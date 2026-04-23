import React, { useState, useEffect } from 'react';
import { CalendarClock, Bell, AlertCircle, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { format } from 'date-fns';

const Reminders = () => {
  const [upcomingNotes, setUpcomingNotes] = useState([]);
  const [overdueNotes, setOverdueNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReminders = async () => {
      try {
        const { data } = await api.get('/notes');
        const notesWithReminders = data.filter(note => note.reminderDate);
        
        const now = new Date();
        const upcoming = [];
        const overdue = [];
        
        notesWithReminders.forEach(note => {
          const reminderDate = new Date(note.reminderDate);
          if (reminderDate < now) {
            overdue.push(note);
          } else {
            upcoming.push(note);
          }
        });
        
        upcoming.sort((a, b) => new Date(a.reminderDate) - new Date(b.reminderDate));
        overdue.sort((a, b) => new Date(b.reminderDate) - new Date(a.reminderDate));

        setUpcomingNotes(upcoming);
        setOverdueNotes(overdue);
      } catch (error) {
        console.error('Failed to fetch reminders', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReminders();
  }, []);

  const ReminderCard = ({ note, isOverdue }) => (
    <div 
      onClick={() => navigate(`/edit-note/${note._id}`)}
      className={`glass-card cursor-pointer flex flex-col border-l-4 ${isOverdue ? 'border-l-red-500' : 'border-l-yellow-400'}`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-white truncate max-w-[70%]">{note.title}</h3>
        <span className={`text-xs px-2 py-1 rounded-full flex items-center gap-1 ${isOverdue ? 'bg-red-500/20 text-red-400' : 'bg-yellow-400/20 text-yellow-400'} whitespace-nowrap`}>
          {isOverdue ? <AlertCircle size={12} /> : <Clock size={12} />}
          {format(new Date(note.reminderDate), 'MMM d, h:mm a')}
        </span>
      </div>
      <p className="text-sm text-gray-400 line-clamp-2">{note.content.replace(/<[^>]+>/g, '')}</p>
    </div>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <CalendarClock className="w-8 h-8 text-yellow-400" />
        <div>
          <h1 className="text-3xl font-bold text-white">Reminders</h1>
          <p className="text-gray-400">Stay on top of your tasks and scheduled reviews.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto space-y-8 pb-10">
        {loading ? (
          <p className="text-gray-400">Loading reminders...</p>
        ) : (
          <>
            {overdueNotes.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-red-400 mb-4 flex items-center gap-2">
                  <AlertCircle /> Overdue
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {overdueNotes.map(note => <ReminderCard key={note._id} note={note} isOverdue={true} />)}
                </div>
              </section>
            )}

            <section>
              <h2 className="text-xl font-bold text-yellow-400 mb-4 flex items-center gap-2">
                <Clock /> Upcoming Reminders
              </h2>
              {upcomingNotes.length === 0 ? (
                <div className="glass-card flex flex-col items-center justify-center py-12 text-center border-white/5">
                  <Bell className="w-12 h-12 text-yellow-400/20 mb-3" />
                  <p className="text-gray-500">You have no upcoming reminders.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingNotes.map(note => <ReminderCard key={note._id} note={note} isOverdue={false} />)}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Reminders;
