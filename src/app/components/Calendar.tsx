import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Clock, X } from 'lucide-react';
import { api } from '../../lib/api';

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ name: '', description: '', priority: 'Medium', dueDate: '', assignee: 'John Doe' });

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks for calendar:', error);
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
      await api.createTask({ ...newTask, status: 'To Do', tags: [] });
      setShowModal(false);
      setNewTask({ name: '', description: '', priority: 'Medium', dueDate: '', assignee: 'John Doe' });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task from calendar:', error);
    }
  };

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const getTasksForDate = (date: number) => {
    return tasks.filter(task => {
      if (!task.dueDate) return false;
      const d = new Date(task.dueDate);
      return d.getDate() === date && d.getMonth() === currentDate.getMonth() && d.getFullYear() === currentDate.getFullYear();
    });
  };

  const getPriorityColorClass = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-blue-500';
      default: return 'bg-gray-500';
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
    <div className="p-8 space-y-6">
      {/* New Planning Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">New Planning</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"><X size={20} /></button>
            </div>
            <form onSubmit={handleAddTask} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Task Name</label>
                <input required type="text" placeholder="e.g. Sprint Planning Meeting"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newTask.name} onChange={e => setNewTask({...newTask, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                  placeholder="What needs to be planned?" value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
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
                  <label className="block text-sm font-medium mb-1.5">Date</label>
                  <input required type="date" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">Schedule Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Organize your workflow by time</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95">
          <Plus size={18} />
          <span className="text-sm font-bold uppercase">New Planning</span>
        </button>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <h2 className="text-2xl font-bold">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h2>
            <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 p-1 rounded-xl">
              <button
                onClick={previousMonth}
                className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all hover:shadow-sm"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={nextMonth}
                className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-all hover:shadow-sm"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-1.5 rounded-xl">
            {['day', 'week', 'month'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v as any)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  view === v ? 'bg-white dark:bg-gray-700 text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === 'month' && (
          <div className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden shadow-inner">
            <div className="grid grid-cols-7 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800">
              {days.map(day => (
                <div key={day} className="py-4 text-center text-xs font-bold text-gray-400 uppercase tracking-widest">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-100 dark:bg-gray-800">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="bg-white dark:bg-gray-900/50 p-3 min-h-[140px]"></div>
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const date = i + 1;
                const dayTasks = getTasksForDate(date);
                const isToday = date === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();

                return (
                  <div
                    key={date}
                    className="bg-white dark:bg-gray-900 p-3 min-h-[140px] hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group cursor-pointer border-t border-gray-50 dark:border-gray-800"
                  >
                    <div className={`text-sm font-bold mb-3 w-8 h-8 flex items-center justify-center rounded-xl transition-all ${
                      isToday ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'text-gray-600 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-700'
                    }`}>
                      {date}
                    </div>
                    <div className="space-y-1.5">
                      {dayTasks.map((task, i) => (
                        <div key={i} className={`${getPriorityColorClass(task.priority)} text-white text-[10px] font-bold p-1.5 rounded-lg truncate shadow-sm hover:scale-105 transition-transform`}>
                          {task.name}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {(view === 'week' || view === 'day') && (
          <div className="py-20 text-center bg-gray-50 dark:bg-gray-800/30 rounded-2xl border-2 border-dashed border-gray-100 dark:border-gray-800">
             <Clock className="mx-auto text-gray-300 mb-4" size={48} />
             <p className="text-gray-500 font-medium">{view === 'week' ? 'Weekly' : 'Daily'} view is optimized for mobile sessions. Please use Month view for full scheduling.</p>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h3 className="text-xl font-bold mb-6">Upcoming Scheduled Tasks</h3>
        <div className="grid grid-cols-2 gap-4">
          {tasks
            .filter(t => t.dueDate && new Date(t.dueDate) >= new Date())
            .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            .slice(0, 4)
            .map((task, i) => (
            <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/30 rounded-2xl hover:bg-white dark:hover:bg-gray-800 hover:shadow-md transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700">
              <div className={`w-1.5 h-10 ${getPriorityColorClass(task.priority)} rounded-full shadow-sm`}></div>
              <div className="flex-1">
                <p className="text-sm font-bold">{task.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                   Due {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-sm text-gray-400 col-span-2 text-center py-4">No scheduled tasks found.</p>}
        </div>
      </div>
    </div>
  );
}
