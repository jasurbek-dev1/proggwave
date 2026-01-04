import { UserSettings } from '@/types';

const SETTINGS_KEY = 'user_settings';

const defaultSettings: UserSettings = {
  notifications: {
    likes: true,
    comments: true,
    follows: true,
    messages: true,
    mentions: true,
  },
  privacy: {
    privateAccount: false,
    showOnlineStatus: true,
    allowMessages: 'everyone',
  },
  appearance: {
    theme: 'system',
    language: 'uz',
  },
  security: {
    twoFactorEnabled: false,
    loginAlerts: true,
  },
  connectedAccounts: {},
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const settingsService = {
  async getSettings(): Promise<UserSettings> {
    await delay(100);
    const stored = localStorage.getItem(SETTINGS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    return defaultSettings;
  },

  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    await delay(200);
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  },

  async updateNotificationSettings(settings: Partial<UserSettings['notifications']>): Promise<void> {
    await delay(100);
    const current = await this.getSettings();
    current.notifications = { ...current.notifications, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(current));
  },

  async updatePrivacySettings(settings: Partial<UserSettings['privacy']>): Promise<void> {
    await delay(100);
    const current = await this.getSettings();
    current.privacy = { ...current.privacy, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(current));
  },

  async updateAppearanceSettings(settings: Partial<UserSettings['appearance']>): Promise<void> {
    await delay(100);
    const current = await this.getSettings();
    current.appearance = { ...current.appearance, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(current));
  },

  async updateSecuritySettings(settings: Partial<UserSettings['security']>): Promise<void> {
    await delay(100);
    const current = await this.getSettings();
    current.security = { ...current.security, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(current));
  },

  async connectAccount(provider: keyof UserSettings['connectedAccounts'], accountId: string): Promise<void> {
    await delay(300);
    const current = await this.getSettings();
    current.connectedAccounts[provider] = accountId;
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(current));
  },

  async disconnectAccount(provider: keyof UserSettings['connectedAccounts']): Promise<void> {
    await delay(200);
    const current = await this.getSettings();
    delete current.connectedAccounts[provider];
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(current));
  },

  async resetSettings(): Promise<UserSettings> {
    await delay(100);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaultSettings));
    return defaultSettings;
  },
};
