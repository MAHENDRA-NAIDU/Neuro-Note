import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BrainCircuit, Sparkles, Network, Search, ArrowRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-darker overflow-hidden">
      {/* Navbar */}
      <nav className="h-20 px-8 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20">
            <BrainCircuit className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold text-white">NeuroNote</span>
        </div>
        <div className="flex gap-4">
          <Link to="/login" className="btn-secondary">Log In</Link>
          <Link to="/register" className="btn-primary">Get Started</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative pt-20 pb-32 px-8 max-w-7xl mx-auto flex flex-col items-center text-center z-10">
        {/* Abstract Background Shapes */}
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50 mix-blend-screen pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[100px] -z-10 opacity-50 mix-blend-screen pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-300">The next generation of note-taking</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-white mb-6 leading-tight">
            Your Digital <br />
            <span className="text-gradient">Second Brain</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Capture your thoughts, connect your ideas, and retrieve information instantly. 
            NeuroNote is the intelligent workspace for your mind.
          </p>

          <div className="flex gap-4 justify-center">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group">
              Start Building
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-8 mt-32 w-full">
          {[
            {
              icon: <BrainCircuit className="w-8 h-8 text-primary" />,
              title: "Capture Anything",
              desc: "Quickly save notes, links, and code snippets in a beautiful rich-text environment."
            },
            {
              icon: <Network className="w-8 h-8 text-secondary" />,
              title: "Connect Ideas",
              desc: "Link related thoughts together to build a powerful personal knowledge graph."
            },
            {
              icon: <Search className="w-8 h-8 text-purple-400" />,
              title: "Find Instantly",
              desc: "Powerful search and smart tagging helps you retrieve your knowledge in milliseconds."
            }
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 + (idx * 0.1) }}
              className="glass-card text-left"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 border border-white/10">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
