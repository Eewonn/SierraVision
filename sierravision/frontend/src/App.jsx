/**
 * SierraVision Frontend Application
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
import { fetchImages, fetchFireData, fetchComparisonImages } from './api'

// Import custom components
import Header from './components/Header'
import StatsDashboard from './components/StatsDashboard'
import ImageComparison from './components/ImageComparison'
import FireDataDisplay from './components/FireDataDisplay'
import Footer from './components/Footer'

export default function App() {
  // Application state management
  const [images, setImages] = useState([])           // Available satellite images
  const [error, setError] = useState(null)          // Error messages
  const [fireData, setFireData] = useState(null)    // Active fire data from NASA FIRMS
  const [loading, setLoading] = useState(false)     // Loading state for fetch operations
  const [lastUpdated, setLastUpdated] = useState(null) // Timestamp of last data update

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
      // Fetch both image list and fire data simultaneously
      const [imagesData, fireDataResult] = await Promise.all([
        fetchImages(),    // Get list of available satellite images
        fetchFireData()   // Get active fire data from NASA FIRMS
      ])
      
      // Update application state with fetched data
      setImages(imagesData.images || [])
      setFireData(fireDataResult)
      
      // Clear any previous errors
      setError(null)
    } catch (err) {
      // Handle and display fetch errors
      setError(err.message)
      console.error('Error loading data:', err)
    }
  }

  /**
   * Fetch fresh satellite imagery from NASA sources
   * Triggers backend to download and process new comparison images
   */
  const handleFetchNewImages = async () => {
    setLoading(true)
    setError(null)
    
    try {
      // Request fresh satellite imagery from NASA for Sierra Madre region
      const result = await fetchComparisonImages('sierra_madre')
      
      // Update timestamp for last fetch operation
      setLastUpdated(new Date().toLocaleString())
      
      // Refresh data to get newly generated images
      await loadData()
      
      // Force browser cache refresh by clearing and reloading images
      // This ensures users see the latest imagery
      setImages([])
      setTimeout(() => {
        loadData()
      }, 100)
      
    } catch (err) {
      // Handle fetch errors with user-friendly message
      setError(`Failed to fetch new images: ${err.message}`)
      console.error('Error fetching new images:', err)
    } finally {
      // Always reset loading state
      setLoading(false)
    }
  }



  // Extract specific year images from the available images list
  const image2000 = images.find(img => img.includes('2000'))  // Historical baseline image
  const image2025 = images.find(img => img.includes('2025'))  // Recent comparison image
  
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

        {/* Image Comparison Section */}
        <div className="fade-in">
          <ImageComparison
            image2000={image2000}
            image2025={image2025}
            imageUrlWithCache={imageUrlWithCache}
            loading={loading}
            onFetchNewImages={handleFetchNewImages}
            lastUpdated={lastUpdated}
          />
        </div>

        {/* Fire Data Display */}
        <div id="data" className="fade-in">
          <FireDataDisplay 
            fireData={fireData}
            loading={loading}
          />
        </div>



        {/* Image Gallery for Loading State */}
        {(!image2000 || !image2025) && images.length > 0 && (
          <section style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            marginBottom: '32px',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{
              color: '#1e293b',
              marginBottom: '24px',
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: '600'
            }}>
              Available Satellite Images
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '24px'
            }}>
              {images.map(img => (
                <div key={img} style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  border: '1px solid #e2e8f0',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
                }}>
                  <img 
                    src={`http://localhost:8000/data/${img}`} 
                    alt={img}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                      borderRadius: '8px',
                      marginBottom: '16px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <p style={{
                    fontSize: '14px',
                    color: '#64748b',
                    margin: 0,
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}>
                    {img.replace(/[_-]/g, ' ').replace('.png', '')}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Application Footer */}
      <Footer />
    </div>
  )
}
