const BACKEND = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"

export async function fetchImages() {
  const res = await fetch(`${BACKEND}/api/images`)
  if (!res.ok) throw new Error(`Failed to fetch images: ${res.status}`)
  return res.json()
}
