import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import VideoCard from '../components/VideoCard'
import { userService, subscriptionService, videoService } from '../api/services'
import { useAuth } from '../context/AuthContext'

const Channel = () => {
  const { username } = useParams()
  const { user } = useAuth()
  const [channel, setChannel] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const res = await userService.getChannelProfile(username)
        setChannel(res.data.data)
        
        // Fetch videos for this channel
        const videoRes = await videoService.getAllVideos({ userId: res.data.data._id })
        setVideos(videoRes.data.data.docs || [])
      } catch (error) {
        console.error("Failed to fetch channel", error)
      } finally {
        setLoading(false)
      }
    }
    fetchChannelData()
  }, [username])

  const toggleSubscribe = async () => {
    if (!user) return alert("Please login first")
    try {
      const res = await subscriptionService.toggleSubscription(channel._id)
      // Optimistic update
      setChannel(prev => ({
        ...prev,
        isSubscribed: !prev.isSubscribed,
        subscribersCount: prev.isSubscribed ? prev.subscribersCount - 1 : prev.subscribersCount + 1
      }))
    } catch (error) {
      alert("Subscription failed")
    }
  }

  if (loading) return <div>Loading...</div>
  if (!channel) return <div>Channel not found</div>

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1 }}>
        {/* Cover Image */}
        <div style={{ height: '250px', background: 'var(--bg-tertiary)', position: 'relative' }}>
          {channel.coverImage && (
            <img src={channel.coverImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          )}
        </div>

        {/* Channel Info */}
        <div style={{ padding: '2rem 3rem', display: 'flex', alignItems: 'center', gap: '2rem', borderBottom: '1px solid var(--border-color)' }}>
          <img src={channel.avatar} style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginTop: '-60px', border: '4px solid var(--bg-primary)' }} />
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: '2rem', fontWeight: '700' }}>{channel.fullname}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>@{channel.username} • {channel.subscribersCount} subscribers • {channel.channelsSubscribedToCount} subscribed</p>
          </div>
          {user?._id !== channel._id && (
            <button 
              onClick={toggleSubscribe}
              style={{
                padding: '0.8rem 2rem', borderRadius: '2rem', fontWeight: '600', fontSize: '1rem',
                background: channel.isSubscribed ? 'var(--bg-tertiary)' : 'white',
                color: channel.isSubscribed ? 'white' : 'black',
                border: channel.isSubscribed ? '1px solid var(--border-color)' : 'none'
              }}
            >
              {channel.isSubscribed ? 'Subscribed' : 'Subscribe'}
            </button>
          )}
        </div>

        {/* Content Tabs */}
        <div style={{ padding: '2rem 3rem' }}>
          <h2 style={{ marginBottom: '1.5rem', borderBottom: '2px solid var(--accent-primary)', display: 'inline-block', paddingBottom: '0.5rem' }}>Videos</h2>
          {videos.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>This channel has no videos yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {videos.map(v => <VideoCard key={v._id} video={v} />)}
            </div>
          )}
        </div>

      </main>
    </div>
  )
}

export default Channel
