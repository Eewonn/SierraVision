#!/usr/bin/env python3
"""
Test script for NASA data fetching
Run this to test your NASA API connections
"""

import sys
import os
from pathlib import Path

# Add the backend directory to Python path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from nasa_data_fetcher import NASADataFetcher

def test_nasa_apis():
    print("🛰️  Testing NASA Data APIs for SierraVision")
    print("=" * 50)
    
    fetcher = NASADataFetcher()
    
    # Test 1: Fire Data
    print("\n🔥 Testing FIRMS Fire Data API...")
    try:
        fire_data = fetcher.get_fire_data()
        print(f"✅ Success! Found {fire_data['count']} active fires in Sierra Madre region")
        if fire_data['fires']:
            print(f"   Sample fire: {fire_data['fires'][0]}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 2: Worldview URLs
    print("\n🌍 Testing NASA Worldview Image URLs...")
    try:
        url_2000 = fetcher.get_worldview_imagery("2000-01-01")
        url_2025 = fetcher.get_worldview_imagery("2025-01-01")
        
        print("✅ Generated URLs successfully:")
        print(f"   2000: {url_2000}")
        print(f"   2025: {url_2025}")
        
        # Test download (small test)
        print("\n📥 Testing image download...")
        success = fetcher.download_image(url_2000, "test_2000.png")
        if success:
            print("✅ Image download successful!")
            # Clean up test file
            test_file = Path(backend_dir) / "data" / "test_2000.png"
            if test_file.exists():
                test_file.unlink()
                print("   (Test file cleaned up)")
        else:
            print("❌ Image download failed")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test 3: Satellite Data APIs (requires authentication)
    print("\n🛰️  Testing Earthdata APIs...")
    print("   (Note: These require NASA Earthdata login credentials)")
    
    try:
        modis_data = fetcher.get_modis_imagery("2000-01-01", "2000-01-31")
        if modis_data and 'feed' in modis_data:
            entries = modis_data['feed'].get('entry', [])
            print(f"✅ MODIS API working! Found {len(entries)} data entries")
        else:
            print("⚠️  MODIS API returned empty results (may need authentication)")
    except Exception as e:
        print(f"❌ MODIS Error: {e}")
    
    try:
        landsat_data = fetcher.get_landsat_imagery("2000-01-01", "2000-01-31")
        if landsat_data and 'feed' in landsat_data:
            entries = landsat_data['feed'].get('entry', [])
            print(f"✅ Landsat API working! Found {len(entries)} data entries")
        else:
            print("⚠️  Landsat API returned empty results (may need authentication)")
    except Exception as e:
        print(f"❌ Landsat Error: {e}")
    
    print("\n" + "=" * 50)
    print("🎯 Next Steps:")
    print("1. Set up NASA Earthdata account: https://urs.earthdata.nasa.gov/")
    print("2. Copy .env.example to .env and add your credentials")
    print("3. Install requirements: pip install -r requirements.txt")
    print("4. Run the backend: uvicorn main:app --reload")
    print("5. Test endpoints at: http://localhost:8000/docs")

if __name__ == "__main__":
    test_nasa_apis()