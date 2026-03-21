import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { playlistService } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { ListVideo, Trash2, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'

const Playlists = () => {
  const { user } = useAuth()
  const [playlists, setPlaylists] = useState([])
  const [loading, setLoading] = useState(true)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [newPlaylistDesc, setNewPlaylistDesc] = useState('')

  const fetchPlaylists = async () => {
    if (!user) return
    try {
      const res = await playlistService.getUserPlaylists(user._id)
      setPlaylists(res.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlaylists()
  }, [user])

  const handleCreate = async (e) => {
    e.preventDefault()
    if (!newPlaylistName) return
    try {
      await playlistService.createPlaylist({ name: newPlaylistName, description: newPlaylistDesc })
      setNewPlaylistName('')
      setNewPlaylistDesc('')
      fetchPlaylists()
    } catch (error) {
      alert("Failed to create playlist")
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Delete playlist?")) return
    try {
      await playlistService.deletePlaylist(id)
      fetchPlaylists()
    } catch (error) {
      alert("Failed to delete")
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem 3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <ListVideo size={32} color="var(--accent-primary)" /> Your Playlists
        </h1>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem', marginBottom: '3rem', maxWidth: '600px' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={20} /> Create New Playlist</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input type="text" placeholder="Playlist Name" value={newPlaylistName} onChange={e => setNewPlaylistName(e.target.value)} required style={{ padding: '0.8rem', borderRadius: '0.8rem', background: 'var(--bg-tertiary)', color: 'white', border: 'none' }} />
            <input type="text" placeholder="Description (Optional)" value={newPlaylistDesc} onChange={e => setNewPlaylistDesc(e.target.value)} style={{ padding: '0.8rem', borderRadius: '0.8rem', background: 'var(--bg-tertiary)', color: 'white', border: 'none' }} />
            <button type="submit" style={{ padding: '0.8rem', borderRadius: '0.8rem', background: 'var(--accent-primary)', color: 'white', fontWeight: '600', alignSelf: 'flex-start' }}>Create</button>
          </form>
        </div>

        {loading ? <div>Loading...</div> : playlists.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No playlists found.</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
            {playlists.map(p => (
              <div key={p._id} className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem', position: 'relative', display: 'flex', flexDirection: 'column', height: '200px' }}>
                 <button onClick={() => handleDelete(p._id)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', color: '#ef4444' }}><Trash2 size={18} /></button>
                 <ListVideo size={40} color="var(--accent-secondary)" style={{ marginBottom: '1rem' }} />
                 <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '0.5rem' }}>{p.name}</h3>
                 <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem', flex: 1 }}>{p.description || "No description"}</p>
                 <Link to={`/playlist/${p._id}`} style={{ color: 'var(--accent-primary)', fontWeight: '600', fontSize: '0.95rem' }}>View Full Playlist →</Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

export default Playlists
