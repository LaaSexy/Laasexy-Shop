import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMutation } from 'react-query';

import instanceEOrder from '@/utils/AxiosEOrder';

export interface Session {
  _id: string;
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
      setSession(sessionData);
    },
  });
  return { mutate, data };
}
