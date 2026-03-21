import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import VideoCard from '../components/VideoCard'
import { playlistService } from '../api/services'
import { ListVideo } from 'lucide-react'

const PlaylistDetail = () => {
  const { playlistId } = useParams()
  const [playlist, setPlaylist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await playlistService.getPlaylistById(playlistId)
        setPlaylist(res.data.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchPlaylist()
  }, [playlistId])

  if (loading) return <div>Loading...</div>
  if (!playlist) return <div>Playlist not found.</div>

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem 3rem' }}>
        <header style={{ marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ListVideo size={36} color="var(--accent-primary)" /> {playlist.name}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{playlist.description}</p>
          <p style={{ marginTop: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Created on {new Date(playlist.createdAt).toLocaleDateString()}</p>
        </header>

        <div>
          <h2 style={{ marginBottom: '2rem' }}>Videos ({playlist.videos?.length || 0})</h2>
          {playlist.videos?.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No videos in this playlist.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {playlist.videos.map(v => <VideoCard key={v._id} video={v} />)}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default PlaylistDetail
