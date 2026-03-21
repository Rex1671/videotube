import React from 'react'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { Edit2, Video, MessageSquare, Users } from 'lucide-react'

const Profile = () => {
  const { user } = useAuth()

  if (!user) return null

  const stats = [
    { label: 'Videos', count: '12', icon: <Video size={20} /> },
    { icon: <Users size={20} />, label: 'Subscribers', count: '1.2K' },
    { icon: <MessageSquare size={20} />, label: 'Tweets', count: '45' }
  ]

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        <div style={{
          height: '250px',
          background: 'linear-gradient(135deg, var(--bg-tertiary), var(--accent-primary))',
          position: 'relative'
        }}>
          <img 
            src={user.coverImage || "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=1200&q=80"} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.4' }}
          />
          <div style={{
            position: 'absolute',
            bottom: '-50px',
            left: '3rem',
            display: 'flex',
            alignItems: 'flex-end',
            gap: '1.5rem'
          }}>
            <img 
              src={user.avatar} 
              style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid var(--bg-primary)', objectFit: 'cover' }}
            />
            <div style={{ marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '2rem', fontWeight: '700' }}>{user.fullname}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>@{user.username}</p>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '4rem', padding: '2rem 3rem' }}>
          <div className="glass" style={{ display: 'flex', gap: '3rem', padding: '2rem', borderRadius: '1.5rem', width: 'fit-content' }}>
            {stats.map(stat => (
              <div key={stat.label} style={{ textAlign: 'center' }}>
                <div style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem', display: 'flex', justifyContent: 'center' }}>{stat.icon}</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '700' }}>{stat.count}</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{stat.label}</div>
              </div>
            ))}
            <button className="glass flex-center" style={{ marginLeft: '1rem', padding: '0.8rem 1.5rem', borderRadius: '1rem', gap: '0.5rem' }}>
              <Edit2 size={16} /> Edit Profile
            </button>
          </div>

          <div style={{ marginTop: '3rem' }}>
            <h3 style={{ marginBottom: '1.5rem' }}>Your Videos</h3>
            <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No videos uploaded yet.</div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Profile
