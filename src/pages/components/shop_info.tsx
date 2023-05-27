import { Col, Image } from 'antd';

// import useShop from '@/hooks/useShop';

const ShopInfo = () => {
  // const { query } = props;
  // const { data } = useShop(query);

  return (
    <div className=" flex flex-nowrap items-center rounded-l-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 p-3 shadow-lg shadow-indigo-500/50">
      <Col span={9}>
        <Image
          alt="Logo"
          preview={false}
          className="rounded-full "
          src="https://api.pointhub.io/image/2022-11-02T024207.380Z-userProfile.jpg"
        />
      </Col>

      <div className="pl-3">
        <h1 className="text-2xl font-bold text-white">Kien Svay View</h1>
        <p className="text-sm text-white">ភូមិធំ ស្រុកកៀនស្វាយ ខេត្តកណ្ដាល</p>
      </div>
    </div>
  );
};

export default ShopInfo;
