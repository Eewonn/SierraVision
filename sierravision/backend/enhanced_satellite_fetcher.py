"""
Enhanced Satellite Data Fetcher
===============================
Improved satellite imagery fetcher that combines multiple high-quality sources:
- Google Earth Engine (when available)
- NASA GIBS (high-quality WMS service)
- NASA Earthdata (processed satellite data)
- NASA FIRMS (fire data)

This provides the best possible satellite imagery quality by trying multiple sources
and falling back gracefully when services are unavailable.
"""

import requests
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Optional
from pathlib import Path
import json
import os
from dotenv import load_dotenv
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend

# Load environment variables
load_dotenv()


class EnhancedSatelliteDataFetcher:
    """
    Enhanced satellite data fetcher with multiple high-quality sources.
    
    Priority order:
    1. Google Earth Engine (highest quality, when authenticated)
    2. NASA GIBS (high-quality WMS service)
    3. NASA Earthdata (processed satellite data)
    4. NASA FIRMS (fire data - always available)
    """
    
    def __init__(self):
        # Sierra Madre coordinates (Philippines - Eastern Luzon)
        self.sierra_madre_bbox = {
            'north': 17.5,   # Northern boundary
            'south': 14.0,   # Southern boundary
            'east': 122.8,   # Eastern coast (Pacific side)
            'west': 120.5    # Western boundary
        }
        
        # NASA FIRMS API key
        self.firms_api_key = os.getenv('FIRMS_API_KEY', 'MAP_KEY')
        
        # Check Google Earth Engine availability
        self.gee_available = self._check_gee_availability()
        
        print(f"🛰️ Enhanced Satellite Data Fetcher initialized")
        print(f"📡 Google Earth Engine: {'Available' if self.gee_available else 'Not available (using NASA GIBS instead)'}")
        print(f"🔥 NASA FIRMS: Available")
    
    def _check_gee_availability(self) -> bool:
        """Check if Google Earth Engine is available and authenticated"""
        try:
            import ee
            # Try to initialize with different approaches
            project_options = ['ee-ewonn', 'earth-engine-legacy', None]
            
            for project in project_options:
                try:
                    if project:
                        ee.Initialize(project=project)
                    else:
                        ee.Initialize()
                    return True
                except:
                    continue
            return False
        except ImportError:
            return False
        except Exception:
            return False
    
    def get_high_quality_imagery_urls(self, date: str, region: str = "sierra_madre") -> Dict:
        """
        Get high-quality imagery URLs from multiple sources
        """
        bbox = self._get_bbox(region)
        
        # Convert date to proper format
        try:
            dt = datetime.strptime(date, '%Y-%m-%d')
            date_formatted = dt.strftime('%Y-%m-%d')
        except:
            date_formatted = date
        
        urls = {
            'high_quality': [],
            'standard_quality': [],
            'sources': []
        }
        
        # 1. NASA GIBS - High quality WMS service (always available)
        gibs_modis_url = (
            f"https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"
            f"?SERVICE=WMS"
            f"&REQUEST=GetMap"
            f"&VERSION=1.3.0"
            f"&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor"
            f"&CRS=EPSG:4326"
            f"&BBOX={bbox['south']},{bbox['west']},{bbox['north']},{bbox['east']}"
            f"&WIDTH=1024"  # Higher resolution
            f"&HEIGHT=1024"
            f"&FORMAT=image/png"
            f"&TIME={date_formatted}"
        )
        urls['high_quality'].append(gibs_modis_url)
        urls['sources'].append('NASA GIBS MODIS Terra')
        
        # 2. NASA GIBS VIIRS (higher resolution)
        gibs_viirs_url = (
            f"https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"
            f"?SERVICE=WMS"
            f"&REQUEST=GetMap"
            f"&VERSION=1.3.0"
            f"&LAYERS=VIIRS_SNPP_CorrectedReflectance_TrueColor"
            f"&CRS=EPSG:4326"
            f"&BBOX={bbox['south']},{bbox['west']},{bbox['north']},{bbox['east']}"
            f"&WIDTH=1024"
            f"&HEIGHT=1024"
            f"&FORMAT=image/png"
            f"&TIME={date_formatted}"
        )
        urls['high_quality'].append(gibs_viirs_url)
        urls['sources'].append('NASA GIBS VIIRS')
        
        # 3. Landsat through NASA GIBS (very high quality when available)
        gibs_landsat_url = (
            f"https://gibs.earthdata.nasa.gov/wms/epsg4326/best/wms.cgi"
            f"?SERVICE=WMS"
            f"&REQUEST=GetMap"
            f"&VERSION=1.3.0"
            f"&LAYERS=Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual"
            f"&CRS=EPSG:4326"
            f"&BBOX={bbox['south']},{bbox['west']},{bbox['north']},{bbox['east']}"
            f"&WIDTH=1024"
            f"&HEIGHT=1024"
            f"&FORMAT=image/png"
            f"&TIME={date_formatted}"
        )
        urls['high_quality'].append(gibs_landsat_url)
        urls['sources'].append('NASA GIBS Landsat')
        
        # 4. Fallback to Worldview
        worldview_url = (
            f"https://worldview.earthdata.nasa.gov/api/v1/snapshot"
            f"?REQUEST=GetSnapshot"
            f"&TIME={date_formatted}"
            f"&BBOX={bbox['west']},{bbox['south']},{bbox['east']},{bbox['north']}"
            f"&CRS=EPSG:4326"
            f"&LAYERS=MODIS_Terra_CorrectedReflectance_TrueColor"
            f"&FORMAT=image/png"
            f"&WIDTH=1024"
            f"&HEIGHT=1024"
        )
        urls['standard_quality'].append(worldview_url)
        urls['sources'].append('NASA Worldview')
        
        return urls
    
    def download_best_quality_image(self, date: str, filename: str, region: str = "sierra_madre") -> Dict:
        """
        Download the best quality image available from multiple sources
        """
        urls_info = self.get_high_quality_imagery_urls(date, region)
        
        save_dir = Path(__file__).parent / "data"
        save_dir.mkdir(exist_ok=True)
        filepath = save_dir / filename
        
        # Try high quality sources first
        all_urls = urls_info['high_quality'] + urls_info['standard_quality']
        all_sources = urls_info['sources']
        
        for i, (url, source) in enumerate(zip(all_urls, all_sources)):
            try:
                print(f"🌐 Trying {source} ({i+1}/{len(all_urls)})...")
                
                response = requests.get(url, timeout=60)
                response.raise_for_status()
                
                # Check if we got an image
                content_type = response.headers.get('content-type', '')
                if 'image' in content_type.lower():
                    with open(filepath, 'wb') as f:
                        f.write(response.content)
                    
                    # Check file size
                    file_size = filepath.stat().st_size
                    if file_size > 5000:  # At least 5KB
                        file_size_mb = file_size / (1024 * 1024)
                        print(f"✅ Successfully downloaded from {source}")
                        print(f"   File size: {file_size_mb:.2f} MB")
                        
                        # Enhance the image
                        self._enhance_satellite_image(filepath, source)
                        
                        return {
                            'success': True,
                            'source': source,
                            'filename': filename,
                            'file_size_mb': file_size_mb,
                            'quality': 'High' if i < len(urls_info['high_quality']) else 'Standard',
                            'resolution': '1024x1024'
                        }
                    else:
                        print(f"⚠️ File too small from {source}: {file_size} bytes")
                else:
                    print(f"⚠️ Not an image from {source}: {content_type}")
                    
            except Exception as e:
                print(f"❌ {source} failed: {e}")
                continue
        
        return {
            'success': False,
            'error': 'No sources available',
            'sources_tried': all_sources
        }
    
    def _enhance_satellite_image(self, image_path: Path, source: str):
        """
        Enhance satellite image with better contrast and labels
        """
        try:
            # Open and enhance the image
            with Image.open(image_path) as img:
                # Convert to RGB if needed
                if img.mode in ('RGBA', 'LA'):
                    background = Image.new('RGB', img.size, (255, 255, 255))
                    if img.mode == 'RGBA':
                        background.paste(img, mask=img.split()[-1])
                    else:
                        background.paste(img, mask=img.split()[-1])
                    img = background
                elif img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Enhance contrast
                from PIL import ImageEnhance
                enhancer = ImageEnhance.Contrast(img)
                img = enhancer.enhance(1.2)  # Increase contrast by 20%
                
                # Enhance color
                color_enhancer = ImageEnhance.Color(img)
                img = color_enhancer.enhance(1.1)  # Increase color saturation by 10%
                
                # Save enhanced image
                img.save(image_path, 'PNG', optimize=True, quality=95)
                
                print(f"✨ Enhanced image from {source}")
                
        except Exception as e:
            print(f"⚠️ Could not enhance image: {e}")
    
    def fetch_comparison_images(self, 
                               year_2000: str = "2002-07-01", 
                               year_2025: str = "2024-07-01",
                               region: str = "sierra_madre") -> Dict:
        """
        Fetch high-quality comparison images
        """
        print(f"🛰️ Fetching high-quality satellite imagery for {region}")
        
        region_name = region.replace('_', ' ').title()
        
        # Download 2000/2002 image
        print(f"📡 Downloading {year_2000} imagery...")
        result_2000 = self.download_best_quality_image(
            year_2000, f"{region}_2000_enhanced.png", region
        )
        
        # Download 2025/2024 image
        print(f"📡 Downloading {year_2025} imagery...")
        result_2025 = self.download_best_quality_image(
            year_2025, f"{region}_2025_enhanced.png", region
        )
        
        # Get fire data
        fire_data = self.get_fire_data()
        
        success = result_2000.get('success', False) and result_2025.get('success', False)
        
        result = {
            'region': region,
            'region_name': region_name,
            'images_downloaded': success,
            'download_results': {
                'year_2000': result_2000,
                'year_2025': result_2025
            },
            'fire_data': fire_data,
            'timestamp': datetime.now().isoformat(),
            'message': f"Enhanced satellite fetch for {region_name} - Success: {success}",
            'data_sources': {
                '2000_image': result_2000.get('source', 'Failed'),
                '2025_image': result_2025.get('source', 'Failed')
            }
        }
        
        if success:
            total_size = result_2000.get('file_size_mb', 0) + result_2025.get('file_size_mb', 0)
            result['total_download_mb'] = round(total_size, 2)
            result['image_quality'] = 'Enhanced high-resolution satellite imagery'
        
        print(f"✅ {result['message']}")
        return result
    
    def get_fire_data(self, date: str = None) -> Dict:
        """
        Fetch fire data from NASA FIRMS
        """
        if not date:
            yesterday = datetime.now() - timedelta(days=1)
            date = yesterday.strftime('%Y-%m-%d')
        
        # Try both VIIRS and MODIS fire data sources
        urls = [
            f"https://firms.modaps.eosdis.nasa.gov/api/country/csv/{self.firms_api_key}/VIIRS_SNPP_NRT/PHL/1/{date}",
            f"https://firms.modaps.eosdis.nasa.gov/api/country/csv/{self.firms_api_key}/MODIS_NRT/PHL/1/{date}"
        ]
        
        try:
            print(f"🔥 Fetching fire data from FIRMS API for {date}")
            
            sierra_fires = []
            bbox = self.sierra_madre_bbox
            
            for url in urls:
                try:
                    response = requests.get(url, timeout=30)
                    
                    if response.status_code == 200 and response.text.strip():
                        lines = response.text.strip().split('\\n')
                        
                        print(f"📊 Processing {len(lines)} lines of fire data from {url.split('/')[-3]}")
                        
                        # Skip header if present
                        start_idx = 1 if lines[0].startswith('latitude') else 0
                        
                        for line in lines[start_idx:]:
                            if line.strip():
                                parts = line.split(',')
                                if len(parts) >= 9:
                                    try:
                                        lat, lon = float(parts[0]), float(parts[1])
                                        if (bbox['south'] <= lat <= bbox['north'] and
                                            bbox['west'] <= lon <= bbox['east']):
                                            sierra_fires.append({
                                                'latitude': lat,
                                                'longitude': lon,
                                                'brightness': float(parts[2]) if parts[2] else None,
                                                'acq_date': parts[5] if len(parts) > 5 and parts[5] else date,
                                                'confidence': int(float(parts[8])) if len(parts) > 8 and parts[8] else None
                                            })
                                    except (ValueError, IndexError):
                                        continue
                    else:
                        print(f"⚠️ No fire data from {url.split('/')[-3]}: {response.status_code}")
                except Exception as e:
                    print(f"❌ Error with {url.split('/')[-3]}: {e}")
                    continue
            
            print(f"🔥 Found {len(sierra_fires)} fires in Sierra Madre region")
            
            # Convert to GeoJSON format
            features = []
            for fire in sierra_fires:
                features.append({
                    'type': 'Feature',
                    'geometry': {
                        'type': 'Point',
                        'coordinates': [fire['longitude'], fire['latitude']]
                    },
                    'properties': {
                        'brightness': fire['brightness'],
                        'confidence': fire['confidence'],
                        'acq_date': fire['acq_date']
                    }
                })
            
            return {
                'type': 'FeatureCollection',
                'features': features,
                'count': len(features)
            }
            
        except Exception as e:
            print(f"❌ Error fetching fire data: {e}")
            return {'type': 'FeatureCollection', 'features': [], 'count': 0}
    
    def _get_bbox(self, region: str = "sierra_madre") -> Dict:
        """Get bounding box for region"""
        return self.sierra_madre_bbox
    
    @property
    def authenticated(self) -> bool:
        """Check if the fetcher is ready to use"""
        return True  # This fetcher is always ready (uses public APIs)


# Example usage and testing
if __name__ == "__main__":
    fetcher = EnhancedSatelliteDataFetcher()
    
    print("Testing Enhanced Satellite Data Fetcher...")
    
    # Test fire data
    fire_data = fetcher.get_fire_data()
    print(f"Found {fire_data['count']} active fires")
    
    # Test single image download
    print("\\nTesting single image download...")
    result = fetcher.download_best_quality_image("2024-07-01", "test_enhanced.png", "sierra_madre")
    print(f"Download result: {result}")
    
    # Test comparison fetch
    print("\\nTesting enhanced comparison fetch...")
    comparison_result = fetcher.fetch_comparison_images(
        "2002-07-01", "2024-07-01", "sierra_madre"
    )
    print(f"Comparison result: {comparison_result['message']}")
    if comparison_result['images_downloaded']:
        print(f"Data sources: {comparison_result['data_sources']}")
        print(f"Total download: {comparison_result.get('total_download_mb', 0)} MB")