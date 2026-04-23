import React, { useState, useEffect } from 'react';
import { LineChart, BarChart } from 'lucide-react';
import api from '../api/axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const Insights = () => {
  const [loading, setLoading] = useState(true);
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const { data } = await api.get('/notes');
        setNotes(data);
      } catch (error) {
        console.error('Failed to fetch notes for insights', error);
      } finally {
        setLoading(false);
      }
    };
    fetchNotes();
  }, []);

  // Prepare data for Bar Chart (Notes per day, last 7 days)
  const last7Days = Array.from({length: 7}, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const notesPerDay = last7Days.map(day => {
    return notes.filter(n => new Date(n.createdAt).toISOString().split('T')[0] === day).length;
  });

  const barData = {
    labels: last7Days.map(d => d.slice(5)), // MM-DD
    datasets: [
      {
        label: 'Notes Created',
        data: notesPerDay,
        backgroundColor: 'rgba(139, 92, 246, 0.6)', // Primary color
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Notes Created (Last 7 Days)', color: '#fff', font: { size: 16 } },
    },
    scales: {
      y: { ticks: { color: '#9ca3af', stepSize: 1 }, grid: { color: 'rgba(255,255,255,0.1)' }, beginAtZero: true },
      x: { ticks: { color: '#9ca3af' }, grid: { display: false } },
    }
  };

  // Prepare data for Pie Chart (Tags distribution)
  const tagCounts = {};
  notes.forEach(note => {
    note.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const pieData = {
    labels: Object.keys(tagCounts),
    datasets: [
      {
        data: Object.values(tagCounts),
        backgroundColor: [
          '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#3b82f6', '#ec4899', '#14b8a6', '#6366f1'
        ],
        borderWidth: 0,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { color: '#fff' } },
      title: { display: true, text: 'Tags Distribution', color: '#fff', font: { size: 16 } },
    },
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 h-full flex flex-col">
      <div className="flex items-center gap-3 mb-8">
        <LineChart className="w-8 h-8 text-secondary" />
        <div>
          <h1 className="text-3xl font-bold text-white">Insights</h1>
          <p className="text-gray-400">Analytics and usage patterns of your second brain.</p>
        </div>
      </div>
      
      {loading ? (
        <div className="text-gray-400">Loading insights...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6 h-[400px] flex items-center justify-center">
            <div className="w-full h-full">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
          <div className="glass-card p-6 h-[400px] flex items-center justify-center">
            {Object.keys(tagCounts).length > 0 ? (
              <div className="w-full h-full">
                 <Pie data={pieData} options={pieOptions} />
              </div>
            ) : (
              <p className="text-gray-500">No tags found. Add tags to your notes to see distribution.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
