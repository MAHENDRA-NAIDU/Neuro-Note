import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import api from '../api/axios';
import { Save, Tag as TagIcon, X, Star, Trash, CalendarClock, Zap } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const AddNote = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [favorite, setFavorite] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tagQuery = searchParams.get('tag');

  useEffect(() => {
    if (tagQuery && !tags.includes(tagQuery)) {
      setTags([...tags, tagQuery]);
    }
  }, [tagQuery]);

  useEffect(() => {
    if (id) {
      const fetchNote = async () => {
        try {
          const { data } = await api.get(`/notes`);
          const note = data.find(n => n._id === id);
          if (note) {
            setTitle(note.title);
            setContent(note.content);
            setTags(note.tags || []);
            setFavorite(note.favorite || false);
            if (note.reminderDate) {
              setReminderDate(new Date(note.reminderDate).toISOString().slice(0, 16));
            }
            setSummary(note.summary || '');
          }
        } catch (error) {
          console.error("Failed to fetch note", error);
        }
      };
      fetchNote();
    }
  }, [id]);

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSmartAnalyze = () => {
    if (!content) return;
    setAnalyzing(true);
    
    setTimeout(() => {
      // Safely extract plain text from HTML, decoding entities like &nbsp;
      const doc = new DOMParser().parseFromString(content, 'text/html');
      const text = doc.body.textContent || "";
      
      const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 4);
      const counts = {};
      words.forEach(w => counts[w] = (counts[w] || 0) + 1);
      const sortedWords = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
      
      const newTags = sortedWords.slice(0, 3);
      const uniqueTags = [...new Set([...tags, ...newTags])];
      setTags(uniqueTags);
      
      const generatedSummary = text.substring(0, 150) + (text.length > 150 ? '...' : '');
      setSummary(generatedSummary);
      
      setAnalyzing(false);
    }, 1500);
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) return;
    
    setLoading(true);
    try {
      if (id) {
        await api.put(`/notes/${id}`, { title, content, tags, favorite, reminderDate: reminderDate || null, summary });
      } else {
        await api.post('/notes', { title, content, tags, favorite, reminderDate: reminderDate || null, summary });
      }
      navigate('/notes');
    } catch (error) {
      console.error("Failed to save note", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setLoading(true);
      try {
        await api.delete(`/notes/${id}`);
        navigate('/notes');
      } catch (error) {
        console.error("Failed to delete note", error);
        setLoading(false);
      }
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">{id ? 'Edit Note' : 'Create Note'}</h1>
        <div className="flex items-center gap-4">
          {id && (
            <button 
              onClick={handleDelete}
              disabled={loading}
              className="p-2 rounded-xl transition-colors bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-50"
              title="Delete Note"
            >
              <Trash size={20} />
            </button>
          )}
          <button 
            onClick={() => setFavorite(!favorite)}
            className={`p-2 rounded-xl transition-colors ${favorite ? 'bg-yellow-400/20 text-yellow-400' : 'bg-white/5 text-gray-400 hover:text-white'}`}
          >
            <Star className={favorite ? "fill-yellow-400" : ""} size={20} />
          </button>
          <button 
            onClick={handleSave} 
            disabled={loading || !title.trim() || !content.trim()}
            className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} />
            {loading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="text-4xl font-bold bg-transparent text-white placeholder-gray-600 focus:outline-none w-full"
        />

        <div className="flex flex-wrap items-center gap-2 mb-2">
          {tags.map(tag => (
            <span key={tag} className="flex items-center gap-1 text-sm px-3 py-1.5 bg-primary/20 text-primary-200 border border-primary/30 rounded-lg">
              <TagIcon size={14} />
              {tag}
              <button onClick={() => removeTag(tag)} className="ml-1 hover:text-white"><X size={14} /></button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleAddTag}
            placeholder="Add a tag..."
            className="bg-transparent text-sm text-gray-300 placeholder-gray-600 focus:outline-none min-w-[100px]"
          />
          
          <div className="flex items-center gap-2 ml-auto">
             <CalendarClock size={16} className="text-gray-400" />
             <input 
               type="datetime-local" 
               value={reminderDate}
               onChange={(e) => setReminderDate(e.target.value)}
               style={{ colorScheme: 'dark' }}
               className="bg-transparent text-sm text-gray-300 border border-white/10 rounded px-2 py-1 focus:outline-none"
             />
             <button 
               onClick={handleSmartAnalyze}
               disabled={analyzing || !content}
               className="flex items-center gap-1 text-sm bg-secondary/20 text-secondary-200 px-3 py-1.5 rounded border border-secondary/30 hover:bg-secondary/30 disabled:opacity-50"
             >
               <Zap size={14} />
               {analyzing ? 'Analyzing...' : 'Smart Analyze'}
             </button>
          </div>
        </div>

        {summary && (
          <div className="bg-white/5 p-3 rounded-lg border border-white/10 mb-2">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1 font-semibold flex items-center gap-1">
               <Zap size={12} className="text-secondary" /> AI Summary
            </p>
            <p className="text-sm text-gray-300">{summary}</p>
          </div>
        )}

        <div className="flex-1 bg-white/5 rounded-xl border border-white/10 quill-dark flex flex-col pb-12">
          <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent} 
            placeholder="Start typing your thoughts here..."
            className="flex-1 h-full"
          />
        </div>
      </div>
    </div>
  );
};

export default AddNote;
