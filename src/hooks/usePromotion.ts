import { useQuery } from 'react-query';

import AxiosUtil from '@/utils/Axios';

const getPromotions = async (props: any) => {
  const { shop } = props;
  const { data } = await AxiosUtil.get(
    `${process.env.NEXT_PUBLIC_API_URL}/promotion/${shop}`
  );
  return data.data;
};

export default function usePromotions(props: any) {
  return useQuery(['promotions', props], () => getPromotions(props), {
    enabled: !!props?.shop,
  });
}
