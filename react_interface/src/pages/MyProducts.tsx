import { Header } from "../components/Header";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { useState } from "react";
import type { Product } from "../types/Product";
import { useAuth } from "../hooks/useAuth";

const mockProducts: Product[] = Array.from({ length: 8 }).map(() => ({
  title: "Jaqueta Térmica...",
  description: "Tecnologia têxtil de 3 camadas com proteção climática extrema",
  stock: 11,
  price: "1.420,00",
}));

// Para criação de produtos
function CreateProductModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      {/* Container de tamanho e altura fixos */}
      <div className="w-full max-w-2xl h-155 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden">
        {/* Cabeçalho Fixo do Modal */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div>
              <h2 className="text-base font-bold text-gray-900">
                Informações Gerais do Produto
              </h2>
              <p className="text-xs text-gray-500">
                Cadastrar novo produto no catálogo
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
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

        {/* Formulário com Scroll Interno */}
        <form className="flex-1 p-6 space-y-5 overflow-y-auto">
          <Input
            legend="Nome do Produto *"
            placeholder="Digite o nome do produto"
            required
          />

          <div>
            <label className="block text-xxs font-sans mb-1.5">
              Descrição Detalhada do Produto
            </label>
            <textarea
              rows={7}
              placeholder="Digite a descrição completa do produto"
              className="w-full px-4 py-3 bg-[#f1f5f9] border-none rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="relative flex items-center">
                <Input
                  legend="Preço de Venda *"
                  type="number"
                  required
                  placeholder="R$"
                />
              </div>
            </div>

            <div>
              <Input
                legend="Estoque Inicial (Unidades) *"
                type="number"
                placeholder="0"
                required
              />
            </div>
          </div>
        </form>

        {/* Ações / Rodapé Fixo */}
        <div className="p-4 bg-gray-50/80 border-t border-gray-100 flex justify-end space-x-3">
          <Button
            type="button"
            onClick={onClose}
            className="bg-red-600 hover:bg-red-700"
          >
            Cancelar
          </Button>
          <Button type="submit" className="">
            Publicar Produto
          </Button>
        </div>
      </div>
    </div>
  );
}

// Página MyProducts
export function MyProducts() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      <Header userRole={user.role} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">
          Meus Produtos
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                <div className="flex items-center space-x-1.5 mb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wide">
                    {product.stock} em estoque
                  </span>
                </div>

                <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                  {product.title}
                </h3>

                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              <div className="mt-6 pt-4 bg-gray-50/70 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                    PREÇO
                  </span>
                  <div className="flex items-baseline text-gray-900 font-extrabold">
                    <span className="text-xs mr-1">R$</span>
                    <span className="text-base">{product.price}</span>
                  </div>
                </div>

                <Button type="button" className="ml-2">
                  Alterar
                </Button>

                <Button
                  type="button"
                  className="bg-red-600 hover:bg-red-700 ml-2"
                  onClick={() => {
                    confirm("Tem certeza que deseja deletar esse produto?");
                  }}
                >
                  Remover
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button
          type="button"
          className="w-60 mt-15 justify-self-end"
          onClick={() => setIsModalOpen(true)}
        >
          Criar novo produto
        </Button>
      </main>

      <CreateProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
