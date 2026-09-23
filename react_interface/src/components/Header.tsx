import { useState } from 'react';
import type { UserRole } from '../types/UserRole';

interface HeaderProps {
  userRole: UserRole;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
}

export function Header({
  userRole,
  userName = 'Alexandre Silva',
  userEmail = 'dev@commerceapi.io',
  avatarUrl = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
}: HeaderProps) {
  const [activeItem, setActiveItem] = useState('Pedidos & Compras');

  const canViewVitrine = userRole === 'admin' || userRole === 'customer';
  const canViewMeusProdutos = userRole === 'admin' || userRole === 'seller';
  const canViewUsuarios = userRole === 'admin';

 
  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="flex items-center space-x-2 md:space-x-4">

          <button
            type="button"
            onClick={() => setActiveItem('Pedidos & Compras')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${activeItem === 'Pedidos & Compras'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
              }`}
          >
            Pedidos & Compras
          </button>

          {canViewVitrine && (
            <button
              type="button"
              onClick={() => setActiveItem('Vitrine / Catálogo')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl
                 text-sm font-medium transition-all ${activeItem === 'Vitrine / Catálogo'
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
              onClick={() => setActiveItem('Meus Produtos')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm 
                font-medium transition-all ${activeItem === 'Meus Produtos'
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
              onClick={() => setActiveItem('Usuários & Perfis')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm 
                font-medium transition-all ${activeItem === 'Usuários & Perfis'
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
              {userName}
            </span>
            <span className="text-xs font-semibold text-indigo-600">
              {userEmail}
            </span>
          </div>
          <img
            src={avatarUrl}
            alt={userName}
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
        </div>
      </div>
    </header>
  );
}