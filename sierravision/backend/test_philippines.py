#!/usr/bin/env python3
"""
Test script to debug NASA imagery fetch for Philippines locations
"""
import requests
from pathlib import Path

def test_worldview_api(bbox, date, filename):
    """Test NASA Worldview API with specific coordinates"""
    base_url = "https://wvs.earthdata.nasa.gov/api/v1/snapshot"
    
    layers = ['MODIS_Aqua_CorrectedReflectance_TrueColor']
    
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
    print(f"\n🌍 Testing {filename}")
    print(f"📍 Coordinates: {bbox}")
    print(f"🔗 URL: {url}")
    
    try:
        response = requests.get(url, timeout=30)
        print(f"📊 Status Code: {response.status_code}")
        print(f"📦 Content Type: {response.headers.get('content-type', 'unknown')}")
        print(f"📏 Content Length: {len(response.content)} bytes")
        
        # Save to data directory
        data_dir = Path(__file__).parent / "data"
        data_dir.mkdir(exist_ok=True)
        filepath = data_dir / filename
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        # Check if it's actually an image
        if response.headers.get('content-type', '').startswith('image/'):
            print(f"✅ Successfully downloaded image: {filename}")
            return True
        else:
            print(f"❌ Response is not an image. First 200 chars of content:")
            try:
                print(response.text[:200])
            except:
                print("Binary content (not text)")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    # Test different Philippine locations
    
    # 1. Current (incorrect) coordinates - Sierra Madre, Mexico
    mexico_bbox = {
        'north': 19.5,   # Northern Mexico
        'south': 14.0,   # Guatemala border  
        'east': -98.0,   # Eastern boundary
        'west': -106.0   # Western boundary
    }
    
    # 2. Philippines - Sierra Madre (Eastern Luzon)
    sierra_madre_ph_bbox = {
        'north': 17.0,   # Northern Luzon
        'south': 14.5,   # Southern boundary
        'east': 122.5,   # Eastern coast
        'west': 120.8    # Western boundary
    }
    
    # 3. Manila Bay area (known to have good satellite coverage)
    manila_bbox = {
        'north': 14.8,   # North of Manila
        'south': 14.3,   # South of Manila
        'east': 121.2,   # East of Manila
        'west': 120.8    # West of Manila
    }
    
    # 4. Broader Philippines view
    philippines_bbox = {
        'north': 19.0,   # Northern Philippines
        'south': 5.0,    # Southern Philippines
        'east': 127.0,   # Eastern boundary
        'west': 116.0    # Western boundary
    }
    
    test_date = "2024-07-01"
    
    print("🧪 Testing NASA Worldview API for Philippines locations")
    print("=" * 60)
    
    # Test all locations
    locations = [
        (mexico_bbox, "mexico_test.png", "Current Mexico coordinates"),
        (sierra_madre_ph_bbox, "sierra_madre_ph_test.png", "Sierra Madre Philippines"),
        (manila_bbox, "manila_test.png", "Manila Bay area"),
        (philippines_bbox, "philippines_wide_test.png", "Wide Philippines view")
    ]
    
    for bbox, filename, description in locations:
        print(f"\n{'='*20} {description} {'='*20}")
        test_worldview_api(bbox, test_date, filename)
    
    print(f"\n🎯 Test complete! Check the data/ directory for results.")