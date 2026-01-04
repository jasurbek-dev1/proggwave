// This hook is deprecated - use useAuthContext from '@/contexts/AuthContext' instead
// Keeping for backwards compatibility

import { useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  const { user, isLoading, isAuthenticated, logout, updateProfile } = useAuthContext();

  return {
    user,
    isLoading,
    isAuthenticated,
    login: async () => { throw new Error('Use useAuthContext().login instead'); },
    logout,
    register: async () => { throw new Error('Use useAuthContext().register instead'); },
    updateProfile,
  };
};
