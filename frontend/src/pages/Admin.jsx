import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import { ShieldAlert, Users, BookText, Trash2 } from 'lucide-react';

const Admin = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalNotes: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.get('/admin/stats'),
        api.get('/admin/users')
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (error) {
      console.error("Failed to fetch admin data", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user and all their notes?")) {
      try {
        await api.delete(`/admin/user/${id}`);
        fetchData(); // Refresh list
      } catch (error) {
        console.error("Failed to delete user", error);
      }
    }
  };

  if (loading) return <div className="p-8 text-gray-400">Loading admin panel...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <ShieldAlert className="w-8 h-8 text-red-500" />
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-400">System overview and management.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
            <Users className="text-blue-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Users</p>
            <h3 className="text-3xl font-bold text-white">{stats.totalUsers}</h3>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <BookText className="text-purple-400" />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Notes</p>
            <h3 className="text-3xl font-bold text-white">{stats.totalNotes}</h3>
          </div>
        </div>
      </div>

      <div className="glass-card mt-8">
        <h3 className="text-xl font-bold text-white mb-6">User Management</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 text-gray-400 text-sm uppercase tracking-wider">
                <th className="pb-3 pr-4 font-medium">Name</th>
                <th className="pb-3 px-4 font-medium">Email</th>
                <th className="pb-3 px-4 font-medium">Role</th>
                <th className="pb-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id} className="border-b border-white/5 last:border-0">
                  <td className="py-4 pr-4 text-white font-medium">{user.name}</td>
                  <td className="py-4 px-4 text-gray-300">{user.email}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-medium ${user.role === 'admin' ? 'bg-red-500/20 text-red-300' : 'bg-white/10 text-gray-300'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button 
                      onClick={() => handleDeleteUser(user._id)}
                      disabled={user.role === 'admin'}
                      className="p-2 text-gray-400 hover:text-red-400 transition-colors disabled:opacity-30"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Admin;
