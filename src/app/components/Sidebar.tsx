import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  Bell,
  BarChart3,
  Users,
  Inbox,
  Settings
} from 'lucide-react';

interface SidebarProps {
  activePage: string;
  onNavigate: (page: string) => void;
  profile?: { firstName: string; lastName: string; email: string; role: string };
}

export function Sidebar({ activePage, onNavigate, profile }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'team', label: 'Team Workspace', icon: Users },
    { id: 'inbox', label: 'Inbox', icon: Inbox },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const displayName = profile ? `${profile.firstName} ${profile.lastName}` : 'John Doe';
  const displayEmail = profile?.email || 'john@company.com';
  const initials = profile ? `${profile.firstName[0] || ''}${profile.lastName[0] || ''}` : 'JD';

  return (
    <div className="w-64 h-screen bg-[#1a1a1a] text-white flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl tracking-tight">TaskFlow</h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => onNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => onNavigate('settings')}
          className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-800 rounded-md transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <span className="text-xs">{initials}</span>
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm">{displayName}</div>
            <div className="text-xs text-gray-400">{displayEmail}</div>
          </div>
        </button>
      </div>
    </div>
  );
}
