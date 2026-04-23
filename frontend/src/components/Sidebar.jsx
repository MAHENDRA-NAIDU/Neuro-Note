import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BookText, 
  PenSquare, 
  Compass, 
  Network, 
  LineChart, 
  CalendarClock, 
  Star,
  Settings,
  ShieldAlert
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useContext(AuthContext);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'My Notes', icon: <BookText size={20} />, path: '/notes' },
    { name: 'Add Note', icon: <PenSquare size={20} />, path: '/add-note' },
    { name: 'Explore', icon: <Compass size={20} />, path: '/explore' },
    { name: 'Connections', icon: <Network size={20} />, path: '/connections' },
    { name: 'Insights', icon: <LineChart size={20} />, path: '/insights' },
    { name: 'Reminders', icon: <CalendarClock size={20} />, path: '/reminders' },
    { name: 'Favorites', icon: <Star size={20} />, path: '/favorites' },
  ];

  return (
    <aside className="w-64 glass border-r border-white/10 hidden md:flex flex-col h-full sticky top-16">
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-primary/20 text-white shadow-sm border border-primary/30' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {item.icon}
            <span className="font-medium">{item.name}</span>
          </NavLink>
        ))}

        {user?.role === 'admin' && (
          <>
            <div className="my-4 border-t border-white/10 pt-4 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              Administration
            </div>
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive 
                    ? 'bg-red-500/20 text-red-200 border border-red-500/30' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`
              }
            >
              <ShieldAlert size={20} />
              <span className="font-medium">Admin Panel</span>
            </NavLink>
          </>
        )}
      </div>
      
      <div className="p-4 border-t border-white/10">
        <NavLink
          to="/settings"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
        >
          <Settings size={20} />
          <span className="font-medium">Settings</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
