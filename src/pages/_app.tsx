import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { SupabaseProvider } from './supabaseProvider';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (

    <SupabaseProvider>
      <Component {...pageProps} />
    </SupabaseProvider>
  )
}