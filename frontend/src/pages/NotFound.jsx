import React from 'react'
import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex-center" style={{ minHeight: '80vh', flexDirection: 'column', gap: '1.5rem' }}>
      <h1 style={{ fontSize: '6rem', fontWeight: '800', color: 'var(--accent-primary)' }}>404</h1>
      <h2 style={{ fontSize: '2rem' }}>Page Not Found</h2>
      <p style={{ color: 'var(--text-secondary)' }}>The page you are looking for doesn't exist or has been moved.</p>
      <Link to="/" style={{
        padding: '0.8rem 2rem',
        borderRadius: '1rem',
        background: 'var(--accent-primary)',
        color: 'white',
        fontWeight: '600'
      }}>Back to Home</Link>
    </div>
  )
}

export default NotFound
