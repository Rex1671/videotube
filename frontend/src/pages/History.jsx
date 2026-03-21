import { useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { History as HistoryIcon } from 'lucide-react'

const History = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {
      const res = await api.get('/users/history')
      setHistory(res.data.data || [])
    } catch (error) {
      toast.error("Failed to load history")
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading history...</div>

  return (
    <div className="p-4 sm:p-8 text-white max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-4 mb-8">
        <HistoryIcon className="w-8 h-8 text-white" />
        <h1 className="text-3xl font-bold">Watch History</h1>
      </div>

      <div className="flex flex-col gap-4">
        {history.length === 0 ? (
          <div className="text-gray-400 py-10">No watch history found.</div>
        ) : (
          history.map(video => (
            <Link to={`/video/${video._id}`} key={video._id} className="flex flex-col sm:flex-row gap-4 bg-surface p-4 rounded-xl border border-surfaceHover hover:bg-surfaceHover/50 transition-colors group">
              <div className="aspect-video w-full sm:w-64 shrink-0 rounded-lg overflow-hidden relative border border-surfaceHover">
                <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <span className="absolute bottom-2 right-2 bg-black/80 px-1 py-0.5 text-xs font-semibold rounded text-white">
                  {Math.floor(video.duration / 60)}:{Math.floor(video.duration % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="flex flex-col flex-1">
                <h3 className="text-lg font-semibold text-white line-clamp-2 leading-tight group-hover:text-blue-400 transition-colors">
                  {video.title}
                </h3>
                <div className="text-sm text-gray-400 mt-2 flex items-center gap-2">
                  <span className="font-medium text-gray-300">{video.owner?.fullName || video.owner?.username || "Unknown"}</span>
                  <span>&bull;</span>
                  <span>{video.views} views</span>
                </div>
                <p className="text-sm text-gray-400 mt-2 line-clamp-2">{video.description}</p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}

export default History
