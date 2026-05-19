import { useState, useEffect } from 'react';
import { Bell, Clock, Repeat, X, Plus, AlertCircle, Calendar as CalendarIcon, Check } from 'lucide-react';
import { api } from '../../lib/api';

export function Reminders() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState<string | null>(null);
  const [newReminder, setNewReminder] = useState({ name: '', description: '', priority: 'Medium', dueDate: '', assignee: 'John Doe' });

  // Smart notification config states
  const [deadlineSyncEnabled, setDeadlineSyncEnabled] = useState(false);
  const [recurrenceEnabled, setRecurrenceEnabled] = useState(false);
  const [digestEnabled, setDigestEnabled] = useState(false);

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks for reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createTask({ ...newReminder, status: 'To Do', tags: [] });
      setShowModal(false);
      setNewReminder({ name: '', description: '', priority: 'Medium', dueDate: '', assignee: 'John Doe' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating reminder:', error);
    }
  };

  const handleDismissTask = async (taskId: number) => {
    try {
      await api.updateTask(taskId, { status: 'Completed' });
      fetchTasks();
    } catch (error) {
      console.error('Error dismissing task:', error);
    }
  };

  // Filter tasks
  const now = new Date();
  const missedTasks = tasks.filter(t => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) < now);
  const upcomingTasks = tasks.filter(t => t.status !== 'Completed' && t.dueDate && new Date(t.dueDate) >= now);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/10 dark:text-red-400';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:text-orange-400';
      case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:text-blue-400';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      {/* Add Alert Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Add New Alert</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddReminder} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Alert Title</label>
                <input required type="text" placeholder="e.g. Review design mockups"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newReminder.name} onChange={e => setNewReminder({...newReminder, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                  placeholder="Additional notes..." value={newReminder.description} onChange={e => setNewReminder({...newReminder, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Priority</label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newReminder.priority} onChange={e => setNewReminder({...newReminder, priority: e.target.value})}>
                    <option>Low</option><option>Medium</option><option>High</option><option>Urgent</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Due Date</label>
                  <input required type="date" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newReminder.dueDate} onChange={e => setNewReminder({...newReminder, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">Add Alert</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Smart Notification Config Modal */}
      {showConfigModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-md w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">
                {showConfigModal === 'deadline' && 'Deadline Sync Settings'}
                {showConfigModal === 'recurrence' && 'Recurrence Settings'}
                {showConfigModal === 'digest' && 'Activity Digest Settings'}
              </h2>
              <button onClick={() => setShowConfigModal(null)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {showConfigModal === 'deadline' && (
                <>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                    <div>
                      <p className="text-sm font-bold">Enable browser notifications</p>
                      <p className="text-xs text-gray-500 mt-1">Get notified 1 hour before deadlines</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={deadlineSyncEnabled} onChange={() => setDeadlineSyncEnabled(!deadlineSyncEnabled)} />
                      <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    {deadlineSyncEnabled ? '✓ Deadline sync is active' : 'Enable to receive automatic deadline alerts'}
                  </p>
                </>
              )}
              {showConfigModal === 'recurrence' && (
                <>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                    <div>
                      <p className="text-sm font-bold">Enable recurring reminders</p>
                      <p className="text-xs text-gray-500 mt-1">Auto-create tasks on a schedule</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={recurrenceEnabled} onChange={() => setRecurrenceEnabled(!recurrenceEnabled)} />
                      <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    {recurrenceEnabled ? '✓ Recurrence is active' : 'Enable to set up recurring task patterns'}
                  </p>
                </>
              )}
              {showConfigModal === 'digest' && (
                <>
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 rounded-xl">
                    <div>
                      <p className="text-sm font-bold">Enable daily digest</p>
                      <p className="text-xs text-gray-500 mt-1">Receive a morning summary email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" checked={digestEnabled} onChange={() => setDigestEnabled(!digestEnabled)} />
                      <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                  <p className="text-xs text-gray-400 text-center">
                    {digestEnabled ? '✓ Daily digest is active' : 'Enable to receive AI-powered activity summaries'}
                  </p>
                </>
              )}
              <div className="pt-2">
                <button onClick={() => setShowConfigModal(null)} className="w-full px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20 font-bold text-sm">
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reminders</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Smart alerts for your tasks and deadlines</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95">
          <Plus size={18} />
          <span className="text-sm font-bold uppercase tracking-wide">Add Alert</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Missed / Overdue Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <AlertCircle className="text-red-500" size={20} />
            <h3 className="text-lg font-bold">Missed Items</h3>
            <span className="ml-auto bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs px-2 py-0.5 rounded-full font-bold">
              {missedTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {missedTasks.map((task) => (
              <div key={task.id} className="p-4 bg-white dark:bg-gray-900 border-l-4 border-l-red-500 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-bold text-gray-900 dark:text-gray-100">{task.name}</p>
                  <button
                    onClick={() => handleDismissTask(task.id)}
                    title="Mark as completed"
                    className="p-1 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Check size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 px-2 py-1 rounded">
                    <Clock size={12} />
                    Overdue since {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  <span className={`inline-flex px-2 py-0.5 text-[10px] rounded font-bold uppercase ${getPriorityColor(task.priority)}`}>
                    {task.priority || 'Low'}
                  </span>
                </div>
              </div>
            ))}
            {missedTasks.length === 0 && (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/20 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500 font-medium">No missed items. Great job!</p>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Bell className="text-indigo-500" size={20} />
            <h3 className="text-lg font-bold">Upcoming Reminders</h3>
            <span className="ml-auto bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs px-2 py-0.5 rounded-full font-bold">
              {upcomingTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {upcomingTasks.map((task) => (
              <div key={task.id} className="p-4 bg-white dark:bg-gray-900 border-l-4 border-l-indigo-500 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all group">
                <div className="flex items-start justify-between mb-2">
                  <p className="font-bold text-gray-900 dark:text-gray-100">{task.name}</p>
                  <button
                    onClick={() => handleDismissTask(task.id)}
                    title="Mark as completed"
                    className="p-1 text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/10 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Check size={16} />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-500 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
                    <CalendarIcon size={12} />
                    Due {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                  <span className={`inline-flex px-2 py-0.5 text-[10px] rounded font-bold uppercase ${getPriorityColor(task.priority)}`}>
                    {task.priority || 'Low'}
                  </span>
                </div>
              </div>
            ))}
            {upcomingTasks.length === 0 && (
              <div className="text-center py-10 bg-gray-50 dark:bg-gray-800/20 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-800">
                <p className="text-sm text-gray-500 font-medium">No upcoming reminders.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
        <h3 className="text-xl font-bold mb-6">Smart Notifications</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 border border-blue-100 dark:border-blue-900/30 rounded-2xl group hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Bell className="text-blue-600" size={20} />
              </div>
              <p className="font-bold text-gray-800 dark:text-gray-200">Deadline Sync</p>
              {deadlineSyncEnabled && <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Automatically sync task deadlines with your browser notifications.
            </p>
            <button onClick={() => setShowConfigModal('deadline')} className="w-full py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
              {deadlineSyncEnabled ? 'Configured ✓' : 'Configure'}
            </button>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-100 dark:border-green-900/30 rounded-2xl group hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Repeat className="text-green-600" size={20} />
              </div>
              <p className="font-bold text-gray-800 dark:text-gray-200">Recurrence</p>
              {recurrenceEnabled && <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Setup complex recurring reminders for daily or weekly meetings.
            </p>
            <button onClick={() => setShowConfigModal('recurrence')} className="w-full py-2 bg-green-600 text-white text-xs font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg shadow-green-500/20">
              {recurrenceEnabled ? 'Configured ✓' : 'Setup'}
            </button>
          </div>

          <div className="p-6 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border border-orange-100 dark:border-orange-900/30 rounded-2xl group hover:shadow-lg transition-all">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <Clock className="text-orange-600" size={20} />
              </div>
              <p className="font-bold text-gray-800 dark:text-gray-200">Activity Digest</p>
              {digestEnabled && <div className="ml-auto w-2 h-2 bg-green-500 rounded-full"></div>}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
              Get an AI-powered summary of your team's activity every morning.
            </p>
            <button onClick={() => setShowConfigModal('digest')} className="w-full py-2 bg-orange-600 text-white text-xs font-bold rounded-xl hover:bg-orange-700 transition-colors shadow-lg shadow-orange-500/20">
              {digestEnabled ? 'Configured ✓' : 'Personalize'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
