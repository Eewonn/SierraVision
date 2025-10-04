# NASA Data Integration Guide for SierraVision

## Quick Setup

### 1. Install Dependencies
```bash
cd sierravision/backend
pip install -r requirements.txt
```

### 2. Get NASA Credentials
1. **NASA Earthdata Account**: Register at [https://urs.earthdata.nasa.gov/](https://urs.earthdata.nasa.gov/)
2. **FIRMS API Key**: Get fire data access at [https://firms.modaps.eosdis.nasa.gov/api/](https://firms.modaps.eosdis.nasa.gov/api/)

### 3. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials
```

### 4. Test the APIs
```bash
python test_nasa_apis.py
```

## Available NASA Data Sources

### 🔥 Fire Data (FIRMS)
- **Endpoint**: `/api/nasa/fire-data`
- **Data**: Real-time active fires in Sierra Madre
- **No authentication required**

```bash
curl http://localhost:8000/api/nasa/fire-data
```

### 🛰️ Satellite Imagery (Worldview)
- **Endpoint**: `/api/nasa/satellite-urls`
- **Data**: Direct image URLs from NASA Worldview
- **No authentication required**

```bash
curl "http://localhost:8000/api/nasa/satellite-urls?date=2000-01-01"
```

### 🌍 MODIS Data
- **Endpoint**: `/api/nasa/modis-data`
- **Data**: Moderate resolution imagery (250m-1km)
- **Requires**: NASA Earthdata login

```bash
curl "http://localhost:8000/api/nasa/modis-data?start_date=2000-01-01&end_date=2000-01-31"
```

### 🛰️ Landsat Data
- **Endpoint**: `/api/nasa/landsat-data`
- **Data**: High resolution imagery (30m)
- **Requires**: NASA Earthdata login

```bash
curl "http://localhost:8000/api/nasa/landsat-data?start_date=2000-01-01&end_date=2000-01-31"
```

### 📸 Download Comparison Images
- **Endpoint**: `/api/nasa/fetch-comparison`
- **Action**: Downloads 2000 vs 2025 images to `/data` folder

```bash
curl -X POST http://localhost:8000/api/nasa/fetch-comparison
```

## Sierra Madre Region Coverage

The system is pre-configured for Sierra Madre coordinates:
- **North**: 19.5° (Northern Mexico)
- **South**: 14.0° (Guatemala border)  
- **East**: -98.0° (Eastern boundary)
- **West**: -106.0° (Western boundary)

## Data Types Available

1. **True Color Imagery**: Visual representation
2. **NDVI**: Vegetation health index
3. **Fire Hotspots**: Active fire locations
4. **Land Cover**: Forest classification
5. **Temperature**: Surface temperature data

## Example Usage

```python
from nasa_data_fetcher import NASADataFetcher

fetcher = NASADataFetcher()

# Get recent fire activity
fires = fetcher.get_fire_data()
print(f"Active fires: {fires['count']}")

# Download comparison images
result = fetcher.fetch_sierra_madre_comparison()
print(f"Images downloaded: {result['images_downloaded']}")

# Get satellite data URLs
url = fetcher.get_worldview_imagery("2000-01-01", 
    layers=['MODIS_Terra_CorrectedReflectance_TrueColor'])
```

## Troubleshooting

### Common Issues:
1. **"Import requests could not be resolved"** → Run `pip install -r requirements.txt`
2. **"Authentication failed"** → Check NASA Earthdata credentials in `.env`
3. **"No data found"** → Verify date formats and coordinate bounds
4. **"Rate limit exceeded"** → Add delays between requests

### API Rate Limits:
- **Worldview**: ~100 requests/hour
- **FIRMS**: ~1000 requests/day  
- **Earthdata**: Varies by dataset

## Next Steps for Your Team

1. **Backend (You)**: 
   - Set up NASA APIs
   - Create data processing endpoints
   - Add caching for downloaded images

2. **Frontend (Teammates)**:
   - Use `/api/nasa/fire-data` for fire overlays
   - Use `/api/nasa/satellite-urls` for dynamic imagery
   - Implement image comparison UI

3. **Enhancement Ideas**:
   - Add NDVI calculation for vegetation analysis
   - Implement time-series animation
   - Add export functionality for datasets