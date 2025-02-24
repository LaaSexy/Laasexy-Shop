import React from 'react';
import { Card, Typography, Image, Row, Col } from 'antd';
import { QRCode } from 'antd';
import AppHeader from './Header';
import Footer from './Footer';
const { Title, Text } = Typography;

const AboutUs = () => {
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

  return (
    <div className='sticky top-0'>
      <AppHeader/>
      <div className="bg-[url('/assets/images/Background1.jpg')] bg-cover bg-center min-h-screen text-white p-5">
        <div className="max-w-6xl mx-auto">
          {/* About Us Section */}
          <Card className="mb-6 bg-gray-800 shadow-lg" bordered={false}>
            <Title level={2} className="text-gold">អំពីពួកយើង</Title>
            <Text>
              Laa.shop គឺជាវេបសាយលក់ទំនិញក្នុងហ្គេមនិងសេវាកម្មឌីជីថលដែលបានចាប់ផ្តើមដំណើរការនៅតាំងពីដើម
              <span className="text-gold"> ឆ្នាំ២០២៥ </span>។ យើងបានចាប់ផ្ដើមដំបូងតាមរយៈ{' '}
              <span className="text-gold">Telegram Bot</span>។ គោលបំណងចម្បងរបស់យើងគឺផ្តល់ជូនអតិថិជននូវសេវាកម្មដែលមានគុណភាពខ្ពស់
              ងាយស្រួលប្រើប្រាស់ និងមានតម្លៃសមរម្យ។
            </Text>
          </Card>

          {/* Our Services Section */}
          <Card className="mb-6 bg-gray-800 shadow-lg" bordered={false}>
            <Title level={2} className="text-gold">សេវាកម្មរបស់យើង</Title>
            <Row gutter={[16, 16]}>
              {services.map((service, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card hoverable className="bg-gray-700" cover={<Image src={service.image} alt={service.title} width={80} height={80}/>}>
                    <Title level={4} className="text-white">
                      {service.title}
                    </Title>
                    <Text>{service.description}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* Payment Methods Section */}
          <Card className="mb-6 bg-gray-800 shadow-lg" bordered={false}>
            <Title level={2} className="text-gold">វិធីបង់ប្រាក់</Title>
            <Text>យើងទទួលការបង់ប្រាក់តាមរយៈ KHQR ដែលអាចស្កេនបានពីគ្រប់ធនាគារនៅកម្ពុជា។</Text>
            <div className="flex justify-center mt-4">
              <QRCode value="https://laa.shop" size={150} />
            </div>
          </Card>

          {/* Why Choose Us Section */}
          <Card className="mb-6 bg-gray-800 shadow-lg" bordered={false}>
            <Title level={2} className="text-gold">ហេតុអ្វីជ្រើសរើសយើង?</Title>
            <Row gutter={[16, 16]}>
              {whyChooseUs.map((item, index) => (
                <Col xs={24} sm={12} md={8} key={index}>
                  <Card hoverable className="bg-gray-700" cover={<Image src={item.image} alt={item.title} width={80} height={80} />}>
                    <Title level={4} className="text-white">
                      {item.title}
                    </Title>
                    <Text>{item.description}</Text>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default AboutUs;
