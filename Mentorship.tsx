
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole } from '../types';
import { MessageSquare, Star, Award, Search, Sparkles, UserCheck } from 'lucide-react';

interface MentorshipProps {
  user: User;
  globalUsers: User[];
  onUpdateUsers: (users: User[]) => void;
}

const Mentorship: React.FC<MentorshipProps> = ({ user, globalUsers, onUpdateUsers }) => {
  const navigate = useNavigate();
  const mentors = globalUsers.filter(u => u.role === UserRole.ALUMNI || u.isMentoring);

  const handleVolunteer = () => {
    if (user.isMentoring) {
      alert("You are already signed up as a volunteer mentor!");
      return;
    }
    const updatedUsers = globalUsers.map(u => u.id === user.id ? { ...u, isMentoring: true } : u);
    onUpdateUsers(updatedUsers);
    alert("Thank you for volunteering! Your profile is now listed as a mentor.");
  };

  const startChat = (mentor: User) => {
    navigate(`/messages?contactId=${mentor.id}`);
  };

  const requestIntro = (mentor: User) => {
    alert(`Introduction request sent to ${mentor.name}. They will be notified shortly!`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <header>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Expert Mentorship</h1>
        <p className="text-slate-500 font-medium">Connect with alumni for 1-on-1 career guidance and industry insights.</p>
      </header>

      {/* Featured Banner */}
      <div className="bg-indigo-600 rounded-[3rem] p-10 flex flex-col md:flex-row items-center gap-10 shadow-2xl shadow-indigo-200 overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 group-hover:scale-110 transition-transform duration-1000"></div>
        <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-white shrink-0 shadow-xl">
          <Award size={48} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Share Your Experience</h2>
          <p className="text-indigo-100 font-medium leading-relaxed max-w-xl">
            Join 240+ other alumni volunteers. Help current students navigate their career paths, 
            review portfolios, and build professional confidence.
          </p>
        </div>
        <button 
          onClick={handleVolunteer}
          className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-black hover:bg-indigo-50 transition-all shrink-0 shadow-xl hover:scale-105 active:scale-95"
        >
          {user.isMentoring ? 'Manage Volunteer Profile' : 'Apply to Volunteer'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mentors.map(mentor => (
          <div key={mentor.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl transition-all duration-500 group relative">
            {mentor.isMentoring && ! (mentor.role === UserRole.ALUMNI) && (
               <div className="absolute top-6 right-6 bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                 <UserCheck size={12} /> Peer Mentor
               </div>
            )}
            <div className="flex items-center gap-5 mb-8">
              <img src={mentor.avatar} className="w-20 h-20 rounded-[2rem] object-cover ring-4 ring-slate-50 transition-all group-hover:ring-indigo-100 shadow-sm" alt="" />
              <div>
                <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-indigo-600 transition-colors">{mentor.name}</h3>
                <p className="text-xs font-bold text-slate-400 mt-1">{mentor.jobTitle || 'Industry Professional'}</p>
                <p className="text-xs font-black text-indigo-500 uppercase tracking-widest mt-0.5">{mentor.company || mentor.major}</p>
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div className="flex flex-wrap gap-2">
                {mentor.skills?.slice(0, 3).map(skill => (
                  <span key={skill} className="bg-slate-50 text-slate-500 text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest border border-slate-100">
                    {skill}
                  </span>
                ))}
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed italic">
                "{mentor.bio}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => startChat(mentor)}
                className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 active:scale-95"
              >
                <MessageSquare size={16} /> Chat
              </button>
              <button 
                onClick={() => requestIntro(mentor)}
                className="flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-4 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-indigo-100 transition-all active:scale-95"
              >
                Request
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Mentorship;
