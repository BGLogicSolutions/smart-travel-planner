import { useState, useEffect } from 'react';

export interface AppSettings {
  geminiApiKey: string;
  stripePublicKey: string;
  stripePriceId: string;
  bookingAffiliateId: string;
  skyscannerAffiliateId: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  geminiApiKey: '',
  stripePublicKey: '',
  stripePriceId: '',
  bookingAffiliateId: '',
  skyscannerAffiliateId: '',
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    const saved = localStorage.getItem('voya_settings');
    if (saved) {
      try {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
      } catch (e) {
        console.error('Error loading settings', e);
      }
    }
  }, []);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem('voya_settings', JSON.stringify(updated));
  };

  return { settings, updateSettings };
}
