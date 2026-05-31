
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { 
  Mail, 
  MapPin, 
  Briefcase, 
  GraduationCap, 
  Award, 
  Settings, 
  Edit3,
  ExternalLink,
  Sparkles,
  Check,
  X,
  Plus
} from 'lucide-react';
import { geminiService } from '../services/geminiService';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [optimizationResult, setOptimizationResult] = useState<string | null>(null);
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  const handleOptimizeBio = async () => {
    if (!user.bio) {
      alert("Please add a bio first so Gemini can analyze it!");
      return;
    }
    setAiOptimizing(true);
    try {
      const suggestions = await geminiService.optimizeProfile(user.bio);
      setOptimizationResult(suggestions || null);
    } catch (e) {
      console.error(e);
      setOptimizationResult("Unable to connect to AI service. Please check your API key.");
    } finally {
      setAiOptimizing(false);
    }
  };

  const applyAiBio = () => {
    if (!optimizationResult) return;
    // Extract a cleaner version if it's multiple bullet points, but for now we'll just set it
    // In a real scenario, we'd parse the Gemini response specifically for the bio rewrite
    const updatedUser = { ...user, bio: optimizationResult.split('\n')[0].replace(/^\d+\.\s*/, '') || user.bio };
    onUpdate(updatedUser);
    setOptimizationResult(null);
    alert("Bio updated with AI suggestions!");
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.trim()) return;
    const currentSkills = user.skills || [];
    if (currentSkills.includes(newSkill.trim())) {
      alert("Skill already exists!");
      return;
    }
    const updatedUser = { ...user, skills: [...currentSkills, newSkill.trim()] };
    onUpdate(updatedUser);
    setNewSkill('');
    setIsAddingSkill(false);
  };

  const profileCompletion = Math.min(100, (user.skills?.length || 0) * 10 + (user.bio ? 30 : 0) + (user.location ? 20 : 0));

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      {/* Header Banner */}
      <div className="relative h-64 bg-gradient-to-br from-indigo-600 via-blue-700 to-indigo-900 rounded-[3rem] overflow-hidden shadow-2xl">
        <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
          <Sparkles size={400} className="text-white" />
        </div>
        <button 
          onClick={() => alert('Banner editing feature coming soon!')}
          className="absolute top-8 right-8 p-4 bg-white/20 backdrop-blur-xl text-white rounded-3xl hover:bg-white/30 transition-all border border-white/20"
        >
          <Edit3 size={20} />
        </button>
      </div>

      <div className="px-12 -mt-24 relative z-10 flex flex-col md:flex-row items-end gap-10 mb-10">
        <div className="relative group">
          <img src={user.avatar} className="w-48 h-48 rounded-[3rem] object-cover border-[10px] border-slate-50 bg-white shadow-2xl transition-transform group-hover:scale-105" alt="" />
          <button 
            onClick={() => alert('Profile picture upload coming soon!')}
            className="absolute bottom-4 right-4 p-3 bg-indigo-600 text-white rounded-2xl shadow-xl hover:bg-indigo-700 transition-all border-4 border-slate-50"
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="flex-1 pb-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">{user.name}</h1>
          <p className="text-xl text-slate-500 font-bold">{user.role === UserRole.ALUMNI ? `${user.jobTitle} at ${user.company}` : `${user.major} Student`}</p>
          <div className="flex gap-6 mt-4 text-sm font-bold text-slate-400">
            <span className="flex items-center gap-2"><MapPin size={18} className="text-indigo-500" /> {user.location || 'Remote'}</span>
            <span className="flex items-center gap-2"><Mail size={18} className="text-blue-500" /> {user.email}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 px-4 sm:px-0">
        <div className="lg:col-span-2 space-y-10">
          {/* About Section */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-black text-slate-800 tracking-tight">Professional Bio</h3>
              <button 
                onClick={handleOptimizeBio}
                disabled={aiOptimizing}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-5 py-2.5 rounded-full hover:bg-indigo-100 transition-all shadow-sm disabled:opacity-50"
              >
                <Sparkles size={14} /> {aiOptimizing ? 'Analyzing...' : 'Gemini AI Review'}
              </button>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium text-lg">
              {user.bio || 'Share your professional journey with the community...'}
            </p>
            
            {optimizationResult && (
              <div className="mt-8 bg-slate-50 border-2 border-indigo-100 rounded-[2.5rem] p-8 relative animate-in zoom-in-95">
                <button onClick={() => setOptimizationResult(null)} className="absolute top-6 right-6 p-2 hover:bg-indigo-100 rounded-full transition-all"><X size={16} className="text-slate-400" /></button>
                <h4 className="text-sm font-black text-indigo-900 mb-4 flex items-center gap-2 uppercase tracking-widest">
                  <Sparkles size={16} className="text-indigo-500" /> AI Optimization Suggestions
                </h4>
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-inner">
                   <p className="text-sm text-slate-600 whitespace-pre-wrap font-medium leading-relaxed italic">
                    {optimizationResult}
                  </p>
                </div>
                <button 
                  onClick={applyAiBio}
                  className="mt-6 w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all text-xs uppercase tracking-widest"
                >
                  Adopt Suggested Style
                </button>
              </div>
            )}
          </section>

          {/* Skills Section */}
          <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-xl font-black text-slate-800 mb-8 tracking-tight">Skills & Expertise</h3>
            <div className="flex flex-wrap gap-4">
              {user.skills?.map(skill => (
                <div key={skill} className="bg-slate-50 border border-slate-100 px-6 py-3 rounded-2xl flex items-center gap-3 text-sm font-black text-slate-700 uppercase tracking-widest shadow-sm group hover:bg-indigo-50 transition-all">
                  {skill} <Check size={16} className="text-blue-500" />
                </div>
              ))}
              
              {!isAddingSkill ? (
                <button 
                  onClick={() => setIsAddingSkill(true)}
                  className="px-6 py-3 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 text-xs font-black uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center gap-2"
                >
                  <Plus size={16} /> Add Skill
                </button>
              ) : (
                <form onSubmit={handleAddSkill} className="flex gap-2">
                  <input 
                    autoFocus
                    type="text" 
                    className="bg-slate-50 border border-indigo-300 px-4 py-2 rounded-xl text-sm font-bold outline-none" 
                    placeholder="Skill name..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                  />
                  <button type="submit" className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700"><Check size={20} /></button>
                  <button type="button" onClick={() => setIsAddingSkill(false)} className="bg-slate-200 text-slate-600 p-2 rounded-xl hover:bg-slate-300"><X size={20} /></button>
                </form>
              )}
            </div>
          </section>
        </div>

        <div className="space-y-10">
          <section className="bg-white p-10 rounded-[3rem] border border-slate-200 shadow-sm">
            <h3 className="text-lg font-black text-slate-800 mb-8 uppercase tracking-widest">Professional Info</h3>
            <div className="space-y-8">
              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all"><Briefcase size={24} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Status</p>
                  <p className="text-sm font-black text-slate-800">{user.jobTitle || 'Seeking Opportunities'}</p>
                </div>
              </div>
              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-amber-50 rounded-2xl text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all"><GraduationCap size={24} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Education</p>
                  <p className="text-sm font-black text-slate-800">{user.major || 'Computer Science'}</p>
                  <p className="text-xs text-slate-500 font-bold">{user.academicYear ? `${user.academicYear} Student` : 'Class of 2018'}</p>
                </div>
              </div>
              <div className="flex items-start gap-5 group">
                <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all"><ExternalLink size={24} /></div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Professional URL</p>
                  <p className="text-sm font-black text-indigo-600 truncate max-w-[150px] hover:underline cursor-pointer">linkedin.com/in/{user.name.split(' ')[0].toLowerCase()}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-indigo-600 p-10 rounded-[3rem] text-white shadow-2xl shadow-indigo-100">
            <h3 className="text-xl font-black mb-4 tracking-tight">Profile Strength</h3>
            <div className="flex items-end gap-3 mb-6">
              <span className="text-6xl font-black">{profileCompletion}</span>
              <span className="text-indigo-200 font-black text-xl mb-2">/ 100</span>
            </div>
            <p className="text-sm text-indigo-100 mb-8 font-medium leading-relaxed">Your network impact grows as you complete your profile details.</p>
            <button 
              onClick={() => alert('All sections are completed or functional. Keep growing!')}
              className="w-full bg-white text-indigo-600 py-4 rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-xl"
            >
              Complete Profile
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
