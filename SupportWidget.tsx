
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, User as UserIcon, ShieldCheck } from 'lucide-react';
import { User, Message } from '../types';

interface SupportWidgetProps {
  currentUser: User;
  adminUser: User;
  messages: Message[];
  onSendMessage: (content: string, receiverId: string) => void;
}

const SupportWidget: React.FC<SupportWidgetProps> = ({ currentUser, adminUser, messages, onSendMessage }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeMessages = messages.filter(m => 
    (m.senderId === currentUser.id && m.receiverId === adminUser.id) ||
    (m.senderId === adminUser.id && m.receiverId === currentUser.id)
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;
    onSendMessage(input, adminUser.id);
    setInput('');
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] font-sans">
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-16 h-16 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group"
        >
          <MessageSquare size={28} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[10px] font-black">
            1
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-96 h-[500px] bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 duration-500">
          <header className="bg-indigo-600 p-6 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-md border border-white/20">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h3 className="font-black text-sm">System Support</h3>
                <p className="text-[10px] text-indigo-100 font-bold uppercase tracking-widest">Admin Team • Online</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-xl transition-all"
            >
              <X size={20} />
            </button>
          </header>

          <div 
            ref={scrollRef}
            className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 custom-scrollbar"
          >
            {/* System Intro Message */}
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                <ShieldCheck size={16} />
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                <p className="text-xs text-slate-600 font-medium">Hello {currentUser.name}! How can we help you today? Send a message and an admin will reply shortly.</p>
              </div>
            </div>

            {activeMessages.map(m => {
              const isMe = m.senderId === currentUser.id;
              return (
                <div key={m.id} className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                  <div className={`p-3 rounded-2xl text-xs font-medium shadow-sm ${
                    isMe 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
                  }`}>
                    {m.content}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2 bg-slate-50 p-2 pl-4 rounded-2xl border border-slate-100 focus-within:border-indigo-300 transition-all">
              <input 
                type="text" 
                placeholder="Type your query..." 
                className="bg-transparent outline-none flex-1 text-xs font-bold"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-indigo-700 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportWidget;
