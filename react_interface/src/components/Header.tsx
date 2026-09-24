import { useState } from 'react';
import { Button } from './Button';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userRole = user?.role;
  const [activeItem, setActiveItem] = useState('Vitrine / Catálogo');
  const { logout } = useAuth();
  const canViewVitrine = userRole === 'admin' || userRole === 'customer';
  const canViewMeusProdutos = userRole === 'admin' || userRole === 'seller';
  const canViewUsuarios = userRole === 'admin';

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="flex items-center space-x-2 md:space-x-4">
          <button
            onClick={() => {
              setActiveItem('Pedidos & Compras');
              if (userRole === 'customer') {
                navigate('/ordersCustomer');
              } else {
                navigate('/orders');
              }
            }}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl
                 text-sm font-medium transition-all ${
                   activeItem === 'Pedidos & Compras'
                     ? 'bg-indigo-600 text-white shadow-sm'
                     : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                 }`}
          >
            Pedidos & Compras
          </button>

          {canViewVitrine && (
            <button
              type="button"
              onClick={() => {
                setActiveItem('Vitrine / Catálogo');
                navigate('/catalog');
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeItem === 'Vitrine / Catálogo'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              Vitrine / Catálogo
            </button>
          )}

          {canViewMeusProdutos && (
            <button
              type="button"
              onClick={() => {
                setActiveItem('Meus Produtos');
                navigate('/myProducts');
              }}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm 
                font-medium transition-all ${
                  activeItem === 'Meus Produtos'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Meus Produtos
            </button>
          )}

          {canViewUsuarios && (
            <button
              type="button"
              onClick={() => {
                setActiveItem('Usuários & Perfis');
                navigate('/directory');
              }}

              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm 
                font-medium transition-all ${
                  activeItem === 'Usuários & Perfis'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              Usuários & Perfis
            </button>
          )}
        </nav>

        <div className="flex items-center space-x-3">
          <div className="flex flex-col text-right">
            <span className="text-sm font-bold text-gray-900 leading-tight">
              {user?.name}
            </span>
            <span className="text-xs font-semibold text-indigo-600">
              {user?.email}
            </span>
          </div>

          <Button
            className="w-20 h-10 ml-4"
            onClick={() => {
              const valid = confirm('deseja sair');
              if (valid) {
                logout();
              }
            }}
          >
            Sair
          </Button>
        </div>
      </div>
    </header>
  );
}
