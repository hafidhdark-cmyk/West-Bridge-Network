import { supabase } from './supabase';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
}

export async function signUpUser(email: string, password: string, fullName: string): Promise<{ user: UserProfile | null; error: string | null }> {
  if (!supabase) {
    // Local fallback for offline mode
    const fakeUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName: fullName || email.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || email)}`,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('wbn_current_user', JSON.stringify(fakeUser));
    }
    return { user: fakeUser, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || email)}`,
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: data.user.user_metadata?.full_name || fullName || email.split('@')[0],
        avatarUrl: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(fullName || email)}`,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('wbn_current_user', JSON.stringify(profile));
      }
      return { user: profile, error: null };
    }

    return { user: null, error: 'Registration pending email confirmation' };
  } catch (e: any) {
    return { user: null, error: e.message || 'Registration failed' };
  }
}

export async function signInUser(email: string, password: string): Promise<{ user: UserProfile | null; error: string | null }> {
  if (!supabase) {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('wbn_current_user') : null;
    if (stored) {
      return { user: JSON.parse(stored), error: null };
    }
    const fakeUser: UserProfile = {
      id: `usr-${Date.now()}`,
      email,
      fullName: email.split('@')[0],
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    };
    if (typeof window !== 'undefined') {
      localStorage.setItem('wbn_current_user', JSON.stringify(fakeUser));
    }
    return { user: fakeUser, error: null };
  }

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      const profile: UserProfile = {
        id: data.user.id,
        email: data.user.email || email,
        fullName: data.user.user_metadata?.full_name || email.split('@')[0],
        avatarUrl: data.user.user_metadata?.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem('wbn_current_user', JSON.stringify(profile));
      }
      return { user: profile, error: null };
    }

    return { user: null, error: 'Invalid login credentials' };
  } catch (e: any) {
    return { user: null, error: e.message || 'Login failed' };
  }
}

export async function signOutUser(): Promise<void> {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('wbn_current_user');
  }
  if (supabase) {
    await supabase.auth.signOut();
  }
}

export function getLocalUser(): UserProfile | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('wbn_current_user');
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch (e) {
    return null;
  }
}
