import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { BookText, Tag, Network, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState({ notes: 0, tags: 0, connections: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/notes');
        const uniqueTags = new Set();
        let connectionCount = 0;
        
        data.forEach(note => {
          note.tags?.forEach(tag => uniqueTags.add(tag));
          connectionCount += (note.linkedNotes?.length || 0);
        });

        setStats({
          notes: data.length,
          tags: uniqueTags.size,
          connections: connectionCount
        });

        // Set recent activity based on updated notes
        const sortedNotes = [...data].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 5);
        setRecentActivity(sortedNotes);
      } catch (error) {
        console.error("Failed to fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { title: "Total Notes", value: stats.notes, icon: <BookText className="w-6 h-6 text-primary" />, bg: "from-primary/20 to-primary/5" },
    { title: "Tags Count", value: stats.tags, icon: <Tag className="w-6 h-6 text-secondary" />, bg: "from-secondary/20 to-secondary/5" },
    { title: "Connections", value: stats.connections, icon: <Network className="w-6 h-6 text-purple-400" />, bg: "from-purple-500/20 to-purple-500/5" },
    { title: "Activity", value: "High", icon: <Activity className="w-6 h-6 text-green-400" />, bg: "from-green-500/20 to-green-500/5" },
  ];

  if (loading) return <div className="p-8 text-gray-400">Loading dashboard...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user?.name.split(' ')[0]}</h1>
          <p className="text-gray-400">Here's what's happening in your second brain today.</p>
        </div>
        <button onClick={() => navigate('/add-note')} className="btn-primary">New Note</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, idx) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="glass p-6 rounded-2xl relative overflow-hidden group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.bg} opacity-50 group-hover:opacity-100 transition-opacity`} />
            <div className="relative z-10 flex justify-between items-start">
              <div>
                <p className="text-gray-400 font-medium mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-white">{stat.value}</h3>
              </div>
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                {stat.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card h-[400px] overflow-y-auto">
          <h3 className="text-xl font-bold text-white mb-6">Activity Timeline</h3>
          {recentActivity.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-[250px] text-gray-500 border-2 border-dashed border-white/10 rounded-xl">
              <Activity className="w-10 h-10 mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map(note => (
                <div key={note._id} onClick={() => navigate(`/edit-note/${note._id}`)} className="flex items-start gap-4 p-4 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-white/5">
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                    <BookText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">Edited "{note.title}"</h4>
                    <p className="text-sm text-gray-400">{new Date(note.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="glass-card h-[400px]">
          <h3 className="text-xl font-bold text-white mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <button onClick={() => navigate('/add-note?tag=journal')} className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5">
              Write a journal entry
            </button>
            <button onClick={() => navigate('/add-note?tag=code')} className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5">
              Add a code snippet
            </button>
            <button onClick={() => navigate('/connections')} className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5">
              Review connections
            </button>
            <button onClick={() => navigate('/notes')} className="w-full text-left px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 transition-colors border border-white/5">
              Organize tags
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
