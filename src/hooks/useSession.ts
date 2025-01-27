import { useAtom } from 'jotai';
import { useMutation } from 'react-query';
import { useEffect, useState } from 'react';
import instanceEOrder from '@/utils/AxiosEOrder';
import { atomWithStorage } from 'jotai/utils';

// Define the Session interface
export interface Session {
  _id: string;
  tableNumber?: number | null;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// Define the session atom
export const sessionAtom = atomWithStorage<Session | null>('session', null);

// Define the type for the session creation parameters
interface CreateSessionParams {
  latitude: number;
  longitude: number;
}

// Function to create a session
const createSession = async (params: CreateSessionParams): Promise<Session> => {
  const { data } = await instanceEOrder.post<Session>('/sessions', params);
  return data;
};

// Define the return type for the useSession hook
interface UseSessionReturn {
  mutateSession: () => void;
  retryLocationPermission: () => void;
  locationError: string | null;
  isLocationLoading: boolean;
  locationPermission: 'default' | 'granted' | 'denied';
  showLocationAlert: boolean;
  handleCloseLocationAlert: () => void;
}

// useSession hook
export default function useSession(): UseSessionReturn {
  const [, setSession] = useAtom(sessionAtom);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState<boolean>(true);
  const [locationPermission, setLocationPermission] = useState<'default' | 'granted' | 'denied'>('default');
  const [showLocationAlert, setShowLocationAlert] = useState<boolean>(false);

  // Mutation to create a session
  const { mutate } = useMutation<Session, Error, CreateSessionParams>(createSession, {
    onSuccess: (sessionData: Session) => {
      if (!sessionData) {
        console.error('Session data is null or undefined.');
        return;
      }
      setSession(sessionData);
      console.log('Session created successfully:', sessionData);
    },
    onError: (error: Error) => {
      setSession(null);
      console.error('Failed to create session:', error);
    },
  });

  // Fetch user's location
  const fetchLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          const { latitude, longitude } = coords;
          console.log({ latitude, longitude });
          setLocation({ latitude, longitude });
          setIsLocationLoading(false);
          setLocationPermission('granted');
          setShowLocationAlert(false); // Hide alert if location is fetched successfully
          mutate({ latitude, longitude });
        },
        (error: GeolocationPositionError) => {
          setLocationError(error.message);
          setIsLocationLoading(false);
          setLocationPermission('denied');
          setShowLocationAlert(true); // Show alert if location permission is denied
          if (error.code === error.PERMISSION_DENIED) {
            console.log('Location permission denied. Retrying in 5 seconds...');
            setTimeout(() => {
              fetchLocation();
            }, 5000);
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocationLoading(false);
      setLocationPermission('denied');
      setShowLocationAlert(true); // Show alert if geolocation is not supported
    }
  };

  // Retry location permission
  const retryLocationPermission = () => {
    setLocationError(null);
    setIsLocationLoading(true);
    setLocationPermission('default');
    setShowLocationAlert(false); // Hide alert when retrying
    fetchLocation();
  };

  // Close location alert
  const handleCloseLocationAlert = () => {
    setShowLocationAlert(false);
  };

  // Fetch location on component mount
  useEffect(() => {
    fetchLocation();
  }, []);

  // Mutate session only if location is available
  const mutateSession = () => {
    if (location) {
      mutate({ latitude: location.latitude, longitude: location.longitude });
    } else {
      console.error('Location is not available');
    }
  };

  return {
    mutateSession,
    retryLocationPermission,
    locationError,
    isLocationLoading,
    locationPermission,
    showLocationAlert,
    handleCloseLocationAlert,
  };
}