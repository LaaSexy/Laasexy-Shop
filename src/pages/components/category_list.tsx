import React, { useEffect } from 'react';

import { List, Skeleton } from 'antd';
import _ from 'lodash';

import useCategories from '@/hooks/useCategories';
import { Category } from '@/types/Item';

const imageUrl = process.env.NEXT_PUBLIC_API_URL;
const CategoryList = (props: any) => {
  const { query, onClick = () => {}, selectedCategoryId, style } = props;
  const { data, isFetching } = useCategories(query);

  const refs = data?.reduce((acc: any, value: any) => {
    // eslint-disable-next-line no-underscore-dangle
    acc[value._id] = React.createRef();
    return acc;
  }, {});

  useEffect(() => {
    const handleMove = (id: string) =>
      refs[id]?.current?.scrollIntoView({
        behavior: 'instant',
        block: 'start',
      });
    if (!selectedCategoryId) return;
    if (selectedCategoryId !== '') {
      handleMove(selectedCategoryId);
    }
  }, [selectedCategoryId, refs]);

  const mock = ['1', '1', '1', '1', '1', '1', '1', '1'];

  const onClickCategory = (category: Category) => {
    onClick(category);
  };

  return (
    <List
      style={style}
      itemLayout="horizontal"
      dataSource={isFetching ? mock : _.orderBy(data, ['index'], ['asc'])}
      renderItem={(item: Category) => (
        <Skeleton loading={isFetching} active>
          {!isFetching && (
            <div
              // eslint-disable-next-line no-underscore-dangle
              key={item._id}
              // eslint-disable-next-line no-underscore-dangle
              ref={refs[item?._id]}
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
                onClick={() => onClickCategory(item)}
                // onClick={() => onClick(item)}
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
        </Skeleton>
      )}
    />
  );
};

export default CategoryList;
