import { useEffect, useState } from 'react';
import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { useAuth } from '../hooks/useAuth';
import { getProducts } from '../services/productService';
import { createOrderSchema } from '../schemas/orderSchema';
import type { Product } from '../types/Product';
import { formatCurrency } from '../utils/formatCurrency';
import { useCreateOrder } from '../hooks/useCreateOrder';

interface CreateOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onConfirmed: (quantity: number) => Promise<void>;
  isLoading: boolean;
  errorMessage: string;
}

export function CreateOrderModal({
  isOpen,
  onClose,
  product,
  onConfirmed,
  isLoading,
  errorMessage,
}: CreateOrderModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setQuantity(1);
      setValidationMessage('');
    }
  }, [isOpen, product]);

  if (!isOpen) return null;


  const handleConfirm = () => {
    const result = createOrderSchema.safeParse({
      productId: product._id ?? product.id,
      quantity,
    });

    if (!result.success) {
      setValidationMessage(
        result.error.issues[0]?.message ?? 'Verifique os dados do pedido.'
      );
      return;
    }

    void onConfirmed(result.data.quantity);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <h2 className="text-2xl font-bold text-[#0d102d] mb-6">
          Criar Novo Pedido de Compra
        </h2>

        <div className="bg-[#f0f4ff]/70 border border-indigo-50/60 rounded-2xl p-5 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[#0d102d] leading-snug">
              {product.title}
            </h3>
            <span className="block text-xs font-mono text-gray-500 mt-1">
              Estoque: {product.stock} un.
            </span>
            <p className="text-xs font-mono text-gray-500 mt-1">
              R$ {formatCurrency(product.price)} / un
            </p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center bg-white border border-gray-200 rounded-xl p-1 shadow-sm">
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => Math.max(1, current - 1))
                }
                disabled={quantity <= 1 || isLoading}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-lg font-medium transition-colors disabled:opacity-30"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-mono font-bold text-gray-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() =>
                  setQuantity((current) => Math.min(product.stock, current + 1))
                }
                disabled={quantity >= product.stock || isLoading}
                className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded-lg text-lg font-medium transition-colors disabled:opacity-30"
              >
                +
              </button>
            </div>

            <div className="text-right">
              <span className="block text-[10px] font-mono font-bold text-gray-400 tracking-wider uppercase">
                Subtotal
              </span>
              <span className="text-lg font-mono font-extrabold text-[#0d102d]">
                R$ {formatCurrency(product.price * quantity)}
              </span>
            </div>
          </div>
        </div>

        {(validationMessage || errorMessage) && (
          <p className="mt-5 text-sm text-red-600" role="alert">
            {validationMessage || errorMessage}
          </p>
        )}

        <div className="mt-8 flex justify-end space-x-3">
          <Button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-auto px-5 bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            isLoading={isLoading}
            className="w-auto px-6"
          >
            Confirmar Pedido
          </Button>
        </div>
      </div>
    </div>
  );
}

export function Catalog() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const {
    isCreating,
    errorMessage: orderErrorMessage,
    saveOrder,
  } = useCreateOrder();

  useEffect(() => {
    async function loadProducts() {
      try {
        setProducts(await getProducts());
      } catch {
        setErrorMessage('Não foi possível carregar o catálogo.');
      } finally {
        setIsLoading(false);
      }
    }

    void loadProducts();
  }, []);

  if (!user) return null;

  async function handleCreateOrder(quantity: number) {
    if (!selectedProduct) return;

    await saveOrder({
      productId: selectedProduct._id ?? selectedProduct.id ?? '',
      quantity,
    });

    const selectedId = selectedProduct._id ?? selectedProduct.id;
    setProducts((current) =>
      current.map((product) =>
        (product._id ?? product.id) === selectedId
          ? { ...product, stock: product.stock - quantity }
          : product
      )
    );
    setIsModalOpen(false);
    setSelectedProduct(null);
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">
          Vitrine & Catálogo Geral
        </h1>

        {errorMessage && (
          <p className="text-sm text-red-600 mb-6" role="alert">
            {errorMessage}
          </p>
        )}
        {isLoading && (
          <p className="text-sm text-gray-500">Carregando catálogo...</p>
        )}
        {!isLoading && !products.length && (
          <p className="text-sm text-gray-500">
            Nenhum produto disponível no momento.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id ?? product.id ?? product.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center space-x-1.5 mb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-500" />
                  <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wide">
                    {product.stock} em estoque
                  </span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                  {product.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {product.description || 'Sem descrição informada.'}
                </p>
              </div>
              <div className="mt-6 pt-4 bg-gray-50/70 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                    PREÇO DE TABELA
                  </span>
                  <div className="flex items-baseline text-gray-900 font-extrabold">
                    <span className="text-xs mr-1">R$</span>
                    <span className="text-base">
                      {formatCurrency(product.price)
                      }
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  className="w-32"
                  disabled={product.stock < 1}
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsModalOpen(true);
                  }}
                >
                  Fazer Pedido
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedProduct && (
        <CreateOrderModal
          isOpen={isModalOpen}
          product={selectedProduct}
          onConfirmed={handleCreateOrder}
          isLoading={isCreating}
          errorMessage={orderErrorMessage}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </div>
  );
}
