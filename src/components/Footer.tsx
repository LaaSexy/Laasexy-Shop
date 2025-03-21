import React from 'react';
import { Button, Typography, Image, List } from 'antd';
import { useRouter } from 'next/router';

const { Text } = Typography;
const footerData = [
  {
    id: '1',
    title: 'តេឡេក្រាម-ឆាណែល',
    image: '/assets/images/Telegram.gif',
    link: 'https://t.me/Laasexychannel',
  },
  {
    id: '2',
    title: 'ហ្វេសបុក-ផេក',
    image: '/assets/images/Facebook.webp',
    link: 'https://web.facebook.com/profile.php?id=100083222271530',
  },
  {
    id: '3',
    title: 'ទិញក្នុង-តេឡេក្រាមBot',
    image: '/assets/images/4.gif',
    link: 'https://t.me/Tengchantola',
  },
  {
    id: '4',
    title: 'អេតមីន-ដោះស្រាយបញ្ហា',
    image: '/assets/images/2.gif',
    link: 'https://t.me/Tengchantola',
  },
  {
    id: '5',
    title: 'របៀបទិញ',
    image: '/assets/images/3.gif',
    link: 'https://youtube.com',
  },
  {
    id: '6',
    title: 'អំពីពួកយើង',
    image: '/assets/images/about.gif',
    link: '/Laa.Shop/aboutUs',
  },
];

const Footer = () => {
  const router = useRouter();

  const openLink = (url:any) => {
    window.open(url, '_blank');
  };

  const handleAboutus = () => {
    router.push({
      pathname: '/Laa.Shop/aboutUs',
    });
  };

  const handleClick = (id:any, link:any) => {
    if (id === '6') {
      handleAboutus();
    } else {
      openLink(link);
    }
  };

  return (
    <div className="bg-[#303434] dark:bg-[#252727] min-h-[200px] py-6">
      <Text className="text-white dark:text-gray-100 text-2xl text-center flex justify-center items-center mb-8">
        តាមដានពួកយើង:
      </Text>
      <List
        grid={{
          gutter: 16,
          xs: 2,
          sm: 2,
          md: 3,
          lg: 4,
          xl: 4,
        }}
        className="sm:mx-60 mx-3"
        dataSource={footerData}
        renderItem={(item) => (
          <List.Item className="bg-[#504f51] dark:bg-[#3a3c3c] dark:hover:bg-[#555757] transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl rounded-md mx-auto max-w-[300px] hover:bg-[#6f6f70]">
            <Button
              type="text"
              onClick={() => handleClick(item.id, item.link)}
              className="w-full flex items-center justify-start sm:px-3 px-3 p-8 my-3 hover:bg-gray-700 rounded-lg"
            >
              <Image
                src={item.image}
                alt={item.title}
                preview={false}
                width={40}
                height={40}
                className="rounded-lg flex-shrink-0"
              />
              <Text className="text-white ml-3 text-sm sm:text-base">
                {item.title}
              </Text>
            </Button>
          </List.Item>
        )}
      />
      <List
        grid={{
          gutter: 0,
          column: 1,
        }}
        dataSource={[
          {
            content: (
              <div className="mt-3 flex justify-center dark:bg-[#3a3c3c] dark:hover:bg-[#555757] cursor-pointer transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl items-center bg-[#504f51] py-2 px-5 hover:bg-[#6f6f70] rounded-lg">
                <Text className="text-white text-center flex items-center text-base mr-4">
                  បង់ប្រាក់តាមរយះ
                </Text>
                <Image
                  src="/assets/images/QR.webp"
                  alt="QR Code"
                  preview={false}
                  width={80}
                  height={80}
                  className="rounded-lg"
                />
              </div>
            ),
            footer: (
              <div className="flex justify-center items-center">
                <Text className="text-white text-base mt-10">
                  © Copyright 2025, Laa.shop
                </Text>
              </div>
            ),
          },
        ]}
        renderItem={(item) => (
          <List.Item>
            <div className="flex flex-col items-center">
              {item.content}
              {item.footer}
            </div>
          </List.Item>
        )}
      />
    </div>
  );
};

export default Footer;