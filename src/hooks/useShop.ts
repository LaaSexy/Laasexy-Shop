import { useQuery } from 'react-query';

import AxiosUtil from '@/utils/Axios';

const getShopInfo = async (props: any) => {
  const { shop } = props;
  const { data } = await AxiosUtil.get(
    `https://staging.api.pointhub.io/user/shop/${shop}`
  );
  // console.log('data==>', data);
  return data.data;
};

export default function useShop(props: any) {
  return useQuery(['shop', props], () => getShopInfo(props));
}
