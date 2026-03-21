import { useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { ThumbsUp } from 'lucide-react'

const LikedVideos = () => {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLiked = async () => {
      try {
        const res = await api.get('/likes/videos')
        setVideos(res.data.data || [])
      } catch (error) {
        toast.error("Failed to load liked videos")
      } finally {
        setLoading(false)
      }
    }
    fetchLiked()
  }, [])

  if (loading) return <div className="p-8 text-center text-gray-400">Loading liked videos...</div>

  return (
    <div className="p-4 sm:p-8 text-white max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8 border-b border-surface pb-6">
        <ThumbsUp className="w-8 h-8 text-white" />
        <h1 className="text-3xl font-bold">Liked Videos</h1>
      </div>

      <div className="flex flex-col gap-4">
        {videos.length === 0 ? (
          <div className="text-gray-400 py-10">You have no liked videos.</div>
        ) : (
          videos.map(video => (
            <Link to={`/video/${video.videoId}`} key={video.videoId} className="flex flex-col sm:flex-row gap-4 bg-surface p-4 rounded-xl border border-surfaceHover hover:bg-surfaceHover/50 transition-colors group">
              <div className="aspect-video w-full sm:w-64 shrink-0 rounded-lg overflow-hidden relative border border-surfaceHover">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute bottom-2 right-2 bg-black/80 px-1 py-0.5 text-xs font-semibold rounded text-white">
                  {Math.floor(video.duration / 60)}:{Math.floor((video.duration % 60) || 0).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col flex-1 mt-2 sm:mt-0">
                <h3 className="text-lg font-semibold text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>
                <div className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                  <span className="font-medium text-gray-300">{video.owner?.username || "Unknown Channel"}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default LikedVideos
