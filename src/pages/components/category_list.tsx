import { List } from 'antd';
import _ from 'lodash';

import useCategories from '@/hooks/useCategories';
import { Category } from '@/types/Item';

const imageUrl = process.env.NEXT_PUBLIC_API_URL;
const CategoryList = (props: any) => {
  const { query, onClick = () => {} } = props;
  const { data, isFetching } = useCategories(query);
  // const { data: promotion, isFetching: promotionFetching } =
  //   usePromotions(query);

  // const contentStyle: React.CSSProperties = {
  //   height: '160px',
  //   color: '#fff',
  //   lineHeight: '160px',
  //   textAlign: 'center',
  //   background: '#364d79',
  // };

  // <Carousel dotPosition={'bottom'}>
  //       <div>
  //         <div
  //           style={{
  //             backgroundSize: 'cover',
  //             height: 280,
  //             backgroundImage: `url(https://cdn.pixabay.com/photo/2023/05/15/18/14/bird-7995668_1280.jpg)`,
  //           }}
  //         >
  //           {/* <p>Learn more</p> */}
  //         </div>
  //       </div>
  //       <div>
  //         <div
  //           style={{
  //             backgroundSize: 'cover',
  //             height: 280,
  //             backgroundImage: `url(https://www.shutterstock.com/image-vector/special-offer-final-sale-banner-600w-1387497926.jpg)`,
  //           }}
  //         >
  //           {/* <p style={contentStyle}></p> */}
  //         </div>
  //       </div>
  //     </Carousel>

  return (
    <>
      <List
        itemLayout="horizontal"
        dataSource={_.orderBy(data, ['index'], ['asc'])}
        loading={isFetching}
        renderItem={(item: Category) => (
          <div
            style={{
              backgroundSize: 'cover',
              height: 168,
              backgroundImage: item?.imageUrl
                ? `url(${`${imageUrl + item.imageUrl}`})`
                : '',
            }}
            className="my-2 items-center rounded-md bg-gradient-to-r from-blue-500 to-transparent"
          >
            <button
              onClick={() => onClick(item)}
              className="h-full w-full rounded-md bg-black/20  backdrop-brightness-75"
            >
              <span className=" z-10 m-0 p-0 text-center   text-2xl   font-bold text-white drop-shadow-md">
                {item.name}
              </span>
              <br />
              {item.subName && (
                <span className="m-0 p-0  text-center text-sm  text-white drop-shadow-md">
                  {item.subName}
                </span>
              )}
            </button>
          </div>
        )}
      />
    </>
  );
};

export default CategoryList;
