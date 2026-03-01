
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { MessageSquare, Users, ShieldAlert, Send, Lock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Community: React.FC = () => {
  const { isLoggedIn, user } = useAuth();
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { id: '1', user: 'VedicMaster', text: 'Welcome to the October cohort! We are diving into D9 analysis tonight.', time: '10:30 AM' },
    { id: '2', user: 'Astrology_Lover', text: 'Is the recording for the Saturn webinar uploaded yet?', time: '11:15 AM' },
    { id: '3', user: 'Research_Team', text: 'Yes! Check your Member Hub under learning materials.', time: '11:20 AM' },
  ]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage = {
      id: Date.now().toString(),
      user: user?.name || 'Member',
      text: message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChat([...chat, newMessage]);
    setMessage('');
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-[80vh] bg-[#0F1115] flex items-center justify-center p-4">
        <div className="max-w-xl w-full text-center space-y-8 animate-fade-in">
          <div className="inline-flex items-center justify-center p-4 bg-amber-700/20 rounded-2xl border border-amber-700/30 text-amber-500 mb-4">
            <Lock size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">Private Community Archive</h1>
          <p className="text-gray-400 text-lg leading-relaxed">
            Access to our technical discussion boards and real-time student chat is reserved for registered members and course students.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/profile" className="px-8 py-4 bg-amber-700 text-white font-bold rounded-xl hover:bg-amber-800 transition-all uppercase tracking-widest text-xs">
              Sign In to Access
            </Link>
            <Link to="/courses" className="px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs">
              View Academy Programs
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F1115] text-white">
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-[#1A1D23] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-amber-700/20 rounded-lg text-amber-500">
                <Users size={20} />
              </div>
              <h2 className="font-serif font-bold text-xl">Channels</h2>
            </div>
            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-3 bg-amber-700 text-white rounded-xl text-sm font-bold flex items-center justify-between">
                <span># General Discussion</span>
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </button>
              <button className="w-full text-left px-4 py-3 hover:bg-white/5 text-gray-400 rounded-xl text-sm font-medium transition-all"># Chart-Readings</button>
              <button className="w-full text-left px-4 py-3 hover:bg-white/5 text-gray-400 rounded-xl text-sm font-medium transition-all"># Technical-Dasha</button>
              <button className="w-full text-left px-4 py-3 hover:bg-white/5 text-gray-400 rounded-xl text-sm font-medium transition-all"># Remedies-Feedback</button>
            </nav>
          </div>

          <div className="bg-amber-900/10 rounded-2xl p-6 border border-amber-700/20">
            <div className="flex items-center space-x-3 mb-4 text-amber-500">
              <Zap size={18} />
              <h3 className="text-xs font-bold uppercase tracking-widest">Upcoming Live Session</h3>
            </div>
            <p className="text-sm font-bold mb-2">Navamsa Synthesis Workshop</p>
            <p className="text-xs text-gray-400 mb-4">Starts in 4 hours. Exclusive for Pro Members.</p>
            <button className="w-full py-2 bg-amber-700 text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">Add to Calendar</button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-grow flex flex-col bg-[#1A1D23] rounded-3xl border border-white/5 h-[80vh] overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center font-bold">#</div>
              <div>
                <h3 className="font-bold">General Discussion</h3>
                <p className="text-xs text-gray-500">Technical insights from the Astrokarak faculty</p>
              </div>
            </div>
          </div>

          <div className="flex-grow p-6 overflow-y-auto space-y-6">
            {chat.map((msg) => (
              <div key={msg.id} className="flex items-start space-x-4 animate-fade-in">
                <div className="w-10 h-10 rounded-xl bg-gray-800 flex items-center justify-center text-xs font-bold uppercase text-amber-500 shrink-0 border border-white/5">
                  {msg.user.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-bold text-sm text-gray-200">{msg.user}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-widest">{msg.time}</span>
                  </div>
                  <p className="text-sm text-gray-400 leading-relaxed bg-white/5 px-4 py-3 rounded-2xl rounded-tl-none inline-block">
                    {msg.text}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#1A1D23] border-t border-white/5">
            <form onSubmit={handleSendMessage} className="relative">
              <input 
                type="text" 
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share a technical insight..."
                className="w-full bg-[#0F1115] border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all pr-16"
              />
              <button 
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-amber-700 text-white rounded-xl hover:bg-amber-800 transition-all"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
