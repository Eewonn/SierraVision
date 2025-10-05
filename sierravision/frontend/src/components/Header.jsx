/**
 * Header Component for SierraVision
 * =================================
 * Main header component with navigation and branding
 */

import React from 'react'
// Import your logo
import logo from '../assets/sierravision-nobbg.png'

const Header = () => {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #1e3a3a 0%, #2d5a5a 100%)',
      color: 'white',
      padding: '24px 0',
      marginBottom: '32px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      borderBottom: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px'
        }}>
          {/* Logo */}
          <img 
            src={logo} 
            alt="SierraVision Logo" 
            style={{
              height: '60px',
              width: 'auto',
              filter: 'brightness(1.1) contrast(1.1)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'scale(1.05)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'scale(1)'
            }}
          />
          
          {/* Title and Subtitle */}
          <div>
            <h1 style={{
              fontSize: '2.75rem',
              margin: '0',
              fontWeight: '700',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(90deg, #ffffff 0%, #e8f4f8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              SierraVision
            </h1>
            <p style={{
              fontSize: '1.15rem',
              margin: '8px 0 0 0',
              opacity: 0.85,
              fontWeight: '400',
              color: 'rgba(255,255,255,0.9)'
            }}>
              Sierra Madre Forest Monitoring System
            </p>
            <p style={{
              fontSize: '0.875rem',
              margin: '4px 0 0 0',
              opacity: 0.75,
              fontWeight: '300',
              fontStyle: 'italic',
              color: 'rgba(255,255,255,0.8)'
            }}>
              Powered by NASA Satellite Imagery Datasets
            </p>
          </div>
        </div>
        
        <nav style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center'
        }}>
          <a href="#overview" style={{
            color: 'rgba(255,255,255,0.9)',
            textDecoration: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            fontSize: '0.95rem',
            fontWeight: '500',
            border: '1px solid transparent'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'
            e.target.style.borderColor = 'rgba(255,255,255,0.2)'
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent'
            e.target.style.borderColor = 'transparent'
          }}>
            Overview
          </a>
          <a href="#comparison" style={{
            color: 'rgba(255,255,255,0.9)',
            textDecoration: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            fontSize: '0.95rem',
            fontWeight: '500',
            border: '1px solid transparent'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'
            e.target.style.borderColor = 'rgba(255,255,255,0.2)'
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent'
            e.target.style.borderColor = 'transparent'
          }}>
            Comparison
          </a>
          <a href="#data" style={{
            color: 'rgba(255,255,255,0.9)',
            textDecoration: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            transition: 'all 0.3s ease',
            fontSize: '0.95rem',
            fontWeight: '500',
            border: '1px solid transparent'
          }}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'
            e.target.style.borderColor = 'rgba(255,255,255,0.2)'
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = 'transparent'
            e.target.style.borderColor = 'transparent'
          }}>
            Data
          </a>
        </nav>
      </div>
    </header>
  )
}

export default Header