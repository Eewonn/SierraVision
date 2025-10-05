/**
 * Footer Component
 * ================
 * Application footer with credits, links, and additional information
 */

import React from 'react'

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #1e3a3a 0%, #2d5a5a 100%)',
      color: 'white',
      marginTop: '64px',
      padding: '48px 0 24px 0',
      borderTop: '1px solid rgba(255,255,255,0.1)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 24px'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '40px',
          marginBottom: '32px'
        }}>
          {/* About Section */}
          <div>
            <h4 style={{
              color: '#e8f4f8',
              marginBottom: '16px',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              About SierraVision
            </h4>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#e8f5e8',
              margin: '0'
            }}>
              An advanced forest monitoring system that uses NASA satellite imagery 
              to track deforestation and environmental changes in the Sierra Madre 
              region of the Philippines. Our mission is to provide accessible, 
              real-time data for conservation efforts.
            </p>
          </div>

          {/* Data Sources */}
          <div>
            <h4 style={{
              color: '#e8f4f8',
              marginBottom: '16px',
              fontSize: '1.125rem',
              fontWeight: '600'
            }}>
              Data Sources
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              fontSize: '0.875rem',
              color: 'rgba(255,255,255,0.8)'
            }}>
              <li style={{ marginBottom: '12px' }}>
                <a href="https://worldview.earthdata.nasa.gov/" target="_blank" rel="noopener noreferrer" style={{
                  color: '#a8e6a1',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  display: 'block',
                  padding: '4px 0'
                }}
                onMouseOver={(e) => e.target.style.color = '#c4f0c1'}
                onMouseOut={(e) => e.target.style.color = '#a8e6a1'}>
                  NASA Worldview
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="https://firms.modaps.eosdis.nasa.gov/" target="_blank" rel="noopener noreferrer" style={{
                  color: '#a8e6a1',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  display: 'block',
                  padding: '4px 0'
                }}
                onMouseOver={(e) => e.target.style.color = '#c4f0c1'}
                onMouseOut={(e) => e.target.style.color = '#a8e6a1'}>
                  NASA FIRMS
                </a>
              </li>
              <li style={{ marginBottom: '12px' }}>
                <a href="https://cmr.earthdata.nasa.gov/" target="_blank" rel="noopener noreferrer" style={{
                  color: '#a8e6a1',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  display: 'block',
                  padding: '4px 0'
                }}
                onMouseOver={(e) => e.target.style.color = '#c4f0c1'}
                onMouseOut={(e) => e.target.style.color = '#a8e6a1'}>
                  NASA Earthdata
                </a>
              </li>
              <li style={{ marginBottom: '12px', padding: '4px 0' }}>
                <span>MODIS & Landsat</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              color: '#a8e6a1',
              marginBottom: '15px',
              fontSize: '1.1rem'
            }}>
               Quick Links
            </h4>
            <ul style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              fontSize: '14px',
              color: '#e8f5e8'
            }}>
              <li style={{ marginBottom: '8px' }}>
                <a href="#overview" style={{
                  color: '#a8e6a1',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>

                  <span>Overview Dashboard</span>
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#comparison" style={{
                  color: '#a8e6a1',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>

                  <span>Image Comparison</span>
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="#data" style={{
                  color: '#a8e6a1',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>

                  <span>Fire Data</span>
                </a>
              </li>
              <li style={{ marginBottom: '8px' }}>
                <a href="https://github.com/Eewonn/SierraVision" target="_blank" rel="noopener noreferrer" style={{
                  color: '#a8e6a1',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>

                  <span>GitHub Repository</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Technical Info */}
          <div>
            <h4 style={{
              color: '#a8e6a1',
              marginBottom: '15px',
              fontSize: '1.1rem'
            }}>
               Technical Stack
            </h4>
            <div style={{
              fontSize: '14px',
              color: '#e8f5e8'
            }}>
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>

                <span>React Frontend</span>
              </div>
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>

                <span>Python FastAPI</span>
              </div>
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>

                <span>NASA APIs</span>
              </div>
              <div style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>

                <span>Earthaccess Library</span>
              </div>
            </div>
          </div>
        </div>

        {/* Separator */}
        <div style={{
          borderTop: '1px solid #4a7c59',
          paddingTop: '20px',
          marginBottom: '20px'
        }}>
          {/* Environmental Impact Statement */}
          <div style={{
            backgroundColor: 'rgba(168, 230, 161, 0.1)',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '20px'
          }}>
            <h4 style={{
              color: '#a8e6a1',
              margin: '0 0 10px 0',
              fontSize: '1rem'
            }}>
               Environmental Impact
            </h4>
            <p style={{
              fontSize: '14px',
              lineHeight: '1.5',
              color: '#e8f5e8',
              margin: '0'
            }}>
              This project supports forest conservation efforts by providing accessible 
              satellite monitoring data. Early detection of deforestation helps enable 
              rapid response for environmental protection. Every visualization contributes 
              to greater awareness of our planet's changing forests.
            </p>
          </div>
        </div>

        {/* Bottom Footer */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '14px',
          color: '#a8e6a1',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>
            © 2025 SierraVision Project. Built for environmental conservation.
          </div>
          <div style={{
            display: 'flex',
            gap: '20px',
            alignItems: 'center'
          }}>
            <span> Monitoring Earth's Forests</span>
            <span>•</span>
            <span> Powered by NASA Datasets</span>
            <span>•</span>
            <span> Conservation Through Technology</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{
          marginTop: '15px',
          padding: '10px',
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
          fontSize: '12px',
          color: '#c5e8c1',
          textAlign: 'center'
        }}>
          <strong>Data Disclaimer:</strong> Satellite imagery and fire data are provided by NASA and other 
          government sources. While we strive for accuracy, this information is for monitoring and 
          educational purposes. For critical decisions, please consult official environmental agencies.
        </div>
      </div>
    </footer>
  )
}

export default Footer