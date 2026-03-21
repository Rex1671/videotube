import { Menu, Search, User, Youtube, LogOut } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate('/login');
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sticky top-0 bg-background border-b border-surface z-50">
      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-surface rounded-full transition-colors hidden sm:block">
          <Menu className="w-6 h-6" />
        </button>
        <Link to="/" className="flex items-center gap-1">
          <Youtube className="w-8 h-8 text-primary" />
          <span className="text-xl font-bold hidden sm:block tracking-tighter">VideoTube</span>
        </Link>
      </div>
      
      <div className="flex max-w-2xl w-full mx-4 items-center">
        <div className="flex flex-1 items-center bg-surface border border-surfaceHover rounded-l-full px-4 py-2 focus-within:border-blue-500">
          <input 
            type="text" 
            placeholder="Search" 
            className="bg-transparent border-none outline-none w-full text-white" 
          />
        </div>
        <button className="bg-surfaceHover px-6 py-2 h-full rounded-r-full border border-l-0 border-surfaceHover hover:bg-gray-600 transition-colors">
          <Search className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <Link to="/settings" className="text-gray-400 hover:text-white transition-colors" title="Settings">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
            </Link>
            <button onClick={handleLogout} className="p-2 hover:bg-surface rounded-full transition-colors text-gray-400 hover:text-white" title="Logout">
              <LogOut className="w-5 h-5" />
            </button>
            <Link to={`/channel/${user.username}`}>
              <img src={user.avatar} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-surfaceHover" />
            </Link>
          </div>
        ) : (
          <Link to="/login" className="px-3 py-1.5 border border-surfaceHover hover:bg-surface rounded-full flex items-center gap-2 font-medium transition-colors">
            <User className="w-5 h-5 text-blue-400" />
            <span className="text-blue-400">Sign in</span>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Header
