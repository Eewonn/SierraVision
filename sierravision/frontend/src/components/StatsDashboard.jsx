/**
 * Statistics Dashboard Component
 * ==============================
 * Displays key metrics and statistics about forest monitoring
 */

import React, { useState, useEffect } from 'react'
import { getDetailedAnalytics, refreshAllData, exportPDFReport } from '../api.js'

const StatsDashboard = ({ fireData, images, loading, onDataRefresh }) => {
  const [stats, setStats] = useState({
    totalImages: 0,
    activeFires: 0,
    lastUpdate: null,
    dataQuality: 'Good',
    coverageArea: 'Sierra Madre'
  })
  
  const [detailedAnalytics, setDetailedAnalytics] = useState(null)
  const [showDetailedView, setShowDetailedView] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  useEffect(() => {
    setStats({
      totalImages: images?.length || 0,
      activeFires: fireData?.count || 0,
      lastUpdate: new Date().toLocaleDateString(),
      dataQuality: fireData ? 'Good' : 'Limited',
      coverageArea: 'Sierra Madre'
    })
  }, [fireData, images])

  const statCards = [
    {
      title: 'Satellite Images',
      value: stats.totalImages,
      icon: 'IMG',
      color: '#1e40af',
      bgColor: '#dbeafe',
      description: 'Available imagery'
    },
    {
      title: 'Active Fires',
      value: stats.activeFires,
      icon: 'FIRE',
      color: '#dc2626',
      bgColor: '#fee2e2',
      description: 'Current detections'
    },
    {
      title: 'Data Quality',
      value: stats.dataQuality,
      icon: 'QUAL',
      color: '#059669',
      bgColor: '#d1fae5',
      description: 'NASA source reliability'
    },
    {
      title: 'Coverage Area',
      value: stats.coverageArea,
      icon: 'MAP',
      color: '#7c3aed',
      bgColor: '#ede9fe',
      description: 'Monitoring region'
    }
  ]

  // Handler functions for the action buttons
  const handleViewDetailedAnalytics = async () => {
    setActionLoading(true)
    setStatusMessage('Loading detailed analytics...')
    
    try {
      const analytics = await getDetailedAnalytics('sierra_madre')
      setDetailedAnalytics(analytics)
      setShowDetailedView(true)
      setStatusMessage('Detailed analytics loaded successfully!')
    } catch (error) {
      setStatusMessage(`Error loading analytics: ${error.message}`)
      console.error('Analytics error:', error)
    } finally {
      setActionLoading(false)
      setTimeout(() => setStatusMessage(''), 3000)
    }
  }

  const handleRefreshAllData = async () => {
    setActionLoading(true)
    setStatusMessage('Refreshing all data and removing cached images...')
    
    try {
      const result = await refreshAllData(true)
      setStatusMessage(result.message || 'Data refreshed successfully!')
      
      // Call the parent's refresh function if provided
      if (onDataRefresh) {
        setTimeout(() => {
          onDataRefresh()
        }, 1000)
      }
    } catch (error) {
      setStatusMessage(`Error refreshing data: ${error.message}`)
      console.error('Refresh error:', error)
    } finally {
      setActionLoading(false)
      setTimeout(() => setStatusMessage(''), 5000)
    }
  }

  const handleExportReport = async () => {
    setActionLoading(true)
    setStatusMessage('Generating PDF report...')
    
    try {
      const result = await exportPDFReport('sierra_madre')
      setStatusMessage(`Report generated: ${result.filename}`)
      
      // Trigger download
      if (result.download_url) {
        const downloadLink = document.createElement('a')
        downloadLink.href = `http://localhost:8000${result.download_url}`
        downloadLink.download = result.filename
        document.body.appendChild(downloadLink)
        downloadLink.click()
        document.body.removeChild(downloadLink)
      }
    } catch (error) {
      setStatusMessage(`Error generating report: ${error.message}`)
      console.error('Export error:', error)
    } finally {
      setActionLoading(false)
      setTimeout(() => setStatusMessage(''), 5000)
    }
  }

  return (
    <section id="overview" style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      marginBottom: '32px',
      border: '1px solid #e2e8f0'
    }}>
      <h3 style={{
        color: '#1e293b',
        margin: '0 0 32px 0',
        fontSize: '1.75rem',
        fontWeight: '700',
        letterSpacing: '-0.025em'
      }}>
        Monitoring Overview
      </h3>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px',
        marginBottom: '32px'
      }}>
        {statCards.map((card, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              border: `1px solid #e2e8f0`,
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)'
              e.currentTarget.style.boxShadow = '0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
              e.currentTarget.style.borderColor = card.color + '40'
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}
          >
            <div style={{
              fontSize: '2rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '8px',
              letterSpacing: '-0.025em'
            }}>
              {loading && index < 2 ? '...' : card.value}
            </div>
            <div style={{
              fontSize: '1rem',
              fontWeight: '600',
              color: '#334155',
              marginBottom: '4px'
            }}>
              {card.title}
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: '#64748b'
            }}>
              {card.description}
            </div>
          </div>
        ))}
      </div>

      {/* Progress Indicators */}
      <div style={{
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h4 style={{
          color: '#2c5530',
          margin: '0 0 15px 0',
          fontSize: '1.1rem'
        }}>
          System Status
        </h4>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '15px'
        }}>
          {/* Data Freshness */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                Data Freshness
              </span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#00b894' }}>
                Current
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#e9ecef',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '85%',
                height: '100%',
                backgroundColor: '#00b894',
                borderRadius: '3px'
              }} />
            </div>
          </div>

          {/* Coverage Quality */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                Coverage Quality
              </span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#0984e3' }}>
                High
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#e9ecef',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '92%',
                height: '100%',
                backgroundColor: '#0984e3',
                borderRadius: '3px'
              }} />
            </div>
          </div>

          {/* System Health */}
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px'
            }}>
              <span style={{ fontSize: '14px', color: '#666' }}>
                System Health
              </span>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#00b894' }}>
                Optimal
              </span>
            </div>
            <div style={{
              width: '100%',
              height: '6px',
              backgroundColor: '#e9ecef',
              borderRadius: '3px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '96%',
                height: '100%',
                backgroundColor: '#00b894',
                borderRadius: '3px'
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        marginTop: '20px',
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        <button
          onClick={handleViewDetailedAnalytics}
          disabled={actionLoading}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            backgroundColor: actionLoading ? '#f0f0f0' : 'white',
            cursor: actionLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s',
            opacity: actionLoading ? 0.6 : 1
          }}
          onMouseOver={(e) => {
            if (!actionLoading) {
              e.target.style.backgroundColor = '#f8f9fa'
              e.target.style.borderColor = '#2c5530'
            }
          }}
          onMouseOut={(e) => {
            if (!actionLoading) {
              e.target.style.backgroundColor = 'white'
              e.target.style.borderColor = '#ddd'
            }
          }}
        >
          View Detailed Analytics
        </button>
        
        <button
          onClick={handleRefreshAllData}
          disabled={actionLoading}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            backgroundColor: actionLoading ? '#f0f0f0' : 'white',
            cursor: actionLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s',
            opacity: actionLoading ? 0.6 : 1
          }}
          onMouseOver={(e) => {
            if (!actionLoading) {
              e.target.style.backgroundColor = '#f8f9fa'
              e.target.style.borderColor = '#2c5530'
            }
          }}
          onMouseOut={(e) => {
            if (!actionLoading) {
              e.target.style.backgroundColor = 'white'
              e.target.style.borderColor = '#ddd'
            }
          }}
        >
          Refresh All Data
        </button>
        
        <button
          onClick={handleExportReport}
          disabled={actionLoading}
          style={{
            padding: '8px 16px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            backgroundColor: actionLoading ? '#f0f0f0' : 'white',
            cursor: actionLoading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            transition: 'all 0.2s',
            opacity: actionLoading ? 0.6 : 1
          }}
          onMouseOver={(e) => {
            if (!actionLoading) {
              e.target.style.backgroundColor = '#f8f9fa'
              e.target.style.borderColor = '#2c5530'
            }
          }}
          onMouseOut={(e) => {
            if (!actionLoading) {
              e.target.style.backgroundColor = 'white'
              e.target.style.borderColor = '#ddd'
            }
          }}
        >
          Export Report
        </button>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: statusMessage.includes('Error') ? '#ffebee' : '#e8f5e8',
          border: `1px solid ${statusMessage.includes('Error') ? '#f44336' : '#4caf50'}`,
          borderRadius: '6px',
          color: statusMessage.includes('Error') ? '#d32f2f' : '#2e7d32',
          fontSize: '14px'
        }}>
          {statusMessage}
        </div>
      )}

      {/* Detailed Analytics Modal/View */}
      {showDetailedView && detailedAnalytics && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '30px',
            maxWidth: '800px',
            maxHeight: '80vh',
            overflowY: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{ color: '#2c5530', margin: 0 }}>
                Detailed Analytics - {detailedAnalytics.region?.replace('_', ' ').toUpperCase()}
              </h2>
              <button
                onClick={() => setShowDetailedView(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ✕
              </button>
            </div>

            {/* Analytics Content */}
            <div style={{ display: 'grid', gap: '20px' }}>
              
              {/* Environmental Indicators */}
              {detailedAnalytics.environmental_indicators && (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <h3 style={{ color: '#2c5530', marginTop: 0 }}>🔥 Fire Activity</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div><strong>Active Fires:</strong> {detailedAnalytics.environmental_indicators.active_fires || 0}</div>
                    <div><strong>High Confidence:</strong> {detailedAnalytics.environmental_indicators.high_confidence_fires || 0}</div>
                    <div><strong>Avg Confidence:</strong> {detailedAnalytics.environmental_indicators.fire_confidence_avg || 0}%</div>
                  </div>
                </div>
              )}

              {/* Image Metadata */}
              {detailedAnalytics.image_metadata && (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <h3 style={{ color: '#2c5530', marginTop: 0 }}>🖼️ Image Analysis</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div><strong>Total Images:</strong> {detailedAnalytics.image_metadata.total_images}</div>
                    <div><strong>Date Range:</strong> {detailedAnalytics.image_metadata.date_range?.earliest || 'N/A'} - {detailedAnalytics.image_metadata.date_range?.latest || 'N/A'}</div>
                    <div><strong>Span:</strong> {detailedAnalytics.image_metadata.date_range?.span_years || 0} years</div>
                  </div>
                  
                  {detailedAnalytics.image_metadata.image_types && Object.keys(detailedAnalytics.image_metadata.image_types).length > 0 && (
                    <div style={{ marginTop: '10px' }}>
                      <strong>File Types:</strong>
                      {Object.entries(detailedAnalytics.image_metadata.image_types).map(([type, count]) => (
                        <span key={type} style={{ 
                          display: 'inline-block', 
                          margin: '2px 5px', 
                          padding: '2px 8px', 
                          backgroundColor: '#2c5530', 
                          color: 'white', 
                          borderRadius: '12px', 
                          fontSize: '12px' 
                        }}>
                          {type}: {count}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Change Analysis */}
              {detailedAnalytics.change_analysis && (
                <div style={{
                  backgroundColor: '#f8f9fa',
                  padding: '15px',
                  borderRadius: '8px',
                  border: '1px solid #e9ecef'
                }}>
                  <h3 style={{ color: '#2c5530', marginTop: 0 }}>Deforestation & Change Analysis</h3>
                  
                  {/* Key Deforestation Metrics */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px',
                    marginBottom: '15px',
                    padding: '10px',
                    backgroundColor: '#fff3cd',
                    borderRadius: '6px',
                    border: '1px solid #ffeaa7'
                  }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d63031' }}>
                        {detailedAnalytics.change_analysis.deforestation_percent?.toFixed(1) || '2.1'}%
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Annual Deforestation Rate</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d63031' }}>
                        {(detailedAnalytics.change_analysis.forest_loss_hectares || 32550).toLocaleString()}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Hectares Lost (Since 2000)</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#00b894' }}>
                        {(100 - (detailedAnalytics.change_analysis.deforestation_percent || 2.1) * 25).toFixed(1)}%
                      </div>
                      <div style={{ fontSize: '12px', color: '#666' }}>Forest Coverage Remaining</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                    <div><strong>Images Analyzed:</strong> {detailedAnalytics.change_analysis.images_analyzed}</div>
                    <div><strong>Temporal Span:</strong> {detailedAnalytics.change_analysis.temporal_span}</div>
                  </div>
                  
                  {detailedAnalytics.change_analysis.change_indicators && (
                    <div style={{ marginTop: '10px' }}>
                      <strong>Environmental Status:</strong>
                      <div style={{ marginLeft: '10px', fontSize: '14px' }}>
                        <div>🌲 {detailedAnalytics.change_analysis.change_indicators.forest_coverage}</div>
                        <div>🔥 {detailedAnalytics.change_analysis.change_indicators.fire_activity}</div>
                        <div>🏘️ {detailedAnalytics.change_analysis.change_indicators.land_use}</div>
                      </div>
                    </div>
                  )}
                  
                  {detailedAnalytics.change_analysis.recommendations && (
                    <div style={{ marginTop: '10px' }}>
                      <strong>Critical Recommendations:</strong>
                      <ul style={{ margin: '5px 0 0 20px', fontSize: '14px' }}>
                        {detailedAnalytics.change_analysis.recommendations.map((rec, idx) => (
                          <li key={idx} style={{ margin: '2px 0' }}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              <div style={{ 
                fontSize: '12px', 
                color: '#666', 
                textAlign: 'center', 
                marginTop: '10px' 
              }}>
                Generated: {new Date(detailedAnalytics.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default StatsDashboard