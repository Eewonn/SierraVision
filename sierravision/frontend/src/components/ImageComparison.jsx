/**
 * Image Comparison Component
 * =========================
 * Displays side-by-side satellite imagery comparison with interactive features
 */

import React, { useState } from 'react'

const ImageComparison = ({ image2000, image2025, imageUrlWithCache, loading, onFetchNewImages, lastUpdated }) => {
  const [selectedView, setSelectedView] = useState('side-by-side')
  const [showImageDetails, setShowImageDetails] = useState(false)

  if (!image2000 || !image2025) {
    return (
      <section id="comparison" style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '48px',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e2e8f0',
        marginBottom: '32px'
      }}>
        <div style={{ 
          width: '64px',
          height: '64px',
          borderRadius: '12px',
          backgroundColor: '#f1f5f9',
          color: '#64748b',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: '700',
          margin: '0 auto 24px auto',
          letterSpacing: '0.5px'
        }}>SAT</div>
        <h3 style={{ 
          color: '#334155', 
          marginBottom: '12px',
          fontSize: '1.5rem',
          fontWeight: '600' 
        }}>
          {loading ? 'Loading Satellite Imagery...' : 'No Comparison Images Available'}
        </h3>
        <p style={{ 
          color: '#64748b',
          fontSize: '1rem',
          lineHeight: '1.5',
          marginBottom: '32px'
        }}>
          {loading 
            ? 'Fetching latest satellite data from NASA...' 
            : 'Click "Fetch Fresh NASA Images" to download comparison imagery for the Sierra Madre region'
          }
        </p>
        
        {/* Fetch Fresh Images Button */}
        {!loading && (
          <button
            onClick={onFetchNewImages}
            disabled={loading}
            style={{
              backgroundColor: '#059669',
              color: 'white',
              border: 'none',
              padding: '16px 32px',
              borderRadius: '12px',
              fontSize: '1rem',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 12px -1px rgba(5, 150, 105, 0.4)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#047857'
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 8px 20px -1px rgba(5, 150, 105, 0.5)'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#059669'
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 12px -1px rgba(5, 150, 105, 0.4)'
            }}
          >
             Fetch Fresh NASA Images
          </button>
        )}
        
        {/* Last Updated Info */}
        {lastUpdated && (
          <div style={{
            backgroundColor: '#f8f9fa',
            border: '1px solid #e9ecef',
            borderRadius: '8px',
            padding: '12px',
            marginTop: '24px',
            display: 'inline-block'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '14px',
              color: '#666'
            }}>
              <span>🕒</span>
              <span><strong>Last updated:</strong> {lastUpdated}</span>
            </div>
          </div>
        )}
      </section>
    )
  }

  return (
    <section id="comparison" style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginBottom: '32px',
      border: '1px solid #e2e8f0'
    }}>
      {/* Header with View Controls and Fetch Button */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h2 style={{
          color: '#1e293b',
          margin: '0',
          fontSize: '1.75rem',
          fontWeight: '700',
          letterSpacing: '-0.025em'
        }}>
          Satellite Imagery Comparison
        </h2>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          {/* Fetch Fresh Images Button */}
          <button
            onClick={onFetchNewImages}
            disabled={loading}
            style={{
              backgroundColor: loading ? '#9ca3af' : '#059669',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: loading ? 'none' : '0 2px 4px -1px rgba(5, 150, 105, 0.4)',
              opacity: loading ? 0.7 : 1
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#047857'
                e.target.style.transform = 'translateY(-1px)'
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = '#059669'
                e.target.style.transform = 'translateY(0)'
              }
            }}
          >
            {loading ? 'Fetching...' : '🛰️ Fetch Fresh NASA Images'}
          </button>
          
          {/* View Controls */}
          <div style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
            padding: '4px',
            borderRadius: '12px',
            border: '1px solid #e2e8f0'
          }}>
          <button
            onClick={() => setSelectedView('side-by-side')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: selectedView === 'side-by-side' ? '#1e40af' : 'transparent',
              color: selectedView === 'side-by-side' ? 'white' : '#64748b',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            Side by Side
          </button>
          <button
            onClick={() => setSelectedView('overlay')}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: selectedView === 'overlay' ? '#1e40af' : 'transparent',
              color: selectedView === 'overlay' ? 'white' : '#64748b',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            Overlay
          </button>
          <button
            onClick={() => setShowImageDetails(!showImageDetails)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: 'white',
              color: '#64748b',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            ℹ️ Details
          </button>
          </div>
        </div>
      </div>

      {/* Last Updated Info */}
      {lastUpdated && (
        <div style={{
          backgroundColor: '#f8f9fa',
          border: '1px solid #e9ecef',
          borderRadius: '6px',
          padding: '12px',
          marginBottom: '20px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: '#666'
          }}>
            <span>🕒</span>
            <span><strong>Last updated:</strong> {lastUpdated}</span>
          </div>
        </div>
      )}

      {/* Image Details Panel */}
      {showImageDetails && (
        <div style={{
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          padding: '15px',
          marginBottom: '20px',
          fontSize: '14px',
          color: '#666'
        }}>
          <h4 style={{ margin: '0 0 10px 0', color: '#2c5530' }}>Image Information</h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div>
              <strong>Baseline Image (2000):</strong><br />
              Source: NASA MODIS/Landsat<br />
              Resolution: High-resolution composite<br />
              Coverage: Sierra Madre region
            </div>
            <div>
              <strong>Recent Image (2025):</strong><br />
              Source: NASA MODIS/Landsat<br />
              Resolution: High-resolution composite<br />
              Processing: Latest available data
            </div>
          </div>
        </div>
      )}

      {/* Image Display */}
      {selectedView === 'side-by-side' ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px'
        }}>
          {/* Historical Image (2000) */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              backgroundColor: '#e8f5e8',
              borderRadius: '8px 8px 0 0',
              padding: '10px',
              marginBottom: '0'
            }}>
              <h3 style={{
                color: '#2c5530',
                margin: '0',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                 Year 2000 - Baseline
              </h3>
            </div>
            <div style={{ position: 'relative' }}>
              <img
                src={imageUrlWithCache(image2000)}
                alt="Sierra Madre forest coverage in 2000"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '0 0 8px 8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: 'rgba(44, 85, 48, 0.8)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Baseline
              </div>
            </div>
            <p style={{
              color: '#666',
              marginTop: '10px',
              fontStyle: 'italic',
              fontSize: '14px'
            }}>
              Original forest coverage and vegetation density
            </p>
          </div>

          {/* Recent Image (2025) */}
          <div style={{ textAlign: 'center' }}>
            <div style={{
              backgroundColor: '#ffe8e8',
              borderRadius: '8px 8px 0 0',
              padding: '10px',
              marginBottom: '0'
            }}>
              <h3 style={{
                color: '#d63031',
                margin: '0',
                fontSize: '1.3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                 Year 2025 - Current
              </h3>
            </div>
            <div style={{ position: 'relative' }}>
              <img
                src={imageUrlWithCache(image2025)}
                alt="Sierra Madre forest coverage in 2025"
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '0 0 8px 8px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                  transition: 'transform 0.2s ease'
                }}
                onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
                onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                backgroundColor: 'rgba(214, 48, 49, 0.8)',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                Current
              </div>
            </div>
            <p style={{
              color: '#666',
              marginTop: '10px',
              fontStyle: 'italic',
              fontSize: '14px'
            }}>
              Current forest coverage showing changes over time
            </p>
          </div>
        </div>
      ) : (
        /* Overlay View */
        <div style={{ textAlign: 'center' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <img
              src={imageUrlWithCache(image2000)}
              alt="Baseline forest coverage"
              style={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                borderRadius: '8px',
                opacity: 0.7
              }}
            />
            <img
              src={imageUrlWithCache(image2025)}
              alt="Current forest coverage"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                borderRadius: '8px',
                opacity: 0.7,
                mixBlendMode: 'multiply'
              }}
            />
          </div>
          <p style={{
            color: '#666',
            marginTop: '15px',
            fontStyle: 'italic'
          }}>
            Overlay comparison showing forest changes (experimental view)
          </p>
        </div>
      )}

      {/* Analysis Summary */}
      <div style={{
        marginTop: '25px',
        padding: '20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        borderLeft: '4px solid #2c5530'
      }}>
        <h4 style={{
          margin: '0 0 10px 0',
          color: '#2c5530',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
           Change Analysis
        </h4>
        <p style={{
          margin: '0',
          color: '#666',
          fontSize: '14px'
        }}>
          Visual comparison shows forest coverage changes in the Sierra Madre region over a 25-year period. 
          Changes may indicate deforestation, reforestation, or natural forest dynamics. 
          Darker areas typically represent denser vegetation, while lighter areas may show cleared land or reduced forest cover.
        </p>
      </div>
    </section>
  )
}

export default ImageComparison