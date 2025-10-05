/**
 * Controls Panel Component
 * ========================
 * Interactive control panel for data fetching and application settings
 */

import React, { useState } from 'react'
import { getDetailedAnalytics, refreshAllData, exportPDFReport } from '../api'

const ControlsPanel = ({ 
  loading, 
  onFetchNewImages, 
  lastUpdated
}) => {
  const [advancedMode, setAdvancedMode] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')

  const handleGenerateDashboard = async () => {
    setActionLoading(true)
    setStatusMessage('Generating analytics dashboard...')
    
    try {
      const analytics = await getDetailedAnalytics('sierra_madre')
      setStatusMessage('Dashboard data loaded! Check detailed analytics view.')
    } catch (error) {
      setStatusMessage(`Dashboard error: ${error.message}`)
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
    } catch (error) {
      setStatusMessage(`Refresh error: ${error.message}`)
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
      setStatusMessage(`Export error: ${error.message}`)
    } finally {
      setActionLoading(false)
      setTimeout(() => setStatusMessage(''), 5000)
    }
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
        marginBottom: '32px',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <h3 style={{
          color: '#1e293b',
          margin: '0',
          fontSize: '1.75rem',
          fontWeight: '700',
          letterSpacing: '-0.025em'
        }}>
          Data Controls
        </h3>
        
        <button
          onClick={() => setAdvancedMode(!advancedMode)}
          style={{
            padding: '10px 18px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            backgroundColor: advancedMode ? '#1e40af' : 'white',
            color: advancedMode ? 'white' : '#64748b',
            cursor: 'pointer',
            fontSize: '0.875rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          {advancedMode ? 'Basic Mode' : 'Advanced Mode'}
        </button>
      </div>



      {/* Main Controls */}
      <div style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        {/* Fetch Button */}
        <button
          onClick={onFetchNewImages}
          disabled={loading}
          style={{
            backgroundColor: loading ? '#9ca3af' : '#059669',
            color: 'white',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '12px',
            fontSize: '1rem',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: loading ? 'none' : '0 4px 6px -1px rgba(5, 150, 105, 0.4)',
            minWidth: '220px',
            opacity: loading ? 0.7 : 1
          }}
          onMouseOver={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#047857'
              e.target.style.transform = 'translateY(-2px)'
            }
          }}
          onMouseOut={(e) => {
            if (!loading) {
              e.target.style.backgroundColor = '#059669'
              e.target.style.transform = 'translateY(0)'
            }
          }}
        >
          {loading ? 'Fetching Data...' : 'Fetch Fresh NASA Images'}
        </button>

        {/* Auto Refresh Toggle */}
        {advancedMode && (
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            backgroundColor: autoRefresh ? '#e8f5e8' : 'white'
          }}>
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span style={{ fontSize: '14px' }}>🔄 Auto-refresh (hourly)</span>
          </label>
        )}
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

      {/* Advanced Controls */}
      {advancedMode && (
        <div style={{
          borderTop: '1px solid #eee',
          paddingTop: '20px'
        }}>
          <h4 style={{
            color: '#2c5530',
            marginBottom: '15px',
            fontSize: '1.1rem'
          }}>
            ⚙️ Advanced Options
          </h4>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '15px'
          }}>
            <button
              onClick={handleGenerateDashboard}
              disabled={actionLoading}
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: actionLoading ? '#f0f0f0' : 'white',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                textAlign: 'left',
                opacity: actionLoading ? 0.6 : 1
              }}
            >
              📊 Generate Dashboard
            </button>
            
            <button
              onClick={handleRefreshAllData}
              disabled={actionLoading}
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: actionLoading ? '#f0f0f0' : 'white',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                textAlign: 'left',
                opacity: actionLoading ? 0.6 : 1
              }}
            >
              � Refresh All Data
            </button>
            
            <button
              onClick={handleExportReport}
              disabled={actionLoading}
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: actionLoading ? '#f0f0f0' : 'white',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                textAlign: 'left',
                opacity: actionLoading ? 0.6 : 1
              }}
            >
              📋 Export Report
            </button>
            
            <button
              style={{
                padding: '12px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'left'
              }}
            >
              🔧 Settings
            </button>
          </div>
        </div>
      )}

      {/* Status Message */}
      {statusMessage && (
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: statusMessage.includes('error') || statusMessage.includes('Error') ? '#ffebee' : '#e8f5e8',
          border: `1px solid ${statusMessage.includes('error') || statusMessage.includes('Error') ? '#f44336' : '#4caf50'}`,
          borderRadius: '6px',
          color: statusMessage.includes('error') || statusMessage.includes('Error') ? '#d32f2f' : '#2e7d32',
          fontSize: '14px'
        }}>
          {statusMessage}
        </div>
      )}

      {/* Data Sources Footer */}
      <div style={{
        borderTop: '1px solid #eee',
        paddingTop: '20px',
        marginTop: '20px'
      }}>
        <h4 style={{
          color: '#2c5530',
          margin: '0 0 15px 0',
          fontSize: '1.1rem'
        }}>
          🌍 Data Sources & Technology
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '15px',
          fontSize: '14px',
          color: '#666'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🛰️</span>
            <span>NASA Worldview</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🔥</span>
            <span>FIRMS Fire Data</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🌿</span>
            <span>MODIS/Landsat</span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span>🌐</span>
            <span>Earthaccess API</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ControlsPanel