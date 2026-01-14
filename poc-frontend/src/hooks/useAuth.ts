import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { loginRequest } from '@/lib/msal-config';

export function useAuth() {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const login = () => {
    instance.loginPopup(loginRequest).catch((error) => {
      console.error('Login failed:', error);
    });
  };

  const logout = () => {
    instance.logoutPopup();
  };

  const getAccessToken = async () => {
    if (!isAuthenticated) return null;

    try {
      const accounts = instance.getAllAccounts();
      const silentRequest = {
        ...loginRequest,
        account: accounts[0],
      };

      const response = await instance.acquireTokenSilent(silentRequest);
      return response.accessToken;
    } catch (error) {
      console.error('Token acquisition failed:', error);
      return null;
    }
  };

  return {
    isAuthenticated,
    login,
    logout,
    getAccessToken,
  };
}