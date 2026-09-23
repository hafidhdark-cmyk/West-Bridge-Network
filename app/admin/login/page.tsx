'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Lock, Mail, KeyRound, ArrowLeft, Loader2, AlertCircle, ShieldCheck, 
  Eye, EyeOff, Radio, Newspaper, Sparkles 
} from 'lucide-react';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/admin';

  const [email, setEmail] = useState('westbridgenetwork@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json().catch(() => null);

      if (res.ok && data?.success) {
        // Successful login: Redirect directly to admin studio
        router.push(returnUrl);
        router.refresh();
      } else {
        setError(data?.error || 'Invalid editorial email or passkey.');
      }
    } catch (err: any) {
      console.error('Login submit error:', err);
      setError('Authentication failed. Please verify your connection or passkey.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-slate-950 text-white">
      {/* ============================================================== */}
      {/* LEFT COLUMN: SIGN-IN PART (Col 1 to 5 on lg / full on mobile)  */}
      {/* ============================================================== */}
      <div className="lg:col-span-5 flex flex-col justify-between p-6 sm:p-10 md:p-14 lg:p-16 bg-slate-950 relative z-10 border-r border-slate-900/80">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header / Mobile Branding */}
        <div>
          <div className="flex items-center justify-between">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <div className="relative w-9 h-9">
                <Image src="/logo.png" alt="West Bridge News" fill className="object-contain" priority />
              </div>
              <span className="font-extrabold text-sm tracking-wider text-white group-hover:text-blue-400 transition-colors uppercase font-editorial-heading">
                West Bridge News
              </span>
            </Link>

            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Gate</span>
            </span>
          </div>
        </div>

        {/* Main Sign-In Card Content */}
        <div className="my-auto py-8 space-y-7 max-w-md w-full mx-auto">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-black text-white font-editorial-heading tracking-tight">
              Editorial Studio Sign-In
            </h1>
            <p className="text-xs text-slate-400 leading-relaxed">
              Authorized West Bridge News editorial staff only. Public readers and Google AdSense crawlers remain unrestricted across the main network.
            </p>
          </div>

          {/* Error Notification */}
          {error && (
            <div className="p-4 bg-red-500/15 border border-red-500/30 rounded-2xl flex items-start gap-3 text-xs text-red-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400 mt-0.5" />
              <div className="space-y-0.5">
                <span className="font-bold block text-red-200">Sign-in Notice</span>
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Editorial Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
                Editorial Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="westbridgenetwork@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                />
              </div>
            </div>

            {/* Admin Passkey */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-extrabold text-slate-300 uppercase tracking-wider">
                  Admin Passkey
                </label>
                <span className="text-[10px] text-slate-500">Case-sensitive</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter passkey"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-11 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  title={showPassword ? 'Hide passkey' : 'Show passkey'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-2 bg-blue-600 hover:bg-blue-500 text-white font-black text-xs py-3.5 rounded-xl transition-all shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Sign In to Admin Studio</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Navigation */}
        <div className="pt-4 border-t border-slate-900 text-center sm:text-left">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Public News Website</span>
          </Link>
        </div>
      </div>

      {/* ============================================================== */}
      {/* RIGHT COLUMN: WBN LOGO & NEWSROOM BACKGROUND (Col 6 to 12)     */}
      {/* ============================================================== */}
      <div className="hidden lg:col-span-7 lg:relative lg:flex flex-col justify-between p-12 xl:p-16 overflow-hidden bg-slate-900">
        {/* Real High-Resolution Editorial Newsroom Image */}
        <Image
          src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1600&q=85"
          alt="West Bridge News Newsroom"
          fill
          className="object-cover object-center filter saturate-125 brightness-75 scale-105"
          priority
        />

        {/* Deep Editorial Gradient & Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40 z-10" />
        <div className="absolute inset-0 bg-blue-950/20 mix-blend-overlay z-10" />

        {/* Top Right Live Badge */}
        <div className="relative z-20 flex justify-end">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-xs font-black uppercase tracking-wider text-white shadow-xl">
            <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span>Live Editorial Network</span>
          </div>
        </div>

        {/* Center WBN Glowing Logo & Brand Statement */}
        <div className="relative z-20 my-auto text-center space-y-6 max-w-lg mx-auto">
          {/* Glowing WBN Logo */}
          <div className="relative w-32 h-32 mx-auto drop-shadow-[0_15px_35px_rgba(37,99,235,0.45)]">
            <Image
              src="/logo.png"
              alt="West Bridge News Brand"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-3xl xl:text-4xl font-black text-white font-editorial-heading tracking-tight leading-tight">
              WEST BRIDGE NEWS
            </h2>
            <div className="h-0.5 w-16 bg-blue-500 mx-auto rounded-full" />
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              Speed, Accuracy, and Unwavering Journalistic Integrity across West Africa and the Globe.
            </p>
          </div>

          <div className="flex items-center justify-center gap-6 pt-2 text-xs text-slate-300 font-bold uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Multi-Photo Stories
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> WhatsApp Split Previews
            </span>
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Video Reports
            </span>
          </div>
        </div>

        {/* Bottom Editorial Legal Notice */}
        <div className="relative z-20 flex items-center justify-between text-xs text-slate-400 border-t border-white/10 pt-6">
          <span>© 2026 West Bridge News (WBN). All Rights Reserved.</span>
          <span className="text-[11px] text-slate-400 font-medium">Editorial Bureau v2.4</span>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
