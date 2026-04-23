import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.clock.boox',
  appName: 'Clock',
  webDir: 'dist',
  android: {
    backgroundColor: '#000000',
  },
  plugins: {
    StatusBar: {
      style: 'DARK',
    },
  },
};

export default config;
