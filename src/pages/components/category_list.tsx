import { List } from 'antd';
import _ from 'lodash';

import useCategories from '@/hooks/useCategories';
import { Category } from '@/types/Item';

const imageUrl = 'https://staging.api.pointhub.io';
const CategoryList = (props: any) => {
  const { query, onClick = () => {} } = props;
  const { data, isFetching } = useCategories(query);

  return (
    <List
      itemLayout="horizontal"
      dataSource={_.orderBy(data, ['index'], ['asc'])}
      loading={isFetching}
      renderItem={(item: Category) => (
        <div
          style={{
            backgroundSize: 'cover',

            height: 200,
            backgroundImage: item?.imageUrl
              ? `url(${`${imageUrl + item.imageUrl}`})`
              : '',
          }}
          className="my-2 items-center rounded-md bg-gradient-to-r from-blue-500 to-transparent "
        >
          <button
            onClick={() => onClick(item)}
            className="h-full w-full rounded-md bg-black/20 py-8  backdrop-brightness-90"
          >
            <p className="z-10 text-center font-sans text-xl font-bold text-white drop-shadow-xl">
              {item.name}
            </p>
          </button>
        </div>
      )}
    />
  );
};

export default CategoryList;
