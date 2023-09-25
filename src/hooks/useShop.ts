import { useQuery } from 'react-query';

import AxiosUtil from '@/utils/Axios';

const getShopInfo = async (props: any) => {
  const { shop } = props;
  const { data } = await AxiosUtil.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/shop/${shop}`
  );
  return data.data;
};

export default function useShop(props: any) {
  return useQuery(['shop', props], () => getShopInfo(props), {
    enabled: !!props?.shop,
  });
}
