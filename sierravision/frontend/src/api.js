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

export async function fetchComparisonImages() {
  const res = await fetch(`${BACKEND}/api/nasa/fetch-comparison`, { method: 'POST' })
  if (!res.ok) throw new Error(`Failed to fetch comparison images: ${res.status}`)
  return res.json()
}

export async function getSatelliteUrl(date) {
  const res = await fetch(`${BACKEND}/api/nasa/satellite-urls?date=${date}`)
  if (!res.ok) throw new Error(`Failed to get satellite URL: ${res.status}`)
  return res.json()
}
