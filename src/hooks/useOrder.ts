import { useMutation } from 'react-query';

import instanceEOrder from '@/utils/AxiosEOrder';

const createOrder = async (param: any) => {
  const { data } = await instanceEOrder.post('/eorders', param);
  return data.data;
};

export default function useOrder() {
  const { mutate, data } = useMutation(createOrder, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  return { mutate, data };
}
