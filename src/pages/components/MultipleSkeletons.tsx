/* eslint-disable consistent-return */
import React, { ReactNode, useState, useEffect } from 'react';

import { Skeleton } from 'antd';

interface MultipleSkeletonsProps {
  itemCount?: number;
  loading: boolean;
  children?: ReactNode;
}

const MultipleSkeletons: React.FC<MultipleSkeletonsProps> = ({
  itemCount = 5,
  loading,
  children,
}) => {
  const [showChildren, setShowChildren] = useState(false);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setShowChildren(true), 300); // Adjust time for matching with skeleton fade out
      return () => clearTimeout(timer);
    }
    setShowChildren(false);
  }, [loading]);

  return (
    <div>
      {loading &&
        Array.from({ length: itemCount }, (_, index) => (
          <Skeleton key={index} active paragraph={{ rows: 2 }} />
        ))}
      <div
        style={{
          opacity: showChildren ? 1 : 0,
          transition: 'opacity 300ms ease-in-out', // Adjust time and easing function as needed
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default MultipleSkeletons;
