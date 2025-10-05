/**
 * Fire Data Display Component
 * ===========================
 * Interactive component for displaying NASA FIRMS fire data with      }}>        <div style={{
          backgroundColor: 'white',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '5px'
          }}>
            {fireData.count || 0}
          </div>lities
 */

import React, { useState } from 'react'

const FireDataDisplay = ({ fireData, loading }) => {
  const [showFireDetails, setShowFireDetails] = useState(false)
  const [selectedTimeRange, setSelectedTimeRange] = useState('24h')

  if (!fireData) {
    return (
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        textAlign: 'center',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ 
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          backgroundColor: '#fef2f2',
          color: '#dc2626',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: '700',
          margin: '0 auto 16px auto',
          letterSpacing: '0.5px'
        }}>FIRE</div>
        <p style={{ 
          color: '#64748b',
          fontSize: '1rem' 
        }}>
          {loading ? 'Loading fire data...' : 'No fire data available'}
        </p>
      </div>
    )
  }

  return (
    <section style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginBottom: '32px',
      border: '1px solid #e2e8f0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h3 style={{
          color: '#000',
          margin: '0',
          fontSize: '1.75rem',
          fontWeight: '700',
          letterSpacing: '-0.025em'
        }}>
          Active Fire Detection
        </h3>
        
        <div style={{
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '0.875rem',
              backgroundColor: 'white',
              color: '#374151',
              cursor: 'pointer'
            }}
          >
            <option value="24h">Last 24 hours</option>
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
          </select>
          
          <button
            onClick={() => setShowFireDetails(!showFireDetails)}
            style={{
              padding: '10px 18px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              color: '#64748b',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#f8fafc'
              e.target.style.borderColor = '#cbd5e1'
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = 'white'
              e.target.style.borderColor = '#e2e8f0'
            }}
          >
            {showFireDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>

      {/* Fire Statistics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          backgroundColor: 'white',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '5px'
          }}>
            {fireData.count || 0}
          </div>
          <div style={{
            fontSize: '14px',
            color: '#000'
          }}>
            Active Fires Detected
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '5px'
          }}>
            Sierra Madre
          </div>
          <div style={{
            fontSize: '14px',
            color: '#000'
          }}>
            Primary Focus Region
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          border: '2px solid #e0e0e0',
          borderRadius: '8px',
          padding: '15px',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: '#000',
            marginBottom: '5px'
          }}>
            NASA FIRMS
          </div>
          <div style={{
            fontSize: '14px',
            color: '#000'
          }}>
            Data Source
          </div>
        </div>
      </div>

      {/* Fire Analysis */}
      <div style={{
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          marginBottom: '15px'
        }}>
          <span style={{
            backgroundColor: '#000',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '20px',
            fontWeight: 'bold',
            fontSize: '1.1rem'
          }}>
            {fireData.count}
          </span>
          <span style={{ fontSize: '16px', color: '#000' }}>
            active fires detected in Sierra Madre region
          </span>
        </div>

        {fireData.fires && fireData.fires.length > 0 && (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '6px',
            padding: '15px',
            marginTop: '15px'
          }}>
            <h4 style={{
              margin: '0 0 10px 0',
              color: '#000',
              fontSize: '1.1rem'
            }}>
              Fire Activity Analysis
            </h4>
            <p style={{
              fontSize: '14px',
              color: '#000',
              margin: '0 0 10px 0'
            }}>
              Recent fire activity detected in the monitoring area. This may indicate:
            </p>
            <ul style={{
              fontSize: '14px',
              color: '#000',
              margin: '0',
              paddingLeft: '20px'
            }}>
              <li>Agricultural burning practices</li>
              <li>Land clearing for development</li>
              <li>Natural forest fires</li>
              <li>Lightning-induced fires</li>
            </ul>
          </div>
        )}

        {fireData.count === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '20px',
            color: '#000'
          }}>
            <p style={{ margin: '0', fontSize: '16px' }}>
              <strong>No active fires detected in the Sierra Madre region</strong>
            </p>
            <p style={{ margin: '5px 0 0 0', fontSize: '14px', opacity: 0.8 }}>
              This is good news for forest conservation!
            </p>
          </div>
        )}
      </div>

      {/* Detailed Fire Information */}
      {showFireDetails && fireData.fires && fireData.fires.length > 0 && (
        <div style={{
          marginTop: '20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '20px'
        }}>
          <h4 style={{
            margin: '0 0 15px 0',
            color: '#000'
          }}>
            Detailed Fire Locations
          </h4>
          <div style={{
            maxHeight: '200px',
            overflowY: 'auto',
            fontSize: '14px'
          }}>
            {fireData.fires.slice(0, 10).map((fire, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '10px',
                marginBottom: '8px',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '10px'
              }}>
                <div>
                  <strong>Location:</strong><br />
                  Lat: {fire.latitude?.toFixed(4) || 'N/A'}<br />
                  Lon: {fire.longitude?.toFixed(4) || 'N/A'}
                </div>
                <div>
                  <strong>Confidence:</strong><br />
                  {fire.confidence || 'N/A'}%
                </div>
                <div>
                  <strong>Brightness:</strong><br />
                  {fire.brightness || 'N/A'}K
                </div>
              </div>
            ))}
            {fireData.fires.length > 10 && (
              <p style={{
                textAlign: 'center',
                color: '#000',
                fontStyle: 'italic',
                margin: '10px 0 0 0'
              }}>
                Showing first 10 of {fireData.fires.length} detected fires
              </p>
            )}
          </div>
        </div>
      )}

      {/* Warning Information */}
      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: 'white',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        fontSize: '14px',
        color: '#000'
      }}>
        <strong>About Fire Data:</strong> Fire detection data is provided by NASA's Fire Information 
        for Resource Management System (FIRMS) using VIIRS satellite observations. Data is updated daily 
        and may include both natural fires and controlled burns. High confidence readings indicate more 
        reliable fire detection.
      </div>
    </section>
  )
}

export default FireDataDisplay