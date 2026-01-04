import { useState } from 'react';
import { Briefcase, UserCircle, Github, Upload, X } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { RegisterData } from '@/services/auth.service';
import { cn } from '@/lib/utils';

interface SignupFlowProps {
  onClose: () => void;
  onSignupComplete: (credentials: { username: string; password: string }) => void;
}

type Role = 'job_seeker' | 'employer';
type VerificationMethod = 'email' | 'phone' | 'oauth' | null;

interface FormData {
  role?: Role;
  username: string;
  password: string;
  email: string;
  phone: string;
  avatar_url: string;
  bio: string;
  location: string;
  skills: string[];
  joined_group: boolean;
  added_friends: boolean;
}

export function SignupFlow({ onClose, onSignupComplete }: SignupFlowProps) {
  const { register, isLoading } = useAuthContext();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    role: undefined,
    username: '',
    password: '',
    email: '',
    phone: '',
    avatar_url: '',
    bio: '',
    location: '',
    skills: [],
    joined_group: false,
    added_friends: false,
  });
  const [usernameSuffix, setUsernameSuffix] = useState('.dev');
  const [verificationMethod, setVerificationMethod] = useState<VerificationMethod>(null);
  const [error, setError] = useState('');

  const totalSteps = 6;

  const canProceedStep1 = formData.role !== undefined;
  const canProceedStep2 = formData.username && formData.username.length > 0;
  const canProceedStep3 = formData.password && formData.password.length >= 6;
  const canProceedStep4 =
    (verificationMethod === 'email' && formData.email) ||
    (verificationMethod === 'phone' && formData.phone) ||
    verificationMethod === 'oauth';
  const canProceedStep6 = formData.joined_group === true;

  const handleNext = async () => {
    setError('');

    if (currentStep === 6) {
      try {
        const fullUsername = formData.username + usernameSuffix;
        const registerData: RegisterData = {
          username: fullUsername,
          password: formData.password,
          role: formData.role!,
          email: formData.email || undefined,
          phone: formData.phone || undefined,
          avatar_url: formData.avatar_url || undefined,
          bio: formData.bio || undefined,
          location: formData.location || undefined,
          skills: formData.skills.length > 0 ? formData.skills : undefined,
          joined_group: formData.joined_group,
          added_friends: formData.added_friends,
        };

        const credentials = await register(registerData);
        onSignupComplete(credentials);
        onClose();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Registration failed');
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError('');
    }
  };

  const updateFormData = (updates: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  return (
    <div className="fixed inset-0 bg-background z-50 overflow-y-auto">
      <div className="min-h-screen flex flex-col">
        <div className="max-w-2xl mx-auto w-full px-6 py-12 flex-1 flex flex-col">
          {/* Header with steps */}
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div key={i} className="flex items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all',
                      i + 1 === currentStep
                        ? 'bg-primary text-primary-foreground'
                        : i + 1 < currentStep
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {i + 1}
                  </div>
                  {i < totalSteps - 1 && (
                    <div
                      className={cn(
                        'w-8 h-0.5 transition-colors',
                        i + 1 < currentStep ? 'bg-primary' : 'bg-border'
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Step Content */}
          <div className="flex-1 flex flex-col">
            {currentStep === 1 && (
              <Step1 formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 2 && (
              <Step2
                formData={formData}
                updateFormData={updateFormData}
                usernameSuffix={usernameSuffix}
                setUsernameSuffix={setUsernameSuffix}
              />
            )}
            {currentStep === 3 && (
              <Step3 formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 4 && (
              <Step4
                formData={formData}
                updateFormData={updateFormData}
                verificationMethod={verificationMethod}
                setVerificationMethod={setVerificationMethod}
              />
            )}
            {currentStep === 5 && (
              <Step5 formData={formData} updateFormData={updateFormData} />
            )}
            {currentStep === 6 && (
              <Step6 formData={formData} updateFormData={updateFormData} />
            )}

            {error && (
              <div className="text-destructive text-sm text-center bg-destructive/10 py-3 rounded-xl mt-6">
                {error}
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-12">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex-1 py-4 border-2 border-border text-foreground rounded-full text-lg font-medium hover:border-primary transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Orqaga
            </button>
            <button
              onClick={handleNext}
              disabled={
                (currentStep === 1 && !canProceedStep1) ||
                (currentStep === 2 && !canProceedStep2) ||
                (currentStep === 3 && !canProceedStep3) ||
                (currentStep === 4 && !canProceedStep4) ||
                (currentStep === 6 && !canProceedStep6) ||
                isLoading
              }
              className="flex-1 py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Yaratilmoqda...' : currentStep === 6 ? 'Yakunlash' : 'Davom etish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 1: Role Selection
function Step1({ formData, updateFormData }: { formData: FormData; updateFormData: (u: Partial<FormData>) => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-semibold text-foreground mb-3">Rolingizni tanlang</h2>
        <p className="text-muted-foreground">Platformadan qanday foydalanishni tanlang</p>
      </div>

      <div className="grid gap-4 mt-8">
        <button
          onClick={() => updateFormData({ role: 'job_seeker' })}
          className={cn(
            'p-8 rounded-3xl border-2 transition-all text-left',
            formData.role === 'job_seeker'
              ? 'bg-primary border-primary text-primary-foreground'
              : 'bg-card border-border hover:border-primary/50'
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              'p-3 rounded-2xl',
              formData.role === 'job_seeker' ? 'bg-primary-foreground/10' : 'bg-muted'
            )}>
              <UserCircle className={cn(
                'w-8 h-8',
                formData.role === 'job_seeker' ? 'text-primary-foreground' : 'text-foreground'
              )} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Men ish izlovchiman</h3>
              <p className={cn(
                'text-sm',
                formData.role === 'job_seeker' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              )}>
                Imkoniyatlarni qidirish va ish beruvchilar bilan bog'lanish
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => updateFormData({ role: 'employer' })}
          className={cn(
            'p-8 rounded-3xl border-2 transition-all text-left',
            formData.role === 'employer'
              ? 'bg-primary border-primary text-primary-foreground'
              : 'bg-card border-border hover:border-primary/50'
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              'p-3 rounded-2xl',
              formData.role === 'employer' ? 'bg-primary-foreground/10' : 'bg-muted'
            )}>
              <Briefcase className={cn(
                'w-8 h-8',
                formData.role === 'employer' ? 'text-primary-foreground' : 'text-foreground'
              )} />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Men ish beruvchiman</h3>
              <p className={cn(
                'text-sm',
                formData.role === 'employer' ? 'text-primary-foreground/70' : 'text-muted-foreground'
              )}>
                Iste'dodlarni yollash va ish imkoniyatlarini joylashtirish
              </p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// Step 2: Username
function Step2({ formData, updateFormData, usernameSuffix, setUsernameSuffix }: {
  formData: FormData;
  updateFormData: (u: Partial<FormData>) => void;
  usernameSuffix: string;
  setUsernameSuffix: (s: string) => void;
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-semibold text-foreground mb-3">Foydalanuvchi nomingizni yarating</h2>
        <p className="text-muted-foreground">Noyob ishlab chiquvchi dastagini tanlang</p>
      </div>

      <div className="mt-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={formData.username}
            onChange={(e) => updateFormData({ username: e.target.value })}
            placeholder="jasur"
            className="flex-1 px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-lg text-foreground placeholder:text-muted-foreground"
          />
          <select
            value={usernameSuffix}
            onChange={(e) => setUsernameSuffix(e.target.value)}
            className="px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-lg text-foreground"
          >
            <option value=".dev">.dev</option>
            <option value="_dev">_dev</option>
          </select>
        </div>
        {formData.username && (
          <p className="mt-3 text-sm text-muted-foreground">
            Sizning username bo'ladi: <span className="font-medium text-foreground">{formData.username}{usernameSuffix}</span>
          </p>
        )}
      </div>
    </div>
  );
}

// Step 3: Password
function Step3({ formData, updateFormData }: { formData: FormData; updateFormData: (u: Partial<FormData>) => void }) {
  const strength = formData.password?.length >= 8 ? 'Kuchli' : formData.password?.length >= 6 ? 'O\'rtacha' : 'Zaif';
  const strengthColor = strength === 'Kuchli' ? 'bg-green-500' : strength === 'O\'rtacha' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-semibold text-foreground mb-3">Parolingizni yarating</h2>
        <p className="text-muted-foreground">Kamida 6 ta belgidan iborat bo'lishi kerak</p>
      </div>

      <div className="mt-8">
        <input
          type="password"
          value={formData.password}
          onChange={(e) => updateFormData({ password: e.target.value })}
          placeholder="Parol kiriting"
          className="w-full px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-lg text-foreground placeholder:text-muted-foreground"
        />
        {formData.password && (
          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Parol kuchi</span>
              <span className={cn(
                'text-sm font-medium',
                strength === 'Kuchli' ? 'text-green-500' : strength === 'O\'rtacha' ? 'text-yellow-500' : 'text-red-500'
              )}>
                {strength}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn('h-full transition-all duration-300', strengthColor)}
                style={{ width: `${Math.min((formData.password.length / 12) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Step 4: Verification
function Step4({ formData, updateFormData, verificationMethod, setVerificationMethod }: {
  formData: FormData;
  updateFormData: (u: Partial<FormData>) => void;
  verificationMethod: VerificationMethod;
  setVerificationMethod: (m: VerificationMethod) => void;
}) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-semibold text-foreground mb-3">Kontaktni tekshirish</h2>
        <p className="text-muted-foreground">Siz bilan qanday bog'lanishimiz mumkin</p>
      </div>

      <div className="mt-8 space-y-4">
        <div
          className={cn(
            'p-6 rounded-2xl border-2 transition-all cursor-pointer',
            verificationMethod === 'email' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          )}
          onClick={() => setVerificationMethod('email')}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              verificationMethod === 'email' ? 'border-primary' : 'border-muted-foreground'
            )}>
              {verificationMethod === 'email' && <div className="w-3 h-3 rounded-full bg-primary" />}
            </div>
            <span className="font-medium text-foreground">Elektron pochta manzili</span>
          </div>
          {verificationMethod === 'email' && (
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData({ email: e.target.value })}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>

        <div
          className={cn(
            'p-6 rounded-2xl border-2 transition-all cursor-pointer',
            verificationMethod === 'phone' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
          )}
          onClick={() => setVerificationMethod('phone')}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={cn(
              'w-5 h-5 rounded-full border-2 flex items-center justify-center',
              verificationMethod === 'phone' ? 'border-primary' : 'border-muted-foreground'
            )}>
              {verificationMethod === 'phone' && <div className="w-3 h-3 rounded-full bg-primary" />}
            </div>
            <span className="font-medium text-foreground">Telefon raqami</span>
          </div>
          {verificationMethod === 'phone' && (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => updateFormData({ phone: e.target.value })}
              placeholder="+998 90 123 45 67"
              className="w-full px-4 py-3 rounded-xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>

        <div className="relative py-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-background text-muted-foreground">Yoki davom eting</span>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setVerificationMethod('oauth')}
            className="flex-1 py-4 rounded-2xl border-2 border-border hover:border-primary transition-colors flex items-center justify-center gap-3 bg-card"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-foreground">Google</span>
          </button>
          <button
            onClick={() => setVerificationMethod('oauth')}
            className="flex-1 py-4 rounded-2xl border-2 border-border hover:border-primary transition-colors flex items-center justify-center gap-3 bg-card"
          >
            <Github className="w-5 h-5 text-foreground" />
            <span className="text-foreground">GitHub</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Step 5: Profile Setup
function Step5({ formData, updateFormData }: { formData: FormData; updateFormData: (u: Partial<FormData>) => void }) {
  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
    updateFormData({ skills });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-semibold text-foreground mb-3">Profilingizni o'rnating</h2>
        <p className="text-muted-foreground">Boshqalarga sizni bilishga yordam bering (ixtiyoriy)</p>
      </div>

      <div className="mt-8 space-y-6">
        <div className="flex justify-center">
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-2 border-dashed border-border flex items-center justify-center bg-muted">
              <Upload className="w-8 h-8 text-muted-foreground" />
            </div>
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors">
              +
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Bio</label>
          <textarea
            value={formData.bio}
            onChange={(e) => updateFormData({ bio: e.target.value })}
            placeholder="O'zingiz haqingizda gapirib bering..."
            rows={4}
            className="w-full px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-primary transition-colors resize-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Manzil</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => updateFormData({ location: e.target.value })}
            placeholder="e.g. Toshkent, O'zbekiston"
            className="w-full px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Ko'nikmalar</label>
          <input
            type="text"
            value={formData.skills?.join(', ') || ''}
            onChange={handleSkillsChange}
            placeholder="e.g. React, TypeScript, Node.js"
            className="w-full px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
          />
          <p className="mt-2 text-sm text-muted-foreground">Vergul bilan ajrating</p>
        </div>
      </div>
    </div>
  );
}

// Step 6: Final Requirements
function Step6({ formData, updateFormData }: { formData: FormData; updateFormData: (u: Partial<FormData>) => void }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-semibold text-foreground mb-3">Yakuniy talablar</h2>
        <p className="text-muted-foreground">Ro'yxatdan o'tishni yakunlang</p>
      </div>

      <div className="mt-8 space-y-4">
        <label className="flex items-start gap-4 p-6 rounded-2xl border-2 border-border cursor-pointer hover:border-primary/50 transition-colors bg-card">
          <input
            type="checkbox"
            checked={formData.joined_group}
            onChange={(e) => updateFormData({ joined_group: e.target.checked })}
            className="w-5 h-5 mt-1 rounded border-border text-primary focus:ring-primary"
          />
          <div>
            <div className="font-medium text-foreground mb-1">
              Bizning jamoa guruhiga qo'shiling <span className="text-destructive">*</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Boshqa a'zolar bilan aloqada bo'ling va muhim yangilanishlarni oling
            </p>
          </div>
        </label>

        <label className="flex items-start gap-4 p-6 rounded-2xl border-2 border-border cursor-pointer hover:border-primary/50 transition-colors bg-card">
          <input
            type="checkbox"
            checked={formData.added_friends}
            onChange={(e) => updateFormData({ added_friends: e.target.checked })}
            className="w-5 h-5 mt-1 rounded border-border text-primary focus:ring-primary"
          />
          <div>
            <div className="font-medium text-foreground mb-1">Tavsiya etilgan ulanishlarni qo'shing</div>
            <p className="text-sm text-muted-foreground">
              Biz sizning sohangizdagi odamlar bilan bog'lanishingizga yordam beramiz (ixtiyoriy)
            </p>
          </div>
        </label>

        {!formData.joined_group && (
          <div className="text-amber-600 text-sm bg-amber-500/10 p-4 rounded-xl">
            Ro'yxatdan o'tishni yakunlash uchun siz hamjamiyat guruhiga qo'shilishingiz kerak
          </div>
        )}
      </div>
    </div>
  );
}

export default SignupFlow;
