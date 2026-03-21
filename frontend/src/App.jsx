import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import VideoDetail from './pages/VideoDetail'
import ChannelProfile from './pages/ChannelProfile'
import Dashboard from './pages/Dashboard'
import Settings from './pages/Settings'
import History from './pages/History'
import LikedVideos from './pages/LikedVideos'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="video/:videoId" element={<VideoDetail />} />
        <Route path="channel/:username" element={<ChannelProfile />} />
        <Route path="studio" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="liked" element={<ProtectedRoute><LikedVideos /></ProtectedRoute>} />
      </Route>
    </Routes>
  )
}

export default App
