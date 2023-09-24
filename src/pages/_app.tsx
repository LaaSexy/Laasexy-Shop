/* eslint-disable */
import { useState } from 'react';

import { ConfigProvider, theme } from 'antd';
import { AppProps } from 'next/app';
import { ThemeProvider, useTheme } from 'next-themes';
import { Hydrate, QueryClient, QueryClientProvider } from 'react-query';

import 'antd/dist/reset.css';

import '../styles/global.css';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const { theme: nextThem } = useTheme();

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
          algorithm:
            nextThem === 'light' ? theme.compactAlgorithm : theme.darkAlgorithm,
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
