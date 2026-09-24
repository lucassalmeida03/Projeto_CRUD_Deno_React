import { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useAuth } from '../hooks/useAuth';
import { useProducts } from '../hooks/useProducts';
import { createProductSchema } from '../schemas/productSchema';
import type { CreateProduct, Product } from '../types/Product';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product;
  onSaved: (productData: CreateProduct, productId?: string) => Promise<Product>;
}

function ProductModal({
  isOpen,
  onClose,
  product,
  onSaved,
}: ProductModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setTitle(product?.title ?? '');
    setDescription(product?.description ?? '');
    setPrice(product ? String(product.price) : '');
    setStock(product ? String(product.stock) : '');
    setErrorMessage('');
  }, [isOpen, product]);

  function resetForm() {
    setTitle('');
    setDescription('');
    setPrice('');
    setStock('');
    setErrorMessage('');
  }

  function handleClose() {
    if (isLoading) return;
    resetForm();
    onClose();
  }

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage('');

    const result = createProductSchema.safeParse({
      title,
      description,
      price,
      stock,
    });

    if (!result.success) {
      setErrorMessage(
        result.error.issues[0]?.message ?? 'Verifique os dados informados.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const productId = product?._id ?? product?.id;
      await onSaved(result.data, productId);
      resetForm();
      onClose();
    } catch (error) {
      const responseMessage = (
        error as { response?: { data?: { message?: string } } }
      ).response?.data?.message;
      setErrorMessage(
        responseMessage ??
          (product
            ? 'Não foi possível atualizar o produto.'
            : 'Não foi possível criar o produto.')
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {product ? 'Editar Produto' : 'Informações Gerais do Produto'}
            </h2>
            <p className="text-xs text-gray-500">
              {product
                ? 'Atualizar informações do produto'
                : 'Cadastrar novo produto no catálogo'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
            aria-label="Fechar formulário"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form
          id="product-form"
          className="p-6 space-y-5"
          onSubmit={handleSubmit}
        >
          <Input
            legend="Nome do Produto *"
            placeholder="Digite o nome do produto"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />

          <div>
            <label
              className="block text-xxs font-sans mb-1.5"
              htmlFor="description"
            >
              Descrição Detalhada do Produto
            </label>
            <textarea
              id="description"
              rows={7}
              placeholder="Digite a descrição completa do produto"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="w-full px-4 py-3 bg-[#f1f5f9] border-none rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              legend="Preço de Venda *"
              type="number"
              min="0"
              step="0.01"
              required
              placeholder="R$"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
            />
            <Input
              legend="Estoque Inicial (Unidades) *"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              required
              value={stock}
              onChange={(event) => setStock(event.target.value)}
            />
          </div>

          {errorMessage && (
            <p className="text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}
        </form>

        <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex justify-end space-x-3">
          <Button
            type="button"
            onClick={handleClose}
            className="bg-red-600 hover:bg-red-700"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button type="submit" form="product-form" isLoading={isLoading}>
            {product ? 'Salvar alterações' : 'Publicar Produto'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MyProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const {
    products,
    isLoading,
    deletingProductId,
    errorMessage,
    saveProduct,
    removeProduct,
  } = useProducts();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            Meus Produtos
          </h1>
          <Button
            type="button"
            className="w-auto px-6"
            onClick={() => {
              setEditingProduct(undefined);
              setIsModalOpen(true);
            }}
          >
            Criar novo produto
          </Button>
        </div>

        {errorMessage && (
          <p className="text-sm text-red-600 mb-6" role="alert">
            {errorMessage}
          </p>
        )}
        {isLoading && (
          <p className="text-sm text-gray-500">Carregando produtos...</p>
        )}
        {!isLoading && !products.length && (
          <p className="text-sm text-gray-500">
            Você ainda não possui produtos cadastrados.
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
              <div className="mt-6 pt-4 bg-gray-50/70 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100 flex gap-4 items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                    PREÇO
                  </span>
                  <div className="flex items-baseline text-gray-900 font-extrabold">
                    <span className="text-xs mr-1">R$</span>
                    <span className="text-base">
                      {product.price.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </span>
                  </div>
                </div>
                <Button
                  type="button"
                  className="h-8"
                  onClick={() => {
                    setEditingProduct(product);
                    setIsModalOpen(true);
                  }}
                >
                  Editar
                </Button>
                <Button
                  type="button"
                  className="h-8 bg-red-600 hover:bg-red-700"
                  isLoading={deletingProductId === (product._id ?? product.id)}
                  onClick={() => void removeProduct(product)}
                >
                  Excluir
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main>

      <ProductModal
        isOpen={isModalOpen}
        product={editingProduct}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(undefined);
        }}
        onSaved={saveProduct}
      />
    </div>
  );
}
