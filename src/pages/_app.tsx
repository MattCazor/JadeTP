import type { AppProps } from 'next/app'
import '../styles/globals.css'
import '../styles/globalicon.css';
import { SupabaseProvider } from './supabaseProvider';
import '@picocss/pico'

export default function App({
  Component,
  pageProps: { ...pageProps },
}: AppProps) {
  return (
    // supabase provider used to share the client among the whole app
    <SupabaseProvider>
      <Component {...pageProps} />
    </SupabaseProvider>
  )
}