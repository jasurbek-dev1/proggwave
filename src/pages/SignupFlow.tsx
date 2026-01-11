import { useState } from 'react';
import { Briefcase, UserCircle, X } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { RegisterData } from '@/services/auth.service';
import { cn } from '@/lib/utils';

interface SignupFlowProps {
  onClose: () => void;
  onSignupComplete: (credentials: { username: string; password: string }) => void;
}

type Role = 'job_seeker' | 'employer';

export function SignupFlow({ onClose, onSignupComplete }: SignupFlowProps) {
  const { register, isLoading } = useAuthContext();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    role: undefined as Role | undefined,
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const totalSteps = 4;

  const canProceedStep1 = formData.role !== undefined;
  const canProceedStep2 = formData.username.length > 0;
  const canProceedStep3 = formData.password.length >= 6;
  const canProceedStep4 = formData.email && formData.firstName && formData.lastName;

  const handleNext = async () => {
    setError('');

    if (currentStep === 4) {
      try {
        const registerData: RegisterData = {
          nickname: formData.username + '.dev',
          password: formData.password,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || undefined,
          address: formData.address || undefined,
          // position: crypto.randomUUID() || undefined,
          role: formData.role,
        };

        const credentials = await register(registerData);
        setSuccess('Muvaffaqiyatli ro\'yxatdan o\'tdingiz!');
        
        setTimeout(() => {
          onSignupComplete(credentials);
          onClose();
        }, 1500);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ro\'yxatdan o\'tish xatosi');
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

  const updateFormData = (updates: Partial<typeof formData>) => {
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
            {currentStep === 1 && <Step1Role formData={formData} updateFormData={updateFormData} />}
            {currentStep === 2 && <Step2Username formData={formData} updateFormData={updateFormData} />}
            {currentStep === 3 && <Step3Password formData={formData} updateFormData={updateFormData} />}
            {currentStep === 4 && <Step4Details formData={formData} updateFormData={updateFormData} />}

            {error && (
              <div className="text-destructive text-sm text-center bg-destructive/10 py-3 rounded-xl mt-6">
                {error}
              </div>
            )}
            
            {success && (
              <div className="text-green-600 text-sm text-center bg-green-50 py-3 rounded-xl mt-6">
                {success}
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
                isLoading
              }
              className="flex-1 py-4 bg-primary text-primary-foreground rounded-full text-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Yuklanmoqda...' : currentStep === 4 ? 'Ro\'yxatdan o\'tish' : 'Davom etish'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step 1: Role Selection
function Step1Role({ formData, updateFormData }: any) {
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
function Step2Username({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-semibold text-foreground mb-3">Username yarating</h2>
        <p className="text-muted-foreground">Avtomatik .dev qo'shiladi</p>
      </div>

      <div className="mt-8">
        <input
          type="text"
          value={formData.username}
          onChange={(e) => updateFormData({ username: e.target.value })}
          placeholder="jasur"
          className="w-full px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-lg text-foreground placeholder:text-muted-foreground"
        />
        {formData.username && (
          <p className="mt-3 text-sm text-muted-foreground">
            Username: <span className="font-medium text-foreground">{formData.username}.dev</span>
          </p>
        )}
      </div>
    </div>
  );
}

// Step 3: Password
function Step3Password({ formData, updateFormData }: any) {
  const strength = formData.password.length >= 8 ? 'Kuchli' : formData.password.length >= 6 ? 'O\'rtacha' : 'Zaif';
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

// Step 4: Details
function Step4Details({ formData, updateFormData }: any) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-3xl font-semibold mb-3">Ma'lumotlaringizni kiriting</h2>
        <p className="text-muted-foreground">Bu ma'lumotlar profildaysiz uchun kerak</p>
      </div>

      <div className="space-y-4 mt-8">
        <input
          type="text"
          value={formData.firstName}
          onChange={(e) => updateFormData({ firstName: e.target.value })}
          placeholder="Ism *"
          className="w-full px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
          required
        />
        
        <input
          type="text"
          value={formData.lastName}
          onChange={(e) => updateFormData({ lastName: e.target.value })}
          placeholder="Familiya *"
          className="w-full px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
          required
        />
        
        <input
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData({ email: e.target.value })}
          placeholder="Email *"
          className="w-full px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
          required
        />
        
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => updateFormData({ phone: e.target.value })}
          placeholder="Telefon (ixtiyoriy)"
          className="w-full px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
        />
        
        <input
          type="text"
          value={formData.address}
          onChange={(e) => updateFormData({ address: e.target.value })}
          placeholder="Manzil (ixtiyoriy)"
          className="w-full px-6 py-4 rounded-2xl border border-border bg-card focus:outline-none focus:border-primary transition-colors text-foreground placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}

export default SignupFlow;



