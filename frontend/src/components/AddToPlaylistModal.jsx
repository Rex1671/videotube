import React, { useState, useEffect } from 'react'
import { playlistService } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { X, Check } from 'lucide-react'

const AddToPlaylistModal = ({ isOpen, onClose, videoId }) => {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && user) {
      fetchPlaylists()
    }
  }, [isOpen, user])

  const fetchPlaylists = async () => {
    setLoading(true)
    try {
      const res = await playlistService.getUserPlaylists(user._id)
      setPlaylists(res.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleVideo = async (playlist) => {
    const isPresent = playlist.videos.some(v => (v._id || v) === videoId)
    try {
      if (isPresent) {
        await playlistService.removeVideoFromPlaylist(videoId, playlist._id)
      } else {
        await playlistService.addVideoToPlaylist(videoId, playlist._id)
      }
      fetchPlaylists() 
    } catch (error) {
      alert("Failed to update playlist")
    }
  }

  if (!isOpen) return null

  return (
    <div className="flex-center fade-in" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.8)', zIndex: 1000, padding: '2rem'
    }}>
      <div className="glass" style={{ width: '100%', maxWidth: '400px', padding: '2rem', borderRadius: '1.5rem', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', color: 'var(--text-secondary)' }}>
          <X size={24} />
        </button>
        
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>Save to Playlist</h2>

        {loading ? (
          <div>Loading...</div>
        ) : playlists.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>You don't have any playlists yet.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', maxHeight: '300px', overflowY: 'auto' }}>
            {playlists.map(p => {
              const isPresent = p.videos.some(v => (v._id || v) === videoId)
              return (
                <div key={p._id} onClick={() => handleToggleVideo(p)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem',
                  background: 'var(--bg-tertiary)', borderRadius: '0.8rem', cursor: 'pointer',
                  border: isPresent ? '1px solid var(--accent-primary)' : '1px solid transparent'
                }}>
                  <span style={{ fontWeight: '500' }}>{p.name}</span>
                  {isPresent && <Check size={18} color="var(--accent-primary)" />}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

export default AddToPlaylistModal
