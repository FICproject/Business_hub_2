import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Video, Mic, MicOff, VideoOff, Share2, Users, MessageSquare, Send, X, PhoneOff, Calendar, Clock, Sparkles, Link as LinkIcon, Copy, ExternalLink, Check, } from 'lucide-react';
import { educationApi } from '../../services/api';
export const LiveClassesPage = () => {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    // Active Classroom Modal State
    const [activeClass, setActiveClass] = useState(null);
    const [micOn, setMicOn] = useState(false);
    const [cameraOn, setCameraOn] = useState(true);
    const [chatMessages, setChatMessages] = useState([
        { sender: 'Prof. David Vance', text: 'Welcome everyone! Today we discuss microservices architecture.', time: '18:01' },
        { sender: 'Alex Chen', text: 'Excited to be here! Can we ask questions about Redis cluster?', time: '18:03' },
    ]);
    const [messageInput, setMessageInput] = useState('');
    const [copiedId, setCopiedId] = useState(null);
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleCopyLink = (text, id) => {
        if (!text) return;
        navigator.clipboard?.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2500);
    };
    useEffect(() => {
        educationApi.getLiveClasses()
            .then((res) => setClasses(res.data.data))
            .catch((err) => console.error(err))
            .finally(() => setLoading(false));
    }, []);
    const handleJoinClass = async (cls) => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        try {
            // Record attendance via backend API
            await educationApi.joinLiveClass(cls._id);
            setActiveClass(cls);
        }
        catch (err) {
            alert(err.response?.data?.message || 'Error joining classroom');
        }
    };
    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageInput.trim())
            return;
        setChatMessages((prev) => [
            ...prev,
            {
                sender: user?.fullName || 'Student',
                text: messageInput.trim(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            },
        ]);
        setMessageInput('');
    };
    return (<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-3 py-1 rounded-md">
          Zero-Cost Education
        </span>
        <h1 className="text-3xl font-extrabold text-navy-900 mt-2">Free Live Interactive Masterclasses</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Join real-time classrooms powered by WebRTC. Engage with expert instructors, ask questions, and collaborate with peers.
        </p>
      </div>

      {loading ? (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((n) => (<div key={n} className="h-64 bg-slate-100 rounded-3xl animate-pulse"></div>))}
        </div>) : (<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((cls) => (<div key={cls._id} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-teal-600 uppercase bg-teal-50 px-3 py-1 rounded-md">
                    {cls.subject}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5"/> 100% Free
                  </span>
                </div>

                <h3 className="font-extrabold text-xl text-navy-900 leading-snug">
                  {cls.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {cls.description}
                </p>

                <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-500 font-medium">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-teal-600"/>
                    <span>{cls.scheduledDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600"/>
                    <span>{cls.startTime} ({cls.durationMinutes} min)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-600"/>
                    <span>{cls.enrolledCount} / {cls.studentCapacity} Attending</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Video className="w-4 h-4 text-teal-600"/>
                    <span>Room: {cls.meetingId}</span>
                  </div>
                </div>
                {/* Live Class Link Callout */}
                {(() => {
                  const liveUrl = cls.classLink || cls.meetingLink || `https://meet.businesshub.com/room/${cls.meetingId || cls._id}`;
                  return (
                    <div className="p-3 rounded-2xl bg-teal-50/70 border border-teal-200/80 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-teal-900 flex items-center gap-1.5 text-[11px]">
                          <LinkIcon className="w-3.5 h-3.5 text-teal-600" /> Live Class Link:
                        </span>
                        <button
                          type="button"
                          onClick={() => handleCopyLink(liveUrl, cls._id)}
                          className="text-[11px] font-extrabold text-teal-700 hover:text-teal-800 flex items-center gap-1 bg-white px-2 py-0.5 rounded-lg border border-teal-200 shadow-2xs"
                        >
                          {copiedId === cls._id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" /> Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy Link
                            </>
                          )}
                        </button>
                      </div>
                      <a
                        href={liveUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="block text-xs font-bold text-teal-700 hover:underline truncate"
                        title={liveUrl}
                      >
                        {liveUrl}
                      </a>
                    </div>
                  );
                })()}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href={cls.classLink || cls.meetingLink || `https://meet.businesshub.com/room/${cls.meetingId || cls._id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 text-center"
                >
                  <ExternalLink className="w-4 h-4" /> Join via Live Link
                </a>
                <button
                  onClick={() => handleJoinClass(cls)}
                  className="px-4 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4 text-teal-400" /> WebRTC Room
                </button>
              </div>
            </div>))}
        </div>)}

      {/* Interactive WebRTC Classroom Modal */}
      {activeClass && (<div className="fixed inset-0 z-50 bg-navy-950 flex flex-col animate-in fade-in">
          {/* Header */}
          <div className="h-16 bg-navy-900 border-b border-navy-800 px-6 flex items-center justify-between text-white">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
              <div>
                <h3 className="font-bold text-sm">{activeClass.title}</h3>
                <p className="text-[11px] text-teal-400">Live Meeting ID: {activeClass.meetingId}</p>
              </div>
            </div>
            <button onClick={() => setActiveClass(null)} className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
              <X className="w-5 h-5"/>
            </button>
          </div>

          {/* Main Stage & Chat */}
          <div className="flex-grow grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
            {/* Video Canvas */}
            <div className="lg:col-span-3 bg-navy-950 flex flex-col justify-between p-6 relative">
              <div className="flex-grow flex items-center justify-center relative">
                {cameraOn ? (<div className="relative w-full max-w-3xl rounded-3xl overflow-hidden aspect-video shadow-2xl bg-navy-900 border border-navy-800">
                    <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&auto=format&fit=crop&q=80" alt="Speaker" className="w-full h-full object-cover"/>
                    <div className="absolute bottom-4 left-4 bg-navy-900/80 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                      Prof. David Vance (Host)
                    </div>
                  </div>) : (<div className="w-32 h-32 rounded-full bg-slate-800 flex items-center justify-center text-slate-500">
                    <VideoOff className="w-12 h-12"/>
                  </div>)}
              </div>

              {/* Call Controls Bar */}
              <div className="flex items-center justify-center gap-4 pt-4">
                <button onClick={() => setMicOn(!micOn)} className={`p-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${micOn ? 'bg-slate-800 text-white' : 'bg-red-500 text-white shadow-md'}`}>
                  {micOn ? <Mic className="w-5 h-5"/> : <MicOff className="w-5 h-5"/>}
                  {micOn ? 'Mute' : 'Unmuted'}
                </button>
                <button onClick={() => setCameraOn(!cameraOn)} className={`p-3.5 rounded-2xl font-bold text-xs flex items-center gap-2 transition-all ${cameraOn ? 'bg-slate-800 text-white' : 'bg-red-500 text-white shadow-md'}`}>
                  {cameraOn ? <Video className="w-5 h-5"/> : <VideoOff className="w-5 h-5"/>}
                  {cameraOn ? 'Stop Camera' : 'Start Camera'}
                </button>
                <button onClick={() => alert('Screen sharing active (WebRTC display stream).')} className="p-3.5 rounded-2xl bg-slate-800 text-white font-bold text-xs flex items-center gap-2 hover:bg-slate-700 transition-colors">
                  <Share2 className="w-5 h-5"/> Share Screen
                </button>
                <button onClick={() => setActiveClass(null)} className="p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center gap-2 shadow-lg transition-colors">
                  <PhoneOff className="w-5 h-5"/> Leave Class
                </button>
              </div>
            </div>

            {/* Chat Box Panel */}
            <div className="bg-navy-900 border-l border-navy-800 flex flex-col justify-between">
              <div className="p-4 border-b border-navy-800 flex items-center justify-between text-xs font-bold text-slate-300">
                <span className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-teal-400"/> Live Questions & Chat
                </span>
                <span className="text-teal-400">{chatMessages.length} msgs</span>
              </div>

              {/* Messages Container */}
              <div className="p-4 space-y-3 overflow-y-auto flex-grow max-h-[calc(100vh-220px)]">
                {chatMessages.map((msg, i) => (<div key={i} className="space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-teal-400">{msg.sender}</span>
                      <span className="text-slate-500">{msg.time}</span>
                    </div>
                    <p className="text-xs text-slate-200 bg-slate-800/80 p-2.5 rounded-xl border border-slate-700/60 leading-relaxed">
                      {msg.text}
                    </p>
                  </div>))}
              </div>

              {/* Chat Form */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-navy-800 flex items-center gap-2">
                <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="Ask a question..." className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-teal-400"/>
                <button type="submit" className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white transition-colors">
                  <Send className="w-4 h-4"/>
                </button>
              </form>
            </div>
          </div>
        </div>)}
    </div>);
};
