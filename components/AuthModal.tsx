'use client';

import React, { useState } from 'react';
import { signUpUser, signInUser, UserProfile } from '@/lib/auth';
import { X, Mail, Lock, User, LogIn, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: UserProfile) => void;
}

export default function AuthModal({ isOpen, onClose, onAuthSuccess }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please fill in all required fields');
      return;
    }

    if (isSignUp && !fullName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }

    setLoading(true);

    if (isSignUp) {
      const { user, error } = await signUpUser(email.trim(), password, fullName.trim());
      setLoading(false);
      if (error) {
        setErrorMsg(error);
      } else if (user) {
        setSuccessMsg('Account created successfully! Welcome to West Bridge News.');
        setTimeout(() => {
          onAuthSuccess(user);
          onClose();
        }, 1200);
      }
    } else {
      const { user, error } = await signInUser(email.trim(), password);
      setLoading(false);
      if (error) {
        setErrorMsg(error);
      } else if (user) {
        setSuccessMsg('Signed in successfully! Welcome back.');
        setTimeout(() => {
          onAuthSuccess(user);
          onClose();
        }, 1000);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl border border-slate-200 animate-fade-in relative text-slate-800">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 text-center pt-2">
          <h3 className="font-extrabold text-2xl text-wbn-navy font-editorial-heading">
            {isSignUp ? 'Join West Bridge News' : 'Welcome Back Reader'}
          </h3>
          <p className="text-xs text-slate-500">
            {isSignUp
              ? 'Create your free account to post comments, love stories, and save reports'
              : 'Sign in to access your verified reader profile and discussions'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-3 rounded-xl text-xs flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div className="space-y-1">
              <label className="block text-[11px] font-extrabold text-wbn-navy uppercase tracking-wider">
                Full Name *
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3" />
                <input
                  type="text"
                  placeholder="e.g. Chief Adeleke Johnson"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold text-wbn-navy uppercase tracking-wider">
              Email Address *
            </label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[11px] font-extrabold text-wbn-navy uppercase tracking-wider">
              Password *
            </label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-wbn-blue"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-wbn-navy hover:bg-wbn-blue text-white font-extrabold text-xs py-3.5 rounded-xl transition-all shadow flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : isSignUp ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Free Reader Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In to Reader Profile</span>
              </>
            )}
          </button>
        </form>

        {/* Toggle Sign In / Sign Up */}
        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsSignUp(false);
                  setErrorMsg(null);
                }}
                className="font-bold text-wbn-blue hover:underline"
              >
                Sign In here
              </button>
            </p>
          ) : (
            <p>
              Don&apos;t have an account yet?{' '}
              <button
                onClick={() => {
                  setIsSignUp(true);
                  setErrorMsg(null);
                }}
                className="font-bold text-wbn-blue hover:underline"
              >
                Sign Up for Free
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
