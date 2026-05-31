
import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Message, UserRole } from '../types';
import { Search, Send, Phone, Video, Info, User as UserIcon, MessageSquare, ShieldCheck } from 'lucide-react';

interface MessagesProps {
  user: User;
  globalUsers: User[];
  messages: Message[];
  onSendMessage: (content: string, receiverId: string) => void;
}

const Messages: React.FC<MessagesProps> = ({ user, globalUsers, messages, onSendMessage }) => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const contactIdFromUrl = searchParams.get('contactId');

  const contacts = globalUsers.filter(u => u.id !== user.id);
  const [activeChat, setActiveChat] = useState<User>(
    contacts.find(c => c.id === contactIdFromUrl) || contacts[0] || user
  );
  const [msgInput, setMsgInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contactIdFromUrl) {
      const contact = contacts.find(c => c.id === contactIdFromUrl);
      if (contact) setActiveChat(contact);
    }
  }, [contactIdFromUrl, contacts]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, activeChat]);

  const activeMessages = messages.filter(m => 
    (m.senderId === user.id && m.receiverId === activeChat.id) ||
    (m.senderId === activeChat.id && m.receiverId === user.id)
  );

  const handleSend = () => {
    if (!msgInput.trim()) return;
    onSendMessage(msgInput, activeChat.id);
    setMsgInput('');
  };

  const getLatestMessage = (contactId: string) => {
    const chatMsgs = messages.filter(m => 
      (m.senderId === user.id && m.receiverId === contactId) ||
      (m.senderId === contactId && m.receiverId === user.id)
    );
    return chatMsgs.length > 0 ? chatMsgs[chatMsgs.length - 1].content : "No messages yet...";
  };

  return (
    <div className="h-[calc(100vh-160px)] bg-white rounded-[3rem] border border-slate-200 overflow-hidden flex shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-100 flex flex-col shrink-0">
        <div className="p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-6">Inboxes</h2>
          <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl text-sm border border-slate-100 focus-within:border-indigo-300 transition-all group">
            <Search size={18} className="text-slate-400 group-focus-within:text-indigo-500" />
            <input type="text" placeholder="Search contacts..." className="bg-transparent outline-none w-full font-bold" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {contacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => setActiveChat(contact)}
              className={`w-full p-6 flex gap-4 transition-all relative ${activeChat.id === contact.id ? 'bg-indigo-50/50' : 'hover:bg-slate-50'}`}
            >
              {activeChat.id === contact.id && (
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-indigo-600 rounded-r-full" />
              )}
              <div className="relative">
                 <img src={contact.avatar} className="w-14 h-14 rounded-[1.5rem] object-cover shrink-0 ring-2 ring-white shadow-sm" alt="" />
                 <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 text-left min-w-0 py-1">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className={`font-black text-sm truncate ${activeChat.id === contact.id ? 'text-indigo-900' : 'text-slate-800'}`}>
                    {contact.name}
                  </h3>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">10:30A</span>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-xs text-slate-500 truncate font-medium flex-1">{getLatestMessage(contact.id)}</p>
                  {user.role === UserRole.ADMIN && contact.role === UserRole.STUDENT && (
                    <span className="bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded text-[8px] font-black uppercase">Inquiry</span>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/20">
        <header className="h-24 bg-white border-b border-slate-100 flex items-center justify-between px-10">
          <div className="flex items-center gap-5">
            <div className="relative">
               <img src={activeChat.avatar} className="w-12 h-12 rounded-[1.25rem] object-cover ring-2 ring-indigo-50" alt="" />
               {activeChat.role === UserRole.ADMIN && (
                 <div className="absolute -top-1 -right-1 bg-indigo-600 text-white p-1 rounded-full shadow-lg">
                   <ShieldCheck size={10} />
                 </div>
               )}
            </div>
            <div>
              <h3 className="font-black text-slate-900 text-lg leading-tight">{activeChat.name}</h3>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{activeChat.role} • Active Now</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"><Phone size={22} /></button>
              <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-2xl transition-all"><Video size={22} /></button>
            </div>
            <div className="w-px h-8 bg-slate-100 mx-2"></div>
            <button className="w-12 h-12 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all"><Info size={22} /></button>
          </div>
        </header>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 custom-scrollbar">
          {activeMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-40">
               <div className="p-8 bg-white rounded-full border-4 border-dashed border-slate-200">
                  <MessageSquare size={64} className="text-slate-200" />
               </div>
               <p className="text-slate-400 font-black uppercase tracking-widest text-xs">No conversation history yet</p>
               <p className="text-slate-300 text-sm max-w-[240px]">Be the first to say hello to {activeChat.name.split(' ')[0]}!</p>
            </div>
          ) : (
            activeMessages.map(m => {
              const isMe = m.senderId === user.id;
              return (
                <div key={m.id} className={`flex gap-5 max-w-[70%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                  <img src={isMe ? user.avatar : activeChat.avatar} className="w-10 h-10 rounded-2xl object-cover shrink-0 ring-2 ring-white shadow-sm" alt="" />
                  <div className={`space-y-2 ${isMe ? 'items-end' : 'items-start'}`}>
                    <div className={`p-5 rounded-[2rem] shadow-sm relative ${isMe ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'}`}>
                      <p className="text-sm font-medium leading-relaxed">{m.content}</p>
                    </div>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest px-1">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="p-8 bg-white border-t border-slate-100">
          <div className="flex items-center gap-4 bg-slate-50 p-3 pl-8 rounded-[2rem] border border-slate-100 focus-within:border-indigo-300 transition-all shadow-inner">
            <input 
              type="text" 
              placeholder={activeChat.role === UserRole.ADMIN ? "Message the Admin Team..." : `Reply to ${activeChat.name.split(' ')[0]}...`} 
              className="bg-transparent outline-none flex-1 text-sm font-bold placeholder-slate-300"
              value={msgInput}
              onChange={(e) => setMsgInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={handleSend}
              className="bg-indigo-600 text-white p-4 rounded-3xl hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-indigo-100"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
