import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, Check, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';
import UserAvatar from './UserAvatar';

interface LoginViewProps {
  onLoginSuccess: (email: string) => void;
}

export default function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [email, setEmail] = useState('Sachin');
  const [password, setPassword] = useState('password');
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authSuccess, setAuthSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in all credentials.');
      return;
    }

    setErrorMessage('');
    setIsAuthenticating(true);

    // Simulate verification
    setTimeout(() => {
      setIsAuthenticating(false);
      setAuthSuccess(true);
      
      // Complete transition after animation
      setTimeout(() => {
        onLoginSuccess(email);
      }, 1000);
    }, 1500);
  };

  return (
    <div className="bg-surface min-h-screen w-full overflow-hidden relative font-sans text-on-surface antialiased flex items-center justify-center p-6 selection:bg-primary-container selection:text-on-primary-container">
      {/* Decorative Blur Blobs */}
      <div 
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-primary-container/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" 
        style={{ animationDuration: '8s' }}
      />
      <div 
        className="absolute bottom-[-10%] right-[-5%] w-[60vw] h-[60vw] bg-secondary-container/20 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" 
        style={{ animationDuration: '12s', animationDelay: '2s' }}
      />
      <div 
        className="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] bg-tertiary-container/10 rounded-full mix-blend-multiply filter blur-[100px] animate-pulse" 
        style={{ animationDuration: '10s', animationDelay: '1s' }}
      />

      {/* Main Container Stage */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex items-center justify-center min-h-[90vh]">
        {!authSuccess ? (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          >
            {/* Left Side: Branding and Pitch */}
            <div className="flex flex-col gap-6 max-w-xl mx-auto lg:mx-0 text-center lg:text-left z-20">
              <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur-md border border-white/40 shadow-sm px-4 py-2 rounded-full w-max mx-auto lg:mx-0">
                <div className="w-2.5 h-2.5 rounded-full bg-tertiary-container animate-pulse shadow-[0_0_8px_rgba(0,122,83,0.6)]" />
                <span className="font-semibold text-xs text-primary uppercase tracking-wide">
                  BookWise AI Systems
                </span>
              </div>
              
              <h1 className="font-black text-4xl sm:text-5xl lg:text-6xl text-on-surface tracking-tight leading-none">
                Next-Gen <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Resource Booking Platform
                </span>
              </h1>
              
              <p className="text-on-surface-variant text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0 font-normal">
                Experience zero booking conflicts with AI-driven allocation. Streamline your campus facilities, labs, and equipment with intelligent scheduling.
              </p>
            </div>

            {/* Right Side: Login Card */}
            <div className="flex justify-center z-20 w-full">
              <div className="glass-panel w-full max-w-[440px] rounded-3xl p-8 sm:p-10 flex flex-col gap-8 border border-white/60 shadow-2xl">
                <div className="flex flex-col gap-2 text-center">
                  <h2 className="font-bold text-2xl text-on-surface tracking-tight">Welcome back</h2>
                  <p className="text-sm text-on-surface-variant font-medium">Select a demo profile or enter your credentials below.</p>
                  
                  {/* Demo Profile Selector */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setEmail('Sachin');
                        setPassword('password');
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                        email.toLowerCase() === 'sachin'
                          ? 'border-primary bg-primary/10'
                          : 'border-white/40 bg-white/40 hover:bg-white/70'
                      }`}
                    >
                      <UserAvatar name="Sachin" className="w-8 h-8 border border-primary/20 text-xs" />
                      <div>
                        <div className="text-xs font-bold text-on-surface">Sachin</div>
                        <div className="text-[10px] text-on-surface-variant font-medium">Student (ID: 1)</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEmail('Rahul');
                        setPassword('password');
                      }}
                      className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all text-left cursor-pointer ${
                        email.toLowerCase() === 'rahul'
                          ? 'border-primary bg-primary/10'
                          : 'border-white/40 bg-white/40 hover:bg-white/70'
                      }`}
                    >
                      <UserAvatar name="Rahul" className="w-8 h-8 border border-primary/20 text-xs" />
                      <div>
                        <div className="text-xs font-bold text-on-surface">Rahul</div>
                        <div className="text-[10px] text-on-surface-variant font-medium">Student (ID: 2)</div>
                      </div>
                    </button>
                  </div>
                </div>

                {errorMessage && (
                  <div className="bg-error-container/30 text-error border border-error/20 p-3.5 rounded-2xl flex items-center gap-3 text-sm font-medium animate-shake">
                    <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                  <div className="flex flex-col gap-4">
                    {/* Username/Email Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-on-surface uppercase tracking-wider pl-1" htmlFor="email">
                        Email or Username
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                        <input
                          id="email"
                          type="text"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="admin@university.edu"
                          disabled={isAuthenticating}
                          className="w-full bg-white/90 border border-outline-variant/60 rounded-xl py-3 pl-11 pr-4 text-on-surface font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm disabled:opacity-50"
                        />
                      </div>
                    </div>

                    {/* Password Input */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-semibold text-on-surface uppercase tracking-wider pl-1" htmlFor="password">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-outline w-5 h-5" />
                        <input
                          id="password"
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          disabled={isAuthenticating}
                          className="w-full bg-white/90 border border-outline-variant/60 rounded-xl py-3 pl-11 pr-4 text-on-surface font-medium text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm disabled:opacity-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Keep Signed In & Forgot Pass */}
                  <div className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer group select-none">
                      <div className="relative flex items-center justify-center w-5 h-5">
                        <input
                          type="checkbox"
                          checked={keepSignedIn}
                          disabled={isAuthenticating}
                          onChange={(e) => setKeepSignedIn(e.target.checked)}
                          className="peer appearance-none w-5 h-5 border border-outline-variant rounded-md bg-white/90 checked:bg-primary checked:border-primary focus:ring-2 focus:ring-primary focus:ring-offset-1 transition-all cursor-pointer disabled:opacity-50"
                        />
                        <Check className="absolute text-white w-3.5 h-3.5 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity stroke-[3px]" />
                      </div>
                      <span className="text-sm text-on-surface-variant group-hover:text-on-surface transition-colors font-medium">
                        Keep me signed in
                      </span>
                    </label>
                    <button
                      type="button"
                      onClick={() => alert('Reset link: Simulated email sent!')}
                      className="text-xs font-semibold text-primary hover:text-secondary transition-colors cursor-pointer"
                    >
                      Forgot password?
                    </button>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col gap-4 pt-2">
                    <button
                      type="submit"
                      disabled={isAuthenticating}
                      className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg hover:shadow-xl hover:opacity-95 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-80"
                    >
                      {isAuthenticating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>Authenticating...</span>
                        </>
                      ) : (
                        <>
                          <span>Sign In</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <div className="relative flex items-center py-2">
                      <div className="flex-grow border-t border-outline-variant/30" />
                      <span className="flex-shrink-0 mx-4 text-xs font-bold text-outline">OR</span>
                      <div className="flex-grow border-t border-outline-variant/30" />
                    </div>

                    {/* Google Login */}
                    <button
                      type="button"
                      disabled={isAuthenticating}
                      onClick={() => {
                        setIsAuthenticating(true);
                        setTimeout(() => {
                          setIsAuthenticating(false);
                          setAuthSuccess(true);
                          setTimeout(() => {
                            onLoginSuccess('admin@university.edu');
                          }, 1000);
                        }, 1200);
                      }}
                      className="w-full py-3.5 px-6 rounded-xl bg-white/60 hover:bg-white/90 border border-outline-variant/60 text-on-surface font-semibold text-sm shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                    >
                      <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span>Sign in with Google</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Authentication Successful Transition Screen */
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md mx-auto text-center"
          >
            <div className="glass-panel p-10 rounded-3xl flex flex-col items-center gap-6 shadow-2xl border border-white/60">
              <div className="w-20 h-20 rounded-full bg-tertiary-container/10 text-tertiary-container flex items-center justify-center mb-2 shadow-inner">
                <Check className="w-10 h-10 stroke-[3px]" />
              </div>
              <h2 className="font-bold text-3xl text-on-surface tracking-tight">Authentication Successful</h2>
              <p className="text-on-surface-variant text-base leading-relaxed">
                Welcome to the BookWise AI Dashboard. Navigating to your resources...
              </p>
              <div className="w-full bg-surface-container-high h-2.5 rounded-full mt-2 overflow-hidden shadow-inner">
                <motion.div 
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 0.9, ease: 'easeInOut' }}
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
