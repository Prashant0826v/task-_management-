import { useState, useEffect } from 'react';
import { CheckCircle2, Clock, AlertCircle, TrendingUp, ArrowRight, Plus, Trash2 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../lib/api';

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<any[]>([]);
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [categoryData, setCategoryData] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const iconMap: Record<string, any> = {
    'Total Tasks': CheckCircle2,
    'Completed': CheckCircle2,
    'In Progress': Clock,
    'Overdue': AlertCircle,
  };

  const loadData = async () => {
    try {
      const [statsData, analyticsData, tasksData] = await Promise.all([
        api.getStats(),
        api.getAnalytics(),
        api.getTasks()
      ]);
      setStats(statsData);
      setWeeklyData(analyticsData.weeklyData);
      setCategoryData(analyticsData.categoryData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-50 dark:bg-red-900/10 dark:text-red-400';
      case 'High': return 'text-orange-600 bg-orange-50 dark:bg-orange-900/10 dark:text-orange-400';
      case 'Medium': return 'text-blue-600 bg-blue-50 dark:bg-blue-900/10 dark:text-blue-400';
      default: return 'text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const handleToggleStatus = async (task: any) => {
    const newStatus = task.status === 'Completed' ? 'In Progress' : 'Completed';
    try {
      await api.updateTask(task.id, { status: newStatus });
      loadData();
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  // Filter tasks for Today (simply tasks created today or due today for this demo)
  const todayTasks = tasks.slice(0, 4); // Show top 4 latest for dashboard
  
  // Upcoming deadlines (tasks with status not completed and sorted by date)
  const upcomingDeadlines = tasks
    .filter(t => t.status !== 'Completed' && t.dueDate)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 3);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Welcome back, John</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <button onClick={() => onNavigate('tasks')} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95">
          <Plus size={18} />
          <span className="text-sm font-medium">Quick Action</span>
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = iconMap[stat.label] || CheckCircle2;
          return (
            <div key={stat.label} className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg shadow-inner`}>
                  <Icon className="text-white" size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold">Weekly Task Performance</h3>
            <div className="flex items-center gap-2 text-sm text-green-600 font-bold bg-green-50 dark:bg-green-900/10 px-2 py-1 rounded">
              <TrendingUp size={16} />
              <span>+12% Trend</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="completed" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <h3 className="mb-6 font-bold">Category Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center gap-2 text-xs font-medium">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }}></div>
                <span className="text-gray-600 dark:text-gray-400 truncate">{cat.name}</span>
                <span className="ml-auto opacity-70">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Recent Active Tasks</h3>
            <button onClick={() => onNavigate('tasks')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-wider group transition-all">
              View all
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 rounded-xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-700 group">
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
                    <p className={`text-sm font-semibold ${task.status === 'Completed' ? 'line-through text-gray-400' : ''}`}>{task.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      <span className="text-[10px] text-gray-400">{task.assignee}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {todayTasks.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No active tasks found.</p>}
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Upcoming Deadlines</h3>
            <button onClick={() => onNavigate('calendar')} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 uppercase tracking-wider group transition-all">
              View all
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="space-y-4">
            {upcomingDeadlines.map((item, i) => {
              const daysLeft = Math.ceil((new Date(item.dueDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
              return (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/30 border border-gray-100 dark:border-gray-800 rounded-xl hover:shadow-md transition-all">
                <div>
                  <p className="text-sm font-bold">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                    <Clock size={12} />
                    Due {new Date(item.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${daysLeft <= 2 ? 'text-red-500' : 'text-indigo-600'}`}>
                    {daysLeft <= 0 ? 'Due' : `${daysLeft}d left`}
                  </p>
                </div>
              </div>
            )})}
            {upcomingDeadlines.length === 0 && <p className="text-sm text-gray-500 text-center py-4">No upcoming deadlines.</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

