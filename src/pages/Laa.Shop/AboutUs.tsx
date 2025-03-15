import React from 'react';
import { Card, Typography, Image, Row, Col, Button } from 'antd';
import AppHeader from '../../components/Header';
import { useRouter } from 'next/router';
const { Title, Text } = Typography;

const AboutUs = () => {
  const router = useRouter();
  const services = [
    {
      title: 'បុកលុយហ្គេម',
      description: 'Mobile Legends, Free Fire, PUBG',
      image: '/assets/images/5.gif',
    },
    {
      title: 'សេវាកម្ម TikTok',
      description: 'Likes, Views, និងសេវាកម្មផ្សេងៗ',
      image: '/assets/images/Tiktok.png',
    },
    {
      title: 'សេវាកម្ម Facebook',
      description: 'Likes, Views, Follow, និងសេវាកម្មផ្សេងៗ',
      image: '/assets/images/Facebook.png',
    },
  ];

  const whyChooseUs = [
    {
      title: 'រហ័សទាន់ចិត្ត',
      description: 'ដំណើរការភ្លាមៗក្រោយពេលបង់ប្រាក់',
      image: '/assets/images/6.gif',
    },
    {
      title: 'មានសុវត្ថិភាព',
      description: 'ប្រព័ន្ធបង់ប្រាក់មានសុវត្ថិភាព',
      image: '/assets/images/7.gif',
    },
    {
      title: 'តម្លៃសមរម្យ',
      description: 'តម្លៃល្អបំផុតសម្រាប់អតិថិជន',
      image: '/assets/images/8.gif',
    },
  ];

  const handleBack = () => {  
    router.push({
      pathname: '/Laa.Shop/Index',
    });
  };

  return (
    <div className='sticky top-0'>
      <AppHeader/>
      <div className="bg-[url('/assets/images/Background1.jpg')] bg-cover bg-center min-h-screen text-white p-5">
        <div className='flex justify-start items-center mt-5'>
          <Button size="large" onClick={handleBack} className='border-none !text-white bg-gray-800 !text-lg flex justify-center items-center'>⬅️ Back</Button>
        </div>
        <div className="max-w-6xl mx-auto mt-10">
          {/* About Us Section */}
          <Card className="mb-6 bg-gray-800 shadow-lg" bordered={false}>
            <Title level={3} className="!text-yellow-400">អំពីពួកយើង</Title>
            <Text className='text-base text-white'>
              Laa.shop គឺជាវេបសាយលក់ទំនិញក្នុងហ្គេមនិងសេវាកម្មឌីជីថលដែលបានចាប់ផ្តើមដំណើរការនៅតាំងពីដើម
              <span className="text-yellow-400 cursor-pointer"> ឆ្នាំ២០២៥ </span>។ យើងបានចាប់ផ្ដើមដំបូងតាមរយៈ{' '}
              <span className="text-yellow-400 cursor-pointer">Telegram Bot</span>។ គោលបំណងចម្បងរបស់យើងគឺផ្តល់ជូនអតិថិជននូវសេវាកម្មដែលមានគុណភាពខ្ពស់
              ងាយស្រួលប្រើប្រាស់ និងមានតម្លៃសមរម្យ។.
            </Text>
          </Card>

          {/* Our Services Section */}
          <Card className="mb-6 bg-gray-800 shadow-lg " bordered={false}>
            <Title level={3} className="!text-yellow-400">សេវាកម្មរបស់យើង</Title>
            <Row gutter={[16, 16]}>
              {services.map((service, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card
                    hoverable
                    className="bg-gray-700 flex border-none hover:bg-gray-600 flex-col transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl justify-center items-center "
                  >
                    <div className='flex justify-center items-center'>
                      <Image
                        className="rounded-xl object-cover"
                        src={service.image}
                        alt={service.title}
                        height={90}
                        width={90}
                        preview={false}
                      />
                    </div>
                    <Title level={4} className="!text-white text-center mt-4">
                      {service.title}
                    </Title>
                    <Text className="text-white flex justify-center items-center">{service.description}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Payment Methods Section */}
          <Card className="mb-6 bg-gray-800 shadow-lg" bordered={false}>
            <Title level={3} className="!text-yellow-400">វិធីបង់ប្រាក់</Title>
            <Text className='text-base text-center mb-6 text-white'>
              យើងទទួលការបង់ប្រាក់តាមរយៈ KHQR ដែលអាចស្កេនបានពីគ្រប់ធនាគារនៅកម្ពុជា។
            </Text>
            <div className="flex justify-center items-center">
              <Col xs={24} sm={12} md={8} className="flex justify-center items-center">
                <Card hoverable className="bg-gray-700 mt-5 border-none hover:bg-gray-600 flex flex-col transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl justify-center items-center ">
                  <div className='flex justify-center items-center'>
                    <Image src='/assets/images/QR.webp'  
                      height={90}
                      width={90} 
                      preview={false} 
                      className='object-cover rounded-xl'
                    />
                  </div>
                  <Title level={4} className='!text-white text-center mt-4'>បាគង​ QR CODE</Title>
                </Card>
              </Col>
            </div>
          </Card>


          {/* Why Choose Us Section */}
          <Card className=" bg-gray-800 shadow-lg" bordered={false}>
            <Title level={3} className="!text-yellow-400">ហេតុអ្វីជ្រើសរើសយើង?</Title>
            <Row gutter={[16, 16]}>
              {whyChooseUs.map((item, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card hoverable className="bg-gray-700  border-none hover:bg-gray-600 flex flex-col justify-center items-center h-full transform transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                    <div className='flex justify-center items-center'>
                      <Image 
                        src={item.image} 
                        alt={item.title}  
                        preview={false}
                        width={90} 
                        height={90}
                      />
                    </div>
                    <Title level={4} className="!text-white text-center mt-4">
                      {item.title}
                    </Title>
                    <Text className='text-white flex justify-center items-center'>{item.description}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
