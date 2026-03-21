import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import moment from 'moment'
import { useAuth } from '../context/AuthContext'
import { MessageSquare, ThumbsUp, Folder } from 'lucide-react'

const ChannelProfile = () => {
  const { username } = useParams()
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [activeTab, setActiveTab] = useState('Videos')
  
  const [videos, setVideos] = useState([])
  const [playlists, setPlaylists] = useState([])
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(true)

  const [newTweet, setNewTweet] = useState("")
  const [postingTweet, setPostingTweet] = useState(false)

  useEffect(() => {
    fetchChannel()
  }, [username])

  const fetchChannel = async () => {
    try {
      const res = await api.get(`/users/c/${username}`)
      const profileData = res.data.data
      setProfile(profileData)
      
      try {
        const vidRes = await api.get(`/videos?userId=${profileData._id}`)
        setVideos(vidRes.data.data || [])
      } catch (e) {
        console.error("Videos error", e)
      }

      try {
        const plRes = await api.get(`/playlists/user/${profileData._id}`)
        setPlaylists(plRes.data.data || [])
      } catch (e) {
        console.error("Playlists error", e)
      }

      try {
        const twRes = await api.get(`/tweets/user/${profileData._id}`)
        setTweets(twRes.data.data || [])
      } catch(e) {
        console.error("Tweets error", e)
      }

    } catch (error) {
      toast.error("Channel not found")
    } finally {
      setLoading(false)
    }
  }

  const handleSubscribe = async () => {
    if (!profile) return;
    try {
      await api.post(`/subscriptions/c/${profile._id}`);
      toast.success("Subscription toggled");
      fetchChannel();
    } catch {
      toast.error("Failed to update subscription");
    }
  }

  const handlePostTweet = async (e) => {
    e.preventDefault()
    if(!newTweet.trim()) return
    setPostingTweet(true)
    try {
      await api.post('/tweets', { content: newTweet })
      setNewTweet("")
      toast.success("Tweet posted")
      const twRes = await api.get(`/tweets/user/${profile._id}`)
      setTweets(twRes.data.data || [])
    } catch(err) {
      toast.error("Failed to post tweet")
    } finally {
      setPostingTweet(false)
    }
  }

  const handleLikeTweet = async (tweetId) => {
    try {
      await api.post(`/likes/toggle/t/${tweetId}`)
      toast.success("Tweet like toggled")
    } catch {
      toast.error("Error liking tweet")
    }
  }

  if (loading) return <div className="p-4 text-center text-gray-400">Loading...</div>
  if (!profile) return <div className="p-4 text-center text-gray-400">Channel not found</div>

  const isOwner = user?.username === profile?.username;

  return (
    <div className="flex flex-col w-full text-white pb-10">
      <div className="w-full h-40 sm:h-64 bg-surface relative">
        {profile.coverImage ? (
          <img src={profile.coverImage} alt="Cover" className="w-full h-full object-cover" />
        ) : <div className="w-full h-full bg-surfaceHover"></div>}
      </div>

      <div className="max-w-[1200px] mx-auto w-full px-4 sm:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img src={profile.avatar} alt="Avatar" className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-background bg-surface" />
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold">{profile.fullName}</h1>
            <div className="text-gray-400 mt-2 flex flex-wrap justify-center sm:justify-start gap-2 text-sm">
              <span className="font-medium text-gray-300">@{profile.username}</span>
              <span>&bull;</span>
              <span>{profile.subscribersCount} subscribers</span>
              <span>&bull;</span>
              <span>{profile.channelsSubscribedToCount} subscribed</span>
            </div>
            <div className="mt-4 flex justify-center sm:justify-start gap-3">
              {!isOwner ? (
                <button onClick={handleSubscribe} className={`px-6 py-2 rounded-full font-semibold transition-colors shadow-md ${profile.isSubscribed ? 'bg-surface hover:bg-surfaceHover text-white' : 'bg-white text-black hover:bg-gray-200'}`}>
                  {profile.isSubscribed ? 'Subscribed' : 'Subscribe'}
                </button>
              ) : (
                <Link to="/studio" className="px-6 py-2 bg-surface hover:bg-surfaceHover text-white rounded-full font-semibold transition-colors shadow-md">
                   Manage videos
                </Link>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-8 border-b border-surface mt-8 pb-3 px-2">
          {['Videos', 'Playlists', 'Community'].map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`font-semibold pb-3 -mb-[14px] ${activeTab === tab ? 'text-white border-b-2 border-white' : 'text-gray-400 hover:text-white'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {activeTab === 'Videos' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {videos.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-10">No videos uploaded yet</div>
              ) : (
                videos.map(video => (
                  <Link to={`/video/${video._id}`} key={video._id} className="flex flex-col gap-2 cursor-pointer group">
                    <div className="aspect-video bg-surface rounded-xl overflow-hidden relative border border-surface">
                      <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      <span className="absolute bottom-2 right-2 bg-black/80 px-1 py-0.5 text-xs font-semibold rounded text-white z-10">
                        {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <div className="flex flex-col pr-6">
                      <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight py-0.5 group-hover:text-blue-400 transition-colors">
                        {video.title}
                      </h3>
                      <p className="text-[13px] text-gray-400 mt-1">{video.views} views &bull; {moment(video.createdAt).fromNow()}</p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}

          {activeTab === 'Playlists' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {playlists.length === 0 ? (
                <div className="col-span-full text-center text-gray-400 py-10">No playlists created yet</div>
              ) : (
                playlists.map(pl => (
                  <div key={pl._id} className="flex flex-col gap-2 cursor-pointer group">
                    <div className="aspect-video bg-surface rounded-xl overflow-hidden relative border border-surface flex items-center justify-center">
                      <Folder className="w-12 h-12 text-gray-500 group-hover:scale-110 transition-transform duration-300" />
                      <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-black/80 flex flex-col items-center justify-center">
                        <span className="text-lg font-bold">{pl.videos?.length || 0}</span>
                        <span className="text-xs text-gray-400 uppercase font-semibold">Videos</span>
                      </div>
                    </div>
                    <div className="flex flex-col pr-6 mt-1">
                      <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight">{pl.name}</h3>
                      <p className="text-[13px] text-gray-400 mt-1">Updated {moment(pl.updatedAt).fromNow()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'Community' && (
            <div className="flex flex-col gap-6 max-w-3xl">
              {isOwner && (
                <form onSubmit={handlePostTweet} className="bg-surface p-4 rounded-xl border border-surfaceHover">
                  <textarea 
                    value={newTweet} 
                    onChange={e=>setNewTweet(e.target.value)}
                    placeholder="What's on your mind?"
                    className="w-full bg-transparent border-b border-surfaceHover focus:border-white focus:outline-none py-2 resize-none text-sm placeholder-gray-400 mb-2"
                    rows="3"
                  ></textarea>
                  <div className="flex justify-end">
                    <button type="submit" disabled={postingTweet || !newTweet.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 px-4 py-2 rounded-full font-medium text-sm transition-colors shadow-md">Post text</button>
                  </div>
                </form>
              )}

              {tweets.length === 0 ? (
                <div className="text-gray-400 text-center py-10">No posts yet</div>
              ) : (
                tweets.map(tweet => (
                  <div key={tweet._id} className="bg-surface p-4 rounded-xl border border-surfaceHover shadow-sm">
                    <div className="flex gap-4">
                      <img src={profile.avatar} alt="Avatar" className="w-10 h-10 rounded-full object-cover shrink-0" />
                      <div className="flex-1 flex flex-col pt-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-[14px]">{profile.fullName}</span>
                          <span className="text-xs text-gray-400">{moment(tweet.createdAt).fromNow()}</span>
                        </div>
                        <p className="text-sm text-gray-200 mt-2 mb-4 whitespace-pre-wrap">{tweet.content}</p>
                        <div className="flex gap-4 items-center">
                          <button onClick={() => handleLikeTweet(tweet._id)} className="flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors">
                            <ThumbsUp className="w-4 h-4" />
                            <span className="text-xs font-medium">Like</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChannelProfile
