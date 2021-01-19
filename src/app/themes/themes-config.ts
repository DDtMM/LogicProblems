import { InjectionToken } from '@angular/core';

export interface ThemeConfigItem {
  key: string;
  label: string;
}

export const THEMES = new InjectionToken<ThemeConfigItem[]>('Theme configuration info',
  {
    factory: () => [
      { key: 'bw', label: 'Black & White' },
      { key: 'blueBerry', label: 'Blueberry' },
      { key: 'highContrast', label: 'High Contrast' },
      { key: 'sunset', label: 'Sunset' }
    ]
  }
);
