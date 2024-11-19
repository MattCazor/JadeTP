import { SessionProvider } from 'next-auth/react'
import type { AppProps } from 'next/app'
import { ApolloProviderWrapper } from '../components/apollo-provider-wrapper'
import '../styles/globals.css'

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  return (
    <SessionProvider session={session}>
      <ApolloProviderWrapper>
        <Component {...pageProps} />
      </ApolloProviderWrapper>
    </SessionProvider>
  )
}