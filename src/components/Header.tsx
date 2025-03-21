import React from 'react';
import { Button, Image, Layout, Typography } from 'antd';

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = () => {
  const openLink = (url:any) => {
    window.open(url, '_blank');
  };

  return (
    <Header className="bg-gray-800 dark:bg-gray-900 flex sticky top-0 z-10 items-center justify-between px-4 h-20">
      <div className="flex items-center gap-4">
        <Button
          type="link"
          onClick={() => openLink('https://laasexy.github.io/LaaSexy-Portfolio/')}
          className="p-0 h-auto"
        >
          <Image
            src="/assets/images/laasexys.png"
            alt="LaaSexy Logo"
            preview={false}
            width={48}
            height={48}
            className="rounded-full border border-yellow-400 object-cover dark:border-yellow-500"
          />
        </Button>
        <Text strong className="text-yellow-400 m-0 sm:text-xl text-lg dark:text-yellow-300">
          Laa.shop
        </Text>
      </div>
      <Text strong className="text-white sm:text-xl text-lg dark:text-gray-100">
        សេវាកម្មមានតម្លៃសមរម្យបំផុត
      </Text>
    </Header>
  );
}

export default AppHeader;