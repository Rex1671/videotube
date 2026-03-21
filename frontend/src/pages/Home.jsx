import { useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import moment from 'moment'
import { Link } from 'react-router-dom'

const Home = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVideos = async () => {
      try {
        const res = await api.get('/videos')
        setVideos(res.data.data || [])
      } catch (error) {
        toast.error("Failed to load videos")
      } finally {
        setLoading(false)
      }
    }
    fetchVideos()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 p-0 sm:p-4 text-white">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="flex flex-col gap-2 animate-pulse">
            <div className="aspect-video bg-surface rounded-none sm:rounded-xl"></div>
            <div className="flex gap-3 pr-6 mt-2 px-3 sm:px-0">
              <div className="w-10 h-10 rounded-full bg-surface shrink-0"></div>
              <div className="flex flex-col gap-2 w-full pt-1">
                <div className="h-4 bg-surface rounded w-3/4"></div>
                <div className="h-3 bg-surface rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (videos.length === 0) {
    return <div className="flex justify-center items-center h-full text-gray-400">No videos found. Be the first to upload!</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 p-0 sm:p-4 text-white">
      {videos.map((video) => (
        <div key={video._id} className="flex flex-col gap-2 cursor-pointer group">
          <Link to={`/video/${video._id}`} className="block">
            <div className="aspect-video bg-surface rounded-none sm:rounded-xl overflow-hidden relative">
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              <span className="absolute bottom-2 right-2 bg-black/80 px-1 py-0.5 text-xs font-semibold rounded text-white">
                {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
              </span>
            </div>
          </Link>
          <div className="flex gap-3 pr-6 px-3 sm:px-0 mt-1">
            <Link to={`/channel/${video.owner?.username}`}>
              <img src={video.owner?.avatar || "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png"} alt="avatar" className="w-10 h-10 rounded-full object-cover shrink-0 border border-surfaceHover hover:border-blue-500 transition-colors" />
            </Link>
            <div className="flex flex-col">
              <Link to={`/video/${video._id}`}>
                <h3 className="text-sm font-semibold text-white line-clamp-2 leading-tight py-0.5 group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>
              </Link>
              <div className="text-[13px] text-gray-400 mt-1 hover:text-white transition-colors">
                <Link to={`/channel/${video.owner?.username}`}>{video.owner?.fullName || video.owner?.username || "Unknown"}</Link>
              </div>
              <p className="text-[13px] text-gray-400">{video.views} views &bull; {moment(video.createdAt).fromNow()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Home
