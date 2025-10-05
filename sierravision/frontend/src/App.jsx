/**
 * SierraVision Frontenexport default function App() {
  // Application state management
  const [images, setImages] = useState([])           // Available satellite images
  const [error, setError] = useState(null)          // Error messages
  const [fireData, setFireData] = useState(null)    // Active fire data from NASA FIRMS
  const [loading, setLoading] = useState(false)     // Loading state for fetch operations
  const [lastUpdated, setLastUpdated] = useState(null) // Timestamp of last data update
  
  // Year slider state
  const [availableYears, setAvailableYears] = useState([]) // Years with downloaded images
  const [currentYear, setCurrentYear] = useState(2024)     // Currently selected yearn
 * =================================
 * Advanced React application for comprehensive forest monitoring and deforestation 
 * analysis in the Sierra Madre region using NASA satellite imagery and environmental data.
 * 
 * Features:
 * - Interactive satellite imagery comparison (2000 vs 2025)
 * - Real-time NASA FIRMS fire data with detailed analysis
 * - Focused on Sierra Madre region monitoring
 * - Statistical dashboard with monitoring metrics
 * - Advanced controls with region selection
 * - Responsive component-based architecture
 * - Professional UI with enhanced user experience
 */

import React, { useEffect, useState } from 'react'
import { fetchImages, fetchFireData, fetchYearRangeImages, fetchSingleYearImage, getAvailableYears } from './api'

// Import custom components
import Header from './components/Header'
import StatsDashboard from './components/StatsDashboard'
import YearSlider from './components/YearSlider'
import FireDataDisplay from './components/FireDataDisplay'
import Footer from './components/Footer'

export default function App() {
  // Application state management
  const [images, setImages] = useState([])           // Available satellite images
  const [error, setError] = useState(null)          // Error messages
  const [fireData, setFireData] = useState(null)    // Active fire data from NASA FIRMS
  const [loading, setLoading] = useState(false)     // Loading state for fetch operations
  const [lastUpdated, setLastUpdated] = useState(null) // Timestamp of last data update
  
  // Year slider state
  const [availableYears, setAvailableYears] = useState([]) // Years with downloaded images
  const [currentYear, setCurrentYear] = useState(2024)     // Currently selected year
  const [viewMode, setViewMode] = useState('slider')       // 'comparison' or 'slider'

  // Load initial data when component mounts
  useEffect(() => {
    loadData()
  }, [])

  /**
   * Load satellite images and fire data from the backend API
   * Fetches both datasets concurrently for better performance
   */
  const loadData = async () => {
    try {
      // Fetch image list, fire data, and available years simultaneously
      const [imagesData, fireDataResult, yearsData] = await Promise.all([
        fetchImages(),      // Get list of available satellite images
        fetchFireData(),    // Get active fire data from NASA FIRMS
        getAvailableYears() // Get years for which we have images
      ])
      
      // Update application state with fetched data
      setImages(imagesData.images || [])
      setFireData(fireDataResult)
      setAvailableYears(yearsData.available_years || [])
      
      // Clear any previous errors
      setError(null)
    } catch (err) {
      // Handle and display fetch errors
      setError(err.message)
      console.error('Error loading data:', err)
    }
  }



  /**
   * Fetch images for a range of years (2010-2025)
   * Downloads satellite imagery for multiple years
   */
  const handleFetchYearRange = async (startYear = 2010, endYear = 2025) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchYearRangeImages(startYear, endYear)
      
      // Update timestamp for last fetch operation
      setLastUpdated(new Date().toLocaleString())
      
      // Refresh data to get newly generated images
      await loadData()
      
      console.log(`Fetched images for ${startYear}-${endYear}:`, result)
      
    } catch (err) {
      setError(`Failed to fetch year range images: ${err.message}`)
      console.error('Error fetching year range images:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Fetch image for a specific year
   */
  const handleFetchSingleYear = async (year) => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchSingleYearImage(year)
      
      // Update timestamp for last fetch operation
      setLastUpdated(new Date().toLocaleString())
      
      // Refresh data to get newly generated images
      await loadData()
      
      console.log(`Fetched image for ${year}:`, result)
      
    } catch (err) {
      setError(`Failed to fetch image for year ${year}: ${err.message}`)
      console.error('Error fetching single year image:', err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle year change from slider
   */
  const handleYearChange = (year) => {
    setCurrentYear(year)
  }



  /**
   * Generate image URL with cache-busting parameter
   * Ensures browser fetches the latest version of images
   * @param {string} filename - Image filename to load
   * @returns {string} - Complete URL with cache buster
   */
  const imageUrlWithCache = (filename) => {
    return `http://localhost:8000/data/${filename}?t=${Date.now()}`
  }

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      backgroundColor: '#f8fafc',
      minHeight: '100vh',
      color: '#334155'
    }}>
      {/* Application Header */}
      <Header />
      
      {/* Error Display */}
      {error && (
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto 24px auto',
          padding: '0 24px'
        }}>
          <div style={{
            color: '#dc2626', 
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '12px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: '#dc2626',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              fontWeight: 'bold',
              flexShrink: 0
            }}>!</div>
            <span>Error: {error}</span>
          </div>
        </div>
      )}

      {/* Main Content Container */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Statistics Dashboard */}
        <div className="fade-in">
          <StatsDashboard 
            fireData={fireData}
            images={images}
            loading={loading}
            onDataRefresh={loadData}
          />
        </div>

        {/* Year Slider Section */}
        <div className="fade-in">
          <YearSlider
            availableYears={availableYears}
            currentYear={currentYear}
            onYearChange={handleYearChange}
            loading={loading}
            onFetchYear={handleFetchSingleYear}
            onFetchYearRange={handleFetchYearRange}
            imageUrlWithCache={imageUrlWithCache}
          />
        </div>

        {/* Fire Data Display */}
        <div id="data" className="fade-in">
          <FireDataDisplay 
            fireData={fireData}
            loading={loading}
          />
        </div>
      </div>

      {/* Application Footer */}
      <Footer />
    </div>
  )
}
