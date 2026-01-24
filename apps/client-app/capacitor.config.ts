import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.plms.client',
  appName: 'Projector Loan Management',
  webDir: '../../dist/apps/client-app',
  server: {
    androidScheme: 'https'
  }
};

export default config;
