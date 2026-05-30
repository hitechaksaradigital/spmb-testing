// ============================================
// SUPABASE CLIENT CONFIGURATION
// ============================================
// 
// Untuk menggunakan Supabase:
// 1. Buat project di https://supabase.com
// 2. Copy URL dan Anon Key dari Settings > API
// 3. Ganti nilai SUPABASE_URL dan SUPABASE_ANON_KEY di bawah
//
// ============================================

import { createClient } from '@supabase/supabase-js';

// Supabase Configuration
// Ganti dengan kredensial Supabase Anda
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Validate configuration
if (SUPABASE_URL === 'https://your-project.supabase.co' || SUPABASE_ANON_KEY === 'your-anon-key') {
  console.warn('⚠️ Supabase credentials not configured. Using local mock data.');
  console.warn('Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env file');
}

// Create Supabase client with any type to allow flexible queries
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const supabase = createClient<any>(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return SUPABASE_URL !== 'https://your-project.supabase.co' && 
         SUPABASE_ANON_KEY !== 'your-anon-key';
};

export default supabase;
