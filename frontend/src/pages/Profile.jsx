import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { User, Mail, Shield, Calendar } from 'lucide-react';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-white mb-8">Profile Settings</h1>
      
      <div className="glass-card flex flex-col md:flex-row gap-8 items-start">
        <div className="w-32 h-32 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white shadow-xl">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 space-y-6 w-full">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
            <div className="flex items-center gap-3 text-lg font-semibold text-white bg-white/5 px-4 py-3 rounded-xl border border-white/10">
              <User className="text-gray-400 w-5 h-5" />
              {user?.name}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
            <div className="flex items-center gap-3 text-lg text-gray-300 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
              <Mail className="text-gray-400 w-5 h-5" />
              {user?.email}
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-400 mb-1">Role</label>
              <div className="flex items-center gap-3 text-gray-300 bg-white/5 px-4 py-3 rounded-xl border border-white/10">
                <Shield className={`${user?.role === 'admin' ? 'text-red-400' : 'text-primary'} w-5 h-5`} />
                <span className="capitalize">{user?.role}</span>
              </div>
            </div>
          </div>
          
          <button className="btn-primary mt-4">Edit Profile</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
