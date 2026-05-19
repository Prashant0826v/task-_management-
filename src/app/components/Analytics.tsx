import { useState, useEffect } from 'react';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { api } from '../../lib/api';

export function Analytics() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const data = await api.getAnalytics();
        setAnalyticsData(data);
      } catch (error) {
        console.error('Error fetching analytics:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading || !analyticsData) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const { weeklyData, categoryData } = analyticsData;

  const monthlyData = [
    { month: 'Jan', completed: 45, created: 52 },
    { month: 'Feb', completed: 52, created: 58 },
    { month: 'Mar', completed: 61, created: 64 },
    { month: 'Apr', completed: 48, created: 51 },
  ];

  const productivityData = [
    { day: 'Mon', score: 85 },
    { day: 'Tue', score: 90 },
    { day: 'Wed', score: 78 },
    { day: 'Thu', score: 92 },
    { day: 'Fri', score: 88 },
    { day: 'Sat', score: 65 },
    { day: 'Sun', score: 58 },
  ];

  const completionTimeData = [
    { priority: 'Low', avgHours: 24 },
    { priority: 'Medium', avgHours: 16 },
    { priority: 'High', avgHours: 8 },
    { priority: 'Urgent', avgHours: 4 },
  ];

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1>Analytics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Track your productivity and performance</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Tasks This Week', value: '42', change: '+12%', trend: 'up', icon: Activity },
          { label: 'Productivity Score', value: '87', change: '+5%', trend: 'up', icon: Target },
          { label: 'Avg Completion Time', value: '12h', change: '-8%', trend: 'down', icon: TrendingDown },
          { label: 'On-Time Delivery', value: '94%', change: '+3%', trend: 'up', icon: TrendingUp },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
                <Icon className={stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} size={18} />
              </div>
              <p className="text-3xl mb-1">{stat.value}</p>
              <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change} vs last week
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="mb-6">Monthly Task Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="created" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.6} />
              <Area type="monotone" dataKey="completed" stackId="1" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="mb-6">Tasks by Category</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {categoryData.map((cat: any) => (
              <div key={cat.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: cat.color }}></div>
                  <span className="text-gray-600 dark:text-gray-400">{cat.name}</span>
                </div>
                <span>{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="mb-6">Weekly Productivity Score</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={productivityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#6366f1" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="mb-6">Average Completion Time by Priority</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={completionTimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="priority" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="avgHours" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
        <h3 className="mb-4">Performance Insights</h3>
        <div className="grid grid-cols-3 gap-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="text-green-600" size={20} />
              <p className="text-sm">Most Productive Day</p>
            </div>
            <p className="text-2xl mb-1">Thursday</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              You complete 35% more tasks on Thursdays
            </p>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="text-blue-600" size={20} />
              <p className="text-sm">Focus Category</p>
            </div>
            <p className="text-2xl mb-1">Development</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              45% of your tasks are development-related
            </p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-200 dark:border-orange-900 rounded-md">
            <div className="flex items-center gap-2 mb-2">
              <Target className="text-orange-600" size={20} />
              <p className="text-sm">Completion Rate</p>
            </div>
            <p className="text-2xl mb-1">89%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              9 out of 10 tasks completed on time
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

