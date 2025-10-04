import React, { useEffect, useState } from 'react'
import { fetchImages, fetchFireData, fetchComparisonImages } from './api'

export default function App() {
  const [images, setImages] = useState([])
  const [error, setError] = useState(null)
  const [fireData, setFireData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [imagesData, fireDataResult] = await Promise.all([
        fetchImages(),
        fetchFireData()
      ])
      setImages(imagesData.images || [])
      setFireData(fireDataResult)
    } catch (err) {
      setError(err.message)
    }
  }

  const handleFetchNewImages = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchComparisonImages()
      await loadData() // Refresh the data
      setLastUpdated(new Date().toLocaleString())
      
      // Force browser to reload images by clearing and resetting
      setImages([])
      setTimeout(() => {
        loadData()
      }, 100)
    } catch (err) {
      setError(`Failed to fetch new images: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const image2000 = images.find(img => img.includes('2000'))
  const image2025 = images.find(img => img.includes('2025'))
  
  // Add cache busting for fresh images
  const imageUrlWithCache = (filename) => {
    return `http://localhost:8000/data/${filename}?t=${Date.now()}`
  }

  return (
    <div style={{fontFamily: 'sans-serif', padding: 20, maxWidth: '1200px', margin: '0 auto'}}>
      <h1 style={{textAlign: 'center', color: '#2c5530'}}>🛰️ SierraVision — Deforestation Viewer</h1>
      <p style={{textAlign: 'center', fontSize: '18px', color: '#666'}}>
        Monitoring Sierra Madre forest changes using NASA satellite imagery
      </p>
      
      {error && <div style={{color: 'red', textAlign: 'center', marginBottom: 20}}>Error: {error}</div>}

      {image2000 && image2025 ? (
        <div>
          <div style={{
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '20px', 
            marginBottom: '30px'
          }}>
            <div style={{textAlign: 'center'}}>
              <h2 style={{color: '#2c5530', marginBottom: '10px'}}>📅 Year 2000</h2>
              <img 
                src={imageUrlWithCache(image2000)} 
                alt="Sierra Madre 2000" 
                style={{
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} 
              />
              <p style={{color: '#666', marginTop: '10px'}}>Baseline forest coverage</p>
            </div>
            
            <div style={{textAlign: 'center'}}>
              <h2 style={{color: '#d63031', marginBottom: '10px'}}>📅 Year 2025</h2>
              <img 
                src={imageUrlWithCache(image2025)} 
                alt="Sierra Madre 2025" 
                style={{
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                }} 
              />
              <p style={{color: '#666', marginTop: '10px'}}>Current forest coverage</p>
            </div>
          </div>

          {fireData && (
            <div style={{
              backgroundColor: '#fff3cd', 
              border: '1px solid #ffeaa7', 
              borderRadius: '8px', 
              padding: '15px', 
              marginTop: '20px'
            }}>
              <h3 style={{color: '#d63031', margin: '0 0 10px 0'}}>🔥 Active Fire Data</h3>
              <p style={{margin: '5px 0'}}>
                <strong>{fireData.count}</strong> active fires detected in Sierra Madre region
              </p>
              {fireData.fires && fireData.fires.length > 0 && (
                <p style={{fontSize: '14px', color: '#666'}}>
                  Recent fire activity may indicate deforestation or agricultural burning
                </p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div style={{textAlign: 'center', padding: '40px'}}>
          <p>Loading Sierra Madre imagery...</p>
          {images.length > 0 && (
            <div>
              <h3>Available images:</h3>
              <ul style={{listStyle: 'none', padding: 0}}>
                {images.map(img => (
                  <li key={img} style={{margin: '10px 0'}}>
                    <img 
                      src={`http://localhost:8000/data/${img}`} 
                      alt={img}
                      style={{maxWidth: '200px', height: 'auto', marginRight: '10px'}}
                    />
                    {img}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      <div style={{
        marginTop: '30px', 
        padding: '20px', 
        backgroundColor: '#f8f9fa', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <button
          onClick={handleFetchNewImages}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#ddd' : '#00b894',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '15px'
          }}
        >
          {loading ? '🛰️ Fetching Latest Imagery...' : '🔄 Fetch Fresh NASA Images'}
        </button>
        
        {lastUpdated && (
          <p style={{color: '#666', fontSize: '14px', margin: '5px 0'}}>
            🕒 Last updated: {lastUpdated}
          </p>
        )}
        
        <h3 style={{color: '#2c5530', margin: '15px 0 10px 0'}}>🌍 Data Sources</h3>
        <p style={{margin: '5px 0', fontSize: '14px', color: '#666'}}>
          NASA Worldview • FIRMS Fire Data • MODIS/Landsat Imagery
        </p>
      </div>
    </div>
  )
}
