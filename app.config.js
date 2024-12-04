export default {
  expo: {
    name: 'hello-world-app',
    slug: 'hello-world-app',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.yourcompany.helloworld'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      package: 'com.yourcompany.helloworld'
    },
    web: {
      bundler: 'metro',
      favicon: './assets/images/favicon.png'
    },
    plugins: ['expo-router'],
    extra: {
      TMDB_API_KEY: process.env.TMDB_API_KEY,
      TMDB_BASE_URL: process.env.TMDB_BASE_URL,
      TMDB_IMAGE_BASE_URL: process.env.TMDB_IMAGE_BASE_URL,
    },
  },
};
