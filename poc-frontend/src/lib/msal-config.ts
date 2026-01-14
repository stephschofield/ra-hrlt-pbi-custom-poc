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

// Scopes needed for Power BI and Microsoft Graph
export const loginRequest = {
  scopes: [
    'User.Read',
    'Directory.Read.All',
    'https://analysis.windows.net/powerbi/api/.default', // Power BI scope
  ],
};

// Power BI specific scopes
export const powerBiScopes = ['https://analysis.windows.net/powerbi/api/.default'];