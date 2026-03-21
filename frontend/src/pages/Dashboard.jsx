import { useState, useEffect } from 'react'
import api from '../api/axios'
import toast from 'react-hot-toast'
import moment from 'moment'
import { Eye, Users, ThumbsUp, Video, Edit, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import UploadVideoModal from '../components/UploadVideoModal'

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null)
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    } else {
      setLoading(false);
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      const statsRes = await api.get('/dashboard/stats')
      setStats(statsRes.data.data)
      const videosRes = await api.get('/dashboard/videos')
      setVideos(videosRes.data.data?.videos || [])
    } catch (error) {
      toast.error("Failed to load dashboard data")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (videoId) => {
    if(!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      await api.delete(`/videos/${videoId}`);
      toast.success("Video deleted");
      fetchDashboardData();
    } catch(err) {
      toast.error("Failed to delete video");
    }
  }

  const handleTogglePublish = async (videoId) => {
    try {
      await api.patch(`/videos/toggle/publish/${videoId}`);
      toast.success("Publish status updated");
      fetchDashboardData();
    } catch(err) {
      toast.error("Failed to update status");
    }
  }

  if (!user && !loading) {
    return <Navigate to="/login" />
  }

  if (loading) return <div className="p-8 text-center text-gray-400">Loading your studio...</div>

  return (
    <div className="p-4 sm:p-8 text-white max-w-7xl mx-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Channel dashboard</h1>
          <p className="text-gray-400 mt-1">Welcome back, {user?.fullName}</p>
        </div>
        <button 
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 font-semibold px-4 py-2 flex items-center gap-2 rounded-full transition-colors shadow-lg"
        >
          <Video className="w-5 h-5" />
          <span>Upload Video</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { icon: Eye, label: "Total Views", value: stats?.totalViews || 0, color: "text-blue-400" },
          { icon: Users, label: "Total Subscribers", value: stats?.totalSubcribers || 0, color: "text-green-400" },
          { icon: ThumbsUp, label: "Total Likes", value: stats?.totalLikes || 0, color: "text-red-400" },
          { icon: Video, label: "Total Videos", value: stats?.totalVideos || 0, color: "text-purple-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-surface p-6 rounded-xl border border-surfaceHover shadow-md hover:border-blue-500/30 transition-colors">
            <stat.icon className={`w-8 h-8 ${stat.color} mb-4`} />
            <h3 className="text-gray-400 font-medium text-sm">{stat.label}</h3>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-xl border border-surfaceHover shadow-md overflow-hidden">
        <div className="p-6 border-b border-surfaceHover flex justify-between items-center bg-surface">
          <h2 className="text-lg font-bold">Your Videos</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-gray-400 border-b border-surfaceHover text-sm">
              <tr>
                <th className="p-4 font-medium">Video</th>
                <th className="p-4 font-medium">Visibility</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Views</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-400">No videos uploaded yet</td>
                </tr>
              ) : (
                videos.map(video => (
                  <tr key={video._id} className="border-b border-surfaceHover hover:bg-surfaceHover/50 transition-colors">
                    <td className="p-4 flex gap-4 min-w-[300px]">
                      <img src={video.thumbnail} alt="thumbnail" className="w-24 aspect-video object-cover rounded shadow-sm border border-surfaceHover" />
                      <div className="flex flex-col justify-center">
                        <span className="font-semibold line-clamp-1">{video.title}</span>
                        <span className="text-xs text-gray-400 line-clamp-1 mt-1">{video.description}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => handleTogglePublish(video._id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${video.isPublished ? "bg-green-500/10 text-green-400 border-green-500/30" : "bg-red-500/10 text-red-400 border-red-500/30"} shadow-sm`}
                      >
                        {video.isPublished ? "Published" : "Draft"}
                      </button>
                    </td>
                    <td className="p-4 text-sm text-gray-300 whitespace-nowrap">{moment(video.createdAt).format("MMM D, YYYY")}</td>
                    <td className="p-4 text-sm text-gray-300">{video.views}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <button className="text-gray-400 hover:text-blue-400 transition-colors" title="Edit">
                          <Edit className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleDelete(video._id)} className="text-gray-400 hover:text-red-400 transition-colors" title="Delete">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <UploadVideoModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onSuccess={fetchDashboardData} 
      />
    </div>
  )
}

export default Dashboard
