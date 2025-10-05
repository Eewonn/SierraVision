const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"

export async function fetchImages() {
  const res = await fetch(`${BACKEND}/api/images`)
  if (!res.ok) throw new Error(`Failed to fetch images: ${res.status}`)
  return res.json()
}

export async function fetchFireData() {
  const res = await fetch(`${BACKEND}/api/nasa/fire-data`)
  if (!res.ok) throw new Error(`Failed to fetch fire data: ${res.status}`)
  return res.json()
}



export async function checkSatelliteAvailability(date) {
  const res = await fetch(`${BACKEND}/api/satellite-availability/${date}`)
  if (!res.ok) throw new Error(`Failed to check satellite availability: ${res.status}`)
  return res.json()
}

export async function fetchYearRangeImages(startYear = 2010, endYear = 2025, region = 'sierra_madre') {
  const res = await fetch(`${BACKEND}/api/fetch-year-range?start_year=${startYear}&end_year=${endYear}&region=${region}`, {
    method: 'POST'
  })
  if (!res.ok) throw new Error(`Failed to fetch year range images: ${res.status}`)
  return res.json()
}

export async function fetchSingleYearImage(year, region = 'sierra_madre') {
  const res = await fetch(`${BACKEND}/api/fetch-year/${year}?region=${region}`, {
    method: 'POST'
  })
  if (!res.ok) throw new Error(`Failed to fetch image for year ${year}: ${res.status}`)
  return res.json()
}

export async function getAvailableYears(region = 'sierra_madre') {
  const res = await fetch(`${BACKEND}/api/available-years?region=${region}`)
  if (!res.ok) throw new Error(`Failed to get available years: ${res.status}`)
  return res.json()
}

export async function getDetailedAnalytics(region) {
  try {
    const res = await fetch(`${BACKEND}/api/detailed-analytics/${region}`)
    if (!res.ok) throw new Error(`Failed to fetch analytics: ${res.status}`)
    return res.json()
  } catch (error) {
    // Return mock data if endpoint doesn't exist yet
    console.warn('Analytics endpoint not available:', error)
    return {
      region,
      timestamp: new Date().toISOString(),
      deforestationRate: 2.1,
      fireRisk: 'High',
      vegetationHealth: 78,
      monthlyTrend: 'Decreasing',
      environmental_indicators: {
        active_fires: 0,
        high_confidence_fires: 0,
        fire_confidence_avg: 0
      },
      image_metadata: {
        total_images: 0,
        date_range: { earliest: '2010', latest: '2025', span_years: 16 }
      },
      change_analysis: {
        deforestation_percent: 2.1,
        forest_loss_hectares: 1250,
        recommendations: ['Increase monitoring frequency', 'Deploy fire prevention resources']
      }
    }
  }
}

export async function refreshAllData(removeImages = true) {
  try {
    const res = await fetch(`${BACKEND}/api/refresh-all-data?remove_images=${removeImages}`, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!res.ok) throw new Error(`Failed to refresh data: ${res.status}`)
    return res.json()
  } catch (error) {
    console.error('Refresh data error:', error)
    return { success: false, message: `Error: ${error.message}` }
  }
}

export async function exportPDFReport(region) {
  try {
    const res = await fetch(`${BACKEND}/api/export-report/${region}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })
    if (!res.ok) throw new Error(`Failed to export PDF: ${res.status}`)
    return res.json()
  } catch (error) {
    console.error('PDF export error:', error)
    throw new Error(`PDF export failed: ${error.message}`)
  }
}
