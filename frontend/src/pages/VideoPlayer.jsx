import React, { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import AddToPlaylistModal from '../components/AddToPlaylistModal'
import { videoService, commentService, likeService, subscriptionService } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { ThumbsUp, Share2, FolderPlus, MessageSquare, Trash2 } from 'lucide-react'

const VideoPlayer = () => {
  const { videoId } = useParams()
  const { user } = useAuth()
  
  const [video, setVideo] = useState(null)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [isPlaylistModalOpen, setIsPlaylistModalOpen] = useState(false)

  const fetchData = async () => {
    try {
      const [videoRes, commentsRes] = await Promise.all([
        videoService.getVideoById(videoId),
        commentService.getVideoComments(videoId, { limit: 50 })
      ])
      setVideo(videoRes.data.data)
      setComments(commentsRes.data.data.docs || commentsRes.data.data || [])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [videoId])

  const handleToggleLike = async () => {
    if (!user) return alert("Please login first")
    try {
      await likeService.toggleVideoLike(videoId)
      fetchData() // Refresh to get updated like count
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubscribe = async () => {
    if (!user) return alert("Please login first")
    try {
      await subscriptionService.toggleSubscription(video.owner._id)
      fetchData()
    } catch (error) {
      console.error(error)
    }
  }

  const handlePostComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return
    try {
      await commentService.addComment(videoId, { content: newComment })
      setNewComment('')
      fetchData()
    } catch (error) {
      console.error(error)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await commentService.deleteComment(commentId)
      fetchData()
    } catch (error) {
      console.error(error)
    }
  }

  if (loading) return <div>Loading...</div>
  if (!video) return <div>Video not found</div>

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          
          <div className="glass" style={{ width: '100%', aspectRatio: '16/9', borderRadius: '1.5rem', overflow: 'hidden', background: 'black', marginBottom: '1.5rem' }}>
            <video src={video.videoFile} poster={video.thumbnail} controls style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>

          <h1 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '1rem' }}>{video.title}</h1>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Link to={`/c/${video.owner?.username}`}>
                <img src={video.owner?.avatar} style={{ width: '48px', height: '48px', borderRadius: '50%' }} />
              </Link>
              <div>
                <Link to={`/c/${video.owner?.username}`}>
                  <h4 style={{ fontWeight: '600' }}>{video.owner?.fullname}</h4>
                </Link>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>@{video.owner?.username}</p>
              </div>
              {user && user._id !== video.owner?._id && (
                <button onClick={handleSubscribe} style={{
                  marginLeft: '1rem', padding: '0.6rem 1.5rem', borderRadius: '2rem',
                  background: video.isSubscribed ? 'var(--bg-tertiary)' : 'white',
                  color: video.isSubscribed ? 'white' : 'black', fontWeight: '600',
                  border: video.isSubscribed ? '1px solid var(--border-color)' : 'none'
                }}>
                  {video.isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button onClick={handleToggleLike} className="glass" style={{ padding: '0.6rem 1.2rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem', background: video.isLiked ? 'rgba(99, 102, 241, 0.2)' : 'var(--glass-bg)', color: video.isLiked ? 'var(--accent-primary)' : 'white'}}>
                <ThumbsUp size={18} /> {video.likesCount}
              </button>
              <button className="glass" style={{ padding: '0.6rem 1.2rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Share2 size={18} /> Share
              </button>
              <button onClick={() => { if(user) setIsPlaylistModalOpen(true); else alert("Please login to save"); }} className="glass" style={{ padding: '0.6rem 1.2rem', borderRadius: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FolderPlus size={18} /> Save
              </button>
            </div>
          </div>

          <div className="glass" style={{ padding: '1.5rem', borderRadius: '1rem', marginBottom: '2rem' }}>
            <p style={{ fontWeight: '600', marginBottom: '0.5rem' }}>{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{video.description}</p>
          </div>

          {/* Comments Section */}
          <div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <MessageSquare size={20} /> Comments
            </h3>

            {user && (
              <form onSubmit={handlePostComment} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <img src={user.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <input 
                    type="text" value={newComment} onChange={e => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    style={{ width: '100%', background: 'none', border: 'none', borderBottom: '1px solid var(--text-secondary)', color: 'white', padding: '0.5rem 0', outline: 'none' }}
                  />
                  {newComment && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                      <button type="submit" style={{ padding: '0.4rem 1rem', borderRadius: '1rem', background: 'var(--accent-primary)', color: 'white', fontWeight: '500' }}>Comment</button>
                    </div>
                  )}
                </div>
              </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {comments.map(comment => (
                <div key={comment._id} style={{ display: 'flex', gap: '1rem' }}>
                  <img src={comment.owner?.avatar} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>@{comment.owner?.username} <span style={{ color: 'var(--text-secondary)', fontWeight: '400', fontSize: '0.8rem' }}>{new Date(comment.createdAt).toLocaleDateString()}</span></p>
                      {user && user._id === comment.owner?._id && (
                        <button onClick={() => handleDeleteComment(comment._id)} style={{ background: 'none', color: '#ef4444' }}><Trash2 size={16} /></button>
                      )}
                    </div>
                    <p style={{ marginTop: '0.2rem', fontSize: '0.95rem' }}>{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </main>

      <AddToPlaylistModal 
        isOpen={isPlaylistModalOpen} 
        onClose={() => setIsPlaylistModalOpen(false)} 
        videoId={videoId} 
      />
    </div>
  )
}

export default VideoPlayer
