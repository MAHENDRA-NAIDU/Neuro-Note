import React, { useState, useEffect } from 'react';
import { Compass, BookOpen } from 'lucide-react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

const Explore = () => {
  const [orphanedNotes, setOrphanedNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await api.get('/notes');
        const orphans = data.filter(n => !n.linkedNotes || n.linkedNotes.length === 0);
        setOrphanedNotes(orphans);
      } catch (error) {
        console.error('Failed to fetch notes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <Compass className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold text-white">Explore</h1>
          <p className="text-gray-400">Discover orphaned notes and build new connections.</p>
        </div>
      </div>
      
      <div className="flex-1 glass-card overflow-y-auto">
        <h2 className="text-xl font-bold text-white mb-6">Orphaned Notes (No Connections)</h2>
        {loading ? (
           <p className="text-gray-400">Loading...</p>
        ) : orphanedNotes.length === 0 ? (
           <div className="text-center text-gray-500 py-10">All your notes are connected! Great job!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {orphanedNotes.map(note => (
              <div 
                key={note._id} 
                onClick={() => navigate(`/edit-note/${note._id}`)}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:bg-white/10 cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2 mb-3 text-primary">
                  <BookOpen className="w-5 h-5" />
                  <h3 className="font-semibold text-white truncate">{note.title}</h3>
                </div>
                <p className="text-sm text-gray-400 line-clamp-3 mb-4">{note.content}</p>
                <div className="flex flex-wrap gap-2">
                  {note.tags?.map(tag => (
                     <span key={tag} className="text-xs px-2 py-1 bg-white/5 rounded-md text-gray-300">{tag}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;
