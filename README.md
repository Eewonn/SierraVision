# SierraVision Technical Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [How to Use SierraVision](#how-to-use-sierravision)
- [System Architecture](#system-architecture)
- [Technologies Used](#technologies-used)
- [Installation & Setup](#installation--setup)
- [API Documentation](#api-documentation)
- [Frontend Components](#frontend-components)
- [Data Sources](#data-sources)
- [Development Workflow](#development-workflow)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## Project Overview

### What is SierraVision?

SierraVision is a comprehensive website designed for users to visualize and analyze the changes in the Sierra Madre mountain range, over time. Users will be able to see how far it has changed by changing the years provided in the website. The platform enables users to explore satellite imagery from 2010 to 2025, providing insights into deforestation patterns, forest coverage changes, and environmental impact analysis.

**Key Features:**
- **Interactive Year Slider**: Navigate through 16 years of satellite imagery (2010-2025)
- **Real-time Fire Data**: Integration with NASA FIRMS for active fire monitoring
- **Forest Change Analytics**: Detailed deforestation statistics and trends
- **Environmental Dashboard**: Comprehensive metrics on forest coverage and loss
- **High-Quality Imagery**: NASA GIBS satellite data with multiple fallback sources

### Mission & Impact

**What does it achieve?**

SierraVision serves as a powerful tool for environmental awareness and education:

- **Environmental Awareness**: Helps users understand the critical importance of the Sierra Madre as the Philippines' natural protector against floods and natural disasters
- **Data-Driven Insights**: Provides quantitative analysis of forest loss patterns (21,840 hectares lost from 2010-2025)
- **Risk Assessment**: Real-time fire monitoring helps identify potential threats to forest areas
- **Trend Analysis**: Visual comparison shows the progression of deforestation over 15+ years
- **Conservation Advocacy**: Raises awareness about the impacts of destructive mining and logging operations

The platform aims to educate stakeholders about the risks of losing one of the Philippines' most critical natural barriers, encouraging sustainable practices and conservation efforts.

---

## How to Use SierraVision

### Getting Started

**Accessing SierraVision:**
1. Open your web browser (Chrome, Firefox, Safari, or Edge)
2. Navigate to the SierraVision website
3. The application loads automatically - no registration required!

###  Main Interface Overview

When you first open SierraVision, you'll see:

#### **Header Section**
- **SierraVision Logo**: Brand identity with mountain imagery
- **Navigation Menu**: Links to different sections (Overview, Data, etc.)
- **Title**: "Advanced Forest Monitoring & Environmental Analysis"

#### **Statistics Dashboard**
The top section displays key environmental metrics:
- **Total Images**: Number of satellite images available
- **Date Range**: Coverage period (2010-2025, spanning 16 years)
- **Active Fires**: Current fire alerts from NASA
- **Annual Deforestation Rate**: 1.8% per year
- **Hectares Lost**: 21,840 hectares lost since 2010
- **Forest Coverage Remaining**: 32.5k hectares remaining

### Using the Year Slider (Main Feature)

The **Year Slider** is the heart of SierraVision - here's how to use it:

#### **Step 1: Understanding the Interface**
- **Large Year Display**: Shows currently selected year (e.g., "2024")
- **Availability Status**: Green = Image available, Red = Not downloaded
- **Slider Bar**: Interactive timeline from 2010 to 2025

#### **Step 2: Navigating Through Years**
**Method 1 - Drag the Slider:**
1. Click and drag the blue slider handle left/right
2. Watch the year change in real-time
3. Release to select that year

**Method 2 - Click Specific Years:**
1. Click on any year marker below the slider (2010, 2012, 2014, etc.)
2. The slider jumps to that year instantly

**Method 3 - Auto-Play Feature:**
1. Click the "▶ Play" button to automatically cycle through years
2. Adjust speed: "Fast (0.5s)", "Normal (1s)", or "Slow (2s)"
3. Click "⏸ Pause" to stop auto-play

#### **Step 3: Viewing Satellite Images**
- **Single Year View**: See one satellite image at a time
- **Available Images**: Display immediately when year is selected
- **Missing Images**: Show placeholder with download option

#### **Step 4: Comparison Mode**
1. **Enable Comparison**: Check the "Enable Year Comparison" box
2. **Select Comparison Year**: Choose a different year from the dropdown
3. **Side-by-Side View**: Two images appear for easy comparison
4. **Visual Analysis**: Compare forest coverage between different years

### Understanding the Data

#### **Environmental Indicators Section**
- **Active Fires**: Real-time fire alerts in the Sierra Madre region
- **High Confidence Fires**: Fires with >80% detection confidence
- **Fire Confidence Average**: Overall reliability of fire detection data

#### **Image Analysis Information**
- **Total Images Available**: Count of downloaded satellite images
- **Data Coverage**: Shows 2010-2025 timeframe (16 years)
- **Missing Images**: Years without downloaded satellite data

#### **Forest Change Analytics**
- **Deforestation Rate**: Annual percentage of forest loss (1.8% per year)
- **Total Forest Loss**: Hectares lost since 2010 (21,840 ha)
- **Remaining Forest**: Current forest coverage (32,460 ha)
- **Loss Percentage**: Total percentage lost over 15 years (40.2%)

### Fire Data Monitoring

The **Fire Data Display** section shows:
- **Real-time Fire Detection**: Updated from NASA FIRMS every 3 hours
- **Geographic Filtering**: Only fires within Sierra Madre boundaries
- **Confidence Levels**: Low, Nominal, High confidence ratings
- **Historical Context**: How current fire activity compares to trends

### Downloading New Images

#### **Fetching Individual Years**
1. Select a year showing " Not downloaded" status
2. The system automatically attempts to fetch the image
3. Wait for download completion (may take 30-60 seconds)
4. Image appears once download is successful

#### **Bulk Download Options**
1. **"Fetch All Years" Button**: Downloads images for all years (2010-2025)
2. **Progress Tracking**: Shows download progress and success rate
3. **Multiple Sources**: Tries NASA GIBS, MODIS, and VIIRS automatically
4. **Fallback Handling**: Uses backup sources if primary fails

### Tips for Best Experience

#### **Performance Optimization**
- **Internet Connection**: Stable broadband recommended for image downloads
- **Browser**: Use modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- **Screen Size**: Desktop/laptop recommended for full experience
- **Mobile**: Responsive design works on tablets and smartphones

#### **Interpreting Satellite Images**
- **Green Areas**: Dense forest coverage
- **Brown/Tan Areas**: Cleared land, agriculture, or bare soil
- **Blue Areas**: Water bodies (rivers, lakes)
- **Gray Areas**: Urban development or mining areas
- **Cloud Cover**: White patches may obscure some areas

#### **Understanding Changes Over Time**
- **Gradual Loss**: Notice subtle changes year by year
- **Major Events**: Sudden changes may indicate mining, logging, or disasters
- **Seasonal Variations**: Some changes reflect dry/wet seasons
- **Recovery**: Green areas returning may show reforestation efforts

### Educational Use Cases

#### **For Students and Educators**
- **Environmental Science**: Study deforestation patterns and causes
- **Geography**: Understand topographic changes over time
- **Data Analysis**: Interpret quantitative environmental data
- **Conservation**: Learn about protection strategies

#### **For Researchers and Analysts**
- **Trend Analysis**: Track long-term environmental changes
- **Impact Assessment**: Measure effects of human activities
- **Policy Development**: Support evidence-based conservation policies
- **Community Planning**: Inform sustainable development decisions

#### **For Environmental Advocates**
- **Awareness Campaigns**: Visual evidence of environmental change
- **Community Education**: Show local impact of deforestation
- **Policy Advocacy**: Support conservation initiatives with data
- **Media Content**: Create compelling environmental stories

### 🔧 Troubleshooting Common Issues

#### **Images Not Loading**
- **Check Internet**: Ensure stable internet connection
- **Refresh Page**: Try reloading the browser page
- **Clear Cache**: Clear browser cache and cookies
- **Try Different Year**: Some years may have limited data availability

#### **Slow Performance**
- **Close Other Tabs**: Free up browser memory
- **Check Connection**: Satellite images are large files (1-5MB each)
- **Wait for Downloads**: Allow time for image processing
- **Use Wired Connection**: WiFi may be slower for large downloads

#### **Fire Data Not Showing**
- **Real-time Dependency**: Fire data updates every 3 hours
- **No Current Fires**: Zero fires displayed means no active fires detected
- **Geographic Filtering**: Only shows fires within Sierra Madre region
- **Seasonal Patterns**: Fire activity varies by season and weather

### 💡 Advanced Features

#### **Data Export Capabilities**
- **Screenshot Images**: Use browser screenshot tools to save comparisons
- **Share URLs**: Bookmark specific years for easy sharing
- **Data Analysis**: Export statistics for further analysis
- **Report Generation**: Create environmental reports (future feature)

#### **Integration Opportunities**
- **Educational Platforms**: Embed in learning management systems
- **Research Projects**: Use data for academic research
- **Policy Presentations**: Include in government or NGO presentations
- **Community Workshops**: Use for environmental awareness sessions

---

## System Architecture

### High-Level Architecture

```
┌─────────────────┐    HTTP/REST API    ┌──────────────────┐
│   Frontend      │◄─────────────────►  │    Backend       │
│   (React/Vite)  │                     │   (FastAPI)      │
└─────────────────┘                     └──────────────────┘
                                                   │
                                                   ▼
                                        ┌──────────────────┐
                                        │  External APIs   │
                                        │  • NASA GIBS     │
                                        │  • NASA FIRMS    │
                                        │  • Hansen GFC    │
                                        └──────────────────┘
```

### Component Architecture

#### Backend Components
- **FastAPI Application**: Core API server handling requests
- **Satellite Data Fetcher**: Handles imagery downloads and processing
- **Forest Analytics Engine**: Processes deforestation data
- **Fire Data Processor**: Integrates NASA FIRMS fire detection data
- **Data Storage**: Local file system for cached imagery

#### Frontend Components
- **Year Slider Component**: Interactive year navigation (2010-2025)
- **Statistics Dashboard**: Environmental metrics and analytics
- **Fire Data Display**: Real-time fire monitoring interface
- **Image Comparison**: Side-by-side imagery analysis
- **Header/Navigation**: Application branding and navigation

---

## Technologies Used

### Backend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **Python** | 3.7+ | Core backend language |
| **FastAPI** | Latest | Modern web framework for building APIs |
| **Uvicorn** | Latest | ASGI server for running FastAPI |
| **Requests** | Latest | HTTP client for NASA API integration |
| **Pillow** | Latest | Image processing and enhancement |
| **NumPy** | Latest | Numerical computing for data analysis |
| **Matplotlib** | Latest | Data visualization (non-interactive backend) |
| **ReportLab** | Latest | PDF generation for environmental reports |
| **Python-dotenv** | Latest | Environment variable management |

### Frontend Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^18.2.0 | UI framework for interactive components |
| **Vite** | Latest | Fast build tool and development server |
| **JavaScript ES6+** | - | Modern JavaScript features |
| **CSS3** | - | Styling and responsive design |

### Data Sources & APIs
| Source | Purpose | API Endpoint |
|--------|---------|--------------|
| **NASA GIBS** | High-quality satellite imagery | `https://gibs.earthdata.nasa.gov/wms/` |
| **NASA FIRMS** | Active fire detection data | `https://firms.modaps.eosdis.nasa.gov/api/` |
| **Hansen Global Forest Change** | Forest change baseline data | Integrated dataset |
| **MODIS Terra/Aqua** | Satellite imagery backup | Via NASA GIBS |
| **VIIRS** | Alternative satellite data | Via NASA GIBS |

### Development Tools
- **Visual Studio Code**: Primary IDE with extensions for React/Python
- **Git**: Version control system
- **GitHub**: Repository hosting and collaboration
- **Node.js**: JavaScript runtime for frontend tooling
- **Python venv**: Virtual environment management

---

## Installation & Setup

### Prerequisites
- **Python 3.7+**
- **Node.js 16+**
- **Git**

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Eewonn/SierraVision.git
   cd SierraVision/sierravision/backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\\Scripts\\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   ```bash
   cp .env.example .env
   # Edit .env file with your NASA FIRMS API key (optional)
   ```

5. **Start the backend server**
   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Verify VITE_BACKEND_URL=http://localhost:8001
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Access the application**
   - Frontend: `http://localhost:5173`
   - Backend API: `http://localhost:8001`
   - API Documentation: `http://localhost:8001/docs`

---

## API Documentation

### Core Endpoints

#### Image Management
```http
GET /api/images
```
Returns list of available satellite images in the data directory.

```http
GET /api/available-years?region=sierra_madre
```
Returns years for which satellite imagery is available.

#### Data Fetching
```http
POST /api/fetch-year-range?start_year=2010&end_year=2025&region=sierra_madre
```
Downloads satellite imagery for a specified year range.

```http
POST /api/fetch-year/{year}?region=sierra_madre
```
Downloads satellite imagery for a specific year.

#### Analytics
```http
GET /api/detailed-analytics/{region}
```
Returns comprehensive environmental analytics including:
- Forest change data (2010-2025)
- Active fire statistics
- Deforestation metrics
- Environmental indicators

**Response Structure:**
```json
{
  "region": "sierra_madre",
  "timestamp": "2025-10-05T10:08:26",
  "environmental_indicators": {
    "active_fires": 0,
    "high_confidence_fires": 0,
    "fire_confidence_avg": 0
  },
  "image_metadata": {
    "total_images": 5,
    "date_range": {
      "earliest": "2010",
      "latest": "2025",
      "span_years": 16
    }
  },
  "change_analysis": {
    "images_analyzed": 5,
    "temporal_span": "2010-2025",
    "deforestation_percent": 1.8,
    "forest_loss_hectares": 21840,
    "forest_remaining_hectares": 32460,
    "total_loss_percentage": 40.2
  }
}
```

#### Fire Data
```http
GET /api/nasa/fire-data
```
Returns real-time fire detection data from NASA FIRMS API.

#### System Status
```http
GET /api/health
```
Health check endpoint for system monitoring.

---

## Frontend Components

### YearSlider Component
**Purpose**: Interactive year navigation for satellite imagery

**Features**:
- Slider control for years 2010-2025
- Auto-play functionality with adjustable speed
- Year-to-year comparison mode
- Image availability indicators
- Automatic image fetching for missing years

**Key Props**:
```javascript
{
  availableYears: Array,     // Years with downloaded images
  currentYear: Number,       // Currently selected year
  onYearChange: Function,    // Year change handler
  loading: Boolean,          // Loading state
  onFetchYear: Function,     // Single year fetch handler
  onFetchYearRange: Function, // Range fetch handler
  imageUrlWithCache: Function // Image URL generator
}
```

### StatsDashboard Component
**Purpose**: Environmental metrics and analytics display

**Key Metrics**:
- Total Images Available
- Date Range Coverage (2010-2025)
- Annual Deforestation Rate: 1.8%
- Hectares Lost (Since 2010): 21,840 ha
- Forest Coverage Remaining: 32.5k Ha
- Active Fire Count
- High Confidence Fire Alerts

### FireDataDisplay Component
**Purpose**: Real-time fire monitoring interface

**Features**:
- NASA FIRMS integration
- Fire location mapping
- Confidence level indicators
- Temporal fire data analysis

### Header Component
**Purpose**: Application branding and navigation

**Features**:
- SierraVision logo integration
- Gradient background design
- Responsive navigation menu
- Professional styling

---

## Data Sources

### NASA GIBS (Global Imagery Browse Services)
- **Primary imagery source** for high-resolution satellite data
- **Layers used**: 
  - MODIS Terra Corrected Reflectance True Color
  - VIIRS SNPP Corrected Reflectance True Color
- **Resolution**: 1024x1024 pixels
- **Format**: PNG
- **Coverage**: Global, daily updates

### NASA FIRMS (Fire Information for Resource Management System)
- **Fire detection data** from MODIS and VIIRS satellites
- **Update frequency**: Near real-time (3-hour delay)
- **Confidence levels**: Low, Nominal, High
- **Geographic filtering**: Philippines (Sierra Madre region)

### Hansen Global Forest Change Dataset
- **Forest cover baseline** data for 2000-2023
- **Resolution**: 30-meter pixel resolution
- **Metrics provided**:
  - Forest cover extent
  - Forest loss year
  - Forest gain (2000-2012)
  - Forest loss percentage

### Regional Specifications
**Sierra Madre Bounding Box:**
- North: 17.5°
- South: 14.0°
- East: 122.8° (Pacific coast)
- West: 120.5°

---

## Development Workflow

### Project Structure
```
sierravision/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── satellite_fetcher.py    # Satellite data handling
│   ├── requirements.txt        # Python dependencies
│   ├── data/                   # Cached satellite imagery
│   │   └── satellite_data/     # Downloaded images
│   └── reports/                # Generated reports
├── frontend/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── YearSlider.jsx
│   │   │   ├── StatsDashboard.jsx
│   │   │   ├── FireDataDisplay.jsx
│   │   │   └── Header.jsx
│   │   ├── assets/             # Static assets (logo, etc.)
│   │   ├── App.jsx             # Main application component
│   │   ├── api.js              # API client functions
│   │   └── main.jsx            # Application entry point
│   ├── package.json            # Frontend dependencies
│   └── vite.config.js          # Vite configuration
└── README.md
```

### Development Process

1. **Feature Development**
   - Create feature branch from `main`
   - Implement backend API endpoints
   - Develop corresponding frontend components
   - Test integration between frontend/backend

2. **Data Integration**
   - Test NASA API connections
   - Validate data processing pipelines
   - Ensure error handling for API failures

3. **Testing Approach**
   - API endpoint testing with curl/Postman
   - Frontend component testing in browser
   - Cross-browser compatibility verification
   - Mobile responsiveness testing

4. **Code Quality**
   - Follow Python PEP 8 style guidelines
   - Use React best practices and hooks
   - Implement proper error handling
   - Add comprehensive logging

---

## Deployment

### Production Environment Setup

#### Backend Deployment
1. **Server Requirements**
   - Python 3.7+ runtime
   - 2GB RAM minimum
   - 10GB storage for image caching
   - Reliable internet connection for NASA APIs

2. **Environment Variables**
   ```bash
   FIRMS_API_KEY=your_nasa_firms_api_key
   ENVIRONMENT=production
   CORS_ORIGINS=https://yourdomain.com
   ```

3. **Process Management**
   ```bash
   # Using systemd service
   uvicorn main:app --host 0.0.0.0 --port 8001 --workers 4
   ```

#### Frontend Deployment
1. **Build Process**
   ```bash
   npm run build
   # Generates optimized static files in dist/
   ```

2. **Static Hosting Options**
   - Netlify (recommended for simplicity)
   - Vercel
   - GitHub Pages
   - Traditional web server (nginx/Apache)

3. **Environment Configuration**
   ```bash
   VITE_BACKEND_URL=https://api.yourdomain.com
   ```

### Monitoring & Maintenance
- **Health Check**: `/api/health` endpoint monitoring
- **Log Management**: Centralized logging for API requests
- **Data Backup**: Regular backup of cached satellite imagery
- **API Rate Limiting**: Respect NASA API usage limits

---

## Contributing

### Getting Started
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes following the coding standards
4. Test your changes thoroughly
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Coding Standards
- **Python**: Follow PEP 8 guidelines
- **JavaScript**: Use ES6+ features, prefer functional components
- **Documentation**: Update technical documentation for new features
- **Testing**: Include tests for new functionality

### Areas for Contribution
- Additional satellite data sources integration
- Mobile application development
- Advanced analytics and machine learning
- Multi-language support
- Performance optimizations
- Accessibility improvements

## Contact

**SierraVision Team**
- Repository: [https://github.com/Eewonn/SierraVision](https://github.com/Eewonn/SierraVision)
- Issues: [GitHub Issues](https://github.com/Eewonn/SierraVision/issues)

---

*Last updated: October 5, 2025*
*Version: 1.0.0*