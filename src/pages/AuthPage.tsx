import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithGoogle, signupWithEmail, loginWithEmail, auth } from '../lib/firebase';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { motion } from 'motion/react';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await loginWithEmail(email, password);
      } else {
        await signupWithEmail(email, password);
      }
      navigate('/');
    } catch (err: any) {
      if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('An account with this email already exists.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password must be at least 6 characters.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password login is not enabled in Firebase. Please enable it in the console.');
      } else {
        setError(err.message || 'An error occurred during authentication.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Failed to authenticate with Google.');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto mt-20"
    >
      <div className="mb-12 border-b border-neutral-900 pb-8 text-center">
        <h1 className="text-3xl font-light tracking-tight mb-2 uppercase tracking-widest">{isLogin ? 'Sign In' : 'Sign Up'}</h1>
        <p className="text-neutral-500 font-serif italic text-lg">{isLogin ? 'Welcome back to Estate.' : 'Create an account to list properties.'}</p>
      </div>

      {error && (
        <div className="p-4 mb-8 bg-red-950/20 border border-red-900/50 text-red-400 text-sm font-light text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleEmailSubmit} className="space-y-8">
        <div className="space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 block">Email</label>
          <Input 
            type="email" 
            required 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="your@email.com" 
          />
        </div>

        <div className="space-y-3">
          <label className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 block">Password</label>
          <Input 
            type="password" 
            required 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="••••••••" 
            minLength={6}
          />
        </div>

        <div className="pt-4 flex flex-col gap-4">
          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? 'Authenticating...' : (isLogin ? 'Sign In' : 'Create Account')}
          </Button>
          
          <Button type="button" variant="outline" size="lg" className="w-full text-sm" onClick={handleGoogleLogin}>
            Continue with Google
          </Button>
        </div>
      </form>

      <div className="mt-12 pt-8 border-t border-neutral-900 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)}
          className="text-[11px] font-bold uppercase tracking-widest text-neutral-500 hover:text-white transition-colors"
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
        </button>
      </div>
    </motion.div>
  );
}
