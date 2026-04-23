import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Star, LayoutGrid, List, Tag as TagIcon } from 'lucide-react';
import { format } from 'date-fns';

const Favorites = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data } = await api.get('/notes');
      setNotes(data.filter(note => note.favorite));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Favorites</h1>
          <p className="text-gray-400">Your most important and bookmarked notes.</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {notes.map((note) => (
          <div 
            key={note._id}
            className="glass-card group cursor-pointer flex flex-col h-64"
            onClick={() => navigate(`/edit-note/${note._id}`)}
          >
            <div className="flex-1 mb-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors line-clamp-1">{note.title}</h3>
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
              <p className="text-gray-400 text-sm line-clamp-4">
                {note.content.replace(/<[^>]+>/g, '')}
              </p>
            </div>
            
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/10">
              <div className="flex items-center gap-2 overflow-hidden flex-1">
                {note.tags?.slice(0, 2).map((tag, i) => (
                  <span key={i} className="flex items-center gap-1 text-xs px-2 py-1 bg-white/5 rounded-md text-gray-300 whitespace-nowrap">
                    <TagIcon size={12} /> {tag}
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-500 shrink-0 ml-2">
                {format(new Date(note.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        ))}
        {notes.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500">
            <Star className="w-12 h-12 mb-4 opacity-20" />
            <p>You haven't favorited any notes yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
