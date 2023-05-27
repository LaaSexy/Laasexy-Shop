import { useQuery } from 'react-query';

import AxiosUtil from '@/utils/Axios';

const get = async (props: any) => {
  const { shop } = props;
  const { data } = await AxiosUtil.get(
    `https://staging.api.pointhub.io/sub-categories/shop/${shop}`
  );
  return data.data;
};

export default function useCategories(props: any) {
  return useQuery(['categories', props], () => get(props));
}
