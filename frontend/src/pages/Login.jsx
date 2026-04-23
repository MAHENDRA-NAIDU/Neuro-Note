import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { BrainCircuit, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-darker px-4">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card w-full max-w-md relative z-10 p-8"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 mb-4">
            <BrainCircuit className="text-white w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-gray-400 text-center">Enter your credentials to access your second brain.</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-10"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-10"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-3 mt-4 flex justify-center">
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:text-white transition-colors font-medium">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
