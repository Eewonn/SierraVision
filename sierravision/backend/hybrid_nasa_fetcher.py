"""
Hybrid NASA Data Fetcher - combining earthaccess with public APIs
Provides reliable access to NASA satellite imagery for SierraVision
"""
import earthaccess
import requests
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Optional
import os
from dotenv import load_dotenv
import json

# Load environment variables
load_dotenv()

class HybridNASADataFetcher:
    def __init__(self):
        # Sierra Madre coordinates (Philippines - Eastern Luzon)
        self.sierra_madre_bbox = {
            'north': 17.5,   # Northern Luzon
            'south': 14.0,   # Southern boundary
            'east': 122.8,   # Eastern coast (Pacific side)
            'west': 120.5    # Western boundary
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
        
        # NASA credentials
        self.earthdata_username = os.getenv('NASA_USERNAME')
        self.earthdata_password = os.getenv('NASA_PASSWORD')
        self.firms_api_key = os.getenv('FIRMS_API_KEY')
        
        # Initialize earthaccess
        self.authenticated = False
        self._try_authenticate()
        
    def _try_authenticate(self):
        """Try to authenticate with NASA Earthdata"""
        try:
            # Try earthaccess authentication
            auth = earthaccess.login(persist=True)
            if auth:
                print("✅ Successfully authenticated with NASA Earthdata")
                self.authenticated = True
            else:
                print("⚠️ Could not authenticate with NASA Earthdata")
        except Exception as e:
            print(f"⚠️ Authentication warning: {e}")
            print("⚠️ Continuing with public APIs only")
    
    def search_available_datasets(self, start_date: str, end_date: str, region: str = "sierra_madre") -> Dict:
        """
        Search for available datasets using earthaccess
        """
        bbox = self._get_bbox(region)
        results = {}
        
        # Define dataset collections to search
        datasets = {
            'MODIS_Terra': 'MOD09GA',  # MODIS Terra Surface Reflectance
            'MODIS_Aqua': 'MYD09GA',   # MODIS Aqua Surface Reflectance  
            'Landsat8': 'HLSL30',      # Landsat 8 Surface Reflectance
            'Landsat9': 'HLSL30',      # Landsat 9 Surface Reflectance
            'Sentinel2': 'HLSS30'      # Sentinel-2 Surface Reflectance
        }
        
        for name, short_name in datasets.items():
            try:
                search_results = earthaccess.search_data(
                    short_name=short_name,
                    bounding_box=(bbox['west'], bbox['south'], bbox['east'], bbox['north']),
                    temporal=(start_date, end_date),
                    count=5  # Limit to 5 results per dataset
                )
                
                results[name] = {
                    'count': len(search_results),
                    'granules': search_results[:3] if search_results else []  # Keep first 3
                }
                print(f"Found {len(search_results)} {name} granules")
                
            except Exception as e:
                print(f"Error searching {name}: {e}")
                results[name] = {'count': 0, 'granules': []}
        
        return results
    
    def get_nasa_gibs_url(self, date: str, layer: str = "MODIS_Aqua_CorrectedReflectance_TrueColor", region: str = "sierra_madre") -> str:
        """
        Get NASA GIBS (Global Imagery Browse Services) URL - more reliable than Worldview
        """
        bbox = self._get_bbox(region)
        
        # Calculate center and approximate zoom level
        center_lat = (bbox['north'] + bbox['south']) / 2
        center_lon = (bbox['east'] + bbox['west']) / 2
        
        # Use NASA GIBS WMTS service
        base_url = "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best"
        
        # Available layers:
        # - MODIS_Aqua_CorrectedReflectance_TrueColor
        # - MODIS_Terra_CorrectedReflectance_TrueColor
        # - VIIRS_SNPP_CorrectedReflectance_TrueColor
        
        # Format: https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/{layer}/default/{date}/GoogleMapsCompatible_Level{level}/{level}/{row}/{col}.jpg
        
        # For simplicity, create a direct map tile URL for the region
        # This is a simplified approach - you'd typically calculate proper tile coordinates
        tile_url = f"{base_url}/{layer}/default/{date}/GoogleMapsCompatible_Level6/6/20/30.jpg"
        
        return tile_url
    
    def get_enhanced_worldview_url(self, date: str, region: str = "sierra_madre") -> str:
        """
        Enhanced Worldview URL with better error handling
        """
        bbox = self._get_bbox(region)
        
        # Use the corrected NASA Worldview API
        base_url = "https://worldview.earthdata.nasa.gov/api/v1/snapshot"
        
        # Available layers that work better
        layers = [
            "VIIRS_SNPP_CorrectedReflectance_TrueColor",  # VIIRS has better coverage
            "MODIS_Terra_CorrectedReflectance_TrueColor"   # Terra as fallback
        ]
        
        params = {
            'REQUEST': 'GetSnapshot',
            'TIME': date,
            'BBOX': f"{bbox['west']},{bbox['south']},{bbox['east']},{bbox['north']}",
            'CRS': 'EPSG:4326',
            'LAYERS': ','.join(layers),
            'WRAPDATELINE': 'false',
            'FORMAT': 'image/jpeg',  # JPEG might be more reliable than PNG
            'WIDTH': 1024,
            'HEIGHT': 1024
        }
        
        url = base_url + "?" + "&".join([f"{k}={v}" for k, v in params.items()])
        return url
    
    def get_fire_data(self, date: str = None) -> Dict:
        """
        Fetch active fire data from NASA FIRMS
        """
        if not date:
            yesterday = datetime.now() - timedelta(days=1)
            date = yesterday.strftime('%Y-%m-%d')
        
        if not self.firms_api_key:
            print("⚠️ FIRMS_API_KEY not found, returning empty fire data")
            return {'fires': [], 'count': 0}
            
        url = f"https://firms.modaps.eosdis.nasa.gov/api/country/csv/{self.firms_api_key}/VIIRS_SNPP_NRT/PHL/1/{date}.csv"
        
        try:
            response = requests.get(url)
            if response.status_code == 200:
                # Filter for Sierra Madre region
                lines = response.text.split('\n')
                sierra_fires = []
                bbox = self.sierra_madre_bbox
                
                for line in lines[1:]:  # Skip header
                    if line.strip():
                        parts = line.split(',')
                        if len(parts) >= 2:
                            try:
                                lat, lon = float(parts[0]), float(parts[1])
                                if (bbox['south'] <= lat <= bbox['north'] and
                                    bbox['west'] <= lon <= bbox['east']):
                                    sierra_fires.append({
                                        'latitude': lat,
                                        'longitude': lon,
                                        'brightness': parts[2] if len(parts) > 2 else None,
                                        'acq_date': parts[5] if len(parts) > 5 else date,
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
    
    def download_image_with_fallback(self, urls: List[str], filename: str, save_dir: Path = None) -> bool:
        """
        Try multiple URLs to download an image, using fallback options
        """
        if save_dir is None:
            save_dir = Path(__file__).parent / "data"
        
        save_dir.mkdir(exist_ok=True)
        filepath = save_dir / filename
        
        for i, url in enumerate(urls):
            try:
                print(f"Trying URL {i+1}/{len(urls)}: {url[:100]}...")
                response = requests.get(url, stream=True, timeout=30)
                response.raise_for_status()
                
                # Check if it's actually an image (not an error page)
                content_type = response.headers.get('content-type', '')
                if 'image' not in content_type.lower() and 'jpeg' not in content_type.lower() and 'png' not in content_type.lower():
                    print(f"Warning: Content type is {content_type}, might not be an image")
                
                with open(filepath, 'wb') as f:
                    for chunk in response.iter_content(chunk_size=8192):
                        f.write(chunk)
                
                # Verify the file is actually an image by checking file size
                if filepath.stat().st_size < 1000:  # Less than 1KB is likely an error
                    print(f"Downloaded file too small ({filepath.stat().st_size} bytes), trying next URL...")
                    continue
                
                print(f"✅ Successfully downloaded: {filename} ({filepath.stat().st_size} bytes)")
                return True
                
            except requests.RequestException as e:
                print(f"❌ Error with URL {i+1}: {e}")
                continue
        
        print(f"❌ Failed to download {filename} from any URL")
        return False
    
    def _get_bbox(self, region: str) -> Dict:
        """Get bounding box for specified region"""
        if region == "manila":
            return self.manila_bbox
        elif region == "luzon_wide":
            return self.luzon_wide_bbox
        else:
            return self.sierra_madre_bbox
    
    def fetch_enhanced_comparison(self, 
                                year_2000: str = "2002-07-01", 
                                year_2025: str = "2024-07-01",
                                region: str = "sierra_madre") -> Dict:
        """
        Fetch comparison images using multiple methods for better reliability
        """
        print(f"🛰️ Fetching enhanced satellite imagery for {region}")
        
        bbox = self._get_bbox(region)
        region_name = region.replace('_', ' ').title()
        
        # Try multiple image sources/methods for each year
        urls_2000 = [
            self.get_enhanced_worldview_url(year_2000, region),
            self.get_nasa_gibs_url(year_2000, "MODIS_Terra_CorrectedReflectance_TrueColor", region),
            self.get_nasa_gibs_url(year_2000, "VIIRS_SNPP_CorrectedReflectance_TrueColor", region)
        ]
        
        urls_2025 = [
            self.get_enhanced_worldview_url(year_2025, region),  
            self.get_nasa_gibs_url(year_2025, "MODIS_Terra_CorrectedReflectance_TrueColor", region),
            self.get_nasa_gibs_url(year_2025, "VIIRS_SNPP_CorrectedReflectance_TrueColor", region)
        ]
        
        # Download with fallback
        print(f"⬇️ Downloading {year_2000} image with fallback options...")
        success_2000 = self.download_image_with_fallback(
            urls_2000, f"{region}_{year_2000.split('-')[0]}_enhanced.jpg"
        )
        
        print(f"⬇️ Downloading {year_2025} image with fallback options...")
        success_2025 = self.download_image_with_fallback(
            urls_2025, f"{region}_{year_2025.split('-')[0]}_enhanced.jpg"
        )
        
        # Search for available datasets if authenticated
        datasets_info = {}
        if self.authenticated:
            print("🔍 Searching for available satellite datasets...")
            datasets_info = self.search_available_datasets(year_2000, year_2025, region)
        
        # Get fire data
        fire_data = self.get_fire_data()
        
        result = {
            'region': region,
            'region_name': region_name,
            'images_downloaded': success_2000 and success_2025,
            'success_2000': success_2000,
            'success_2025': success_2025,
            'fire_data': fire_data,
            'bbox': bbox,
            'datasets_found': datasets_info,
            'fallback_urls': {
                '2000': urls_2000,
                '2025': urls_2025
            },
            'timestamp': datetime.now().isoformat(),
            'message': f"Enhanced fetch completed for {region_name} - Images: {success_2000 and success_2025}"
        }
        
        print(f"✅ {result['message']}")
        return result

# Example usage and testing
if __name__ == "__main__":
    fetcher = HybridNASADataFetcher()
    
    print("Testing Hybrid NASA Data Fetcher...")
    
    # Test fire data
    fire_data = fetcher.get_fire_data()
    print(f"Found {fire_data['count']} active fires")
    
    # Test enhanced comparison fetch
    print("\nTesting enhanced comparison fetch...")
    result = fetcher.fetch_enhanced_comparison(
        "2002-07-01", "2024-07-01", "sierra_madre"
    )
    print(f"Enhanced comparison result: {result['message']}")
    print(f"Images downloaded: {result['images_downloaded']}")
    
    if result['datasets_found']:
        print("\nAvailable datasets:")
        for dataset, info in result['datasets_found'].items():
            print(f"  {dataset}: {info['count']} granules")