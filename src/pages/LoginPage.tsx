import { useState } from 'react';
import { Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/contexts/AuthContext';
import { validateUsername } from '@/services/auth.service';
import { cn } from '@/lib/utils';

interface LoginPageProps {
  onOpenSignup: () => void;
  initialUsername?: string;
  initialPassword?: string;
}

const translations = {
  UZ: {
    welcome: 'Xush kelibsiz',
    signInToAccount: 'Hisobingizga kiring',
    usernamePlaceholder: 'e.g. jasur_dev',
    password: 'Parol',
    forgotPassword: 'Parolni unutdingizmi?',
    signIn: 'Kirish',
    signingIn: 'Yuklanmoqda...',
    createAccount: 'Yangi hisob yaratish',
    usernameInvalid: 'Username .dev yoki _dev bilan tugashi kerak',
    passwordRequired: 'Parol kiritishingiz shart',
  },
  RU: {
    welcome: 'Добро пожаловать',
    signInToAccount: 'Войдите в свой аккаунт',
    usernamePlaceholder: 'например: jasur_dev',
    password: 'Пароль',
    forgotPassword: 'Забыли пароль?',
    signIn: 'Войти',
    signingIn: 'Загрузка...',
    createAccount: 'Создать аккаунт',
    usernameInvalid: 'Имя должно заканчиваться на .dev или _dev',
    passwordRequired: 'Требуется пароль',
  },
  EN: {
    welcome: 'Welcome back',
    signInToAccount: 'Sign in to your account',
    usernamePlaceholder: 'e.g. jasur_dev',
    password: 'Password',
    forgotPassword: 'Forgot password?',
    signIn: 'Sign in',
    signingIn: 'Signing in...',
    createAccount: 'Create an account',
    usernameInvalid: 'Username must end with .dev or _dev',
    passwordRequired: 'Password is required',
  },
};

type Lang = keyof typeof translations;

export function LoginPage({
  onOpenSignup,
  initialUsername = '',
  initialPassword = '',
}: LoginPageProps) {
  const navigate = useNavigate();
  const { login, isLoading } = useAuthContext();
  
  const [username, setUsername] = useState(initialUsername);
  const [password, setPassword] = useState(initialPassword);
  const [error, setError] = useState('');
  const [lang, setLang] = useState<Lang>('UZ');

  const t = translations[lang];

  const handleGoogleLogin = () => {
    console.log('TODO: Implement Google OAuth');
  };

  const handleGithubLogin = () => {
    console.log('TODO: Implement GitHub OAuth');
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateUsername(username)) {
      setError(t.usernameInvalid);
      return;
    }

    if (!password) {
      setError(t.passwordRequired);
      return;
    }

    try {
      await login({ username, password });
      navigate('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Language Selector */}
        <div className="flex justify-center gap-3 mb-6">
          {(['UZ', 'RU', 'EN'] as Lang[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLang(l)}
              className={cn(
                'px-4 py-2 rounded-full border text-sm transition-colors',
                lang === l
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'border-border text-muted-foreground hover:bg-muted'
              )}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-semibold text-foreground mb-2">
            {t.welcome}
          </h1>
          <p className="text-muted-foreground">{t.signInToAccount}</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {/* OAuth Buttons */}
          <div className="flex gap-4 mb-8">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
            </button>

            <button
              type="button"
              onClick={handleGithubLogin}
              className="w-14 h-14 rounded-full bg-card border border-border flex items-center justify-center hover:border-primary transition-colors shadow-sm"
            >
              <Github className="w-5 h-5 text-foreground" />
            </button>
          </div>

          {/* Username Input */}
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t.usernamePlaceholder}
              className={cn(
                'w-full px-6 py-4 rounded-2xl border bg-card focus:outline-none focus:border-primary transition-colors text-lg text-foreground placeholder:text-muted-foreground',
                error && !validateUsername(username) ? 'border-destructive' : 'border-border'
              )}
            />
          </div>

          {/* Password Input */}
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.password}
              className="w-full px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-lg text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="button"
              className="text-sm text-muted-foreground hover:text-foreground mt-3 transition-colors"
            >
              {t.forgotPassword}
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="text-destructive text-sm text-center bg-destructive/10 py-3 rounded-xl">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? t.signingIn : t.signIn}
          </button>

          {/* Signup Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={onOpenSignup}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.createAccount}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
