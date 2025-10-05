/**
 * Year Slider Component
 * ====================
 * Interactive year slider for comparing satellite imagery across multiple years (2010-2025)
 * Features smooth transitions, automatic image loading, and comparison capabilities
 */

import React, { useState, useEffect } from 'react'

const YearSlider = ({ 
  availableYears = [], 
  currentYear, 
  onYearChange, 
  loading, 
  onFetchYear,
  onFetchYearRange,
  imageUrlWithCache 
}) => {
  const [selectedYear, setSelectedYear] = useState(currentYear || 2024)
  const [comparisonYear, setComparisonYear] = useState(2010)
  const [showComparison, setShowComparison] = useState(false)
  const [autoPlay, setAutoPlay] = useState(false)
  const [playSpeed, setPlaySpeed] = useState(1000) // milliseconds

  // Auto-play functionality
  useEffect(() => {
    let interval
    if (autoPlay && availableYears.length > 0) {
      interval = setInterval(() => {
        setSelectedYear(prev => {
          const currentIndex = availableYears.indexOf(prev)
          const nextIndex = (currentIndex + 1) % availableYears.length
          return availableYears[nextIndex]
        })
      }, playSpeed)
    }
    return () => clearInterval(interval)
  }, [autoPlay, availableYears, playSpeed])

  // Update parent component when year changes
  useEffect(() => {
    if (onYearChange) {
      onYearChange(selectedYear)
    }
  }, [selectedYear, onYearChange])

  const handleYearChange = (year) => {
    setSelectedYear(year)
    // If the year's image is not available, try to fetch it
    if (!availableYears.includes(year) && onFetchYear) {
      onFetchYear(year)
    }
  }

  const handleFetchRange = async () => {
    if (onFetchYearRange) {
      const startYear = Math.min(...availableYears.length ? availableYears : [2010])
      const endYear = Math.max(...availableYears.length ? availableYears : [2025])
      await onFetchYearRange(startYear, endYear)
    }
  }

  const yearRange = { min: 2010, max: 2025 }
  const totalYears = yearRange.max - yearRange.min + 1

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      border: '1px solid #e2e8f0',
      marginBottom: '32px'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div>
            <h3 style={{
              margin: '0',
              fontSize: '1.5rem',
              fontWeight: '600',
              color: '#1e293b'
            }}>
              Year Comparison Slider
            </h3>
            <p style={{
              margin: '4px 0 0 0',
              color: '#64748b',
              fontSize: '0.875rem'
            }}>
              Navigate through {totalYears} years of satellite imagery (2010-2025)
            </p>
          </div>
        </div>

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              backgroundColor: autoPlay ? '#3b82f6' : 'white',
              color: autoPlay ? 'white' : '#64748b',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
          >
            {autoPlay ? '⏸ Pause' : '▶ Play'}
          </button>
          
          <select
            value={playSpeed}
            onChange={(e) => setPlaySpeed(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontSize: '0.875rem',
              cursor: 'pointer'
            }}
          >
            <option value={500}>Fast (0.5s)</option>
            <option value={1000}>Normal (1s)</option>
            <option value={2000}>Slow (2s)</option>
          </select>

          <button
            onClick={handleFetchRange}
            disabled={loading}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: loading ? '#9ca3af' : '#059669',
              color: 'white',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '0.875rem',
              fontWeight: '500',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Fetching...' : ' Fetch All Years'}
          </button>
        </div>
      </div>

      {/* Year Display */}
      <div style={{
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          fontSize: '3rem',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '8px'
        }}>
          {selectedYear}
        </div>
        <div style={{
          color: '#64748b',
          fontSize: '1rem'
        }}>
          Satellite imagery from {selectedYear}
          {availableYears.includes(selectedYear) ? 
            <span style={{ color: '#059669', marginLeft: '8px' }}> Available</span> :
            <span style={{ color: '#dc2626', marginLeft: '8px' }}> Not downloaded</span>
          }
        </div>
      </div>

      {/* Year Slider */}
      <div style={{ marginBottom: '24px' }}>
        <input
          type="range"
          min={yearRange.min}
          max={yearRange.max}
          value={selectedYear}
          onChange={(e) => handleYearChange(Number(e.target.value))}
          style={{
            width: '100%',
            height: '8px',
            borderRadius: '4px',
            background: `linear-gradient(to right, 
              #3b82f6 0%, 
              #3b82f6 ${((selectedYear - yearRange.min) / (yearRange.max - yearRange.min)) * 100}%, 
              #e2e8f0 ${((selectedYear - yearRange.min) / (yearRange.max - yearRange.min)) * 100}%, 
              #e2e8f0 100%)`,
            outline: 'none',
            cursor: 'pointer'
          }}
        />
        
        {/* Year markers */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '8px',
          fontSize: '0.75rem',
          color: '#64748b'
        }}>
          {[2010, 2012, 2014, 2016, 2018, 2020, 2022, 2024, 2025].map(year => (
            <span 
              key={year}
              style={{
                cursor: 'pointer',
                fontWeight: selectedYear === year ? '600' : '400',
                color: selectedYear === year ? '#3b82f6' : '#64748b'
              }}
              onClick={() => handleYearChange(year)}
            >
              {year}
            </span>
          ))}
        </div>
      </div>

      {/* Comparison Toggle */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        padding: '16px',
        backgroundColor: '#f8fafc',
        borderRadius: '8px',
        marginBottom: '16px'
      }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
          fontSize: '0.875rem',
          color: '#374151'
        }}>
          <input
            type="checkbox"
            checked={showComparison}
            onChange={(e) => setShowComparison(e.target.checked)}
            style={{ cursor: 'pointer' }}
          />
          Enable Year Comparison
        </label>

        {showComparison && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.875rem', color: '#64748b' }}>Compare with:</span>
            <select
              value={comparisonYear}
              onChange={(e) => setComparisonYear(Number(e.target.value))}
              style={{
                padding: '4px 8px',
                borderRadius: '4px',
                border: '1px solid #d1d5db',
                fontSize: '0.875rem'
              }}
            >
              {Array.from({ length: totalYears }, (_, i) => yearRange.min + i)
                .filter(year => year !== selectedYear)
                .map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
            </select>
          </div>
        )}
      </div>

      {/* Data Summary */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '16px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        fontSize: '0.875rem'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '600', color: '#059669' }}>
            {availableYears.length}
          </div>
          <div style={{ color: '#64748b' }}>Images Downloaded</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '600', color: '#3b82f6' }}>
            {totalYears}
          </div>
          <div style={{ color: '#64748b' }}>Total Years Available</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontWeight: '600', color: '#dc2626' }}>
            {totalYears - availableYears.length}
          </div>
          <div style={{ color: '#64748b' }}>Missing Images</div>
        </div>
      </div>

      {/* Image Display */}
      {showComparison ? (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
          marginTop: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#374151', fontSize: '1rem' }}>
              {selectedYear}
            </h4>
            {availableYears.includes(selectedYear) ? (
              <img
                src={imageUrlWithCache(`sierra_madre_${selectedYear}.png`)}
                alt={`Satellite imagery for ${selectedYear}`}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: 'auto',
                  borderRadius: '8px',
                  border: '2px solid #3b82f6'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                maxWidth: '400px',
                height: '300px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: '0.875rem'
              }}>
                Image not available
              </div>
            )}
          </div>
          
          <div style={{ textAlign: 'center' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#374151', fontSize: '1rem' }}>
              {comparisonYear}
            </h4>
            {availableYears.includes(comparisonYear) ? (
              <img
                src={imageUrlWithCache(`sierra_madre_${comparisonYear}.png`)}
                alt={`Satellite imagery for ${comparisonYear}`}
                style={{
                  width: '100%',
                  maxWidth: '400px',
                  height: 'auto',
                  borderRadius: '8px',
                  border: '2px solid #059669'
                }}
              />
            ) : (
              <div style={{
                width: '100%',
                maxWidth: '400px',
                height: '300px',
                backgroundColor: '#f3f4f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#9ca3af',
                fontSize: '0.875rem'
              }}>
                Image not available
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          {availableYears.includes(selectedYear) ? (
            <img
              src={imageUrlWithCache(`sierra_madre_${selectedYear}.png`)}
              alt={`Satellite imagery for ${selectedYear}`}
              style={{
                width: '100%',
                maxWidth: '600px',
                height: 'auto',
                borderRadius: '12px',
                boxShadow: '0 8px 32px -4px rgba(0, 0, 0, 0.1)'
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              maxWidth: '600px',
              height: '400px',
              backgroundColor: '#f3f4f6',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9ca3af',
              margin: '0 auto'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛰️</div>
              <div style={{ fontSize: '1.125rem', fontWeight: '500', marginBottom: '8px' }}>
                Image not available for {selectedYear}
              </div>
              <div style={{ fontSize: '0.875rem', textAlign: 'center' }}>
                Click "Fetch All Years" to download satellite imagery,<br/>
                or select a different year from the slider
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default YearSlider