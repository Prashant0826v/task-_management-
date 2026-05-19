import { useState, useEffect } from 'react';
import { Plus, Users, Calendar, MoreHorizontal, X, Trash2 } from 'lucide-react';
import { api } from '../../lib/api';

export function Projects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    progress: 0,
    status: 'On Track',
    dueDate: '',
    members: 'JD'
  });

  const fetchProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createProject(newProject);
      setShowModal(false);
      setNewProject({
        name: '',
        description: '',
        progress: 0,
        status: 'On Track',
        dueDate: '',
        members: 'JD'
      });
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleDeleteProject = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await api.deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const openEditModal = (project: any) => {
    setEditingProject({ ...project, dueDate: project.dueDate || '' });
    setShowEditModal(true);
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    try {
      await api.updateProject(editingProject.id, {
        name: editingProject.name,
        description: editingProject.description,
        progress: editingProject.progress,
        status: editingProject.status,
        dueDate: editingProject.dueDate,
      });
      setShowEditModal(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error editing project:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ahead': return 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/10 dark:border-green-900';
      case 'On Track': return 'text-blue-600 bg-blue-50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-900';
      case 'At Risk': return 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:border-orange-900';
      default: return 'text-gray-600 bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700';
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
      {/* New Project Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Create New Project</h2>
              <button onClick={() => setShowModal(false)} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleAddProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Project Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Mobile App Redesign"
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={newProject.name}
                  onChange={e => setNewProject({...newProject, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea
                  className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[100px]"
                  placeholder="Project goals and scope..."
                  value={newProject.description}
                  onChange={e => setNewProject({...newProject, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Status</label>
                  <select
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newProject.status}
                    onChange={e => setNewProject({...newProject, status: e.target.value})}
                  >
                    <option>On Track</option>
                    <option>At Risk</option>
                    <option>Ahead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Due Date</label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={newProject.dueDate}
                    onChange={e => setNewProject({...newProject, dueDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditModal && editingProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 rounded-xl max-w-lg w-full shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
              <h2 className="text-xl font-bold">Edit Project</h2>
              <button onClick={() => { setShowEditModal(false); setEditingProject(null); }} className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleEditProject} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Project Name</label>
                <input required type="text" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={editingProject.name} onChange={e => setEditingProject({...editingProject, name: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Description</label>
                <textarea className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none min-h-[80px]"
                  value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">Status</label>
                  <select className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={editingProject.status} onChange={e => setEditingProject({...editingProject, status: e.target.value})}>
                    <option>On Track</option><option>At Risk</option><option>Ahead</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">Due Date</label>
                  <input type="date" className="w-full px-3 py-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    value={editingProject.dueDate} onChange={e => setEditingProject({...editingProject, dueDate: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Progress ({editingProject.progress}%)</label>
                <input type="range" min="0" max="100" className="w-full accent-indigo-600"
                  value={editingProject.progress} onChange={e => setEditingProject({...editingProject, progress: parseInt(e.target.value)})} />
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => { setShowEditModal(false); setEditingProject(null); }} className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/20">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h1>Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Track and manage all ongoing projects</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95"
        >
          <Plus size={18} />
          <span className="text-sm font-medium">New Project</span>
        </button>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:shadow-xl transition-all hover:border-indigo-500/30">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="mb-1 font-bold group-hover:text-indigo-600 transition-colors">{project.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">{project.description}</p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleDeleteProject(project.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded transition-colors"
                >
                  <Trash2 size={16} />
                </button>
                <button
                  onClick={() => openEditModal(project)}
                  className="p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                >
                  <MoreHorizontal size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-gray-500 font-medium">Progress</span>
                  <span className="text-sm font-bold">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  <div className="flex -space-x-2">
                    {project.members && project.members.map((member: any, i: number) => (
                      <div
                        key={i}
                        className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-[10px] font-bold border-2 border-white dark:border-gray-900"
                      >
                        {member}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar size={14} />
                  {project.dueDate ? new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'No date'}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className={`inline-flex px-2 py-0.5 text-[10px] rounded border font-bold uppercase ${getStatusColor(project.status)}`}>
                  {project.status}
                </span>
                <span className="text-xs text-gray-500 font-medium">
                  {project.activeTasks || 0} active tasks
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
        <h3 className="mb-6 font-bold">Project Timeline</h3>
        <div className="space-y-6">
          {projects.slice(0, 4).map((project) => (
            <div key={project.id} className="flex items-center gap-6">
              <div className="w-48 text-sm font-medium truncate">{project.name}</div>
              <div className="flex-1">
                <div className="w-full bg-gray-100 dark:bg-gray-850 rounded-full h-10 relative overflow-hidden flex items-center">
                  <div
                    className="absolute left-0 top-0 h-full bg-indigo-600/10 dark:bg-indigo-600/20 border-l-4 border-indigo-600"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                  <span className="relative z-10 px-4 text-xs font-bold text-indigo-600 dark:text-indigo-400">{project.progress}% Complete</span>
                </div>
              </div>
              <div className="w-32 text-xs font-medium text-gray-500 text-right">
                {project.dueDate ? new Date(project.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


