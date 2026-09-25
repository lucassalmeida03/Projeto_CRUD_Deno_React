import { Button } from './Button';
import { useAuth } from '../hooks/useAuth';
import { NavLink } from 'react-router-dom';

function getNavLinkClass({ isActive }: { isActive: boolean }) {
  return `flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
    isActive
      ? 'bg-indigo-600 text-white shadow-sm'
      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
  }`;
}

export function Header() {
  const { user, logout } = useAuth();
  const userRole = user?.role;
  const canViewVitrine = userRole === 'admin' || userRole === 'customer';
  const canViewMeusProdutos = userRole === 'admin' || userRole === 'seller';
  const canViewUsuarios = userRole === 'admin';

  return (
    <header className="w-full bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <nav className="flex items-center space-x-2 md:space-x-4">
          <NavLink
            to={userRole === 'customer' ? '/ordersCustomer' : '/orders'}
            className={getNavLinkClass}
          >
            Pedidos & Compras
          </NavLink>

          {canViewVitrine && (
            <NavLink to="/catalog" className={getNavLinkClass}>
              Vitrine / Catálogo
            </NavLink>
          )}

          {canViewMeusProdutos && (
            <NavLink to="/myProducts" className={getNavLinkClass}>
              Meus Produtos
            </NavLink>
          )}

          {canViewUsuarios && (
            <NavLink to="/directory" className={getNavLinkClass}>
              Usuários & Perfis
            </NavLink>
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
