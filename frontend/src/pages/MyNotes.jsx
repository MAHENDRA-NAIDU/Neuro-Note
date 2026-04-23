import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Search, Plus, LayoutGrid, List, MoreVertical, Tag as TagIcon, Star } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

const MyNotes = () => {
  const [notes, setNotes] = useState([]);
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await api.get('/notes');
      setNotes(data);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(search.toLowerCase()) || 
    note.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">My Notes</h1>
          <p className="text-gray-400">Manage and organize your second brain.</p>
        </div>
        <button onClick={() => navigate('/add-note')} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          New Note
        </button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search notes or tags..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field pl-10"
          />
        </div>
        
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/10 ml-4">
          <button 
            onClick={() => setView('grid')}
            className={`p-2 rounded-lg transition-colors ${view === 'grid' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <LayoutGrid size={20} />
          </button>
          <button 
            onClick={() => setView('list')}
            className={`p-2 rounded-lg transition-colors ${view === 'list' ? 'bg-primary text-white' : 'text-gray-400 hover:text-white'}`}
          >
            <List size={20} />
          </button>
        </div>
      </div>

      <div className={`flex-1 overflow-y-auto ${view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}`}>
        {filteredNotes.map((note, idx) => (
          <motion.div 
            key={note._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            className={`glass-card group cursor-pointer ${view === 'list' ? 'flex items-center justify-between p-4' : 'flex flex-col h-64'}`}
            onClick={() => navigate(`/edit-note/${note._id}`)}
          >
            <div className={view === 'list' ? 'flex-1' : 'flex-1 mb-4'}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">{note.title}</h3>
                {note.favorite && <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />}
              </div>
              <p className={`text-gray-400 text-sm ${view === 'grid' ? 'line-clamp-4' : 'line-clamp-1'}`}>
                {note.content.replace(/<[^>]+>/g, '')}
              </p>
            </div>
            
            <div className={`flex items-center justify-between mt-auto pt-4 border-t border-white/10 ${view === 'list' ? 'border-t-0 pt-0 ml-4 w-64' : ''}`}>
              <div className="flex items-center gap-2 overflow-hidden flex-1">
                {note.tags?.slice(0, 2).map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs px-2 py-1 bg-white/5 rounded-md text-gray-300 whitespace-nowrap">
                    <TagIcon size={12} /> {tag}
                  </span>
                ))}
                {note.tags?.length > 2 && <span className="text-xs text-gray-500">+{note.tags.length - 2}</span>}
              </div>
              <span className="text-xs text-gray-500 shrink-0 ml-2">
                {format(new Date(note.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
          </motion.div>
        ))}
        {filteredNotes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>No notes found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNotes;
