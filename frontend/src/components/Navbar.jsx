import React from 'react'
import { Link } from 'react-router-dom'
import { Video, User, LogIn, Search, LogOut } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import apiClient from '../api/apiClient'

const Navbar = () => {
  const { user, logout } = useAuth()

  const handleLogout = async () => {
    try {
      await apiClient.post('/users/logout')
      logout()
    } catch (error) {
      console.error("Logout failed", error)
    }
  }

  return (
    <nav className="glass" style={{
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      marginBottom: '1rem'
    }}>
      <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          padding: '0.5rem',
          borderRadius: '0.8rem',
          display: 'flex'
        }}>
          <Video size={24} color="white" />
        </div>
        <span style={{ fontSize: '1.5rem', fontWeight: '700', letterSpacing: '-0.5px' }}>
          Chai<span style={{ color: 'var(--accent-primary)' }}>Tube</span>
        </span>
      </Link>

      <div className="search-bar glass" style={{
        display: 'flex',
        alignItems: 'center',
        padding: '0.5rem 1.5rem',
        borderRadius: '2rem',
        width: '40%',
        maxWidth: '500px'
      }}>
        <Search size={18} color="var(--text-secondary)" style={{ marginRight: '0.8rem' }} />
        <input 
          type="text" 
          placeholder="Search videos, tweets..." 
          style={{
            background: 'none',
            border: 'none',
            outline: 'none',
            color: 'white',
            width: '100%',
            fontSize: '0.95rem'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
             <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
               <img src={user.avatar} alt="avatar" style={{ width: '35px', height: '35px', borderRadius: '50%', objectFit: 'cover' }} />
               <span style={{ fontWeight: '500' }}>{user.username}</span>
             </Link>
             <Link to="/settings" style={{ color: 'var(--text-secondary)' }}>Settings</Link>
             <button onClick={handleLogout} style={{ background: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
               <LogOut size={18} />
               <span>Logout</span>
             </button>
          </div>
        ) : (
          <>
            <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '500' }}>
              <LogIn size={20} />
              <span>Login</span>
            </Link>
            <Link to="/register" style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '0.8rem',
              background: 'var(--accent-primary)',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.9rem'
            }}>
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar
