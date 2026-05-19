import { useState } from 'react';
import { Mail, Star, Trash2, Archive, Tag, Search, CheckCircle2 } from 'lucide-react';

export function Inbox() {
  const [messages, setMessages] = useState([
    { id: 1, from: 'Sarah Chen', subject: 'Design review needed', preview: 'Hey, can you review the latest mockups?', time: '10 min ago', unread: true, starred: false, archived: false },
    { id: 2, from: 'Mike Johnson', subject: 'API deployment update', preview: 'The new API version is live in production...', time: '1 hour ago', unread: true, starred: true, archived: false },
    { id: 3, from: 'Emma Davis', subject: 'Frontend PR ready', preview: 'I\'ve completed the dark mode implementation...', time: '2 hours ago', unread: false, starred: false, archived: false },
    { id: 4, from: 'TaskFlow', subject: 'Weekly digest', preview: 'Your productivity summary for this week...', time: '1 day ago', unread: false, starred: false, archived: false },
    { id: 5, from: 'Chris Lee', subject: 'Database migration', preview: 'Starting the migration process tomorrow...', time: '1 day ago', unread: false, starred: true, archived: false },
    { id: 6, from: 'John Doe', subject: 'Roadmap planning', preview: 'Let\'s schedule a meeting to discuss Q2 goals...', time: '2 days ago', unread: false, starred: false, archived: false },
  ]);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleStar = (id: number) => {
    setMessages(messages.map(m => m.id === id ? { ...m, starred: !m.starred } : m));
  };

  const deleteMessage = (id: number) => {
    setMessages(messages.filter(m => m.id !== id));
  };

  const archiveMessage = (id: number) => {
    setMessages(messages.map(m => m.id === id ? { ...m, archived: true } : m));
  };

  const bulkDelete = () => {
    setMessages(messages.filter(m => !selectedIds.includes(m.id)));
    setSelectedIds([]);
  };

  const bulkArchive = () => {
    setMessages(messages.map(m => selectedIds.includes(m.id) ? { ...m, archived: true } : m));
    setSelectedIds([]);
  };

  const filteredMessages = messages.filter(m => {
    if (m.archived && filter !== 'Archived') return false;
    if (!m.archived && filter === 'Archived') return true;
    if (filter === 'Unread' && !m.unread) return false;
    if (filter === 'Starred' && !m.starred) return false;
    
    const searchMatch = m.from.toLowerCase().includes(search.toLowerCase()) || 
                       m.subject.toLowerCase().includes(search.toLowerCase());
    return searchMatch;
  });

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inbox</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage your team communication and notifications</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search messages..."
              className="pl-10 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none w-64 shadow-sm"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold text-sm shadow-lg shadow-indigo-500/20 active:scale-95">
            Compose
          </button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'All Messages', value: messages.filter(m => !m.archived).length, color: 'bg-indigo-600', filterVal: 'All' },
          { label: 'Unread', value: messages.filter(m => m.unread && !m.archived).length, color: 'bg-orange-500', filterVal: 'Unread' },
          { label: 'Starred', value: messages.filter(m => m.starred && !m.archived).length, color: 'bg-yellow-500', filterVal: 'Starred' },
          { label: 'Archived', value: messages.filter(m => m.archived).length, color: 'bg-gray-500', filterVal: 'Archived' },
        ].map((stat, i) => (
          <button 
            key={i} 
            onClick={() => setFilter(stat.filterVal)}
            className={`text-left bg-white dark:bg-gray-900 p-6 rounded-2xl border transition-all hover:shadow-md ${
              filter === stat.filterVal ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-gray-200 dark:border-gray-800'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-xl shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}>
                <Mail className="text-white" size={24} />
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
        <div className="p-4 bg-gray-50/50 dark:bg-gray-800/20 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-gray-300" 
              checked={selectedIds.length === filteredMessages.length && filteredMessages.length > 0}
              onChange={(e) => setSelectedIds(e.target.checked ? filteredMessages.map(m => m.id) : [])}
            />
            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 transition-all">
                <span className="text-sm font-bold text-indigo-600 px-2">{selectedIds.length} Selected</span>
                <button onClick={bulkArchive} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                  <Archive size={18} className="text-gray-600 dark:text-gray-400" />
                </button>
                <button onClick={bulkDelete} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-600">
                  <Trash2 size={18} className="text-red-500" />
                </button>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase mr-2 tracking-widest">Filter By:</span>
            <select 
              className="px-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl text-xs font-bold focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            >
              <option>All</option>
              <option>Unread</option>
              <option>Starred</option>
              <option>Archived</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {filteredMessages.map((message) => (
            <div
              key={message.id}
              className={`p-6 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-all cursor-pointer group flex items-start gap-4 ${
                message.unread ? 'bg-indigo-50/20 dark:bg-indigo-900/5' : ''
              }`}
            >
              <input 
                type="checkbox" 
                className="w-4 h-4 rounded border-gray-300 mt-1" 
                checked={selectedIds.includes(message.id)}
                onChange={() => toggleSelect(message.id)}
              />
              <button
                onClick={() => toggleStar(message.id)}
                className={`mt-1 transition-colors ${message.starred ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}
              >
                <Star size={18} fill={message.starred ? 'currentColor' : 'none'} />
              </button>
              <div className="flex-1 min-w-0" onClick={() => {
                setMessages(messages.map(m => m.id === message.id ? { ...m, unread: false } : m));
              }}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className={`text-sm tracking-tight ${message.unread ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-600 dark:text-gray-400 font-medium'}`}>
                      {message.from}
                    </span>
                    {message.unread && <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></div>}
                  </div>
                  <span className="text-xs font-bold text-gray-400">{message.time}</span>
                </div>
                <h4 className={`text-sm mb-1 ${message.unread ? 'font-bold text-gray-900 dark:text-gray-100' : 'text-gray-700 dark:text-gray-300'}`}>
                  {message.subject}
                </h4>
                <p className="text-xs text-gray-500 line-clamp-1">{message.preview}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => archiveMessage(message.id)}
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg shadow-sm border border-transparent hover:border-gray-200 dark:hover:border-gray-800"
                >
                  <Archive size={16} className="text-gray-500" />
                </button>
                <button 
                  onClick={() => deleteMessage(message.id)}
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg shadow-sm border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
                >
                  <Trash2 size={16} className="text-red-500" />
                </button>
              </div>
            </div>
          ))}
          {filteredMessages.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center justify-center space-y-4">
              <div className="p-6 bg-gray-50 dark:bg-gray-800/50 rounded-3xl">
                <CheckCircle2 size={48} className="text-gray-300" />
              </div>
              <p className="text-gray-500 font-bold">Your inbox is clear!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
