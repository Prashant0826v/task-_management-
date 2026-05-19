import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Bell, Sun, Moon, ChevronDown, X, Check, Clock, AlertCircle } from 'lucide-react';
import { api } from '../../lib/api';

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
  onNavigate: (page: string) => void;
}

export function Navbar({ isDark, onToggleTheme, onNavigate }: NavbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showWorkspace, setShowWorkspace] = useState(false);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [activeWorkspace, setActiveWorkspace] = useState('My Workspace');
  const notifRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  const [newTask, setNewTask] = useState({
    name: '', description: '', priority: 'Medium', status: 'To Do', dueDate: '', assignee: 'John Doe', tags: []
  });

  const [notifications, setNotifications] = useState([
    { id: 1, text: 'New task assigned: Fix auth bug', time: '2m ago', read: false },
    { id: 2, text: 'Emma commented on your task', time: '15m ago', read: false },
    { id: 3, text: 'Project deadline approaching', time: '1h ago', read: true },
    { id: 4, text: 'Weekly report is ready', time: '3h ago', read: true },
  ]);

  const workspaces = ['My Workspace', 'Team Alpha', 'Marketing', 'Engineering'];

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
      if (wsRef.current && !wsRef.current.contains(e.target as Node)) setShowWorkspace(false);
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) { setShowSearch(false); setSearchResults([]); }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 2) { setSearchResults([]); setShowSearch(false); return; }
    try {
      const tasks = await api.getTasks();
      const filtered = tasks.filter((t: any) =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(query.toLowerCase())) ||
        (t.assignee && t.assignee.toLowerCase().includes(query.toLowerCase()))
      );
      setSearchResults(filtered.slice(0, 5));
      setShowSearch(true);
    } catch { setSearchResults([]); }
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTask(newTask);
      setShowNewTaskModal(false);
      setNewTask({ name: '', description: '', priority: 'Medium', status: 'To Do', dueDate: '', assignee: 'John Doe', tags: [] });
      onNavigate('tasks');
    } catch (err) { console.error('Error creating task:', err); }
  };

  const markAllRead = () => setNotifications(notifications.map(n => ({ ...n, read: true })));
  const dismissNotification = (id: number) => setNotifications(notifications.filter(n => n.id !== id));
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="h-16 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1a1a] flex items-center justify-between px-6 fixed top-0 right-0 left-64 z-10">
        <div className="flex items-center gap-4 flex-1 max-w-2xl" ref={searchRef}>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search tasks, projects, or team members..."
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => { if (searchResults.length > 0) setShowSearch(true); }}
            />
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-400 uppercase tracking-wider">
                  Search Results ({searchResults.length})
                </div>
                {searchResults.map((task) => (
                  <button
                    key={task.id}
                    onClick={() => { setShowSearch(false); setSearchQuery(''); onNavigate('tasks'); }}
                    className="w-full px-4 py-3 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left border-t border-gray-100 dark:border-gray-800"
                  >
                    <div className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{task.name}</p>
                      <p className="text-xs text-gray-400 truncate">{task.assignee} · {task.status}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
            {showSearch && searchQuery.length >= 2 && searchResults.length === 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl p-6 text-center z-50">
                <p className="text-sm text-gray-500">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewTaskModal(true)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Plus size={18} />
            <span className="text-sm">New Task</span>
          </button>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowWorkspace(false); }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors relative"
            >
              <Bell size={20} className="text-gray-700 dark:text-gray-300" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-red-500 rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-3 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
                  <h4 className="font-bold text-sm">Notifications</h4>
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">
                      Mark all read
                    </button>
                  )}
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <p className="text-center text-sm text-gray-400 py-8">No notifications</p>
                  ) : notifications.map((n) => (
                    <div key={n.id} className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800 ${!n.read ? 'bg-indigo-50/50 dark:bg-indigo-900/5' : ''}`}>
                      <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${!n.read ? 'bg-indigo-500' : 'bg-gray-300 dark:bg-gray-600'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm leading-snug">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                      </div>
                      <button onClick={() => dismissNotification(n.id)} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors flex-shrink-0">
                        <X size={14} className="text-gray-400" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
          >
            {isDark ? <Sun size={20} className="text-gray-300" /> : <Moon size={20} className="text-gray-700" />}
          </button>

          {/* Workspace Dropdown */}
          <div className="relative" ref={wsRef}>
            <div
              onClick={() => { setShowWorkspace(!showWorkspace); setShowNotifications(false); }}
              className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md cursor-pointer transition-colors"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300">{activeWorkspace}</span>
              <ChevronDown size={16} className={`text-gray-500 transition-transform ${showWorkspace ? 'rotate-180' : ''}`} />
            </div>
            {showWorkspace && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-2xl z-50 overflow-hidden">
                <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800/50 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100 dark:border-gray-800">
                  Workspaces
                </div>
                {workspaces.map((ws) => (
                  <button
                    key={ws}
                    onClick={() => { setActiveWorkspace(ws); setShowWorkspace(false); }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left text-sm"
                  >
                    {activeWorkspace === ws && <Check size={14} className="text-indigo-600" />}
                    <span className={activeWorkspace === ws ? 'font-bold text-indigo-600' : 'text-gray-700 dark:text-gray-300 ml-[22px]'}>{ws}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Create New Task</h2>
              <button onClick={() => setShowNewTaskModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Task Name</label>
                <input required type="text" placeholder="e.g. Design Logo"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                  placeholder="What needs to be done?"
                  value={newTask.description} onChange={e => setNewTask({ ...newTask, description: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Priority</label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newTask.priority} onChange={e => setNewTask({ ...newTask, priority: e.target.value })}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Due Date</label>
                  <input type="date" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newTask.dueDate} onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })} />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowNewTaskModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
