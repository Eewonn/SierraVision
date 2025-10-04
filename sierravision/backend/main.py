from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pathlib import Path
from nasa_data_fetcher import NASADataFetcher
from working_nasa_fetcher import WorkingNASADataFetcher
from typing import Optional
import json
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="SierraVision Backend")
nasa_fetcher = NASADataFetcher()
working_fetcher = WorkingNASADataFetcher()

# Allow only the Vite dev server origin during development
origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATA_DIR = Path(__file__).parent / "data"


@app.get("/api/images")
def list_images():
    """Return a JSON list of image filenames found in the data directory."""
    files = []
    if DATA_DIR.exists():
        for p in sorted(DATA_DIR.iterdir()):
            if p.is_file():
                files.append(p.name)
    return {"images": files}


@app.get("/api/nasa/fire-data")
def get_fire_data(date: Optional[str] = None):
    """Get active fire data for Sierra Madre region from NASA FIRMS"""
    try:
        fire_data = nasa_fetcher.get_fire_data(date)
        return fire_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching fire data: {str(e)}")


@app.get("/api/nasa/satellite-urls")
def get_satellite_urls(date: str, region: str = "sierra_madre"):
    """Get NASA Worldview satellite imagery URLs for specific date and region"""
    try:
        url = nasa_fetcher.get_worldview_imagery(date, region=region)
        return {"date": date, "region": region, "url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating satellite URL: {str(e)}")


@app.post("/api/nasa/fetch-comparison")
def fetch_comparison_images(region: str = "sierra_madre"):
    """Download 2000 vs 2025 comparison images from NASA for specified region"""
    try:
        # Use the working fetcher for better results
        result = working_fetcher.fetch_working_comparison(
            "2002-07-01", "2024-07-01", region
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching comparison images: {str(e)}")

@app.post("/api/nasa/fetch-comparison-legacy")
def fetch_comparison_images_legacy(region: str = "sierra_madre"):
    """Legacy comparison using the original fetcher"""
    try:
        # Update the fetch method to support regions
        if region == "manila":
            result = nasa_fetcher.fetch_manila_comparison()
        elif region == "luzon_wide":
            result = nasa_fetcher.fetch_luzon_comparison()
        else:
            result = nasa_fetcher.fetch_sierra_madre_comparison()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching comparison images: {str(e)}")


@app.get("/api/nasa/modis-data")
def get_modis_data(start_date: str, end_date: str):
    """Get MODIS satellite data for date range"""
    try:
        data = nasa_fetcher.get_modis_imagery(start_date, end_date)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching MODIS data: {str(e)}")


@app.get("/api/nasa/landsat-data")
def get_landsat_data(start_date: str, end_date: str):
    """Get Landsat satellite data for date range"""
    try:
        data = nasa_fetcher.get_landsat_imagery(start_date, end_date)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching Landsat data: {str(e)}")


@app.post("/api/nasa/download-satellite-data")
def download_satellite_data(start_date: str, end_date: str, region: str = "sierra_madre"):
    """Download and process actual satellite data using earthaccess"""
    try:
        filename = f"{region}_{start_date}_processed.png"
        success = working_fetcher.download_satellite_data_and_create_image(
            start_date, end_date, filename, region
        )
        return {
            "success": success,
            "filename": filename if success else None,
            "region": region,
            "date_range": f"{start_date} to {end_date}",
            "message": "Satellite data downloaded and processed successfully" if success else "Failed to download satellite data"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error downloading satellite data: {str(e)}")


@app.post("/api/nasa/create-dashboard")
def create_forest_dashboard(region: str = "sierra_madre"):
    """Create enhanced forest monitoring dashboard from existing satellite data"""
    try:
        from simple_visualizer import SimpleEnhancedVisualizer
        
        visualizer = SimpleEnhancedVisualizer()
        success = visualizer.create_forest_comparison_dashboard(region)
        
        dashboard_file = f"{region}_forest_monitoring_dashboard.png"
        summary_file = f"{region}_analysis_summary.json"
        
        return {
            "success": success,
            "dashboard_file": dashboard_file if success else None,
            "summary_file": summary_file if success else None,
            "region": region,
            "message": f"Enhanced forest dashboard created for {region}" if success else f"Failed to create dashboard for {region}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating dashboard: {str(e)}")


@app.get("/api/nasa/analysis-summary/{region}")
def get_analysis_summary(region: str):
    """Get forest analysis summary for a region"""
    try:
        summary_path = DATA_DIR / f"{region}_analysis_summary.json"
        
        if not summary_path.exists():
            raise HTTPException(status_code=404, detail=f"Analysis summary not found for region: {region}")
        
        with open(summary_path, 'r') as f:
            summary_data = json.load(f)
        
        return summary_data
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Analysis summary not found for region: {region}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error loading analysis summary: {str(e)}")


# Serve image/static files at /data/<filename>
app.mount("/data", StaticFiles(directory=DATA_DIR), name="data")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
