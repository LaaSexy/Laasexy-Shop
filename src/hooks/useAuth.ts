import { useEffect } from 'react';

import { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMutation } from 'react-query';

import instanceEOrder from '@/utils/AxiosEOrder';

export const tokenAtom = atomWithStorage('token', []);
const setTokenHeaders = async (token: string) => {
  instanceEOrder.interceptors.request.use((config: AxiosRequestConfig) => {
    const internalConfig = config as InternalAxiosRequestConfig;
    internalConfig.headers.Authorization = `Bearer ${token}`;
    return internalConfig;
  });
};

const getAccessToken = async (params: any) => {
  const { data } = await instanceEOrder.post('/auth/get-token', params);
  return data;
};

export default function useAuthications() {
  const [, setToken] = useAtom(tokenAtom);
  const { mutate, data, isSuccess } = useMutation(getAccessToken);
  useEffect(() => {
    if (isSuccess) {
      setTokenHeaders(data?.token);
      setToken(data?.token);
    }
  }, [data, isSuccess]);
  return { mutate, data, isSuccess };
}
