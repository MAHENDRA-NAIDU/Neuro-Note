import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit, Search, Bell, LogOut, Check } from 'lucide-react';
import api from '../api/axios';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  const searchRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const { data } = await api.get('/notifications');
        setNotifications(data);
      } catch (error) {
        console.error('Failed to fetch notifications', error);
      }
    };
    if (user) {
      fetchNotifications();
    }
  }, [user]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (q.trim().length > 0) {
      try {
        const { data } = await api.get(`/notes/search?q=${q}`);
        setSearchResults(data);
        setShowSearch(true);
      } catch (error) {
        console.error('Search failed', error);
      }
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  };

  const handleResultClick = (id) => {
    setShowSearch(false);
    setSearchQuery('');
    navigate(`/edit-note/${id}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id, link) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
      if (link) {
        setShowNotifications(false);
        navigate(link);
      }
    } catch (error) {
      console.error('Failed to mark notification as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all as read', error);
    }
  };

  return (
    <nav className="h-16 border-b border-white/10 glass px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
          <BrainCircuit className="text-white w-6 h-6" />
        </div>
        <span className="text-xl font-bold text-gradient hidden sm:block">NeuroNote</span>
      </Link>

      {/* Search */}
      <div className="flex-1 max-w-xl mx-8 hidden md:block relative" ref={searchRef}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={handleSearch}
            placeholder="Search notes, tags, or connections..." 
            className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm text-gray-300 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
          />
        </div>
        
        {/* Search Dropdown */}
        {showSearch && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-darker border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-96 overflow-y-auto z-50 glass">
            {searchResults.length > 0 ? (
              searchResults.map(result => (
                <div 
                  key={result._id} 
                  onClick={() => handleResultClick(result._id)}
                  className="p-3 hover:bg-white/5 cursor-pointer border-b border-white/5 last:border-0"
                >
                  <h4 className="text-white font-medium">{result.title}</h4>
                  <p className="text-xs text-gray-400 truncate">{result.content.replace(/<[^>]+>/g, '')}</p>
                </div>
              ))
            ) : searchQuery.trim().length > 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">No notes found for "{searchQuery}".</div>
            ) : null}
          </div>
        )}
      </div>

      {/* Profile & Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/5 relative"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-primary rounded-full border-2 border-darker"></span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-darker border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 glass">
              <div className="p-3 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h3 className="font-bold text-white">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={markAllAsRead} className="text-xs text-primary hover:text-primary-300 flex items-center gap-1">
                    <Check className="w-3 h-3" /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 text-sm">No notifications yet.</div>
                ) : (
                  notifications.map(notif => (
                    <div 
                      key={notif._id} 
                      onClick={() => markAsRead(notif._id, notif.link)}
                      className={`p-3 border-b border-white/5 last:border-0 cursor-pointer hover:bg-white/5 transition-colors ${!notif.read ? 'bg-primary/5' : ''}`}
                    >
                      <p className={`text-sm ${!notif.read ? 'text-white' : 'text-gray-400'}`}>{notif.message}</p>
                      <span className="text-xs text-gray-500 mt-1 block">{new Date(notif.createdAt).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-white/10 pl-4">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center">
            <span className="text-sm font-semibold">{user?.name?.charAt(0).toUpperCase()}</span>
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.role}</p>
          </div>
          <button onClick={handleLogout} className="ml-2 p-2 text-gray-400 hover:text-red-400 transition-colors rounded-full hover:bg-white/5" title="Logout">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
