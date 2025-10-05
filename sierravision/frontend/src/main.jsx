/**
 * SierraVision Frontend Entry Point
 * =================================
 * Main entry point for the React application.
 * Initializes the React root and renders the main App component.
 */

import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

// Get the root container element from the HTML
const container = document.getElementById('root')

if (!container) {
  throw new Error('Root container not found. Make sure index.html has a div with id="root"')
}

// Create React root and render the main application
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
