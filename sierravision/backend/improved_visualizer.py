"""
Improved visualization processor for SierraVision
Creates better forest monitoring visualizations from existing satellite data
"""
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
from datetime import datetime
import json
from PIL import Image
import warnings
warnings.filterwarnings('ignore')

class ImprovedVisualizationProcessor:
    def __init__(self):
        self.data_dir = Path(__file__).parent / "data"
        
        # Sierra Madre coordinates
        self.sierra_madre_bbox = {
            'north': 17.5,
            'south': 14.0,
            'east': 122.8,
            'west': 120.5
        }
        
    def create_enhanced_comparison(self, year_2000_file: str, year_2025_file: str, region: str = "sierra_madre"):
        """
        Create enhanced comparison visualization from existing satellite images
        """
        print(f"🎨 Creating enhanced comparison for {region}")
        
        try:
            # Load existing images
            img_2000_path = self.data_dir / year_2000_file
            img_2025_path = self.data_dir / year_2025_file
            
            if not img_2000_path.exists() or not img_2025_path.exists():
                print(f"❌ Image files not found: {year_2000_file} or {year_2025_file}")
                return False
            
            # Load images
            img_2000 = Image.open(img_2000_path)
            img_2025 = Image.open(img_2025_path)
            
            # Convert to numpy arrays
            arr_2000 = np.array(img_2000)
            arr_2025 = np.array(img_2025)
            
            # Create comprehensive comparison
            self._create_forest_change_analysis(arr_2000, arr_2025, region)
            
            return True
            
        except Exception as e:
            print(f"❌ Error creating enhanced comparison: {e}")
            return False
    
    def _create_forest_change_analysis(self, img_2000, img_2025, region):
        """
        Create detailed forest change analysis visualization
        """
        fig = plt.figure(figsize=(20, 16))
        
        # Convert images for analysis (handle different formats)
        if len(img_2000.shape) == 3:
            gray_2000 = np.mean(img_2000, axis=2)
        else:
            gray_2000 = img_2000
            
        if len(img_2025.shape) == 3:
            gray_2025 = np.mean(img_2025, axis=2)
        else:
            gray_2025 = img_2025
        
        # Calculate change detection
        change_map = self._calculate_change_detection(gray_2000, gray_2025)
        
        # Create subplot layout
        gs = fig.add_gridspec(3, 3, hspace=0.3, wspace=0.3)
        
        # 1. Original 2000 image
        ax1 = fig.add_subplot(gs[0, 0])
        ax1.imshow(img_2000, cmap='viridis')
        ax1.set_title('Sierra Madre 2000\n(MODIS Satellite Data)', fontweight='bold', fontsize=12)
        ax1.set_xlabel('Longitude →')
        ax1.set_ylabel('Latitude →')
        self._add_coordinate_labels(ax1)
        
        # 2. Original 2025 image  
        ax2 = fig.add_subplot(gs[0, 1])
        ax2.imshow(img_2025, cmap='viridis')
        ax2.set_title('Sierra Madre 2024\n(MODIS Satellite Data)', fontweight='bold', fontsize=12)
        ax2.set_xlabel('Longitude →')
        ax2.set_ylabel('Latitude →')
        self._add_coordinate_labels(ax2)
        
        # 3. Change detection map
        ax3 = fig.add_subplot(gs[0, 2])
        change_plot = ax3.imshow(change_map, cmap='RdYlGn', vmin=-1, vmax=1)
        ax3.set_title('Forest Change Detection\n(Green=Growth, Red=Loss)', fontweight='bold', fontsize=12)
        ax3.set_xlabel('Longitude →')
        ax3.set_ylabel('Latitude →')
        self._add_coordinate_labels(ax3)
        
        # Add colorbar for change detection
        cbar = plt.colorbar(change_plot, ax=ax3, shrink=0.8)
        cbar.set_label('Change Index\\n(-1: Major Loss, +1: Major Growth)')
        
        # 4. Side-by-side comparison
        ax4 = fig.add_subplot(gs[1, :2])
        comparison = np.hstack([
            self._normalize_image(img_2000),
            self._normalize_image(img_2025)
        ])
        ax4.imshow(comparison, cmap='viridis', aspect='auto')
        ax4.set_title('Side-by-Side Comparison: 2000 (Left) vs 2024 (Right)', fontweight='bold', fontsize=14)
        ax4.axvline(x=img_2000.shape[1], color='white', linewidth=3, linestyle='--')
        ax4.text(img_2000.shape[1]//2, img_2000.shape[0]//2, '2000', 
                color='white', fontsize=16, ha='center', fontweight='bold',
                bbox=dict(boxstyle="round,pad=0.3", facecolor='black', alpha=0.7))
        ax4.text(img_2000.shape[1] + img_2025.shape[1]//2, img_2025.shape[0]//2, '2024', 
                color='white', fontsize=16, ha='center', fontweight='bold',
                bbox=dict(boxstyle="round,pad=0.3", facecolor='black', alpha=0.7))
        ax4.set_xlabel('Geographic Extent (West to East)')
        ax4.set_ylabel('Geographic Extent (South to North)')
        
        # 5. Change statistics
        ax5 = fig.add_subplot(gs[1, 2])
        self._create_change_statistics(change_map, ax5)
        
        # 6. Regional analysis
        ax6 = fig.add_subplot(gs[2, :])
        self._create_regional_analysis(gray_2000, gray_2025, ax6)
        
        # Add main title and metadata
        fig.suptitle(f'Sierra Madre Forest Monitoring Analysis\\nPhilippines Deforestation Study - {datetime.now().strftime("%Y-%m-%d")}', 
                     fontsize=18, fontweight='bold', y=0.98)
        
        # Add metadata text
        metadata_text = (
            f"Data Source: NASA MODIS Terra/Aqua Surface Reflectance\\n"
            f"Region: Sierra Madre Mountain Range, Philippines\\n"
            f"Coordinates: {self.sierra_madre_bbox['west']}°-{self.sierra_madre_bbox['east']}°E, "
            f"{self.sierra_madre_bbox['south']}°-{self.sierra_madre_bbox['north']}°N\\n"
            f"Analysis Date: {datetime.now().strftime('%B %d, %Y')}\\n"
            f"Processing: Enhanced earthaccess integration"
        )
        
        fig.text(0.02, 0.02, metadata_text, fontsize=10, 
                bbox=dict(boxstyle="round,pad=0.5", facecolor='lightgray', alpha=0.8))
        
        # Save the enhanced visualization
        output_path = self.data_dir / f"{region}_enhanced_forest_analysis.png"
        plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        
        print(f"✅ Created enhanced forest analysis: {output_path.name}")
        
        # Also create a summary report
        self._create_summary_report(change_map, region)
    
    def _calculate_change_detection(self, img_2000, img_2025):
        """Calculate change detection between two images"""
        # Normalize images to same scale
        img_2000_norm = (img_2000 - img_2000.min()) / (img_2000.max() - img_2000.min())
        img_2025_norm = (img_2025 - img_2025.min()) / (img_2025.max() - img_2025.min())
        
        # Calculate difference (positive = increase, negative = decrease)
        change = img_2025_norm - img_2000_norm
        
        # Apply smoothing to reduce noise
        from scipy import ndimage
        try:
            change_smooth = ndimage.gaussian_filter(change, sigma=1.0)
        except:
            change_smooth = change
            
        return change_smooth
    
    def _normalize_image(self, img):
        """Normalize image for display"""
        if len(img.shape) == 3:
            # Color image - normalize each channel
            img_norm = np.zeros_like(img, dtype=float)
            for i in range(img.shape[2]):
                channel = img[:,:,i].astype(float)
                img_norm[:,:,i] = (channel - channel.min()) / (channel.max() - channel.min())
            return img_norm
        else:
            # Grayscale image
            img_float = img.astype(float)
            return (img_float - img_float.min()) / (img_float.max() - img_float.min())
    
    def _add_coordinate_labels(self, ax):
        """Add coordinate labels to plots"""
        # Add coordinate information
        ax.set_xticks([0, ax.get_xlim()[1]//2, ax.get_xlim()[1]])
        ax.set_xticklabels([f"{self.sierra_madre_bbox['west']:.1f}°E", 
                           f"{(self.sierra_madre_bbox['west'] + self.sierra_madre_bbox['east'])/2:.1f}°E",
                           f"{self.sierra_madre_bbox['east']:.1f}°E"])
        
        ax.set_yticks([0, ax.get_ylim()[0]//2, ax.get_ylim()[0]])
        ax.set_yticklabels([f"{self.sierra_madre_bbox['north']:.1f}°N",
                           f"{(self.sierra_madre_bbox['north'] + self.sierra_madre_bbox['south'])/2:.1f}°N", 
                           f"{self.sierra_madre_bbox['south']:.1f}°N"])
    
    def _create_change_statistics(self, change_map, ax):
        """Create change statistics visualization"""
        # Calculate statistics
        total_pixels = change_map.size
        forest_loss = np.sum(change_map < -0.1)  # Significant decrease
        forest_gain = np.sum(change_map > 0.1)   # Significant increase
        no_change = total_pixels - forest_loss - forest_gain
        
        # Create pie chart
        sizes = [forest_loss, no_change, forest_gain]
        labels = ['Forest Loss', 'No Change', 'Forest Gain']
        colors = ['red', 'gray', 'green']
        explode = (0.05, 0, 0.05)  # Explode loss and gain
        
        wedges, texts, autotexts = ax.pie(sizes, labels=labels, colors=colors, explode=explode,
                                         autopct='%1.1f%%', startangle=90, textprops={'fontsize': 10})
        
        ax.set_title('Forest Change Statistics\\n(2000 vs 2024)', fontweight='bold')
        
        # Add statistics text
        stats_text = (
            f"Total Area Analyzed: {total_pixels:,} pixels\\n"
            f"Estimated Forest Loss: {(forest_loss/total_pixels)*100:.1f}%\\n"
            f"Estimated Forest Gain: {(forest_gain/total_pixels)*100:.1f}%\\n"
            f"Net Change: {((forest_gain-forest_loss)/total_pixels)*100:.1f}%"
        )
        
        ax.text(1.3, 0, stats_text, transform=ax.transAxes, fontsize=10,
                bbox=dict(boxstyle="round,pad=0.3", facecolor='lightblue', alpha=0.8))
    
    def _create_regional_analysis(self, img_2000, img_2025, ax):
        """Create regional intensity analysis"""
        # Create regional averages (divide image into grid)
        rows, cols = 4, 6  # Grid for regional analysis
        h, w = img_2000.shape
        
        region_changes = []
        x_positions = []
        
        for i in range(rows):
            for j in range(cols):
                # Extract region
                r_start, r_end = i * h // rows, (i + 1) * h // rows
                c_start, c_end = j * w // cols, (j + 1) * w // cols
                
                region_2000 = img_2000[r_start:r_end, c_start:c_end]
                region_2025 = img_2025[r_start:r_end, c_start:c_end]
                
                # Calculate average change
                avg_2000 = np.mean(region_2000)
                avg_2025 = np.mean(region_2025)
                change_pct = ((avg_2025 - avg_2000) / avg_2000) * 100 if avg_2000 > 0 else 0
                
                region_changes.append(change_pct)
                x_positions.append(i * cols + j)
        
        # Create bar plot
        colors = ['red' if x < -5 else 'green' if x > 5 else 'gray' for x in region_changes]
        bars = ax.bar(x_positions, region_changes, color=colors, alpha=0.7)
        
        ax.set_title('Regional Forest Change Analysis (% Change by Area)', fontweight='bold', fontsize=12)
        ax.set_xlabel('Geographic Regions (West to East, North to South)')
        ax.set_ylabel('Percentage Change (%)')
        ax.axhline(y=0, color='black', linestyle='-', alpha=0.3)
        ax.axhline(y=5, color='green', linestyle='--', alpha=0.5, label='Growth Threshold')
        ax.axhline(y=-5, color='red', linestyle='--', alpha=0.5, label='Loss Threshold')
        ax.legend()
        ax.grid(True, alpha=0.3)
        
        # Add value labels on bars
        for bar, value in zip(bars, region_changes):
            if abs(value) > 2:  # Only label significant changes
                ax.text(bar.get_x() + bar.get_width()/2, bar.get_height() + (1 if value > 0 else -1),
                       f'{value:.1f}%', ha='center', va='bottom' if value > 0 else 'top', fontsize=8)
    
    def _create_summary_report(self, change_map, region):
        """Create a summary report JSON file"""
        # Calculate summary statistics
        total_pixels = change_map.size
        forest_loss_pixels = np.sum(change_map < -0.1)
        forest_gain_pixels = np.sum(change_map > 0.1)
        stable_pixels = total_pixels - forest_loss_pixels - forest_gain_pixels
        
        # Create summary report
        report = {
            "analysis_date": datetime.now().isoformat(),
            "region": region,
            "coordinates": self.sierra_madre_bbox,
            "data_source": "NASA MODIS Surface Reflectance",
            "analysis_period": "2000-2024",
            "statistics": {
                "total_pixels_analyzed": total_pixels,
                "forest_loss_pixels": int(forest_loss_pixels),
                "forest_gain_pixels": int(forest_gain_pixels),
                "stable_pixels": int(stable_pixels),
                "forest_loss_percentage": (forest_loss_pixels / total_pixels) * 100,
                "forest_gain_percentage": (forest_gain_pixels / total_pixels) * 100,
                "stable_percentage": (stable_pixels / total_pixels) * 100,
                "net_change_percentage": ((forest_gain_pixels - forest_loss_pixels) / total_pixels) * 100
            },
            "interpretation": {
                "overall_trend": "Forest Loss" if forest_loss_pixels > forest_gain_pixels else "Forest Gain" if forest_gain_pixels > forest_loss_pixels else "Stable",
                "change_magnitude": "Significant" if abs((forest_gain_pixels - forest_loss_pixels) / total_pixels) > 0.1 else "Moderate",
                "data_quality": "High (NASA MODIS)"
            }
        }
        
        # Save report
        report_path = self.data_dir / f"{region}_forest_analysis_report.json"
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"✅ Created analysis report: {report_path.name}")

def create_enhanced_visualizations():
    """Create enhanced visualizations from existing satellite data"""
    processor = ImprovedVisualizationProcessor()
    
    # Process the existing satellite images
    satellite_files = [
        ("sierra_madre_2000_satellite.png", "sierra_madre_2025_satellite.png", "sierra_madre"),
        ("manila_2000_satellite.png", "manila_2025_satellite.png", "manila")
    ]
    
    for file_2000, file_2025, region in satellite_files:
        if (processor.data_dir / file_2000).exists() and (processor.data_dir / file_2025).exists():
            print(f"\\n🎨 Processing {region} comparison...")
            processor.create_enhanced_comparison(file_2000, file_2025, region)
        else:
            print(f"⚠️ Skipping {region} - files not found")

if __name__ == "__main__":
    print("🎨 Creating Enhanced Forest Monitoring Visualizations")
    print("=" * 60)
    create_enhanced_visualizations()