import { useEffect, useState } from 'react';
import {
  createProduct,
  deleteProduct,
  getMyProducts,
  updateProduct,
} from '../services/productService';
import type { ProductPagination } from '../services/productService';
import type { CreateProduct, Product } from '../types/Product';

const PAGE_SIZE = 12;

interface ProductError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  return (error as ProductError).response?.data?.message ?? fallback;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<ProductPagination>({
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let isCurrentRequest = true;

    async function loadProducts() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const result = await getMyProducts(page, PAGE_SIZE);
        if (isCurrentRequest) {
          setProducts(result.products);
          setPagination(result.pagination);
        }
      } catch (error) {
        if (isCurrentRequest) {
          setErrorMessage(
            getErrorMessage(error, 'Não foi possível carregar seus produtos.')
          );
        }
      } finally {
        if (isCurrentRequest) setIsLoading(false);
      }
    }

    void loadProducts();
    return () => {
      isCurrentRequest = false;
    };
  }, [page]);

  async function saveProduct(productData: CreateProduct, productId?: string) {
    setErrorMessage('');

    try {
      const savedProduct = productId
        ? await updateProduct(productId, productData)
        : await createProduct(productData);

      setProducts((current) => {
        if (!productId) return [savedProduct, ...current];

        return current.map((product) =>
          (product._id ?? product.id) === productId ? savedProduct : product
        );
      });

      if (!productId) {
        if (page !== 1) {
          setPage(1);
        } else {
          const result = await getMyProducts(1, PAGE_SIZE);
          setProducts(result.products);
          setPagination(result.pagination);
        }
      }

      return savedProduct;
    } catch (error) {
      const fallback = productId
        ? 'Não foi possível atualizar o produto.'
        : 'Não foi possível criar o produto.';
      setErrorMessage(getErrorMessage(error, fallback));
      throw error;
    }
  }

  async function removeProduct(product: Product) {
    const productId = product._id ?? product.id;

    if (
      !productId ||
      !window.confirm('Tem certeza que deseja excluir esse produto?')
    ) {
      return;
    }

    setErrorMessage('');
    setDeletingProductId(productId);

    try {
      await deleteProduct(productId);
      if (products.length === 1 && page > 1) {
        setPage((currentPage) => currentPage - 1);
      } else {
        const result = await getMyProducts(page, PAGE_SIZE);
        setProducts(result.products);
        setPagination(result.pagination);
      }
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, 'Não foi possível excluir o produto.')
      );
    } finally {
      setDeletingProductId(null);
    }
  }

  return {
    products,
    page,
    setPage,
    pagination,
    isLoading,
    deletingProductId,
    errorMessage,
    saveProduct,
    removeProduct,
  };
}
