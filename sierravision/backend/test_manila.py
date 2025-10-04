#!/usr/bin/env python3
"""
Test script for Manila Bay area with better satellite coverage
"""
from nasa_data_fetcher import NASADataFetcher

# Create a custom fetcher for Manila Bay area
class ManilaDataFetcher(NASADataFetcher):
    def __init__(self):
        super().__init__()
        # Manila Bay area coordinates (known to have excellent satellite coverage)
        self.sierra_madre_bbox = {
            'north': 14.8,   # North of Manila
            'south': 14.3,   # South of Manila  
            'east': 121.2,   # East of Manila Bay
            'west': 120.8    # West of Manila Bay
        }

if __name__ == "__main__":
    print("🏙️ Testing Manila Bay area satellite imagery...")
    
    # Test Manila Bay area
    manila_fetcher = ManilaDataFetcher()
    result = manila_fetcher.fetch_sierra_madre_comparison(
        year_2000="2002-07-01", 
        year_2025="2024-07-01"
    )
    
    print(f"✅ Manila Test Result: {result}")
    
    # Download with custom filenames
    url_2000 = manila_fetcher.get_worldview_imagery("2002-07-01")
    url_2025 = manila_fetcher.get_worldview_imagery("2024-07-01")
    
    print(f"📡 Manila 2000 URL: {url_2000}")
    print(f"📡 Manila 2025 URL: {url_2025}")
    
    # Download Manila images
    manila_fetcher.download_image(url_2000, "manila_2000.png")
    manila_fetcher.download_image(url_2025, "manila_2025.png")
    
    print("🎯 Manila Bay test complete!")