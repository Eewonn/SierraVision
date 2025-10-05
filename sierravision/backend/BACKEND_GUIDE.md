# SierraVision Backend Documentation

## 🌟 Overview

SierraVision Backend is a simplified FastAPI-based service that provides high-quality satellite imagery for the Sierra Madre region in the Philippines. It uses a single, enhanced satellite data fetcher that automatically sources clean satellite imagery from multiple NASA services without legends or overlays.

## 🚀 Quick Start

### 1. Setup Environment
```bash
cd sierravision/backend
pip install -r requirements.txt
```

### 2. Run the Server (No credentials needed!)
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Test the API
Visit: [http://localhost:8000/docs](http://localhost:8000/docs) for interactive API documentation

## 📁 Project Structure

```
backend/
├── main.py                     # FastAPI application and API endpoints
├── enhanced_satellite_fetcher.py  # Multi-source satellite imagery fetcher
├── requirements.txt            # Python dependencies
├── data/                      # Downloaded satellite images
│   ├── sierra_madre_2000_enhanced.png
│   ├── sierra_madre_2025_enhanced.png
│   └── satellite_data/        # Raw satellite data cache
└── reports/                   # Generated PDF reports
```

## 🛰️ API Endpoints

### Core Endpoints

#### 1. System Status
```http
GET /api/system/status
```
Get system status and enhanced satellite fetcher capabilities.

#### 2. List Available Images
```http
GET /api/images
```
Returns a list of all downloaded images in the data directory.

#### 3. Fire Data
```http
GET /api/nasa/fire-data?date=2024-10-05
```
Get active fire hotspots for Sierra Madre region from NASA FIRMS.

#### 4. Satellite Availability
```http
GET /api/satellite-availability/{date}
```
Check if high-quality satellite imagery is available for a specific date.

#### 5. Fetch Clean Comparison Images ⭐
```http
POST /api/satellite/fetch-comparison
```
Download clean, high-quality satellite comparison images (2000 vs 2025) **without legends** using enhanced multi-source fetcher.

#### 6. Analysis Summary
```http
GET /api/nasa/analysis-summary/{region}
```
Get forest change analysis results for a region.

#### 7. Static File Access
```http
GET /data/{filename}
```
Access downloaded clean satellite images directly.

### Example API Usage

```bash
# Get system status and available sources
curl "http://localhost:8000/api/system/status"

# Get fire data for today
curl "http://localhost:8000/api/nasa/fire-data"

# Check satellite availability for specific date
curl "http://localhost:8000/api/satellite-availability/2024-07-01"

# Download clean comparison images (no legends!)
curl -X POST "http://localhost:8000/api/satellite/fetch-comparison"

# View clean satellite image
curl "http://localhost:8000/data/sierra_madre_2000_enhanced.png"

# View downloaded image
curl "http://localhost:8000/data/sierra_madre_2000_satellite.png"
```

## 🌍 Supported Regions

### Sierra Madre (Primary)
- **Coordinates**: 14.0°N - 17.5°N, 120.5°E - 122.8°E
- **Coverage**: Eastern Luzon mountain range
- **Focus**: Deforestation and forest change analysis

### Manila (Comparison)
- **Coordinates**: 14.3°N - 14.8°N, 120.8°E - 121.2°E
- **Coverage**: Metro Manila area
- **Focus**: Urban development analysis

### Luzon Wide (Regional)
- **Coordinates**: 13.5°N - 18.5°N, 120.0°E - 123.0°E
- **Coverage**: Entire Luzon island
- **Focus**: Regional overview analysis

## 🛠️ Key Features

### 1. Clean Satellite Images (No Credentials Required!)
- **Multiple High-Quality Sources**: NASA GIBS WMS, MODIS, VIIRS, and Landsat
- **Clean Output**: Pure satellite imagery without legends, scales, or overlays
- **High Resolution**: 1024x1024 pixel images with automatic enhancement
- **Automatic Fallback**: Tries multiple sources until successful

### 2. Enhanced Multi-Source Fetcher
- **NASA GIBS WMS**: Primary high-quality source
- **Automatic Source Selection**: Tries best quality sources first
- **Image Enhancement**: Automatic contrast and color optimization
- **No Authentication**: Works immediately without NASA credentials

### 3. Fire Monitoring
- Real-time active fire detection from NASA FIRMS
- Regional filtering for Sierra Madre
- GeoJSON format with confidence scoring

### 4. Simplified Architecture
- **Single Fetcher**: One enhanced fetcher handles all sources
- **Minimal Dependencies**: Only essential packages required
- **Fast Setup**: No credential configuration needed
- **Reliable**: Automatic source fallback ensures data availability

## 📊 Data Analysis Capabilities

### Forest Change Detection
The system provides quantitative analysis including:
- **Total Analysis Area**: Number of pixels analyzed
- **Forest Loss**: Percentage showing vegetation decline
- **Forest Gain**: Percentage showing vegetation growth
- **Stable Areas**: Percentage with minimal change
- **Net Change**: Overall forest change percentage
- **Trend Analysis**: Direction of forest change

### Recent Analysis Results

#### Sierra Madre (2000-2024):
- **Net Forest Loss**: 1.16%
- **Area with Changes**: 60% of region
- **Data Quality**: Medium confidence (NASA MODIS validated)

#### Manila (2000-2024):
- **Net Forest Gain**: 0.31%
- **Area with Changes**: 59% of region
- **Data Quality**: Medium confidence

## 🔧 Technical Implementation

### Dependencies
```python
# Core Framework
fastapi>=0.104.0           # Web API framework
uvicorn[standard]>=0.24.0  # ASGI server

# NASA Data Access
earthaccess>=0.8.0         # NASA Earthdata integration
requests>=2.31.0           # HTTP client

# Data Processing
numpy>=1.24.0              # Numerical computing
matplotlib>=3.7.0          # Visualization
pillow>=10.0.0            # Image processing

# Configuration
python-dotenv>=1.0.0       # Environment variables
```

### Data Processing Pipeline
1. **Authentication**: NASA Earthdata login via earthaccess
2. **Data Search**: Query NASA CMR for satellite data
3. **Download**: Retrieve raw satellite files (HDF/NetCDF)
4. **Processing**: Convert raw data to visualizations
5. **Analysis**: Calculate forest change metrics
6. **Visualization**: Generate dashboards and reports

### File Types Generated
- **Raw Data**: `.hdf` files (70MB+ satellite data)
- **Visualizations**: `.png` images (100KB satellite views)
- **Dashboards**: `.png` comprehensive analysis (1.7MB)
- **Reports**: `.json` quantitative analysis results

## 🐛 Troubleshooting

### Common Issues

#### 1. Authentication Errors
```
Error: NASA Earthdata authentication failed
```
**Solution**: Check `.env` file has correct NASA_USERNAME and NASA_PASSWORD

#### 2. No Data Found
```
Error: No satellite data found for date range
```
**Solutions**: 
- Verify date format (YYYY-MM-DD)
- Check coordinates are within coverage area
- Try different date ranges

#### 3. Download Failures
```
Error: Failed to download satellite data
```
**Solutions**:
- Check internet connection
- Verify NASA Earthdata credentials
- Try alternative date ranges

#### 4. Image Generation Errors
```
Error: Cannot create visualization
```
**Solutions**:
- Ensure matplotlib dependencies installed
- Check data directory permissions
- Verify raw data files exist

### Debug Commands
```bash
# Test NASA API connections
python -c "from working_nasa_fetcher import WorkingNASADataFetcher; f=WorkingNASADataFetcher(); print(f.authenticated)"

# Check available images
curl "http://localhost:8000/api/images"

# Test fire data access
curl "http://localhost:8000/api/nasa/fire-data"

# Verify environment variables
python -c "import os; print('NASA_USERNAME:', bool(os.getenv('NASA_USERNAME')))"
```

## 🔐 Security Notes

- Store NASA credentials in `.env` file (never commit to git)
- Use environment variables for all sensitive data
- Implement rate limiting for production deployment
- Consider caching for frequently requested data

## 🚀 Performance Optimization

### Caching Strategy
- Cache downloaded satellite images locally
- Store processed visualizations for reuse
- Implement API response caching for static data

### Resource Management
- Large satellite files (70MB+) - consider cleanup routines
- Limit concurrent downloads to prevent memory issues
- Use streaming for large file downloads

## 📈 Future Enhancements

### Planned Features
1. **Additional Regions**: Expand beyond Philippines
2. **Time Series Analysis**: Multi-year trend analysis
3. **Automated Alerts**: Forest change notifications
4. **Data Export**: CSV/GeoJSON export capabilities
5. **Advanced Visualizations**: Interactive maps, animations

### Integration Opportunities
- **Frontend**: React/Vue.js dashboard integration
- **Database**: PostgreSQL for data persistence
- **Notifications**: Email/SMS alerts for forest changes
- **APIs**: Integration with external environmental services

## 📞 Support

### Resources
- **NASA Earthdata**: [https://earthdata.nasa.gov/](https://earthdata.nasa.gov/)
- **FIRMS Fire Data**: [https://firms.modaps.eosdis.nasa.gov/](https://firms.modaps.eosdis.nasa.gov/)
- **FastAPI Docs**: [https://fastapi.tiangolo.com/](https://fastapi.tiangolo.com/)
- **earthaccess Library**: [https://earthaccess.readthedocs.io/](https://earthaccess.readthedocs.io/)

### Development
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/

---

*Last Updated: October 5, 2025*  
*SierraVision Backend v1.0 - Forest Monitoring & Satellite Analysis*