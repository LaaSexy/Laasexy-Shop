import { useMutation } from 'react-query';

import instanceEOrder from '@/utils/AxiosEOrder';
import { atomWithStorage } from 'jotai/utils';
import { useAtom } from 'jotai';
export const orderIdAtom = atomWithStorage('orderId', null);
const createOrder = async (param: any) => {
  const { data } = await instanceEOrder.post('/eorders', param);
  return data;
};

export default function useOrder() {
  const [, setDeviceId] = useAtom(orderIdAtom); 
  const { mutate, data} = useMutation(createOrder, {
    onSuccess: (data) => {
      console.log('Order created successfully:', data);
      setDeviceId(data?.orderId);
    },
    onError: (error) => {
      console.error('Error creating order:', error);
    },
  });
  return { mutate, data };
}
