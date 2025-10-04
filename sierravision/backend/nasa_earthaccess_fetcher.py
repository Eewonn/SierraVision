"""
Enhanced NASA Data Fetcher using earthaccess library
Provides better access to NASA satellite imagery for SierraVision
"""
import earthaccess
import numpy as np
import xarray as xr
from pathlib import Path
from datetime import datetime, timedelta
from typing import Dict, List, Optional, Tuple
import os
from dotenv import load_dotenv
import matplotlib.pyplot as plt
import matplotlib.patches as patches
from PIL import Image
import requests

# Load environment variables
load_dotenv()

class EnhancedNASADataFetcher:
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
        self._authenticate()
        
    def _authenticate(self):
        """Authenticate with NASA Earthdata"""
        try:
            if self.earthdata_username and self.earthdata_password:
                # Authenticate with credentials using the correct method
                auth = earthaccess.login(persist=True)
                if auth:
                    print("✅ Successfully authenticated with NASA Earthdata")
                    self.authenticated = True
                else:
                    print("⚠️ Authentication failed, will try guest access")
            else:
                print("⚠️ No NASA credentials found, trying guest access")
                # Try to authenticate without credentials (guest access)
                try:
                    auth = earthaccess.login(persist=True)
                    if auth:
                        print("✅ Successfully authenticated with guest access")
                        self.authenticated = True
                except:
                    print("⚠️ Guest access also failed")
        except Exception as e:
            print(f"⚠️ Authentication error: {e}")
            print("⚠️ Continuing without authentication - some features may be limited")
    
    def search_landsat_data(self, start_date: str, end_date: str, region: str = "sierra_madre") -> List:
        """
        Search for Landsat data using earthaccess
        """
        bbox = self._get_bbox(region)
        
        try:
            # Search for Landsat Collection 2 Level-2 data
            results = earthaccess.search_data(
                short_name="HLSL30",  # Landsat 8-9 Collection 2 Level-2
                bounding_box=(bbox['west'], bbox['south'], bbox['east'], bbox['north']),
                temporal=(start_date, end_date),
                count=10
            )
            
            print(f"Found {len(results)} Landsat granules for {region}")
            return results
            
        except Exception as e:
            print(f"Error searching Landsat data: {e}")
            return []
    
    def search_modis_data(self, start_date: str, end_date: str, region: str = "sierra_madre") -> List:
        """
        Search for MODIS data using earthaccess
        """
        bbox = self._get_bbox(region)
        
        try:
            # Search for MODIS Terra Surface Reflectance
            results = earthaccess.search_data(
                short_name="MOD09GA",  # MODIS Terra Surface Reflectance Daily
                bounding_box=(bbox['west'], bbox['south'], bbox['east'], bbox['north']),
                temporal=(start_date, end_date),
                count=10
            )
            
            print(f"Found {len(results)} MODIS granules for {region}")
            return results
            
        except Exception as e:
            print(f"Error searching MODIS data: {e}")
            return []
    
    def search_sentinel2_data(self, start_date: str, end_date: str, region: str = "sierra_madre") -> List:
        """
        Search for Sentinel-2 data using earthaccess
        """
        bbox = self._get_bbox(region)
        
        try:
            # Search for Sentinel-2 Level-2A data
            results = earthaccess.search_data(
                short_name="HLSS30",  # Sentinel-2 Level-2A
                bounding_box=(bbox['west'], bbox['south'], bbox['east'], bbox['north']),
                temporal=(start_date, end_date),
                count=10
            )
            
            print(f"Found {len(results)} Sentinel-2 granules for {region}")
            return results
            
        except Exception as e:
            print(f"Error searching Sentinel-2 data: {e}")
            return []
    
    def download_and_process_granule(self, granule, output_filename: str, bands: List[str] = None) -> bool:
        """
        Download and process a single granule into a viewable image
        """
        try:
            # Create data directory if it doesn't exist
            data_dir = Path(__file__).parent / "data"
            data_dir.mkdir(exist_ok=True)
            
            # Download the granule
            print(f"Downloading granule: {granule['meta']['concept-id']}")
            files = earthaccess.download(granule, str(data_dir))
            
            if not files:
                print("No files downloaded")
                return False
            
            # Process the first file (usually the main data file)
            main_file = files[0]
            print(f"Processing file: {main_file}")
            
            # Try to open with xarray for NetCDF/HDF files
            try:
                ds = xr.open_dataset(main_file)
                
                # Create a simple RGB composite if possible
                if 'red' in ds.data_vars and 'green' in ds.data_vars and 'blue' in ds.data_vars:
                    rgb_array = np.stack([
                        ds['red'].values,
                        ds['green'].values, 
                        ds['blue'].values
                    ], axis=-1)
                elif len(ds.data_vars) >= 3:
                    # Use first 3 variables as RGB
                    vars_list = list(ds.data_vars.keys())[:3]
                    rgb_array = np.stack([
                        ds[vars_list[0]].values,
                        ds[vars_list[1]].values,
                        ds[vars_list[2]].values  
                    ], axis=-1)
                else:
                    # Single band - convert to grayscale
                    first_var = list(ds.data_vars.keys())[0]
                    data = ds[first_var].values
                    rgb_array = np.stack([data, data, data], axis=-1)
                
                # Normalize to 0-255 range
                rgb_array = ((rgb_array - rgb_array.min()) / 
                           (rgb_array.max() - rgb_array.min()) * 255).astype(np.uint8)
                
                # Save as PNG
                output_path = data_dir / output_filename
                plt.figure(figsize=(10, 10))
                plt.imshow(rgb_array)
                plt.axis('off')
                plt.title(f"Satellite Image - {output_filename}")
                plt.savefig(output_path, bbox_inches='tight', dpi=150)
                plt.close()
                
                print(f"✅ Saved processed image: {output_filename}")
                return True
                
            except Exception as e:
                print(f"Error processing with xarray: {e}")
                # Fallback: just copy the file with a new name
                import shutil
                output_path = data_dir / output_filename
                shutil.copy2(main_file, output_path)
                return True
                
        except Exception as e:
            print(f"Error downloading/processing granule: {e}")
            return False
    
    def get_alternative_worldview_imagery(self, date: str, region: str = "sierra_madre") -> str:
        """
        Alternative method using NASA GIBS (Global Imagery Browse Services)
        """
        bbox = self._get_bbox(region)
        
        # Use NASA GIBS API - more reliable than the Worldview snapshot API
        base_url = "https://gibs.earthdata.nasa.gov/wmts/epsg4326/best"
        
        # MODIS Aqua True Color
        layer = "MODIS_Aqua_CorrectedReflectance_TrueColor"
        
        # Convert date format
        try:
            dt = datetime.strptime(date, '%Y-%m-%d')
            date_str = dt.strftime('%Y-%m-%d')
        except:
            date_str = date
        
        # Calculate tile coordinates (simplified for now)
        # For a more accurate implementation, you'd need to calculate the exact tiles
        url = (f"{base_url}/{layer}/default/{date_str}/GoogleMapsCompatible_Level9/"
               f"9/150/200.jpg")
        
        return url
    
    def get_fire_data(self, date: str = None) -> Dict:
        """
        Fetch active fire data from NASA FIRMS (same as original implementation)
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
    
    def _get_bbox(self, region: str) -> Dict:
        """Get bounding box for specified region"""
        if region == "manila":
            return self.manila_bbox
        elif region == "luzon_wide":
            return self.luzon_wide_bbox
        else:
            return self.sierra_madre_bbox
    
    def fetch_comparison_using_earthaccess(self, 
                                         year_2000: str = "2002-07-01", 
                                         year_2025: str = "2024-07-01",
                                         region: str = "sierra_madre") -> Dict:
        """
        Fetch comparison images using earthaccess for better quality
        """
        print(f"🛰️ Fetching satellite imagery using earthaccess for {region}")
        
        bbox = self._get_bbox(region)
        region_name = region.replace('_', ' ').title()
        
        # Search for data around both dates
        print("🔍 Searching for Landsat data...")
        landsat_2000 = self.search_landsat_data(year_2000, year_2000, region)
        landsat_2025 = self.search_landsat_data(year_2025, year_2025, region)
        
        # If no Landsat, try MODIS
        if not landsat_2000:
            print("🔍 No Landsat found, trying MODIS for 2000...")
            modis_2000 = self.search_modis_data(year_2000, year_2000, region)
        else:
            modis_2000 = []
            
        if not landsat_2025:
            print("🔍 No Landsat found, trying MODIS for 2025...")
            modis_2025 = self.search_modis_data(year_2025, year_2025, region)
        else:
            modis_2025 = []
        
        success_2000 = False
        success_2025 = False
        
        # Download and process 2000 data
        if landsat_2000:
            print("⬇️ Downloading Landsat 2000 data...")
            success_2000 = self.download_and_process_granule(
                landsat_2000[0], f"{region}_2000_landsat.png"
            )
        elif modis_2000:
            print("⬇️ Downloading MODIS 2000 data...")
            success_2000 = self.download_and_process_granule(
                modis_2000[0], f"{region}_2000_modis.png"
            )
        
        # Download and process 2025 data
        if landsat_2025:
            print("⬇️ Downloading Landsat 2025 data...")
            success_2025 = self.download_and_process_granule(
                landsat_2025[0], f"{region}_2025_landsat.png"
            )
        elif modis_2025:
            print("⬇️ Downloading MODIS 2025 data...")
            success_2025 = self.download_and_process_granule(
                modis_2025[0], f"{region}_2025_modis.png"
            )
        
        # Get fire data
        fire_data = self.get_fire_data()
        
        result = {
            'region': region,
            'region_name': region_name,
            'images_downloaded': success_2000 and success_2025,
            'data_sources': {
                '2000': 'landsat' if landsat_2000 else 'modis' if modis_2000 else 'none',
                '2025': 'landsat' if landsat_2025 else 'modis' if modis_2025 else 'none'
            },
            'fire_data': fire_data,
            'bbox': bbox,
            'timestamp': datetime.now().isoformat(),
            'message': f"Retrieved {len(landsat_2000 + landsat_2025 + modis_2000 + modis_2025)} satellite data granules for {region_name}"
        }
        
        print(f"✅ {result['message']}")
        return result

# Example usage and testing
if __name__ == "__main__":
    fetcher = EnhancedNASADataFetcher()
    
    print("Testing Enhanced NASA Data Fetcher with earthaccess...")
    
    # Test fire data
    fire_data = fetcher.get_fire_data()
    print(f"Found {fire_data['count']} active fires")
    
    # Test satellite data search
    print("\nTesting satellite data search...")
    landsat_results = fetcher.search_landsat_data("2024-01-01", "2024-01-31", "sierra_madre")
    modis_results = fetcher.search_modis_data("2024-01-01", "2024-01-31", "sierra_madre")
    
    print(f"Found {len(landsat_results)} Landsat granules")
    print(f"Found {len(modis_results)} MODIS granules")
    
    # Test comparison fetch
    if landsat_results or modis_results:
        print("\nTesting comparison fetch...")
        result = fetcher.fetch_comparison_using_earthaccess(
            "2024-01-01", "2024-07-01", "sierra_madre"
        )
        print(f"Comparison result: {result}")