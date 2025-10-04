import React, { useEffect, useState } from 'react'
import { fetchImages } from './api'

export default function App() {
  const [images, setImages] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchImages()
      .then(data => setImages(data.images || []))
      .catch(err => setError(err.message))
  }, [])

  const first = images.length > 0 ? images[0] : null

  return (
    <div style={{fontFamily: 'sans-serif', padding: 20}}>
      <h1>SierraVision — Deforestation Viewer</h1>
      <p>Showing Sierra Madre imagery (2000 — 2025)</p>
      {error && <div style={{color: 'red'}}>Error: {error}</div>}

      {first ? (
        <div>
          <h2>First image: {first}</h2>
          <img src={`http://localhost:8000/data/${first}`} alt={first} style={{maxWidth: '100%', height: 'auto'}} />
        </div>
      ) : (
        <div>No images available yet. Add PNGs to the backend data folder.</div>
      )}

      {images.length > 1 && (
        <div style={{marginTop: 20}}>
          <h3>Other images</h3>
          <ul>
            {images.map(img => (
              <li key={img}>{img}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
