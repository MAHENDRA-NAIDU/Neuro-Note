import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Network } from 'lucide-react';
import ForceGraph2D from 'react-force-graph-2d';

const Connections = () => {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const navigate = useNavigate();

  useEffect(() => {
    if (containerRef.current) {
      setDimensions({
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight
      });
    }

    const fetchNotes = async () => {
      try {
        const { data } = await api.get('/notes');
        
        const nodes = data.map(note => ({
          id: note._id,
          name: note.title,
          val: 2 + (note.linkedNotes?.length || 0)
        }));

        const links = [];
        data.forEach(note => {
          if (note.linkedNotes && note.linkedNotes.length > 0) {
            note.linkedNotes.forEach(linkedId => {
              // Ensure the target node exists before creating a link
              if (nodes.some(n => n.id === linkedId._id || n.id === linkedId)) {
                links.push({
                  source: note._id,
                  target: linkedId._id || linkedId
                });
              }
            });
          }
        });

        setGraphData({ nodes, links });
      } catch (error) {
        console.error("Failed to fetch notes for graph", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();

    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.clientWidth,
          height: containerRef.current.clientHeight
        });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Network className="text-secondary" />
          Knowledge Graph
        </h1>
        <p className="text-gray-400 mt-2">Visualize the connections between your ideas.</p>
      </div>

      <div ref={containerRef} className="flex-1 glass-card overflow-hidden p-0 relative border border-white/10">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center text-primary">Loading graph...</div>
        ) : graphData.nodes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center text-gray-500">No connections to display yet.</div>
        ) : (
          <ForceGraph2D
            width={dimensions.width}
            height={dimensions.height}
            graphData={graphData}
            nodeLabel="name"
            nodeColor={() => '#8b5cf6'} // Primary color
            linkColor={() => 'rgba(255,255,255,0.2)'}
            nodeRelSize={6}
            onNodeClick={(node) => navigate(`/edit-note/${node.id}`)}
            backgroundColor="transparent"
          />
        )}
      </div>
    </div>
  );
};

export default Connections;
