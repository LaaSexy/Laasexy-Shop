import { useMutation } from 'react-query';

import instanceEOrder from '@/utils/AxiosEOrder';

// Assuming sessionId is a string
const fetchOrderSessionId = async ({ sessionId }: { sessionId: string }) => {
  const { data } = await instanceEOrder.get(`/eorders/${sessionId}`);
  return data;
};

export default function useOrderSessionId() {
  return useMutation(fetchOrderSessionId);
}
