
import React, { useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  Trash2, 
  Edit, 
  Download, 
  CheckCircle, 
  X, 
  Save, 
  Search,
  UserPlus,
  Mail,
  Lock,
  User as UserIcon
} from 'lucide-react';
import { User, UserRole } from '../types';

interface AdminPanelProps {
  users: User[];
  onUpdateUsers: (users: User[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, onUpdateUsers }) => {
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = (id: string) => {
    if (confirm('Delete this user? This cannot be undone.')) {
      onUpdateUsers(users.filter(u => u.id !== id));
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      onUpdateUsers(users.map(u => u.id === editingUser.id ? editingUser : u));
      setEditingUser(null);
    }
  };

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Email', 'Role', 'Organization/Major'].join(',');
    const rows = users.map(u => [u.id, u.name, u.email, u.role, u.company || u.major || 'N/A'].join(','));
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `alumni_connect_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget as HTMLFormElement);
    const role = fd.get('role') as UserRole;
    const newUser: User = {
      id: 'u' + Date.now(),
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      password: fd.get('password') as string || 'password123',
      role: role,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${fd.get('email')}`,
      bio: `System added ${role.toLowerCase()}.`,
      company: role === UserRole.ALUMNI ? fd.get('org') as string : undefined,
      major: role === UserRole.STUDENT ? fd.get('org') as string : undefined,
    };
    onUpdateUsers([...users, newUser]);
    setIsAddingUser(false);
    alert('User added successfully!');
  };

  const filtered = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-top-4 duration-700">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Admin</h1>
          <p className="text-slate-500 font-medium">Oversee network health and manage global members.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-bold text-sm text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
          >
            <Download size={18} /> Export Reports
          </button>
          <button 
            onClick={() => setIsAddingUser(true)}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100"
          >
            <UserPlus size={18} /> Add User
          </button>
        </div>
      </header>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-3xl flex items-center justify-center shrink-0"><Users size={28} /></div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Members</p>
            <p className="text-3xl font-black text-slate-900">{users.length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-green-50 text-green-600 rounded-3xl flex items-center justify-center shrink-0"><CheckCircle size={28} /></div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Alumni Verified</p>
            <p className="text-3xl font-black text-slate-900">{users.filter(u => u.role === UserRole.ALUMNI).length}</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm flex items-center gap-6">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center shrink-0"><ShieldAlert size={28} /></div>
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Pending Requests</p>
            <p className="text-3xl font-black text-slate-900">12</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[40px] border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <h3 className="text-xl font-black text-slate-900">Member Directory</h3>
          <div className="relative w-full sm:w-72">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name/email" 
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm" 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                <th className="px-8 py-5">Profile</th>
                <th className="px-8 py-5">Role</th>
                <th className="px-8 py-5">Organization</th>
                <th className="px-8 py-5">Contact</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(user => (
                <tr key={user.id} className="hover:bg-indigo-50/20 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={user.avatar} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100" />
                      <div>
                        <p className="font-bold text-slate-900 leading-none mb-1">{user.name}</p>
                        <p className="text-[10px] font-medium text-slate-400 uppercase">ID: {user.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      user.role === UserRole.ADMIN ? 'bg-purple-100 text-purple-700' :
                      user.role === UserRole.ALUMNI ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm font-bold text-slate-600">
                    {user.company || user.major || 'Global Network'}
                  </td>
                  <td className="px-8 py-5 text-sm font-medium text-slate-500">
                    {user.email}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setEditingUser(user)} className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-300 rounded-2xl transition-all"><Edit size={18} /></button>
                      <button 
                        onClick={() => handleDelete(user.id)} 
                        disabled={user.role === UserRole.ADMIN}
                        className={`p-3 bg-white border border-slate-200 rounded-2xl transition-all ${user.role === UserRole.ADMIN ? 'opacity-20 cursor-not-allowed' : 'text-slate-400 hover:text-red-600 hover:border-red-300'}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] p-10 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-slate-900">Update Profile</h2>
              <button onClick={() => setEditingUser(null)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 ml-1 uppercase">Full Name</label>
                <input required className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none font-medium" value={editingUser.name} onChange={e => setEditingUser({...editingUser, name: e.target.value})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 ml-1 uppercase">Role</label>
                <select className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none font-medium" value={editingUser.role} onChange={e => setEditingUser({...editingUser, role: e.target.value as UserRole})}>
                  <option value={UserRole.STUDENT}>Student</option>
                  <option value={UserRole.ALUMNI}>Alumni</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 ml-1 uppercase">Company/Major</label>
                <input className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none font-medium" value={editingUser.company || editingUser.major || ''} onChange={e => editingUser.role === UserRole.ALUMNI ? setEditingUser({...editingUser, company: e.target.value}) : setEditingUser({...editingUser, major: e.target.value})} />
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setEditingUser(null)} className="flex-1 py-4 font-black text-slate-500 hover:bg-slate-50 rounded-2xl border border-slate-200">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 flex items-center justify-center gap-2">
                  <Save size={20} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {isAddingUser && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[48px] p-10 w-full max-w-lg shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black text-slate-900">Add Member</h2>
              <button onClick={() => setIsAddingUser(false)} className="p-3 hover:bg-slate-100 rounded-2xl transition-all"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Full Name</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5">
                  <UserIcon size={20} className="text-slate-400" />
                  <input name="name" required placeholder="John Doe" className="bg-transparent border-none outline-none w-full text-sm font-bold" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Email Address</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5">
                  <Mail size={20} className="text-slate-400" />
                  <input name="email" required type="email" placeholder="john@example.com" className="bg-transparent border-none outline-none w-full text-sm font-bold" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Role</label>
                  <select name="role" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none font-bold text-sm">
                    <option value={UserRole.STUDENT}>Student</option>
                    <option value={UserRole.ALUMNI}>Alumni</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Company/Major</label>
                  <input name="org" placeholder="Computer Science" className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 outline-none font-bold text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-black text-slate-500 ml-1 uppercase tracking-widest">Initial Password</label>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5">
                  <Lock size={20} className="text-slate-400" />
                  <input name="password" placeholder="password123" className="bg-transparent border-none outline-none w-full text-sm font-bold" />
                </div>
              </div>
              <div className="flex gap-4 pt-6">
                <button type="button" onClick={() => setIsAddingUser(false)} className="flex-1 py-4 font-black text-slate-500 hover:bg-slate-50 rounded-2xl border border-slate-200 transition-all">Cancel</button>
                <button type="submit" className="flex-1 py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                  <CheckCircle size={20} /> Confirm Addition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
