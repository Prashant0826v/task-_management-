import { useState } from 'react';
import { Users, MessageSquare, TrendingUp, CheckCircle2, Clock, Plus, Trash2, Send, X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function Team() {
  const [members, setMembers] = useState([
    { id: 1, name: 'Sarah Chen', role: 'Senior Designer', avatar: 'SC', tasks: 12, completed: 8, status: 'online' },
    { id: 2, name: 'Mike Johnson', role: 'Backend Engineer', avatar: 'MJ', tasks: 15, completed: 11, status: 'online' },
    { id: 3, name: 'Emma Davis', role: 'Frontend Developer', avatar: 'ED', tasks: 10, completed: 7, status: 'away' },
    { id: 4, name: 'Chris Lee', role: 'DevOps Engineer', avatar: 'CL', tasks: 8, completed: 6, status: 'online' },
    { id: 5, name: 'John Doe', role: 'Product Manager', avatar: 'JD', tasks: 14, completed: 10, status: 'offline' },
  ]);

  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: 'Sarah Chen', message: 'Design mockups are ready for review', time: '2m ago' },
    { id: 2, user: 'Mike Johnson', message: 'API deployment successful', time: '15m ago' },
    { id: 3, user: 'Emma Davis', message: 'Can someone review my PR?', time: '1h ago' },
  ]);

  const [newMsg, setNewMsg] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [newMember, setNewMember] = useState({ name: '', role: '', status: 'online' });

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim()) return;
    const msg = {
      id: Date.now(),
      user: 'You',
      message: newMsg,
      time: 'Just now'
    };
    setChatMessages([...chatMessages, msg]);
    setNewMsg('');
  };

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const avatar = newMember.name.split(' ').map(n => n[0]).join('').toUpperCase();
    setMembers([...members, { 
      id: Date.now(), 
      ...newMember, 
      avatar, 
      tasks: 0, 
      completed: 0 
    }]);
    setShowModal(false);
    setNewMember({ name: '', role: '', status: 'online' });
  };

  const removeMember = (id: number) => {
    if (confirm('Are you sure you want to remove this member?')) {
      setMembers(members.filter(m => m.id !== id));
    }
  };

  const workloadData = members.map(m => ({
    name: m.avatar,
    tasks: m.tasks
  }));

  const activities = [
    { user: 'Sarah Chen', action: 'completed', item: 'Homepage redesign', time: '5 minutes ago' },
    { user: 'Mike Johnson', action: 'commented on', item: 'API Integration task', time: '12 minutes ago' },
    { user: 'Emma Davis', action: 'created', item: 'Dark mode implementation', time: '1 hour ago' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500 shadow-green-500/50';
      case 'away': return 'bg-yellow-500 shadow-yellow-500/50';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-3xl max-w-md w-full shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
              <h2 className="text-xl font-bold">Inivte Team Member</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl transition-all shadow-sm">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddMember} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={newMember.name}
                  onChange={e => setNewMember({...newMember, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Role / Position</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Lead Designer"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  value={newMember.role}
                  onChange={e => setNewMember({...newMember, role: e.target.value})}
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20"
                >
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Team Workspace</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Real-time collaboration across your organization</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 font-bold text-sm"
        >
          <Plus size={18} />
          Invite Member
        </button>
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Active Members</h3>
            <div className="space-y-4">
              {members.map((member) => (
                <div key={member.name} className="flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-2xl border border-transparent hover:border-gray-100 dark:hover:border-gray-700 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {member.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(member.status)} border-4 border-white dark:border-gray-900 rounded-full shadow-lg`}></div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-gray-100">{member.name}</p>
                      <p className="text-xs text-indigo-600 dark:text-indigo-400 font-bold uppercase tracking-widest">{member.role}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{member.tasks} Active</p>
                      <p className="text-xs text-gray-400">{member.completed} Completed</p>
                    </div>
                    <div className="w-24">
                      <div className="flex items-center justify-between text-xs font-bold mb-1.5">
                        <span className="text-indigo-600">Progress</span>
                        <span>{member.tasks > 0 ? Math.round((member.completed / member.tasks) * 100) : 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 shadow-inner overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(79,70,229,0.5)]"
                          style={{ width: `${member.tasks > 0 ? (member.completed / member.tasks) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeMember(member.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-8">Resources Allocation</h3>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="tasks" fill="url(#colorBar)" radius={[10, 10, 0, 0]} barSize={50}>
                  <defs>
                    <linearGradient id="colorBar" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    </linearGradient>
                  </defs>
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm flex flex-col h-[600px]">
            <div className="p-6 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-200 dark:border-gray-800 flex items-center gap-3">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm">
                <MessageSquare className="text-indigo-600" size={20} />
              </div>
              <h3 className="font-bold">Team Chat</h3>
              <div className="ml-auto w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]"></div>
            </div>
            
            <div className="flex-1 p-6 space-y-6 overflow-y-auto scrollbar-hide">
              {chatMessages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.user === 'You' ? 'flex-row-reverse' : ''} animate-in slide-in-from-bottom-2`}>
                  <div className={`w-9 h-9 rounded-2xl flex-shrink-0 flex items-center justify-center text-white font-bold text-xs shadow-md ${
                    msg.user === 'You' ? 'bg-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                  }`}>
                    {msg.user === 'You' ? 'U' : msg.user.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className={`flex-1 max-w-[80%] ${msg.user === 'You' ? 'text-right' : ''}`}>
                    <div className={`flex items-center gap-2 mb-1 justify-end ${msg.user === 'You' ? '' : 'flex-row-reverse'}`}>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{msg.time}</span>
                      <span className="text-xs font-bold">{msg.user}</span>
                    </div>
                    <div className={`p-3 rounded-2xl text-xs inline-block shadow-sm ${
                      msg.user === 'You' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-tl-none'
                    }`}>
                      {msg.message}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-gray-50/50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-800 flex gap-2">
              <input
                type="text"
                placeholder="Message team..."
                className="flex-1 px-4 py-2.5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl text-xs font-medium focus:ring-2 focus:ring-indigo-500 outline-none transition-all shadow-inner"
                value={newMsg}
                onChange={e => setNewMsg(e.target.value)}
              />
              <button 
                type="submit"
                className="p-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
              >
                <Send size={18} />
              </button>
            </form>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <h3 className="text-xl font-bold mb-6">Engagement</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 dark:bg-green-900/10 rounded-xl">
                    <CheckCircle2 className="text-green-600" size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Sync Rate</span>
                </div>
                <span className="text-sm font-extrabold text-green-600">94%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/10 rounded-xl">
                    <Clock className="text-blue-600" size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Response</span>
                </div>
                <span className="text-sm font-extrabold text-blue-600">~12m</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 dark:bg-orange-900/10 rounded-xl">
                    <TrendingUp className="text-orange-600" size={18} />
                  </div>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Growth</span>
                </div>
                <span className="text-sm font-extrabold text-orange-600">+22%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
