import { useQuery } from 'react-query';

import AxiosUtil from '@/utils/Axios';

const getItems = async (props: any) => {
  const { shop, branch } = props;
  const { data } = await AxiosUtil.get(
    `${process.env.NEXT_PUBLIC_API_URL}/item/user/shop/${shop}/branch/${branch}`
  );
  return data.data;
};

const getV2Items = async (branch: string) => {
  const { data } = await AxiosUtil.get(
    `${process.env.NEXT_PUBLIC_API_URL}/user/shop/menu/${branch}`
  );
  return data.data;
};

export default function useItems(props: any) {
  return useQuery(['items', props], () => getItems(props), {
    enabled: !!props?.shop,
  });
}

export function useV2Items(branch: any) {
  return useQuery(['itemsV2', branch], () => getV2Items(branch), {
    enabled: !!branch,
  });
}
