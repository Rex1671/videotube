import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import { useAuth } from '../context/AuthContext'
import { tweetService, likeService } from '../api/services'
import { MessageSquare, ThumbsUp, Trash2 } from 'lucide-react'

const Tweets = () => {
  const { user } = useAuth()
  const [tweets, setTweets] = useState([])
  const [newTweet, setNewTweet] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchTweets = async () => {
    if (!user) return
    try {
      const res = await tweetService.getUserTweets(user._id)
      setTweets(res.data.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTweets()
  }, [user])

  const handlePostTweet = async (e) => {
    e.preventDefault()
    if (!newTweet.trim()) return
    try {
      await tweetService.createTweet({ content: newTweet })
      setNewTweet('')
      fetchTweets()
    } catch (error) {
      alert("Failed to post tweet")
    }
  }

  const handleDeleteTweet = async (id) => {
    if(!window.confirm("Delete tweet?")) return
    try {
      await tweetService.deleteTweet(id)
      fetchTweets()
    } catch (error) {
      alert("Failed to delete")
    }
  }

  const handleLikeTweet = async (id) => {
    try {
      await likeService.toggleTweetLike(id)
      fetchTweets()
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '2rem 3rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <MessageSquare size={32} color="var(--accent-primary)" /> Your Tweets
        </h1>

        <div className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem', marginBottom: '2rem', maxWidth: '800px' }}>
          <form onSubmit={handlePostTweet} style={{ display: 'flex', gap: '1rem' }}>
            <img src={user?.avatar} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} />
            <div style={{ flex: 1 }}>
              <textarea 
                value={newTweet}
                onChange={e => setNewTweet(e.target.value)}
                placeholder="What's happening?"
                style={{
                  width: '100%', padding: '1rem', borderRadius: '1rem',
                  background: 'var(--bg-tertiary)', color: 'var(--text-primary)',
                  border: 'none', minHeight: '100px', resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="submit" style={{
                  padding: '0.6rem 1.5rem', borderRadius: '2rem',
                  background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', color: 'white', fontWeight: '600'
                }}>Post Tweet</button>
              </div>
            </div>
          </form>
        </div>

        {loading ? (
          <div>Loading tweets...</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '800px' }}>
            {tweets.map(tweet => (
              <div key={tweet._id} className="glass" style={{ padding: '1.5rem', borderRadius: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <img src={user?.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontWeight: '600' }}>{user?.fullname}</h4>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>@{user?.username}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteTweet(tweet._id)} style={{ background: 'none', color: '#ef4444' }}><Trash2 size={18} /></button>
                </div>
                <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{tweet.content}</p>
                <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                   <button onClick={() => handleLikeTweet(tweet._id)} style={{ background: 'none', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                     <ThumbsUp size={18} /> Like
                   </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  )
}

export default Tweets
