/* eslint-disable */
import {  useState } from 'react';

import { ConfigProvider, theme } from 'antd';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

import 'antd/dist/reset.css';

import '../styles/global.css';
import useThemeDetector from '@/hooks/useThemeDetector';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const isDarkTheme = useThemeDetector();

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
            <Component {...pageProps} />
          </ThemeProvider>
        </Hydrate>
      </ConfigProvider>
    </QueryClientProvider>
  );
};

export default MyApp;
