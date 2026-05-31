
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { Sparkles, ArrowRight, User as UserIcon, Lock, Mail, ChevronLeft, ShieldCheck } from 'lucide-react';

interface LoginProps {
  onLogin: (user: User) => void;
  onRegister: (user: User) => void;
  users: User[];
}

const Login: React.FC<LoginProps> = ({ onLogin, onRegister, users }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isRegistering) {
      if (users.some(u => u.email === email)) {
        setError('This email is already registered.');
        return;
      }
      const newUser: User = {
        id: 'u' + Math.random().toString(36).substr(2, 9),
        name,
        email,
        password,
        role,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`,
        bio: `New ${role.toLowerCase()} member.`
      };
      onRegister(newUser);
      onLogin(newUser);
    } else {
      const found = users.find(u => u.email === email && u.password === password);
      if (found) {
        onLogin(found);
      } else {
        setError('Invalid credentials. (Hint: Use admin@college.edu / admin123)');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] -ml-48 -mb-48"></div>

      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl rounded-[48px] p-10 border border-white/10 shadow-2xl relative z-10 transition-all">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl text-white mb-6 shadow-2xl shadow-indigo-500/20 font-black text-2xl">
            AC
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">
            {isRegistering ? 'Join Us' : 'Welcome Back'}
          </h1>
          <p className="text-slate-400 font-medium">
            {isRegistering ? 'Start your networking journey' : 'Sign in to see your updates'}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          {error && (
            <div className="bg-red-500/20 border border-red-500/40 text-red-200 text-sm px-5 py-4 rounded-2xl animate-in fade-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {isRegistering && (
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Full Name</label>
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 focus-within:border-indigo-500/50 rounded-2xl px-5 py-3.5 transition-all">
                <UserIcon size={20} className="text-slate-500" />
                <input required type="text" placeholder="Jane Cooper" className="bg-transparent border-none outline-none text-white w-full text-sm font-medium" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Email Address</label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 focus-within:border-indigo-500/50 rounded-2xl px-5 py-3.5 transition-all">
              <Mail size={20} className="text-slate-500" />
              <input required type="email" placeholder="name@domain.com" className="bg-transparent border-none outline-none text-white w-full text-sm font-medium" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Password</label>
            <div className="flex items-center gap-3 bg-white/5 border border-white/10 focus-within:border-indigo-500/50 rounded-2xl px-5 py-3.5 transition-all">
              <Lock size={20} className="text-slate-500" />
              <input required type="password" placeholder="••••••••" className="bg-transparent border-none outline-none text-white w-full text-sm font-medium" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>

          {isRegistering && (
            <div className="grid grid-cols-2 gap-4 mt-6">
              <button type="button" onClick={() => setRole(UserRole.STUDENT)} className={`p-4 rounded-2xl text-sm font-bold border transition-all ${role === UserRole.STUDENT ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                Student
              </button>
              <button type="button" onClick={() => setRole(UserRole.ALUMNI)} className={`p-4 rounded-2xl text-sm font-bold border transition-all ${role === UserRole.ALUMNI ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                Alumni
              </button>
            </div>
          )}

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 rounded-2xl mt-4 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 group">
            {isRegistering ? 'Create Account' : 'Sign In'}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-10 text-center">
          <button onClick={() => { setIsRegistering(!isRegistering); setError(''); }} className="text-slate-400 hover:text-white transition-all text-sm font-bold underline underline-offset-4 decoration-slate-600 hover:decoration-indigo-500">
            {isRegistering ? 'Already a member? Sign In' : "New here? Create your account"}
          </button>
        </div>

        <div className="mt-12 flex items-center justify-center gap-2 text-[10px] font-black uppercase text-slate-500 tracking-widest">
          <ShieldCheck size={12} className="text-indigo-500" /> Secure Connection Active
        </div>
      </div>
    </div>
  );
};

export default Login;
