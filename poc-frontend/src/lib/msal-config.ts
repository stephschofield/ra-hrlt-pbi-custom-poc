import { Configuration, LogLevel } from '@azure/msal-browser';

// MSAL Configuration for Azure AD authentication
export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || '',
    authority: process.env.NEXT_PUBLIC_AZURE_AUTHORITY || '',
    redirectUri: typeof window !== 'undefined' ? window.location.origin : '',
  },
  cache: {
    cacheLocation: 'sessionStorage', // Use session storage for POC
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        console.log(message);
      },
      logLevel: LogLevel.Verbose,
    },
  },
};

// Scopes needed for basic authentication and Microsoft Graph
export const loginRequest = {
  scopes: [
    'User.Read', // Basic profile information
    'openid',
    'profile',
    'offline_access',
  ],
};

// Microsoft Graph specific scopes (separate request)
export const graphScopes = ['User.Read', 'Directory.Read.All'];

// Power BI specific scopes (separate request)
export const powerBiScopes = ['https://analysis.windows.net/powerbi/api/Report.Read.All'];