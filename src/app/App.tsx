import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { Tasks } from './components/Tasks';
import { Projects } from './components/Projects';
import { Calendar } from './components/Calendar';
import { Reminders } from './components/Reminders';
import { Analytics } from './components/Analytics';
import { Team } from './components/Team';
import { Inbox } from './components/Inbox';
import { Settings } from './components/Settings';

export default function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [isDark, setIsDark] = useState(false);
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@company.com',
    role: 'Product Manager'
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard onNavigate={setActivePage} />;
      case 'tasks':
        return <Tasks />;
      case 'projects':
        return <Projects />;
      case 'calendar':
        return <Calendar />;
      case 'reminders':
        return <Reminders />;
      case 'analytics':
        return <Analytics />;
      case 'team':
        return <Team />;
      case 'inbox':
        return <Inbox />;
      case 'settings':
        return <Settings isDark={isDark} onToggleTheme={(dark: boolean) => setIsDark(dark)} profile={profile} onProfileChange={setProfile} />;
      default:
        return <Dashboard onNavigate={setActivePage} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} profile={profile} />
      <div className="ml-64">
        <Navbar isDark={isDark} onToggleTheme={() => setIsDark(!isDark)} onNavigate={setActivePage} />
        <div className="pt-16">
          {renderPage()}
        </div>
      </div>
    </div>
  );
}