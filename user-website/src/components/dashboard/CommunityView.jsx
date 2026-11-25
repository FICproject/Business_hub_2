import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  MessageSquare,
  Users,
  Send,
  ThumbsUp,
  MessageCircle,
  Sparkles,
  Share2,
  Award,
  GraduationCap,
  Store,
  Briefcase,
  Search,
  Filter,
} from 'lucide-react';

export const CommunityView = ({ role = 'teacher' }) => {
  const { user } = useSelector((state) => state.auth);

  const [activeGroup, setActiveGroup] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [discussionInput, setDiscussionInput] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postChannel, setPostChannel] = useState(
    role === 'teacher' ? 'Educators & Mentor Lounge' : 'General Discussion'
  );

  const [discussions, setDiscussions] = useState([]);

  const groupNames = [
    'Educators & Mentor Lounge',
    'Software Engineering',
    'Data Science & AI',
    'Commerce & Careers',
  ];

  const groups = [
    { name: 'All', count: discussions.length },
    ...groupNames.map((name) => ({
      name,
      count: discussions.filter((d) => d.group === name).length,
    })),
  ];

  const handleLike = (id) => {
    setDiscussions((prev) =>
      prev.map((d) =>
        d.id === id
          ? { ...d, liked: !d.liked, likes: d.liked ? d.likes - 1 : d.likes + 1 }
          : d
      )
    );
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (!discussionInput.trim() || !postTitle.trim()) return;

    const newPost = {
      id: Date.now(),
      author: user?.fullName || (role === 'teacher' ? 'Faculty Member' : 'Community Member'),
      role: role === 'teacher' ? 'Faculty / Educator' : 'Member',
      avatar:
        user?.avatarUrl ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
          user?.fullName || 'Teacher'
        )}`,
      group: postChannel,
      title: postTitle,
      content: discussionInput,
      time: 'Just now',
      likes: 0,
      replies: 0,
      liked: false,
    };

    setDiscussions([newPost, ...discussions]);
    setDiscussionInput('');
    setPostTitle('');
  };

  const filteredDiscussions = discussions.filter((d) => {
    const matchesGroup = activeGroup === 'All' || d.group === activeGroup;
    const matchesQuery =
      searchQuery === '' ||
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesGroup && matchesQuery;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-700 text-xs font-extrabold border border-teal-500/20 mb-2">
            <Users className="w-3.5 h-3.5" />
            Global Faculty & Learner Community
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-navy-950">
            Community Discussions &amp; Circles
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Collaborate with peers, exchange pedagogical resources, answer technical questions, and expand your academic network.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-100 text-navy-950 font-bold text-xs">
            {discussions.length} Discussions Active
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1 md:pb-0 text-xs font-bold">
          {groups.map((grp) => (
            <button
              key={grp.name}
              onClick={() => setActiveGroup(grp.name)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                activeGroup === grp.name
                  ? 'bg-navy-950 text-white shadow-md font-extrabold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-navy-950 border border-slate-100'
              }`}
            >
              {grp.name}
            </button>
          ))}
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discussions..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500 bg-slate-50/50"
          />
        </div>
      </div>

      {/* Main Grid: Create Post & Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Post Creator */}
        <div className="lg:col-span-1 space-y-6">
          <form
            onSubmit={handlePostSubmit}
            className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-4 sticky top-24"
          >
            <div className="border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-sm text-navy-950 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Start a Discussion
              </h3>
              <p className="text-[11px] text-slate-500">Publish to verified community members</p>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Channel / Category
              </label>
              <select
                value={postChannel}
                onChange={(e) => setPostChannel(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="Educators & Mentor Lounge">Educators & Mentor Lounge</option>
                <option value="Software Engineering">Software Engineering</option>
                <option value="Data Science & AI">Data Science & AI</option>
                <option value="Commerce & Careers">Commerce & Careers</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Discussion Title
              </label>
              <input
                type="text"
                required
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Brief topic headline..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">
                Details &amp; Notes
              </label>
              <textarea
                rows={4}
                required
                value={discussionInput}
                onChange={(e) => setDiscussionInput(e.target.value)}
                placeholder="Share educational context, coding solutions, or question details..."
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5 text-amber-400" />
              Publish Discussion
            </button>
          </form>
        </div>

        {/* Right Column: Discussion Feed */}
        <div className="lg:col-span-2 space-y-4">
          {filteredDiscussions.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-10 text-center space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-bold text-navy-950">No discussions match your filter.</p>
              <p className="text-xs text-slate-500">Try selecting a different channel or clear the search query.</p>
            </div>
          ) : (
            filteredDiscussions.map((disc) => (
              <div
                key={disc.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-sm space-y-3 hover:border-slate-300 transition-all"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={disc.avatar}
                      alt={disc.author}
                      className="w-9 h-9 rounded-xl object-cover bg-slate-100 border border-slate-200"
                    />
                    <div>
                      <h4 className="font-extrabold text-xs text-navy-950 flex items-center gap-2">
                        {disc.author}
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {disc.role}
                        </span>
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {disc.group} • {disc.time}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-lg bg-teal-50 text-teal-700 border border-teal-200">
                    Active
                  </span>
                </div>

                {/* Body */}
                <div className="space-y-1 pt-1">
                  <h3 className="font-extrabold text-sm text-navy-950 hover:text-teal-700 cursor-pointer transition-colors">
                    {disc.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{disc.content}</p>
                </div>

                {/* Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => handleLike(disc.id)}
                      className={`flex items-center gap-1.5 transition-colors font-semibold ${
                        disc.liked ? 'text-teal-600 font-bold' : 'hover:text-navy-950'
                      }`}
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${disc.liked ? 'fill-current' : ''}`} />
                      {disc.likes} Helpful
                    </button>
                    <span className="flex items-center gap-1.5 hover:text-navy-950 cursor-pointer transition-colors font-semibold">
                      <MessageCircle className="w-3.5 h-3.5" />
                      {disc.replies} Replies
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Discussion link copied to clipboard!');
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-navy-950 transition-colors"
                    title="Share discussion"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
