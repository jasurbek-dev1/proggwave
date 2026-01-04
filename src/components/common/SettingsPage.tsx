import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  User,
  Lock,
  Bell,
  Shield,
  Palette,
  Link2,
  ChevronRight,
  Moon,
  Sun,
  Monitor,
  Github,
  MessageCircle,
  Mail,
  Eye,
  EyeOff,
  Check,
  X,
  Smartphone,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/hooks/useTheme';
import { settingsService } from '@/services/settings.service';
import { UserSettings } from '@/types';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';

interface SettingsPageProps {
  onBack: () => void;
  onLogout: () => void;
}

type SettingsSection = 'main' | 'account' | 'privacy' | 'notifications' | 'security' | 'appearance' | 'connected';

export const SettingsPage: React.FC<SettingsPageProps> = ({ onBack, onLogout }) => {
  const { theme, isDark, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState<SettingsSection>('main');
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Account form state
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('');

  // Security form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setIsLoading(true);
    const data = await settingsService.getSettings();
    setSettings(data);
    setIsLoading(false);
  };

  const handleNotificationToggle = async (key: keyof UserSettings['notifications']) => {
    if (!settings) return;
    const newValue = !settings.notifications[key];
    await settingsService.updateNotificationSettings({ [key]: newValue });
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [key]: newValue },
    });
  };

  const handlePrivacyToggle = async (key: keyof UserSettings['privacy'], value: boolean | string) => {
    if (!settings) return;
    await settingsService.updatePrivacySettings({ [key]: value });
    setSettings({
      ...settings,
      privacy: { ...settings.privacy, [key]: value },
    });
  };

  const handleSecurityToggle = async (key: keyof UserSettings['security'], value: boolean) => {
    if (!settings) return;
    await settingsService.updateSecuritySettings({ [key]: value });
    setSettings({
      ...settings,
      security: { ...settings.security, [key]: value },
    });
  };

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
    if (settings) {
      settingsService.updateAppearanceSettings({ theme: newTheme });
      setSettings({
        ...settings,
        appearance: { ...settings.appearance, theme: newTheme },
      });
    }
  };

  const handleConnectAccount = async (provider: 'github' | 'telegram' | 'google') => {
    // Mock connection flow
    toast({
      title: `${provider.charAt(0).toUpperCase() + provider.slice(1)} Connected`,
      description: `Your ${provider} account has been linked successfully.`,
    });
    await settingsService.connectAccount(provider, `${provider}_user_123`);
    loadSettings();
  };

  const handleDisconnectAccount = async (provider: 'github' | 'telegram' | 'google') => {
    await settingsService.disconnectAccount(provider);
    toast({
      title: 'Account Disconnected',
      description: `Your ${provider} account has been unlinked.`,
    });
    loadSettings();
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: 'Error',
        description: 'Please fill in both password fields.',
        variant: 'destructive',
      });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: 'Error',
        description: 'New password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Password Updated',
      description: 'Your password has been changed successfully.',
    });
    setCurrentPassword('');
    setNewPassword('');
  };

  const menuItems = [
    { id: 'account' as const, icon: User, label: 'Account', description: 'Username, email, bio' },
    { id: 'privacy' as const, icon: Lock, label: 'Privacy', description: 'Who can see your content' },
    { id: 'notifications' as const, icon: Bell, label: 'Notifications', description: 'Push & email settings' },
    { id: 'security' as const, icon: Shield, label: 'Security', description: 'Password, sessions' },
    { id: 'appearance' as const, icon: Palette, label: 'Appearance', description: 'Theme & display' },
    { id: 'connected' as const, icon: Link2, label: 'Connected Accounts', description: 'GitHub, Telegram, Google' },
  ];

  const renderMainMenu = () => (
    <div className="space-y-2">
      {menuItems.map((item) => (
        <button
          key={item.id}
          onClick={() => setActiveSection(item.id)}
          className="w-full flex items-center gap-4 p-4 bg-card hover:bg-muted rounded-xl transition-colors text-left"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <item.icon size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground">{item.label}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <ChevronRight size={20} className="text-muted-foreground" />
        </button>
      ))}

      <div className="pt-4 border-t border-border mt-4">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-4 p-4 hover:bg-destructive/10 rounded-xl transition-colors text-left text-destructive"
        >
          <div className="w-10 h-10 bg-destructive/10 rounded-full flex items-center justify-center">
            <LogOut size={20} />
          </div>
          <div className="flex-1">
            <p className="font-medium">Log Out</p>
            <p className="text-sm opacity-70">Sign out of your account</p>
          </div>
        </button>
      </div>
    </div>
  );

  const renderAccountSection = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="your_username"
          className="w-full px-4 py-3 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full px-4 py-3 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-muted-foreground mb-2">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={3}
          className="w-full px-4 py-3 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-primary/50 transition-all resize-none text-foreground"
        />
      </div>
      <button
        onClick={() => toast({ title: 'Saved', description: 'Your profile has been updated.' })}
        className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition"
      >
        Save Changes
      </button>
    </div>
  );

  const renderPrivacySection = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-card rounded-xl">
        <div>
          <p className="font-medium text-foreground">Private Account</p>
          <p className="text-sm text-muted-foreground">Only followers can see your posts</p>
        </div>
        <Switch
          checked={settings?.privacy.privateAccount || false}
          onCheckedChange={(checked) => handlePrivacyToggle('privateAccount', checked)}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-card rounded-xl">
        <div>
          <p className="font-medium text-foreground">Show Online Status</p>
          <p className="text-sm text-muted-foreground">Let others see when you're active</p>
        </div>
        <Switch
          checked={settings?.privacy.showOnlineStatus || false}
          onCheckedChange={(checked) => handlePrivacyToggle('showOnlineStatus', checked)}
        />
      </div>

      <div className="p-4 bg-card rounded-xl">
        <p className="font-medium text-foreground mb-3">Who Can Message You</p>
        <div className="space-y-2">
          {['everyone', 'followers', 'nobody'].map((option) => (
            <button
              key={option}
              onClick={() => handlePrivacyToggle('allowMessages', option)}
              className={cn(
                'w-full flex items-center justify-between p-3 rounded-lg transition-colors',
                settings?.privacy.allowMessages === option
                  ? 'bg-primary/10 text-primary'
                  : 'hover:bg-muted text-foreground'
              )}
            >
              <span className="capitalize">{option}</span>
              {settings?.privacy.allowMessages === option && <Check size={18} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div className="space-y-3">
      {[
        { key: 'likes' as const, label: 'Likes', description: 'When someone likes your post' },
        { key: 'comments' as const, label: 'Comments', description: 'When someone comments on your post' },
        { key: 'follows' as const, label: 'New Followers', description: 'When someone follows you' },
        { key: 'messages' as const, label: 'Messages', description: 'When you receive a message' },
        { key: 'mentions' as const, label: 'Mentions', description: 'When someone mentions you' },
      ].map((item) => (
        <div key={item.key} className="flex items-center justify-between p-4 bg-card rounded-xl">
          <div>
            <p className="font-medium text-foreground">{item.label}</p>
            <p className="text-sm text-muted-foreground">{item.description}</p>
          </div>
          <Switch
            checked={settings?.notifications[item.key] || false}
            onCheckedChange={() => handleNotificationToggle(item.key)}
          />
        </div>
      ))}
    </div>
  );

  const renderSecuritySection = () => (
    <div className="space-y-4">
      <div className="p-4 bg-card rounded-xl space-y-4">
        <h3 className="font-medium text-foreground">Change Password</h3>
        <div className="relative">
          <input
            type={showCurrentPassword ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            placeholder="Current password"
            className="w-full px-4 py-3 pr-12 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
          />
          <button
            type="button"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <div className="relative">
          <input
            type={showNewPassword ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New password"
            className="w-full px-4 py-3 pr-12 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-primary/50 transition-all text-foreground"
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
          >
            {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <button
          onClick={handleChangePassword}
          className="w-full py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition"
        >
          Update Password
        </button>
      </div>

      <div className="flex items-center justify-between p-4 bg-card rounded-xl">
        <div>
          <p className="font-medium text-foreground">Two-Factor Authentication</p>
          <p className="text-sm text-muted-foreground">Add extra security to your account</p>
        </div>
        <Switch
          checked={settings?.security.twoFactorEnabled || false}
          onCheckedChange={(checked) => handleSecurityToggle('twoFactorEnabled', checked)}
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-card rounded-xl">
        <div>
          <p className="font-medium text-foreground">Login Alerts</p>
          <p className="text-sm text-muted-foreground">Get notified of new logins</p>
        </div>
        <Switch
          checked={settings?.security.loginAlerts || false}
          onCheckedChange={(checked) => handleSecurityToggle('loginAlerts', checked)}
        />
      </div>

      <div className="p-4 bg-card rounded-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-foreground">Active Sessions</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Smartphone size={20} className="text-primary" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">This device</p>
              <p className="text-xs text-muted-foreground">Active now • Tashkent, UZ</p>
            </div>
            <span className="text-xs text-success font-medium">Current</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            <Monitor size={20} className="text-muted-foreground" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Chrome on Windows</p>
              <p className="text-xs text-muted-foreground">2 days ago • Tashkent, UZ</p>
            </div>
            <button className="text-xs text-destructive font-medium">End</button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSection = () => (
    <div className="space-y-4">
      <div className="p-4 bg-card rounded-xl">
        <h3 className="font-medium text-foreground mb-4">Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'light' as const, icon: Sun, label: 'Light' },
            { id: 'dark' as const, icon: Moon, label: 'Dark' },
            { id: 'system' as const, icon: Monitor, label: 'System' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => handleThemeChange(item.id)}
              className={cn(
                'flex flex-col items-center gap-2 p-4 rounded-xl transition-all',
                theme === item.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80 text-foreground'
              )}
            >
              <item.icon size={24} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 bg-card rounded-xl">
        <h3 className="font-medium text-foreground mb-3">Preview</h3>
        <div className={cn(
          'p-4 rounded-xl border border-border',
          isDark ? 'bg-background' : 'bg-muted'
        )}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-primary/20" />
            <div className="flex-1">
              <div className="h-3 w-24 bg-foreground/20 rounded" />
              <div className="h-2 w-16 bg-muted-foreground/20 rounded mt-1" />
            </div>
          </div>
          <div className="h-32 bg-muted rounded-lg" />
        </div>
      </div>
    </div>
  );

  const renderConnectedSection = () => (
    <div className="space-y-3">
      {[
        { id: 'github' as const, icon: Github, label: 'GitHub', color: 'text-foreground' },
        { id: 'telegram' as const, icon: MessageCircle, label: 'Telegram', color: 'text-blue-500' },
        { id: 'google' as const, icon: Mail, label: 'Google', color: 'text-red-500' },
      ].map((provider) => {
        const isConnected = settings?.connectedAccounts[provider.id];
        return (
          <div key={provider.id} className="flex items-center justify-between p-4 bg-card rounded-xl">
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center bg-muted', provider.color)}>
                <provider.icon size={20} />
              </div>
              <div>
                <p className="font-medium text-foreground">{provider.label}</p>
                <p className="text-sm text-muted-foreground">
                  {isConnected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>
            <button
              onClick={() =>
                isConnected
                  ? handleDisconnectAccount(provider.id)
                  : handleConnectAccount(provider.id)
              }
              className={cn(
                'px-4 py-2 rounded-lg font-medium text-sm transition-colors',
                isConnected
                  ? 'bg-destructive/10 text-destructive hover:bg-destructive/20'
                  : 'bg-primary text-primary-foreground hover:opacity-90'
              )}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </button>
          </div>
        );
      })}
    </div>
  );

  const getSectionTitle = () => {
    const titles: Record<SettingsSection, string> = {
      main: 'Settings',
      account: 'Account',
      privacy: 'Privacy',
      notifications: 'Notifications',
      security: 'Security',
      appearance: 'Appearance',
      connected: 'Connected Accounts',
    };
    return titles[activeSection];
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      );
    }

    switch (activeSection) {
      case 'main':
        return renderMainMenu();
      case 'account':
        return renderAccountSection();
      case 'privacy':
        return renderPrivacySection();
      case 'notifications':
        return renderNotificationsSection();
      case 'security':
        return renderSecuritySection();
      case 'appearance':
        return renderAppearanceSection();
      case 'connected':
        return renderConnectedSection();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-lg border-b border-border px-4 py-3">
        <div className="flex items-center gap-3 max-w-lg mx-auto">
          <button
            onClick={activeSection === 'main' ? onBack : () => setActiveSection('main')}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-foreground">{getSectionTitle()}</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-lg mx-auto p-4 pb-24 animate-fade-in">
        {renderContent()}
      </div>
    </div>
  );
};

export default SettingsPage;
