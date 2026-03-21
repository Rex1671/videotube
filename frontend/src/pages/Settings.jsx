import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'

const Settings = () => {
  const { user } = useAuth()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [email, setEmail] = useState(user?.email || '')
  
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  
  const [avatar, setAvatar] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleUpdateDetails = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.patch('/users/update-account', { fullName, email })
      toast.success("Account details updated. Please refresh to see changes.")
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update details")
    } finally { setLoading(false) }
  }

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/users/change-password', { oldPassword, newPassword })
      toast.success("Password updated successfully")
      setOldPassword('')
      setNewPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password")
    } finally { setLoading(false) }
  }

  const handleUpdateAvatar = async (e) => {
    e.preventDefault()
    if (!avatar) return
    setLoading(true)
    const formData = new FormData()
    formData.append('avatar', avatar)
    try {
      await api.patch('/users/update-avatar', formData)
      toast.success("Avatar updated. Please refresh.")
      setAvatar(null)
    } catch (err) {
      toast.error("Failed to update avatar")
    } finally { setLoading(false) }
  }

  const handleUpdateCover = async (e) => {
    e.preventDefault()
    if (!coverImage) return
    setLoading(true)
    const formData = new FormData()
    formData.append('coverImage', coverImage)
    try {
      await api.patch('/users/update-coverImage', formData)
      toast.success("Cover image updated. Please refresh.")
      setCoverImage(null)
    } catch (err) {
      toast.error("Failed to update cover image")
    } finally { setLoading(false) }
  }

  return (
    <div className="p-4 sm:p-8 text-white max-w-4xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">Settings</h1>
      
      <div className="grid gap-8">
        <div className="bg-surface p-6 rounded-xl border border-surfaceHover shadow-md">
          <h2 className="text-xl font-bold mb-4">Account Details</h2>
          <form onSubmit={handleUpdateDetails} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Full Name</label>
              <input type="text" value={fullName} onChange={e=>setFullName(e.target.value)} className="w-full bg-background border border-surfaceHover px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full bg-background border border-surfaceHover px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors">Update Details</button>
          </form>
        </div>

        <div className="bg-surface p-6 rounded-xl border border-surfaceHover shadow-md">
          <h2 className="text-xl font-bold mb-4">Change Password</h2>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Current Password</label>
              <input type="password" value={oldPassword} onChange={e=>setOldPassword(e.target.value)} className="w-full bg-background border border-surfaceHover px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">New Password</label>
              <input type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} className="w-full bg-background border border-surfaceHover px-4 py-2 rounded-lg focus:outline-none focus:border-blue-500" />
            </div>
            <button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-medium disabled:opacity-50 transition-colors">Update Password</button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row gap-8">
          <div className="bg-surface p-6 rounded-xl border border-surfaceHover shadow-md flex-1">
            <h2 className="text-xl font-bold mb-4">Update Avatar</h2>
            <form onSubmit={handleUpdateAvatar} className="space-y-4 flex flex-col items-start">
              <input type="file" accept="image/*" onChange={e=>setAvatar(e.target.files[0])} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-surfaceHover file:text-white cursor-pointer" />
              <button type="submit" disabled={!avatar || loading} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium disabled:opacity-50 mt-2 transition-colors">Upload Avatar</button>
            </form>
          </div>
          <div className="bg-surface p-6 rounded-xl border border-surfaceHover shadow-md flex-1">
            <h2 className="text-xl font-bold mb-4">Update Cover Image</h2>
            <form onSubmit={handleUpdateCover} className="space-y-4 flex flex-col items-start">
              <input type="file" accept="image/*" onChange={e=>setCoverImage(e.target.files[0])} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-surfaceHover file:text-white cursor-pointer" />
              <button type="submit" disabled={!coverImage || loading} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-medium disabled:opacity-50 mt-2 transition-colors">Upload Cover Image</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Settings
