import React from 'react'
import { Link } from 'react-router-dom'
import { MoreVertical, Clock } from 'lucide-react'

const VideoCard = ({ video }) => {
  return (
    <Link to={`/video/${video.id}`} className="glass fade-in" style={{
      borderRadius: '1.2rem',
      overflow: 'hidden',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      cursor: 'pointer',
      height: 'fit-content'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ position: 'relative' }}>
        <img 
          src={video.thumbnail || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80"} 
          alt={video.title} 
          style={{ width: '100%', aspectRatio: '16/9', objectFit: 'cover' }}
        />
        <span style={{
          position: 'absolute',
          bottom: '10px',
          right: '10px',
          background: 'rgba(0,0,0,0.8)',
          padding: '2px 8px',
          borderRadius: '4px',
          fontSize: '0.8rem',
          fontWeight: '500'
        }}>
          {video.duration || "10:00"}
        </span>
      </div>

      <div style={{ padding: '1.2rem', display: 'flex', gap: '0.8rem' }}>
        <img 
          src={video.ownerDetails?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80"} 
          alt="avatar" 
          style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
        />
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', lineHeight: '1.4', color: 'var(--text-primary)' }}>{video.title}</h3>
            <MoreVertical size={18} color="var(--text-secondary)" />
          </div>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.2rem' }}>{video.ownerDetails?.username || "Chai User"}</p>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span>{video.views} views</span>
            <span style={{ fontSize: '4px' }}>●</span>
            <span>2 days ago</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default VideoCard
