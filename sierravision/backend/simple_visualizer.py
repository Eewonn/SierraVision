"""
Simple Enhanced Visualizer for SierraVision
Creates better forest monitoring visualizations without complex dependencies
"""
import numpy as np
import matplotlib.pyplot as plt
from pathlib import Path
from datetime import datetime
import json
from PIL import Image
import warnings
warnings.filterwarnings('ignore')

class SimpleEnhancedVisualizer:
    def __init__(self):
        self.data_dir = Path(__file__).parent / "data"
        
        # Sierra Madre coordinates
        self.sierra_madre_bbox = {
            'north': 17.5,
            'south': 14.0,
            'east': 122.8,
            'west': 120.5
        }
        
    def create_forest_comparison_dashboard(self, region: str = "sierra_madre"):
        """
        Create a comprehensive forest comparison dashboard
        """
        print(f"🎨 Creating forest comparison dashboard for {region}")
        
        # Find the satellite images
        files_2000 = list(self.data_dir.glob(f"{region}_*2000*satellite.png"))
        files_2025 = list(self.data_dir.glob(f"{region}_*202*satellite.png"))
        
        if not files_2000 or not files_2025:
            print(f"⚠️ Satellite images not found for {region}")
            return False
        
        try:
            # Load images
            img_2000 = Image.open(files_2000[0])
            img_2025 = Image.open(files_2025[0])
            
            # Convert to numpy arrays
            arr_2000 = np.array(img_2000)
            arr_2025 = np.array(img_2025)
            
            # Handle different image sizes by resizing
            if arr_2000.shape != arr_2025.shape:
                print(f"📐 Resizing images to match: {arr_2000.shape} vs {arr_2025.shape}")
                # Resize the larger image to match the smaller one
                min_height = min(arr_2000.shape[0], arr_2025.shape[0])
                min_width = min(arr_2000.shape[1], arr_2025.shape[1])
                
                arr_2000 = arr_2000[:min_height, :min_width]
                arr_2025 = arr_2025[:min_height, :min_width]
            
            # Create the dashboard
            self._create_comparison_dashboard(arr_2000, arr_2025, region)
            
            return True
            
        except Exception as e:
            print(f"❌ Error creating dashboard: {e}")
            import traceback
            traceback.print_exc()
            return False
    
    def _create_comparison_dashboard(self, img_2000, img_2025, region):
        """
        Create comprehensive comparison dashboard
        """
        # Create figure with custom layout
        fig = plt.figure(figsize=(20, 12))
        
        # Convert to grayscale for analysis if needed
        if len(img_2000.shape) == 3:
            gray_2000 = np.mean(img_2000, axis=2)
        else:
            gray_2000 = img_2000
            
        if len(img_2025.shape) == 3:
            gray_2025 = np.mean(img_2025, axis=2)
        else:
            gray_2025 = img_2025
        
        # Calculate simple change detection
        change_map = self._simple_change_detection(gray_2000, gray_2025)
        
        # Create subplots
        gs = fig.add_gridspec(2, 4, height_ratios=[2, 1], width_ratios=[1, 1, 1, 1])
        
        # 1. Original 2000 image
        ax1 = fig.add_subplot(gs[0, 0])
        ax1.imshow(img_2000, cmap='RdYlGn')
        ax1.set_title('Sierra Madre 2000\\n(NASA MODIS Data)', fontweight='bold', fontsize=12)
        ax1.set_xlabel('Longitude →')
        ax1.set_ylabel('Latitude →')
        ax1.grid(True, alpha=0.3)
        
        # 2. Original 2025 image
        ax2 = fig.add_subplot(gs[0, 1])
        ax2.imshow(img_2025, cmap='RdYlGn')
        ax2.set_title('Sierra Madre 2024\\n(NASA MODIS Data)', fontweight='bold', fontsize=12)
        ax2.set_xlabel('Longitude →')
        ax2.set_ylabel('Latitude →')
        ax2.grid(True, alpha=0.3)
        
        # 3. Change detection
        ax3 = fig.add_subplot(gs[0, 2])
        change_plot = ax3.imshow(change_map, cmap='RdYlBu', vmin=-0.5, vmax=0.5)
        ax3.set_title('Forest Change Detection\\n(Blue=Growth, Red=Loss)', fontweight='bold', fontsize=12)
        ax3.set_xlabel('Longitude →')
        ax3.set_ylabel('Latitude →')
        ax3.grid(True, alpha=0.3)
        
        # Add colorbar
        cbar = fig.colorbar(change_plot, ax=ax3, shrink=0.8)
        cbar.set_label('Change Intensity')
        
        # 4. Side-by-side comparison
        ax4 = fig.add_subplot(gs[0, 3])
        # Create a difference visualization
        diff_img = np.abs(gray_2025 - gray_2000)
        diff_plot = ax4.imshow(diff_img, cmap='hot')
        ax4.set_title('Absolute Difference\\n(Brighter = More Change)', fontweight='bold', fontsize=12)
        ax4.set_xlabel('Longitude →')
        ax4.set_ylabel('Latitude →')
        ax4.grid(True, alpha=0.3)
        
        # Add colorbar
        cbar2 = fig.colorbar(diff_plot, ax=ax4, shrink=0.8)
        cbar2.set_label('Difference Magnitude')
        
        # 5. Statistics
        ax5 = fig.add_subplot(gs[1, 0:2])
        self._create_change_statistics_simple(change_map, ax5)
        
        # 6. Profile analysis
        ax6 = fig.add_subplot(gs[1, 2:4])
        self._create_profile_analysis(gray_2000, gray_2025, ax6)
        
        # Add main title
        region_name = region.replace('_', ' ').title()
        fig.suptitle(f'{region_name} Forest Monitoring Analysis\\nPhilippines Deforestation Study - NASA MODIS Data', 
                     fontsize=16, fontweight='bold', y=0.95)
        
        # Add metadata
        metadata_text = (
            f"🛰️ Data: NASA MODIS Surface Reflectance | 📅 Period: 2000-2024 | 📍 Region: {region_name}\\n"
            f"🔬 Analysis: earthaccess integration | 📊 Resolution: ~250m pixels | 🌍 Coordinates: {self.sierra_madre_bbox['west']}°-{self.sierra_madre_bbox['east']}°E, {self.sierra_madre_bbox['south']}°-{self.sierra_madre_bbox['north']}°N"
        )
        fig.text(0.02, 0.02, metadata_text, fontsize=10, 
                bbox=dict(boxstyle="round,pad=0.5", facecolor='lightblue', alpha=0.8))
        
        plt.tight_layout()
        
        # Save the dashboard
        output_path = self.data_dir / f"{region}_forest_monitoring_dashboard.png"
        plt.savefig(output_path, dpi=300, bbox_inches='tight', facecolor='white')
        plt.close()
        
        print(f"✅ Created forest monitoring dashboard: {output_path.name}")
        
        # Create summary report
        self._create_summary_report_simple(change_map, region)
    
    def _simple_change_detection(self, img1, img2):
        """Simple change detection between two images"""
        # Normalize images
        img1_norm = (img1 - img1.mean()) / img1.std()
        img2_norm = (img2 - img2.mean()) / img2.std()
        
        # Calculate normalized difference
        change = (img2_norm - img1_norm) / (img1_norm + img2_norm + 1e-8)
        
        return change
    
    def _create_change_statistics_simple(self, change_map, ax):
        """Create simple change statistics"""
        # Calculate basic statistics
        total_pixels = change_map.size
        significant_loss = np.sum(change_map < -0.1)
        significant_gain = np.sum(change_map > 0.1)
        minimal_change = total_pixels - significant_loss - significant_gain
        
        # Create bar chart
        categories = ['Forest Loss', 'Stable/Minor Change', 'Forest Growth']
        values = [significant_loss, minimal_change, significant_gain]
        percentages = [v/total_pixels*100 for v in values]
        colors = ['red', 'gray', 'green']
        
        bars = ax.bar(categories, percentages, color=colors, alpha=0.7)
        ax.set_title('Forest Change Analysis (2000-2024)', fontweight='bold')
        ax.set_ylabel('Percentage of Area (%)')
        ax.grid(True, alpha=0.3)
        
        # Add percentage labels on bars
        for bar, pct in zip(bars, percentages):
            height = bar.get_height()
            ax.text(bar.get_x() + bar.get_width()/2., height + 0.5,
                   f'{pct:.1f}%', ha='center', va='bottom', fontweight='bold')
        
        # Add summary text
        net_change = (significant_gain - significant_loss) / total_pixels * 100
        trend = "Net Forest Loss" if net_change < -1 else "Net Forest Gain" if net_change > 1 else "Relatively Stable"
        
        ax.text(0.02, 0.98, f"Overall Trend: {trend}\\nNet Change: {net_change:.1f}%", 
               transform=ax.transAxes, fontsize=11, verticalalignment='top',
               bbox=dict(boxstyle="round,pad=0.3", facecolor='yellow', alpha=0.7))
    
    def _create_profile_analysis(self, img1, img2, ax):
        """Create profile analysis showing changes across the region"""
        # Create average profiles across different directions
        
        # Horizontal profile (North-South average)
        h_profile_2000 = np.mean(img1, axis=0)
        h_profile_2025 = np.mean(img2, axis=0)
        
        # Vertical profile (East-West average)  
        v_profile_2000 = np.mean(img1, axis=1)
        v_profile_2025 = np.mean(img2, axis=1)
        
        # Plot horizontal profiles
        x_coords = np.linspace(self.sierra_madre_bbox['west'], self.sierra_madre_bbox['east'], len(h_profile_2000))
        ax.plot(x_coords, h_profile_2000, 'b-', label='2000 (West-East)', linewidth=2, alpha=0.7)
        ax.plot(x_coords, h_profile_2025, 'r-', label='2024 (West-East)', linewidth=2, alpha=0.7)
        
        ax.set_title('Forest Density Profiles Across Region', fontweight='bold')
        ax.set_xlabel('Geographic Position')
        ax.set_ylabel('Average Surface Reflectance')
        ax.legend()
        ax.grid(True, alpha=0.3)
        
        # Add difference shading
        diff = h_profile_2025 - h_profile_2000
        ax.fill_between(x_coords, 0, diff, where=(diff > 0), color='green', alpha=0.3, label='Increase')
        ax.fill_between(x_coords, 0, diff, where=(diff < 0), color='red', alpha=0.3, label='Decrease')
    
    def _create_summary_report_simple(self, change_map, region):
        """Create simple summary report"""
        total_pixels = change_map.size
        loss_pixels = np.sum(change_map < -0.1)
        gain_pixels = np.sum(change_map > 0.1)
        
        report = {
            "analysis_date": datetime.now().isoformat(),
            "region": region,
            "method": "Simple Change Detection",
            "data_source": "NASA MODIS (via earthaccess)",
            "period": "2000-2024",
            "results": {
                "total_pixels": int(total_pixels),
                "forest_loss_percentage": float(loss_pixels / total_pixels * 100),
                "forest_gain_percentage": float(gain_pixels / total_pixels * 100),
                "stable_percentage": float((total_pixels - loss_pixels - gain_pixels) / total_pixels * 100),
                "net_change_percentage": float((gain_pixels - loss_pixels) / total_pixels * 100)
            },
            "interpretation": {
                "trend": "Loss" if loss_pixels > gain_pixels else "Gain" if gain_pixels > loss_pixels else "Stable",
                "confidence": "Medium (visual analysis)",
                "notes": "Based on NASA MODIS surface reflectance data processed via earthaccess library"
            }
        }
        
        # Save report
        report_path = self.data_dir / f"{region}_analysis_summary.json"
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        print(f"✅ Created summary report: {report_path.name}")

def main():
    """Create enhanced visualizations for all available regions"""
    visualizer = SimpleEnhancedVisualizer()
    
    # Process available regions
    regions = ["sierra_madre", "manila"]
    
    for region in regions:
        print(f"\\n🎨 Processing {region}...")
        success = visualizer.create_forest_comparison_dashboard(region)
        if success:
            print(f"✅ Successfully created dashboard for {region}")
        else:
            print(f"⚠️ Could not create dashboard for {region}")

if __name__ == "__main__":
    print("🎨 SierraVision Enhanced Forest Monitoring Dashboard")
    print("=" * 60)
    main()