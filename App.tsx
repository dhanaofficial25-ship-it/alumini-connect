
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Link, Navigate, useLocation } from 'react-router-dom';
import { 
  Users as UsersIcon, 
  Briefcase, 
  Calendar, 
  MessageSquare, 
  User as UserIcon, 
  LayoutDashboard, 
  ShieldCheck, 
  LogOut,
  Bell,
  Search,
  Menu,
  X
} from 'lucide-react';
import { User, UserRole, Job, Message, Event } from './types';
import { mockUsers, mockJobs, mockEvents } from './mockData';

// Pages
import Dashboard from './pages/Dashboard';
import JobBoard from './pages/JobBoard';
import Mentorship from './pages/Mentorship';
import Events from './pages/Events';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Messages from './pages/Messages';
import Login from './pages/Login';
import SupportWidget from './components/SupportWidget';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // State for persistent data
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Initialize data
  useEffect(() => {
    const savedUsers = localStorage.getItem('ac_users');
    const savedJobs = localStorage.getItem('ac_jobs');
    const savedSession = localStorage.getItem('ac_session');
    const savedMsgs = localStorage.getItem('ac_messages');
    const savedEvents = localStorage.getItem('ac_events');

    if (savedUsers) setUsers(JSON.parse(savedUsers));
    else {
      setUsers(mockUsers);
      localStorage.setItem('ac_users', JSON.stringify(mockUsers));
    }

    if (savedJobs) setJobs(JSON.parse(savedJobs));
    else {
      setJobs(mockJobs);
      localStorage.setItem('ac_jobs', JSON.stringify(mockJobs));
    }

    if (savedEvents) setEvents(JSON.parse(savedEvents));
    else {
      setEvents(mockEvents);
      localStorage.setItem('ac_events', JSON.stringify(mockEvents));
    }

    if (savedMsgs) setMessages(JSON.parse(savedMsgs));
    else setMessages([]);

    if (savedSession) setCurrentUser(JSON.parse(savedSession));
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('ac_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('ac_session');
  };

  const handleUpdateUsers = (newUsers: User[]) => {
    setUsers(newUsers);
    localStorage.setItem('ac_users', JSON.stringify(newUsers));
    if (currentUser) {
      const updatedSelf = newUsers.find(u => u.id === currentUser.id);
      if (updatedSelf) {
        setCurrentUser(updatedSelf);
        localStorage.setItem('ac_session', JSON.stringify(updatedSelf));
      }
    }
  };

  const handleUpdateJobs = (newJobs: Job[]) => {
    setJobs(newJobs);
    localStorage.setItem('ac_jobs', JSON.stringify(newJobs));
  };

  const handleUpdateEvents = (newEvents: Event[]) => {
    setEvents(newEvents);
    localStorage.setItem('ac_events', JSON.stringify(newEvents));
  };

  const handleSendMessage = (content: string, receiverId: string) => {
    if (!currentUser) return;
    const newMessage: Message = {
      id: 'm' + Date.now(),
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: new Date().toISOString()
    };
    const updatedMsgs = [...messages, newMessage];
    setMessages(updatedMsgs);
    localStorage.setItem('ac_messages', JSON.stringify(updatedMsgs));
  };

  const handleGlobalSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = (e.currentTarget.elements[0] as HTMLInputElement).value;
    if (query) alert(`Searching for: "${query}" across users, jobs, and events...`);
  };

  if (!currentUser) {
    return <Login onLogin={handleLogin} users={users} onRegister={(u) => handleUpdateUsers([...users, u])} />;
  }

  const adminUser = users.find(u => u.role === UserRole.ADMIN) || users[0];

  return (
    <Router>
      <div className="flex h-screen bg-slate-50 overflow-hidden relative">
        <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 flex flex-col z-50 shadow-sm`}>
          <div className="p-6 flex items-center justify-between">
            <div className={`flex items-center gap-2 font-bold text-xl text-indigo-600 ${!isSidebarOpen && 'hidden'}`}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-sm">AC</div>
              <span>AlumniConnect</span>
            </div>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <nav className="flex-1 px-4 space-y-1 py-4 overflow-y-auto">
            <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" expanded={isSidebarOpen} />
            <SidebarLink to="/jobs" icon={<Briefcase size={20} />} label="Job Board" expanded={isSidebarOpen} />
            <SidebarLink to="/mentorship" icon={<UsersIcon size={20} />} label="Mentorship" expanded={isSidebarOpen} />
            <SidebarLink to="/events" icon={<Calendar size={20} />} label="Events" expanded={isSidebarOpen} />
            <SidebarLink to="/messages" icon={<MessageSquare size={20} />} label="Messages" expanded={isSidebarOpen} />
            {currentUser.role === UserRole.ADMIN && (
              <SidebarLink to="/admin" icon={<ShieldCheck size={20} />} label="Admin Panel" expanded={isSidebarOpen} />
            )}
            <SidebarLink to="/profile" icon={<UserIcon size={20} />} label="My Profile" expanded={isSidebarOpen} />
          </nav>

          <div className="p-4 border-t border-slate-100">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all font-medium"
            >
              <LogOut size={20} />
              {isSidebarOpen && <span>Logout</span>}
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 z-40">
            <form onSubmit={handleGlobalSearch} className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-xl w-96 border border-slate-100 focus-within:border-indigo-300 transition-all">
              <Search size={18} className="text-slate-400" />
              <input type="text" placeholder="Search people, jobs, news..." className="bg-transparent outline-none w-full text-sm font-medium" />
            </form>

            <div className="flex items-center gap-6">
              <div 
                className="relative cursor-pointer p-2 hover:bg-slate-50 rounded-full transition-colors"
                onClick={() => alert('No new notifications')}
              >
                <Bell size={20} className="text-slate-500" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
              </div>
              <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-900 leading-none mb-1">{currentUser.name}</p>
                  <p className="text-[10px] font-black uppercase text-indigo-500 tracking-wider leading-none">{currentUser.role}</p>
                </div>
                <img src={currentUser.avatar} alt="User" className="w-10 h-10 rounded-xl object-cover ring-2 ring-slate-100 shadow-sm" />
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8">
            <Routes>
              <Route path="/" element={<Dashboard user={currentUser} jobs={jobs} events={events} users={users} onUpdateEvents={handleUpdateEvents} />} />
              <Route path="/jobs" element={<JobBoard user={currentUser} jobs={jobs} onUpdateJobs={handleUpdateJobs} users={users} />} />
              <Route path="/mentorship" element={<Mentorship user={currentUser} globalUsers={users} onUpdateUsers={handleUpdateUsers} />} />
              <Route path="/events" element={<Events user={currentUser} events={events} onUpdateEvents={handleUpdateEvents} />} />
              <Route path="/messages" element={<Messages user={currentUser} globalUsers={users} messages={messages} onSendMessage={handleSendMessage} />} />
              <Route path="/profile" element={<Profile user={currentUser} onUpdate={(u) => handleUpdateUsers(users.map(us => us.id === u.id ? u : us))} />} />
              <Route path="/admin" element={currentUser.role === UserRole.ADMIN ? <AdminPanel users={users} onUpdateUsers={handleUpdateUsers} /> : <Navigate to="/" />} />
            </Routes>
          </div>
        </main>

        {currentUser.role !== UserRole.ADMIN && (
          <SupportWidget 
            currentUser={currentUser} 
            adminUser={adminUser} 
            messages={messages} 
            onSendMessage={handleSendMessage} 
          />
        )}
      </div>
    </Router>
  );
};

const SidebarLink: React.FC<{ to: string, icon: React.ReactNode, label: string, expanded: boolean }> = ({ to, icon, label, expanded }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link 
      to={to} 
      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100 font-bold' 
          : 'text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 font-medium'
      }`}
    >
      <span className={isActive ? 'text-white' : ''}>{icon}</span>
      {expanded && <span>{label}</span>}
    </Link>
  );
};

export default App;
