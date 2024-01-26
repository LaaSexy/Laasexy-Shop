/* eslint-disable */
import { useState } from 'react';

import { ConfigProvider, theme } from 'antd';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

import 'antd/dist/reset.css';

import '../styles/global.css';
import '../styles/ant.css';

import useThemeDetector from '@/hooks/useThemeDetector';
import Script from 'next/script';
import { GA_TRACKING_ID } from '@/utils/gtag';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const isDarkTheme = useThemeDetector();
  const GID = GA_TRACKING_ID;
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
            staleTime: 30000,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          algorithm: isDarkTheme ? theme.darkAlgorithm : theme.compactAlgorithm,
          token: {
            colorPrimary: '#6C01C8',
            borderRadius: 8,
          },
        }}
      >
        <Hydrate state={pageProps.dehydratedState}>
          <ThemeProvider attribute="class">
            <Script
              strategy="lazyOnload"
              src={`https://www.googletagmanager.com/gtag/js?id=${GID}`}
            />

            <Script id="google-analytics-script" strategy="lazyOnload">
              {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GID}', {
          page_path: window.location.pathname,
          });
    `}
            </Script>
            <Component {...pageProps} />
          </ThemeProvider>
        </Hydrate>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
