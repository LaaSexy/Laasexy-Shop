import { useQuery } from 'react-query';

import AxiosUtil from '@/utils/Axios';

const getItems = async (props: any) => {
  const { shop, branch } = props;
  const { data } = await AxiosUtil.get(
    `${process.env.NEXT_PUBLIC_API_URL}/item/user/shop/${shop}/branch/${branch}`
  );
  return data.data;
};

export default function useItems(props: any) {
  return useQuery(['items', props], () => getItems(props), {
    enabled: !!props?.shop,
  });
}
