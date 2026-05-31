
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, UserRole, Job } from '../types';
import { 
  Search, 
  MapPin, 
  Clock, 
  Plus, 
  Briefcase, 
  ChevronLeft, 
  X, 
  Building, 
  CheckCircle2, 
  Share2, 
  Globe, 
  ExternalLink, 
  Users,
  DollarSign,
  ArrowRight
} from 'lucide-react';

interface JobBoardProps {
  user: User;
  jobs: Job[];
  users: User[];
  onUpdateJobs: (jobs: Job[]) => void;
}

const JobBoard: React.FC<JobBoardProps> = ({ user, jobs, users, onUpdateJobs }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const navigate = useNavigate();

  const filteredJobs = jobs.filter(j => 
    j.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    j.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApply = (id: string) => {
    if (user.role !== UserRole.STUDENT) {
      alert("Only students can apply for jobs.");
      return;
    }
    const updated = jobs.map(j => {
      if (j.id === id && !j.applicants.includes(user.id)) {
        return { ...j, applicants: [...j.applicants, user.id] };
      }
      return j;
    });
    onUpdateJobs(updated);
    if (selectedJob?.id === id) {
      setSelectedJob({...selectedJob, applicants: [...selectedJob.applicants, user.id]});
    }
    alert('Application sent successfully!');
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const newJob: Job = {
      id: 'j' + Date.now(),
      title: fd.get('title') as string,
      company: fd.get('company') as string,
      location: fd.get('location') as string,
      salary: fd.get('salary') as string,
      type: fd.get('type') as any,
      description: fd.get('description') as string,
      postedBy: user.id,
      datePosted: new Date().toLocaleDateString(),
      applicants: []
    };
    onUpdateJobs([newJob, ...jobs]);
    setShowModal(false);
    alert('Job posted successfully!');
  };

  const handleShare = (job: Job) => {
    navigator.clipboard.writeText(`${window.location.origin}/#/jobs?id=${job.id}`);
    alert(`Link for "${job.title}" copied to clipboard!`);
  };

  const startChatWithApplicant = (appId: string) => {
    navigate(`/messages?contactId=${appId}`);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-6 duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Job Board</h1>
          <p className="text-slate-500 font-medium">Connect with top opportunities in your alumni network.</p>
        </div>
        {(user.role === UserRole.ALUMNI || user.role === UserRole.ADMIN) && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 text-white px-8 py-4 rounded-[2rem] font-black flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100"
          >
            <Plus size={22} /> Post New Opening
          </button>
        )}
      </header>

      <div className="bg-white p-5 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="flex-1 flex items-center gap-3 bg-slate-50 px-6 py-4 rounded-3xl border border-slate-100 focus-within:border-indigo-200 transition-all">
          <Search size={20} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by role, company, or skills..." 
            className="bg-transparent outline-none w-full text-sm font-medium"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredJobs.map(job => (
          <div 
            key={job.id} 
            onClick={() => setSelectedJob(job)}
            className="group bg-white p-8 rounded-[3rem] border border-slate-200 hover:border-indigo-300 hover:shadow-2xl transition-all duration-500 cursor-pointer relative"
          >
            <div className="flex items-start justify-between mb-8">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-50 rounded-3xl flex items-center justify-center group-hover:bg-indigo-50 transition-colors shadow-inner">
                  <Briefcase className="text-slate-300 group-hover:text-indigo-500" size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">{job.title}</h3>
                  <p className="text-indigo-500 font-black text-xs uppercase tracking-widest">{job.company}</p>
                </div>
              </div>
              <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                job.type === 'Internship' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {job.type}
              </span>
            </div>
            
            <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-8 leading-relaxed">
              {job.description}
            </p>

            <div className="flex flex-wrap items-center justify-between pt-8 border-t border-slate-100 gap-4">
              <div className="flex gap-5">
                <div className="flex items-center gap-2 text-xs font-black text-emerald-600">
                  <DollarSign size={16} /> {job.salary}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                  <MapPin size={16} /> {job.location}
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-black text-indigo-600 group-hover:translate-x-1 transition-transform">
                Details <ArrowRight size={14} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Job Drawer */}
      {selectedJob && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedJob(null)} />
          <div className="relative w-full max-w-2xl bg-white shadow-2xl h-full animate-in slide-in-from-right duration-500 flex flex-col overflow-hidden rounded-l-[4rem]">
            <header className="px-10 py-8 border-b border-slate-100 flex items-center justify-between shrink-0">
              <button onClick={() => setSelectedJob(null)} className="flex items-center gap-3 text-slate-400 hover:text-indigo-600 font-black text-xs uppercase tracking-widest transition-all">
                <ChevronLeft size={18} /> Close
              </button>
              <div className="flex gap-3">
                <button onClick={() => handleShare(selectedJob)} className="p-3 bg-slate-50 hover:bg-indigo-50 text-slate-400 hover:text-indigo-600 rounded-2xl transition-all"><Share2 size={20} /></button>
                <button onClick={() => setSelectedJob(null)} className="p-3 bg-red-50 text-red-400 hover:bg-red-500 hover:text-white rounded-2xl transition-all"><X size={20} /></button>
              </div>
            </header>

            <div className="flex-1 overflow-y-auto px-10 py-12 space-y-12">
              <div className="flex items-start gap-8">
                <div className="w-24 h-24 bg-slate-50 rounded-[2.5rem] flex items-center justify-center text-indigo-600 shadow-inner">
                  <Building size={40} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-indigo-600 text-white text-[10px] font-black uppercase tracking-[0.15em] px-4 py-1.5 rounded-full shadow-lg shadow-indigo-200">
                      {selectedJob.type}
                    </span>
                    <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Active • {selectedJob.datePosted}</span>
                  </div>
                  <h2 className="text-4xl font-black text-slate-900 leading-tight mb-4 tracking-tight">{selectedJob.title}</h2>
                  <div className="flex flex-wrap gap-6 text-slate-500 font-bold text-sm">
                    <span className="flex items-center gap-2"><Building size={18} className="text-indigo-500" /> {selectedJob.company}</span>
                    <span className="flex items-center gap-2"><MapPin size={18} className="text-blue-500" /> {selectedJob.location}</span>
                    <span className="flex items-center gap-2 font-black text-emerald-600"><DollarSign size={18} /> {selectedJob.salary}</span>
                  </div>
                </div>
              </div>

              <div className="p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group shadow-2xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-1000"></div>
                <div>
                  <h4 className="text-xl font-black mb-2">Interested in this role?</h4>
                  <p className="text-slate-400 text-sm font-medium">Be part of the {selectedJob.company} family.</p>
                </div>
                <button 
                  onClick={() => handleApply(selectedJob.id)} 
                  disabled={selectedJob.applicants.includes(user.id)}
                  className={`px-10 py-4 rounded-2xl font-black text-sm transition-all shadow-xl flex items-center gap-3 ${
                    selectedJob.applicants.includes(user.id) 
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed' 
                    : 'bg-indigo-500 text-white hover:bg-indigo-400 hover:scale-105 active:scale-95 shadow-indigo-500/30'
                  }`}
                >
                  {selectedJob.applicants.includes(user.id) ? 'Application Sent' : 'Apply Now'} <ExternalLink size={18} />
                </button>
              </div>

              {(user.role === UserRole.ADMIN || user.id === selectedJob.postedBy) && (
                <section className="bg-white border-2 border-indigo-100 rounded-[3rem] p-10 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
                      <Users size={28} className="text-indigo-600" /> Job Applicants
                    </h3>
                    <div className="bg-indigo-50 px-4 py-2 rounded-2xl text-xs font-black text-indigo-600 uppercase tracking-widest">
                      {selectedJob.applicants.length} Total
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {selectedJob.applicants.length > 0 ? (
                      selectedJob.applicants.map(appId => {
                        const applicant = users.find(u => u.id === appId);
                        return applicant ? (
                          <div key={appId} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-indigo-200 transition-all group">
                            <div className="flex items-center gap-4">
                              <img src={applicant.avatar} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white" />
                              <div>
                                <p className="font-bold text-slate-900">{applicant.name}</p>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{applicant.major || applicant.jobTitle || 'Member'}</p>
                              </div>
                            </div>
                            <button 
                              onClick={() => startChatWithApplicant(appId)}
                              className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-500 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all"
                            >
                              Message
                            </button>
                          </div>
                        ) : null;
                      })
                    ) : (
                      <div className="text-center py-10">
                        <p className="text-slate-400 font-bold italic text-sm">Waiting for the first applicant...</p>
                      </div>
                    )}
                  </div>
                </section>
              )}

              <section>
                <h3 className="text-2xl font-black text-slate-900 mb-6">Description</h3>
                <p className="text-slate-500 leading-relaxed text-lg font-medium whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </section>

              {selectedJob.qualifications && (
                <section>
                  <h3 className="text-2xl font-black text-slate-900 mb-6">Qualifications</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedJob.qualifications.map((q, i) => (
                      <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 items-start">
                        <CheckCircle2 size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                        <span className="text-slate-600 font-bold text-sm leading-relaxed">{q}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Post Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3.5rem] p-12 w-full max-w-xl shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-3xl font-black text-slate-900 mb-2">New Opportunity</h2>
            <p className="text-slate-500 font-medium mb-10">Help fellow members grow by posting an opening.</p>
            <form onSubmit={handlePostJob} className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-black text-slate-400 ml-1 uppercase">Job Title</label>
                <input name="title" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold focus:border-indigo-400 transition-all" placeholder="Frontend Engineer" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 ml-1 uppercase">Company</label>
                <input name="company" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold focus:border-indigo-400 transition-all" placeholder="Acme Corp" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 ml-1 uppercase">Location</label>
                <input name="location" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold focus:border-indigo-400 transition-all" placeholder="New York, NY" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 ml-1 uppercase">Salary Range</label>
                <input name="salary" required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold focus:border-indigo-400 transition-all" placeholder="$80k - $120k" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-400 ml-1 uppercase">Job Type</label>
                <select name="type" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold">
                  <option value="Full-time">Full-time</option>
                  <option value="Internship">Internship</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-black text-slate-400 ml-1 uppercase">Description</label>
                <textarea name="description" required rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 outline-none font-bold resize-none"></textarea>
              </div>
              <div className="col-span-2 flex gap-4 pt-6">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-4 font-black text-slate-500 hover:bg-slate-100 rounded-2xl transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all">Post Now</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobBoard;
