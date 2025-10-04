"""
NASA Data Fetcher for SierraVision
Retrieves satellite imagery and environmental data for Sierra Madre region
"""
import requests
import json
from datetime import datetime, timedelta
from pathlib import Path
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class NASADataFetcher:
    def __init__(self):
        self.base_urls = {
            'earthdata': 'https://cmr.earthdata.nasa.gov/search',
            'firms': 'https://firms.modaps.eosdis.nasa.gov/api',
            'giovanni': 'https://giovanni.gsfc.nasa.gov/giovanni/daac-bin',
            'worldview': 'https://worldview.earthdata.nasa.gov/api/v1'
        }
        
        # Sierra Madre coordinates (Philippines - Eastern Luzon)
        # Updated coordinates for better satellite coverage
        self.sierra_madre_bbox = {
            'north': 17.5,   # Northern Luzon (extended)
            'south': 14.0,   # Southern boundary (extended)
            'east': 122.8,   # Eastern coast (Pacific side)
            'west': 120.5    # Western boundary (includes more inland area)
        }
        
        # Alternative coordinate sets for different views
        self.manila_bbox = {
            'north': 14.8,   # North of Manila
            'south': 14.3,   # South of Manila  
            'east': 121.2,   # East of Manila Bay
            'west': 120.8    # West of Manila Bay
        }
        
        self.luzon_wide_bbox = {
            'north': 18.5,   # Northern Luzon
            'south': 13.5,   # Southern Luzon
            'east': 123.0,   # Eastern coast
            'west': 120.0    # Western coast
        }
        
        # You'll need to register for these at https://urs.earthdata.nasa.gov/
        self.earthdata_username = os.getenv('NASA_USERNAME')
        self.earthdata_password = os.getenv('NASA_PASSWORD')
        self.firms_api_key = os.getenv('FIRMS_API_KEY')

    def get_modis_imagery(self, start_date: str, end_date: str) -> Dict:
        """
        Fetch MODIS imagery for deforestation monitoring
        Date format: YYYY-MM-DD
        """
        params = {
            'concept_id': 'C1000000240-LPDAAC_ECS',  # MODIS Terra Surface Reflectance
            'bounding_box': f"{self.sierra_madre_bbox['west']},{self.sierra_madre_bbox['south']},{self.sierra_madre_bbox['east']},{self.sierra_madre_bbox['north']}",
            'temporal': f"{start_date}T00:00:00Z,{end_date}T23:59:59Z",
            'page_size': 10,
            'pretty': True
        }
        
        try:
            response = requests.get(f"{self.base_urls['earthdata']}/granules.json", params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching MODIS data: {e}")
            return {}

    def get_landsat_imagery(self, start_date: str, end_date: str) -> Dict:
        """
        Fetch Landsat imagery for high-resolution forest change analysis
        """
        params = {
            'concept_id': 'C2021957295-LPCLOUD',  # Landsat 8-9 Collection 2
            'bounding_box': f"{self.sierra_madre_bbox['west']},{self.sierra_madre_bbox['south']},{self.sierra_madre_bbox['east']},{self.sierra_madre_bbox['north']}",
            'temporal': f"{start_date}T00:00:00Z,{end_date}T23:59:59Z",
            'page_size': 5,
            'cloud_cover': '0,30',  # Low cloud cover only
            'pretty': True
        }
        
        try:
            response = requests.get(f"{self.base_urls['earthdata']}/granules.json", params=params)
            response.raise_for_status()
            return response.json()
        except requests.RequestException as e:
            print(f"Error fetching Landsat data: {e}")
            return {}

    def get_fire_data(self, date: str = None) -> Dict:
        """
        Fetch active fire data from NASA FIRMS
        Date format: YYYY-MM-DD (defaults to yesterday if not provided)
        """
        if not date:
            yesterday = datetime.now() - timedelta(days=1)
            date = yesterday.strftime('%Y-%m-%d')
        
        # FIRMS API endpoint for VIIRS fire data
        if not self.firms_api_key:
            raise ValueError("FIRMS_API_KEY not found in environment variables")
        url = f"{self.base_urls['firms']}/country/csv/{self.firms_api_key}/VIIRS_SNPP_NRT/PHL/1/{date}.csv"
        
        try:
            response = requests.get(url)
            if response.status_code == 200:
                # Filter for Sierra Madre region
                lines = response.text.split('\n')
                sierra_fires = []
                
                for line in lines[1:]:  # Skip header
                    if line.strip():
                        parts = line.split(',')
                        if len(parts) >= 2:
                            try:
                                lat, lon = float(parts[0]), float(parts[1])
                                if (self.sierra_madre_bbox['south'] <= lat <= self.sierra_madre_bbox['north'] and
                                    self.sierra_madre_bbox['west'] <= lon <= self.sierra_madre_bbox['east']):
                                    sierra_fires.append({
                                        'latitude': lat,
                                        'longitude': lon,
                                        'brightness': parts[2] if len(parts) > 2 else None,
                                        'scan': parts[3] if len(parts) > 3 else None,
                                        'track': parts[4] if len(parts) > 4 else None,
                                        'acq_date': parts[5] if len(parts) > 5 else date,
                                        'acq_time': parts[6] if len(parts) > 6 else None,
                                        'satellite': parts[7] if len(parts) > 7 else 'VIIRS',
                                        'confidence': parts[8] if len(parts) > 8 else None
                                    })
                            except (ValueError, IndexError):
                                continue
                
                return {'fires': sierra_fires, 'count': len(sierra_fires)}
            else:
                print(f"FIRMS API returned status code: {response.status_code}")
                return {'fires': [], 'count': 0}
                
        except requests.RequestException as e:
            print(f"Error fetching fire data: {e}")
            return {'fires': [], 'count': 0}

    def get_worldview_imagery(self, date: str, layers: List[str] = None, region: str = "sierra_madre") -> str:
        """
        Generate NASA Worldview imagery URL for specific date and layers
        Updated to use the correct Worldview API format
        
        Args:
            date: Date in YYYY-MM-DD format
            layers: List of layer names (defaults to MODIS Aqua True Color)
            region: Region to use - "sierra_madre", "manila", or "luzon_wide"
        """
        if layers is None:
            # Use MODIS Aqua which has better coverage
            layers = ['MODIS_Aqua_CorrectedReflectance_TrueColor']
        
        # Select the appropriate bounding box based on region
        if region == "manila":
            bbox = self.manila_bbox
        elif region == "luzon_wide":
            bbox = self.luzon_wide_bbox
        else:  # default to sierra_madre
            bbox = self.sierra_madre_bbox
        
        # Use the correct NASA Worldview snapshot API
        base_url = "https://wvs.earthdata.nasa.gov/api/v1/snapshot"
        
        params = {
            'REQUEST': 'GetSnapshot',
            'TIME': date,
            'BBOX': f"{bbox['west']},{bbox['south']},{bbox['east']},{bbox['north']}",
            'CRS': 'EPSG:4326',
            'LAYERS': ','.join(layers),
            'WRAPDATELINE': 'false',
            'FORMAT': 'image/png',
            'WIDTH': 1024,
            'HEIGHT': 1024
        }
        
        url = f"{base_url}?" + "&".join([f"{k}={v}" for k, v in params.items()])
        return url

    def download_image(self, url: str, filename: str, save_dir: Path = None) -> bool:
        """
        Download image from URL and save to data directory
        """
        if save_dir is None:
            save_dir = Path(__file__).parent / "data"
        
        save_dir.mkdir(exist_ok=True)
        filepath = save_dir / filename
        
        try:
            response = requests.get(url, stream=True)
            response.raise_for_status()
            
            with open(filepath, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)
            
            print(f"Downloaded: {filename}")
            return True
            
        except requests.RequestException as e:
            print(f"Error downloading {filename}: {e}")
            return False

    def fetch_sierra_madre_comparison(self, year_2000: str = "2002-07-01", year_2025: str = "2024-07-01"):
        """
        Fetch comparison images for 2000 vs 2025 - Sierra Madre region
        """
        return self._fetch_comparison_images(year_2000, year_2025, "sierra_madre", "Sierra Madre")
    
    def fetch_manila_comparison(self, year_2000: str = "2002-07-01", year_2025: str = "2024-07-01"):
        """
        Fetch comparison images for 2000 vs 2025 - Manila Bay region
        """
        return self._fetch_comparison_images(year_2000, year_2025, "manila", "Manila Bay")
    
    def fetch_luzon_comparison(self, year_2000: str = "2002-07-01", year_2025: str = "2024-07-01"):
        """
        Fetch comparison images for 2000 vs 2025 - Wide Luzon view
        """
        return self._fetch_comparison_images(year_2000, year_2025, "luzon_wide", "Luzon Wide")
    
    def _fetch_comparison_images(self, year_2000: str, year_2025: str, region: str, region_name: str):
        """
        Internal method to fetch comparison images for any region
        """
        from datetime import datetime
        print(f"🛰️ Fetching fresh {region_name} imagery for comparison at {datetime.now()}")
        
        # Generate Worldview URLs for the specified region
        url_2000 = self.get_worldview_imagery(year_2000, region=region)
        url_2025 = self.get_worldview_imagery(year_2025, region=region)
        
        print(f"📡 2000 Image URL: {url_2000}")
        print(f"📡 2025 Image URL: {url_2025}")
        
        # Use region-specific filenames
        filename_2000 = f"{region}_2000.png"
        filename_2025 = f"{region}_2025.png"
        
        # Download images
        print("⬇️ Downloading 2000 image...")
        success_2000 = self.download_image(url_2000, filename_2000)
        print("⬇️ Downloading 2025 image...")
        success_2025 = self.download_image(url_2025, filename_2025)
        
        # Get fire data for recent activity
        print("🔥 Fetching fire data...")
        fire_data = self.get_fire_data()
        
        result = {
            'region': region,
            'region_name': region_name,
            'images_downloaded': success_2000 and success_2025,
            'filenames': {
                '2000': filename_2000,
                '2025': filename_2025
            },
            'fire_data': fire_data,
            'urls': {
                '2000': url_2000,
                '2025': url_2025
            },
            'timestamp': datetime.now().isoformat(),
            'message': f"Successfully downloaded {2 if success_2000 and success_2025 else 1 if success_2000 or success_2025 else 0} NASA satellite images for {region_name}"
        }
        
        print(f"✅ {result['message']}")
        return result

# Example usage
if __name__ == "__main__":
    fetcher = NASADataFetcher()
    
    # Test the fetcher
    print("Testing NASA Data Fetcher...")
    
    # Fetch fire data
    fire_data = fetcher.get_fire_data()
    print(f"Found {fire_data['count']} active fires in Sierra Madre region")
    
    # Generate comparison URLs
    result = fetcher.fetch_sierra_madre_comparison()
    print(f"Comparison fetch result: {result}")