import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import MyNotes from './pages/MyNotes';
import AddNote from './pages/AddNote';
import Explore from './pages/Explore';
import Connections from './pages/Connections';
import Insights from './pages/Insights';
import Reminders from './pages/Reminders';
import Favorites from './pages/Favorites';
import Profile from './pages/Profile';
import Admin from './pages/Admin';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div className="h-screen w-full flex items-center justify-center text-primary text-xl">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />;
  
  return children;
};

const App = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col min-h-screen bg-darker text-light">
      {user && <Navbar />}
      <div className="flex flex-1 overflow-hidden">
        {user && <Sidebar />}
        <main className={`flex-1 overflow-y-auto ${user ? 'p-6' : 'p-0'}`}>
          <Routes>
            <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Home />} />
            <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />
            
            {/* Protected Routes */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/notes" element={<ProtectedRoute><MyNotes /></ProtectedRoute>} />
            <Route path="/add-note" element={<ProtectedRoute><AddNote /></ProtectedRoute>} />
            <Route path="/edit-note/:id" element={<ProtectedRoute><AddNote /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Explore /></ProtectedRoute>} />
            <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
            <Route path="/insights" element={<ProtectedRoute><Insights /></ProtectedRoute>} />
            <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
            <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* Admin Route */}
            <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default App;
