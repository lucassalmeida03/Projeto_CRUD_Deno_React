import { Button } from '../components/Button';
import { Header } from '../components/Header';
import { useUsers } from '../hooks/useUsers';

export function UsersDirectory() {
  const { users, isLoading, deletingUserId, errorMessage, removeUser } =
    useUsers();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-12">
          <h1 className="text-xl md:text-2xl font-bold text-[#0d102d] text-center mb-10">
            Diretório de Usuários
          </h1>

          {errorMessage && (
            <p className="text-sm text-red-600 mb-6" role="alert">
              {errorMessage}
            </p>
          )}
          {isLoading && (
            <p className="text-sm text-gray-500 text-center">
              Carregando usuários...
            </p>
          )}
          {!isLoading && !users.length && (
            <p className="text-sm text-gray-500 text-center">
              Nenhum usuário encontrado.
            </p>
          )}

          <div className="space-y-6 max-w-xl mx-auto">
            {users.map((user) => {
              const isSeller = user.role === 'seller';

              return (
                <div
                  key={user._id}
                  className="flex items-center justify-between gap-4 py-2 border-b border-gray-50 last:border-none"
                >
                  <div className="flex items-center space-x-6 min-w-0">
                    <span className="text-xs font-mono font-bold text-gray-400">
                      {user._id.slice(-6)}
                    </span>
                    <div className="min-w-0">
                      <h3 className="text-sm font-bold text-gray-900 leading-tight">
                        {user.name}
                      </h3>
                      <p className="text-xs font-mono text-gray-500 mt-0.5 truncate">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`flex items-center space-x-1.5 px-3 py-1 rounded-md text-[10px] font-mono font-bold tracking-wider ${
                      isSeller
                        ? 'bg-cyan-50 text-cyan-600'
                        : 'bg-indigo-50 text-indigo-600'
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSeller ? 'bg-cyan-500' : 'bg-indigo-500'
                      }`}
                    />
                    <span>{user.role}</span>
                  </div>

                  <Button
                    className="w-25 bg-red-600 hover:bg-red-700"
                    isLoading={deletingUserId === user._id}
                    onClick={() => void removeUser(user)}
                  >
                    Remover
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default UsersDirectory;
