
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.4278bf3a58e4475ba08e312229016927',
  appName: 'soul-sync-routine',
  webDir: 'dist',
  server: {
    url: 'https://4278bf3a-58e4-475b-a08e-312229016927.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#488AFF",
      sound: "beep.wav"
    },
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#ffffff",
      showSpinner: false
    }
  }
};

export default config;
