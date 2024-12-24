import { useEffect, useRef, useState } from 'react';

import { useAtom } from 'jotai';
import { io, Socket } from 'socket.io-client';

import { tokenAtom } from './useAuth';
import { sessionAtom } from './useSession';

interface UseSocketProps {
  onReceivedOrder?: (data: any) => void;
}

const useSocket = ({ onReceivedOrder = () => {} }: UseSocketProps) => {
  const [session] = useAtom(sessionAtom);
  const [tokenBarer] = useAtom(tokenAtom);
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const hasConnected = useRef(false);

  useEffect(() => {
    if (hasConnected.current) return;
    if (!session || !session._id || !tokenBarer) {
      console.error('Socket: Missing session or token');
      return;
    }
    const tokenId = tokenBarer;
    const sessionId = session._id;
    socketRef.current = io(`${process.env.NEXT_PUBLIC_SOCKET_URL}`, {
      transports: ['websocket'],
      query: { sessionId },
      auth: { token: tokenId },
    });
    const socket = socketRef.current;

    const handleConnect = () => {
      setIsConnected(true);
      hasConnected.current = true;
      console.log('Socket: Connected to server - ', socket.id);
    };

    const handleResponse = (data: any) => {
      console.log('Socket: Server response', data);
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    const handleReceivedOrderUpdate = (data: any) => {
      console.log('Socket: Received order update', data);
      onReceivedOrder(data);
    };

    socket.on('connect', handleConnect);
    socket.on('order-update', handleReceivedOrderUpdate);
    socket.on('response', handleResponse);
    socket.on('disconnect', handleDisconnect);

    // eslint-disable-next-line consistent-return
    return () => {
      if (socket) {
        socket.off('connect', handleConnect);
        socket.off('order-update', handleReceivedOrderUpdate);
        socket.off('response', handleResponse);
        socket.off('disconnect', handleDisconnect);
        socket.disconnect();
      }
    };
  }, [session, tokenBarer, onReceivedOrder]);

  const sendMessage = (event: string, payload?: any) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, payload);
      console.log(`Socket: Message sent: Event=${event}`, payload);
    } else {
      console.error('Socket: Unable to send message, socket not connected');
    }
  };

  return { isConnected, sendMessage };
};

export default useSocket;
