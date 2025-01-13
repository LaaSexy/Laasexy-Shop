import { useAtom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { useMutation } from 'react-query';
import { useEffect, useState } from 'react';

import instanceEOrder from '@/utils/AxiosEOrder';
// import useAuthications from './useAuth';

export interface Session {
  _id: string;
  tableNumber?: number | null;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export const sessionAtom = atomWithStorage<Session | null>('session', null);

const createSession = async (params: any) => {
  console.log({params})
  const { data } = await instanceEOrder.post('/sessions', params);
  return data;
};

export default function useSession() {
  const [, setSession] = useAtom(sessionAtom);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(true);
 
  // Fetch user's location
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          console.log({latitude,longitude})
          setLocation({ latitude, longitude });
 
          setIsLocationLoading(false);
        },
        (error) => {
          setLocationError(error.message);
          setIsLocationLoading(false);
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocationLoading(false);
    }
  }, []);
  
  // Create session with location
  const { mutate, data } = useMutation(createSession, {
    onSuccess: (sessionData: Session) => {
      if (!sessionData) {
        console.error('Session data is null or undefined.');
        return;
      }
      setSession(sessionData);
      console.log('Session created successfully:', sessionData);
    },
    onError: (error) => {
      console.error('Failed to create session:', error);
    },
  });

  // const { mutate , data } = useMutation(createSession)
 
  const mutateSession=()=>{
    mutate({latitude:location?.latitude, longitude:location?.longitude})
  }

  return { mutateSession, data, locationError, isLocationLoading };
}