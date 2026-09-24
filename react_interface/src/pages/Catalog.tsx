import { Header } from '../components/Header';
import { Button } from '../components/Button'; 
import { useAuth } from '../hooks/useAuth';
import type { Product } from '../types/Product';


const mockProducts: Product[] = Array.from({ length: 8 }).map((_, index) => ({
  title: 'Jaqueta Térmica...',
  description: 'Tecnologia têxtil de 3 camadas com proteção climática extrema',
  stock: 11,
  price: '1.420,00',
}));

export function Catalog() {
  const { user } = useAuth();
  
  if(!user) {
    return null
  }

  const userRole = user.role
  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      
      <Header userRole={user.role}/>

     { userRole !== "seller" && (
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8">
          Vitrine & Catálogo Geral
        </h1>

        {/* Grid de Cards de Produtos (4 colunas no desktop, responsive) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {mockProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              {/* Topo do Card: Badge de Estoque, Título e Descrição */}
              <div>
                {/* Badge de Estoque */}
                <div className="flex items-center space-x-1.5 mb-3">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  <span className="text-[11px] font-bold text-cyan-600 uppercase tracking-wide">
                    {product.stock} em estoque
                  </span>
                </div>

                {/* Título do Produto */}
                <h3 className="text-base font-bold text-gray-900 mb-2 leading-tight">
                  {product.title}
                </h3>

                {/* Descrição */}
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Bloco do Preço e Botão de Comprar */}
              <div className="mt-6 pt-4 bg-gray-50/70 -mx-6 -mb-6 p-4 rounded-b-2xl border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase">
                    PREÇO DE TABELA
                  </span>
                  <div className="flex items-baseline text-gray-900 font-extrabold">
                    <span className="text-xs mr-1">R$</span>
                    <span className="text-base">{product.price}</span>
                  </div>
                </div>

                <Button
                  type="button"
                  className="w-30"
                >
                  Comprar
                </Button>
              </div>
            </div>
          ))}
        </div>
      </main> )};
    </div>
  );
}