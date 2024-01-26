import { useEffect } from 'react';

import { Col, Image } from 'antd';

import { event } from '@/utils/gtag';

const ShopInfo = (props: any) => {
  const { data } = props;

  useEffect(() => {
    if (data?.shop) {
      event({
        action: data.shop.name,
        label: data.shop.currency,
        category: 'shop',
      });
    }
  }, [data]);

  return (
    <div className="sticky top-0   z-50 flex min-h-fit flex-nowrap items-center bg-white bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3 shadow-lg shadow-indigo-500/50">
      <Col span={6}>
        <Image
          alt="Logo"
          className="p-1"
          preview={false}
          src={`https://api.pointhub.io${data?.logoUrl}`}
        />
      </Col>

      <div className="pl-5">
        <span className="m-0 p-0 text-lg text-white">Welcome to</span>
        <h1 className="m-0 p-0 text-2xl font-bold text-white">{data?.name}</h1>
      </div>
    </div>
  );
};

export default ShopInfo;
