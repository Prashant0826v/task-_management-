import { useState, useEffect } from 'react';
import { Filter, Calendar, User, MoreHorizontal, Plus, X, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../../lib/api';

export function Tasks() {
  const [view, setView] = useState<'table' | 'kanban' | 'list'>('table');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<any>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  
  // New Task Form State
  const [newTask, setNewTask] = useState({
    name: '',
    description: '',
    priority: 'Medium',
    status: 'To Do',
    dueDate: '',
    assignee: 'John Doe',
    tags: []
  });

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTask(newTask);
      setShowModal(false);
      setNewTask({
        name: '',
        description: '',
        priority: 'Medium',
        status: 'To Do',
        dueDate: '',
        assignee: 'John Doe',
        tags: []
      });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleToggleStatus = async (task: any) => {
    const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    try {
      await api.updateTask(task.id, { status: newStatus });
      fetchTasks();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await api.deleteTask(id);
        fetchTasks();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };

  const openEditModal = (task: any) => {
    setEditingTask({ ...task, dueDate: task.dueDate || '' });
    setShowEditModal(true);
  };

  const handleEditTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask) return;
    try {
      await api.updateTask(editingTask.id, {
        name: editingTask.name,
        description: editingTask.description,
        priority: editingTask.priority,
        status: editingTask.status,
        dueDate: editingTask.dueDate,
        assignee: editingTask.assignee,
      });
      setShowEditModal(false);
      setEditingTask(null);
      fetchTasks();
    } catch (error) {
      console.error('Error editing task:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/10 dark:border-red-900';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-900';
      case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900';
      case 'Low': return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900';
      case 'In Progress': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900';
      case 'Review': return 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/10 dark:border-purple-900';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
    }
  };

  const filteredTasks = tasks.filter(t => filter === 'All' || t.status === filter);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Create New Task</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Task Name</label>
                <input required type="text" placeholder="e.g. Design Logo"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newTask.name} onChange={e => setNewTask({...newTask, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                  placeholder="What needs to be done?" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Priority</label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Due Date</label>
                  <input type="date" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {showEditModal && editingTask && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Edit Task</h2>
              <button onClick={() => { setShowEditModal(false); setEditingTask(null); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Task Name</label>
                <input required type="text" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={editingTask.name} onChange={e => setEditingTask({...editingTask, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                  value={editingTask.description || ''} onChange={e => setEditingTask({...editingTask, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Priority</label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={editingTask.priority} onChange={e => setEditingTask({...editingTask, priority: e.target.value})}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Status</label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={editingTask.status} onChange={e => setEditingTask({...editingTask, status: e.target.value})}>
                    <option>To Do</option><option>In Progress</option><option>Review</option><option>Completed</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Due Date</label>
                  <input type="date" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={editingTask.dueDate} onChange={e => setEditingTask({...editingTask, dueDate: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Assignee</label>
                  <input type="text" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={editingTask.assignee || ''} onChange={e => setEditingTask({...editingTask, assignee: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => { setShowEditModal(false); setEditingTask(null); }} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1>My Tasks</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage and track all your tasks</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">New Task</span>
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-950 p-1 rounded-lg">
          {(['table', 'kanban', 'list'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-1.5 rounded-md text-sm transition-all capitalize ${
                view === v ? 'bg-white dark:bg-gray-800 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              {v}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-sm outline-none appearance-none cursor-pointer"
            >
              <option>All</option>
              <option>To Do</option>
              <option>In Progress</option>
              <option>Review</option>
              <option>Completed</option>
            </select>
            <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Main Content Views */}
      {view === 'table' && (
        <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800">
              <tr>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-500 font-bold">Task</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-500 font-bold">Priority</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-500 font-bold">Status</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-500 font-bold">Due Date</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-500 font-bold">Assignee</th>
                <th className="px-6 py-4 text-left text-xs uppercase tracking-wider text-gray-500 font-bold"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filteredTasks.map((task) => (
                <tr key={task.id} className="group hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => handleToggleStatus(task)}
                        className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                          task.status === 'Completed' 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 dark:border-gray-600 hover:border-indigo-500'
                        }`}
                      >
                        {task.status === 'Completed' && <CheckCircle2 size={12} />}
                      </button>
                      <div>
                        <p className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>{task.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{task.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-[10px] rounded border font-bold uppercase ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-[10px] rounded border font-bold uppercase ${getStatusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                      <Calendar size={14} />
                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-[10px] font-bold">
                        {task.assignee ? task.assignee.split(' ').map((n: any) => n[0]).join('') : '??'}
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400">{task.assignee}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleDeleteTask(task.id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                      <button 
                        onClick={() => openEditModal(task)}
                        className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/10 rounded transition-colors"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTasks.length === 0 && (
            <div className="p-20 text-center text-gray-500">
              <p>No tasks found for this filter.</p>
            </div>
          )}
        </div>
      )}

      {view === 'kanban' && (
        <div className="grid grid-cols-4 gap-4">
          {['To Do', 'In Progress', 'Review', 'Completed'].map((status) => (
            <div key={status} className="bg-gray-50/50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-200/50 dark:border-gray-800/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500">{status}</h3>
                <span className="w-6 h-6 flex items-center justify-center bg-white dark:bg-gray-800 rounded-full text-[10px] font-bold border border-gray-200 dark:border-gray-700">
                  {tasks.filter(t => t.status === status).length}
                </span>
              </div>
              <div className="space-y-3">
                {tasks.filter(t => t.status === status).map((task) => (
                  <div 
                    key={task.id} 
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-indigo-500/30 transition-all cursor-pointer group"
                  >
                    <div className="flex items-start justify-between mb-2">
                       <p className="text-sm font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{task.name}</p>
                       <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteTask(task.id); }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                       >
                         <Trash2 size={14} />
                       </button>
                    </div>
                    <p className="text-xs text-gray-500 mb-4 line-clamp-2">{task.description}</p>
                    <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50 dark:border-gray-700/50">
                      <span className={`inline-flex px-2 py-0.5 text-[9px] rounded font-bold uppercase ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                        <Calendar size={12} />
                        {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {view === 'list' && (
        <div className="space-y-3">
          {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white dark:bg-gray-900 px-6 py-4 rounded-xl border border-gray-200 dark:border-gray-800 hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <button 
                    onClick={() => handleToggleStatus(task)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      task.status === 'Completed' 
                        ? 'bg-green-500 border-green-500 text-white' 
                        : 'border-gray-300 dark:border-gray-700 hover:border-indigo-500'
                    }`}
                  >
                    {task.status === 'Completed' && <CheckCircle2 size={14} />}
                  </button>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className={`text-base font-bold ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>{task.name}</h4>
                      <span className={`inline-flex px-2 py-0.5 text-[9px] rounded font-bold uppercase ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-6">
                      <p className="text-xs text-gray-500 line-clamp-1">{task.description}</p>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                          <Calendar size={14} />
                          {task.dueDate ? new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                        </div>
                        <div className="flex items-center gap-2">
                          <User size={14} className="text-gray-400" />
                          <span className="text-[10px] text-gray-500 font-medium">{task.assignee}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <button 
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


