import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Item } from '@/types';
import { formatCurrency } from '@/utils/numeral';
import { imagePath } from './newPage';
import { Button } from 'antd';

const ProductPage = () => {
  const router = useRouter();
  const { id } = router.query; // Extract `id` from the query
  const [product, setProduct] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return; // Ensure `id` is available

    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${id}`);
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="flex justify-center">
          <img
            src={`${imagePath}${product.itemData.imageUrl}`}
            alt={product.itemData.name}
            className="rounded-lg shadow-lg w-full max-w-md"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-black dark:text-white">
            {product.itemData.name}
          </h1>
          <p className="text-lg text-gray-700 dark:text-gray-300">
            {product.itemData.description}
          </p>
          <div className="text-2xl font-bold text-violet-700 dark:text-white">
            {formatCurrency(
              product.itemData.variations[0]?.itemVariationData?.priceMoney?.amount || 0,
              'USD' // Replace with dynamic currency if available
            )}
          </div>
          <Button
            onClick={() => {
              // Add to cart logic
              console.log('Add to cart:', product);
            }}
            className="mt-4 flex h-12 w-full items-center justify-center rounded-md bg-violet-500 font-bold text-white dark:border-none dark:bg-violet-500 dark:hover:!text-white"
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;