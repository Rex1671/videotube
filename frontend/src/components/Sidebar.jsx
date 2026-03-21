import { Home, Compass, PlaySquare, History, ThumbsUp, Folder } from 'lucide-react'
import { NavLink } from 'react-router-dom'

const items = [
  { icon: Home, label: 'Home', path: '/' },
  { icon: Compass, label: 'Explore', path: '/explore' },
  { icon: PlaySquare, label: 'Subscriptions', path: '/subscriptions' },
]

const itemsSecondary = [
  { icon: Folder, label: 'Library', path: '/library' },
  { icon: History, label: 'History', path: '/history' },
  { icon: ThumbsUp, label: 'Liked videos', path: '/liked' },
]

const SidebarItem = ({ icon: Icon, label, path }) => (
  <NavLink 
    to={path}
    className={({isActive}) => `flex flex-col xl:flex-row items-center xl:justify-start justify-center py-4 xl:py-3 px-2 xl:px-4 rounded-xl transition-colors hover:bg-surface ${isActive ? 'bg-surface font-semibold' : ''}`}
  >
    <Icon className="w-6 h-6 mb-1 xl:mb-0 xl:mr-4" />
    <span className="text-[10px] xl:text-sm truncate">{label}</span>
  </NavLink>
)

const Sidebar = () => {
  return (
    <aside className="w-20 xl:w-64 h-full bg-background border-r border-surface overflow-y-auto hidden sm:flex flex-col py-2 transition-all duration-300">
      <div className="flex flex-col gap-1 px-2">
        {items.map((item) => (
          <SidebarItem key={item.path} {...item} />
        ))}
      </div>
      <div className="w-full h-[1px] bg-surface my-4"></div>
      <div className="flex flex-col gap-1 px-2">
        {itemsSecondary.map((item) => (
          <SidebarItem key={item.path} {...item} />
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
