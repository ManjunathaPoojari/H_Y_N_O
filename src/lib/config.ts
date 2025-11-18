// Configuration Management
// This file provides a safe way to access environment variables in the browser

interface Config {
  USE_BACKEND: boolean;
  API_URL: string;
}

// Default configuration (works without any .env file)
const defaultConfig: Config = {
  USE_BACKEND: false,
  API_URL: 'http://localhost:8081',
};

// Load config from window object (set by index.html or build process)
const loadConfig = (): Config => {
  // Check if running in browser
  if (typeof window === 'undefined') {
    return defaultConfig;
  }

  // Try to get config from window object
  const windowEnv = (window as any).__ENV__;

  if (windowEnv) {
    return {
      USE_BACKEND: windowEnv.REACT_APP_USE_BACKEND === 'true',
      API_URL: windowEnv.REACT_APP_API_URL || defaultConfig.API_URL,
    };
  }

  // Fallback to default
  return defaultConfig;
};

// Export config instance
export const config = loadConfig();

// Helper function to get environment variable safely
export const getEnvVar = (key: string, defaultValue: string = ''): string => {
  if (typeof window !== 'undefined' && (window as any).__ENV__) {
    return (window as any).__ENV__[key] || defaultValue;
  }
  return defaultValue;
};

// Export individual config values for convenience
export const USE_BACKEND = config.USE_BACKEND;
export const API_URL = config.API_URL;

export default config;
