// src/pages/AuthPage.tsx

import { useState } from 'react';
import { LoginPage } from './LoginPage';
import { SignupFlow } from './SignupFlow';

export function AuthPage() {
  const [showSignup, setShowSignup] = useState(false);
  const [loginCredentials, setLoginCredentials] = useState({ username: '', password: '' });

  const handleSignupComplete = (credentials: { username: string; password: string }) => {
    setLoginCredentials(credentials);
    setShowSignup(false);
  };

  return (
    <>
      {!showSignup && (
        <LoginPage
          onOpenSignup={() => setShowSignup(true)}
          initialUsername={loginCredentials.username}
          initialPassword={loginCredentials.password}
        />
      )}
      {showSignup && (
        <SignupFlow
          onClose={() => setShowSignup(false)}
          onSignupComplete={handleSignupComplete}
        />
      )}
    </>
  );
}

export default AuthPage;