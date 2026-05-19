import { useState, useRef } from 'react';
import { User, Bell, Palette, Globe, Shield, CreditCard, CheckCircle, Save, Camera } from 'lucide-react';

interface SettingsProps {
  isDark: boolean;
  onToggleTheme: (dark: boolean) => void;
  profile: { firstName: string; lastName: string; email: string; role: string };
  onProfileChange: (profile: { firstName: string; lastName: string; email: string; role: string }) => void;
}

export function Settings({ isDark, onToggleTheme, profile, onProfileChange }: SettingsProps) {
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [localProfile, setLocalProfile] = useState({ ...profile });
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [notifications, setNotifications] = useState([
    { id: 1, label: 'Email notifications', description: 'Receive email updates for task assignments', enabled: true },
    { id: 2, label: 'Push notifications', description: 'Get browser notifications for important updates', enabled: true },
    { id: 3, label: 'Task reminders', description: 'Reminder notifications before deadlines', enabled: true },
    { id: 4, label: 'Team mentions', description: 'Notify when someone mentions you', enabled: false },
    { id: 5, label: 'Weekly digest', description: 'Receive weekly summary of your tasks', enabled: false },
  ]);

  const [accentColor, setAccentColor] = useState('#6366f1');

  const handleSave = (section: string) => {
    if (section === 'Profile') {
      onProfileChange(localProfile);
    }
    setSaveStatus(section);
    setTimeout(() => setSaveStatus(null), 3000);
  };

  const handleThemeSelect = (themeName: string) => {
    onToggleTheme(themeName === 'Dark');
  };

  const toggleNotification = (id: number) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, enabled: !n.enabled } : n));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const currentTheme = isDark ? 'Dark' : 'Light';

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Personalize your TaskFlow experience</p>
        </div>
        {saveStatus && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-2xl animate-in slide-in-from-top-2 shadow-lg shadow-green-500/20">
            <CheckCircle size={18} />
            <span className="text-sm font-bold">{saveStatus} updated successfully</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          {/* Profile Section */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl">
                <User className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-bold">Profile Info</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-800">
                <div className="relative group">
                  {photoUrl ? (
                    <img src={photoUrl} alt="Profile" className="w-24 h-24 rounded-3xl object-cover shadow-xl" />
                  ) : (
                    <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                      {localProfile.firstName[0]}{localProfile.lastName[0]}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/40 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Camera size={24} className="text-white" />
                  </button>
                </div>
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all text-sm font-bold shadow-sm mb-2"
                  >
                    Change Photo
                  </button>
                  <p className="text-xs text-gray-400">JPG, GIF or PNG. Max size of 800K</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">First Name</label>
                  <input
                    type="text"
                    value={localProfile.firstName}
                    onChange={e => setLocalProfile({...localProfile, firstName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Last Name</label>
                  <input
                    type="text"
                    value={localProfile.lastName}
                    onChange={e => setLocalProfile({...localProfile, lastName: e.target.value})}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Email Address</label>
                <input
                  type="email"
                  value={localProfile.email}
                  onChange={e => setLocalProfile({...localProfile, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => handleSave('Profile')}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20"
                >
                  <Save size={18} />
                  Save Changes
                </button>
              </div>
            </div>
          </div>

          {/* Notifications Section */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-orange-50 dark:bg-orange-900/10 rounded-xl">
                <Bell className="text-orange-600" size={24} />
              </div>
              <h3 className="text-xl font-bold">Notifications</h3>
            </div>
            <div className="space-y-4">
              {notifications.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-gray-800/30 rounded-2xl">
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-gray-100">{item.label}</p>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer" 
                      checked={item.enabled}
                      onChange={() => toggleNotification(item.id)}
                    />
                    <div className="w-12 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Security Section */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-red-50 dark:bg-red-900/10 rounded-xl">
                <Shield className="text-red-600" size={24} />
              </div>
              <h3 className="text-xl font-bold">Security</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <button 
                  onClick={() => handleSave('Password')}
                  className="px-6 py-2.5 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-bold shadow-lg shadow-indigo-500/20"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Appearance Section */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Palette className="text-purple-600" size={24} />
              <h3 className="text-xl font-bold">Appearance</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Interface Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  {['Light', 'Dark'].map((t) => (
                    <button
                      key={t}
                      onClick={() => handleThemeSelect(t)}
                      className={`py-3 rounded-2xl font-bold text-sm transition-all border ${
                        currentTheme === t 
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' 
                          : 'border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Branding Color</label>
                <div className="grid grid-cols-4 gap-3">
                  {['#6366f1', '#8b5cf6', '#ec4899', '#10b981'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setAccentColor(color)}
                      className={`h-10 rounded-xl border-2 transition-all ${
                        accentColor === color ? 'border-indigo-600 scale-110 shadow-lg' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Regional Section */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Globe className="text-blue-600" size={24} />
              <h3 className="text-xl font-bold">Regional</h3>
            </div>
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Language</label>
                <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium">
                  <option>English (US)</option>
                  <option>Hindi (IN)</option>
                  <option>French (FR)</option>
                  <option>German (DE)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Timezone</label>
                <select className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-medium">
                  <option>PST (UTC-8)</option>
                  <option>IST (UTC+5:30)</option>
                  <option>EST (UTC-5)</option>
                  <option>GMT (UTC+0)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Billing Section */}
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8 shadow-sm overflow-hidden relative">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-indigo-600" size={24} />
              <h3 className="text-xl font-bold">Subscription</h3>
            </div>
            <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl text-white shadow-xl mb-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <CreditCard size={120} />
              </div>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Current Plan</p>
              <h4 className="text-2xl font-black mb-4">Enterprise Pro</h4>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold">$49<span className="text-sm opacity-80 font-normal">/mo</span></p>
                <span className="px-3 py-1 bg-white/20 rounded-lg text-xs font-bold backdrop-blur-md border border-white/20">Active</span>
              </div>
            </div>
            <button onClick={() => handleSave('Billing')} className="w-full py-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all mb-3 border border-gray-100 dark:border-gray-700">
              Manage Billing
            </button>
            <button onClick={() => handleSave('Invoice')} className="w-full py-3 bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-2xl font-bold text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-all border border-gray-100 dark:border-gray-700">
              Download Invoices
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
