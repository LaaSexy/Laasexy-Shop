import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMutation } from 'react-query';

import instanceEOrder from '@/utils/AxiosEOrder';

export interface Session {
  _id: string;
  tableNumber?: number | null;
}
export const sessionAtom = atomWithStorage<Session | null>('session', null);

const createSession = async () => {
  const { data } = await instanceEOrder.post('/sessions');
  return data;
};

export default function useSession() {
  const [, setSession] = useAtom(sessionAtom);
  const { mutate, data } = useMutation(createSession, {
    onSuccess: (sessionData: Session) => {
      if (!sessionData) {
        console.error('Session data is null or undefined.');
        return;
      }
      if (sessionData.tableNumber === null || sessionData.tableNumber === undefined) {
        console.warn('Session tableNumber is null or undefined.');
        return;
      } 
      setSession(sessionData);
      console.log('Session data:', sessionData);
    },
    onError: (error) => {
      console.error('Failed to create session:', error);
    },
  });
  return { mutate, data };
}
