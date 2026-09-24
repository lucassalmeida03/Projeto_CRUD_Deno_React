import { useEffect, useState } from 'react';
import {
  createProduct,
  deleteProduct,
  getMyProducts,
  updateProduct,
} from '../services/productService';
import type { CreateProduct, Product } from '../types/Product';

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
  const [isLoading, setIsLoading] = useState(true);
  const [deletingProductId, setDeletingProductId] = useState<string | null>(
    null
  );
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function loadProducts() {
      try {
        setProducts(await getMyProducts());
      } catch (error) {
        setErrorMessage(
          getErrorMessage(error, 'Não foi possível carregar seus produtos.')
        );
      } finally {
        setIsLoading(false);
      }
    }

    void loadProducts();
  }, []);

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
      setProducts((current) =>
        current.filter(
          (currentProduct) =>
            (currentProduct._id ?? currentProduct.id) !== productId
        )
      );
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
    isLoading,
    deletingProductId,
    errorMessage,
    saveProduct,
    removeProduct,
  };
}
