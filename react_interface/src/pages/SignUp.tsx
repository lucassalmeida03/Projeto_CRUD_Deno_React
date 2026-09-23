import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Link } from 'react-router-dom';
import { useSignUp } from '../hooks/useSignUp';
import type { UserRole } from '../types/UserRole';

const roleOptions: { label: string; value: UserRole }[] = [
  { label: 'Administrador', value: 'admin' },
  { label: 'Vendedor', value: 'seller' },
  { label: 'Cliente', value: 'customer' },
];

export function SignUp() {
  const {
    selectedRole,
    setSelectedRole,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    errorMessage,
    handleSubmit,
  } = useSignUp();

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-[#f8fafc] font-sans">
      {/* Lado Esquerdo */}
      <div className="w-full md:w-1/2 bg-[#0d102d] text-white p-8 md:p-16 flex flex-col justify-between">
        <div className="flex items-center space-x-3 bg-white/90 text-indigo-900 px-4 py-2 rounded-xl w-fit shadow-md">
          <div className="flex flex-col">
            <span className="font-bold text-sm leading-tight text-gray-900">CommerceAPI</span>
            <span className="text-[10px] text-gray-500 font-semibold tracking-wider uppercase">Painel & CRUD</span>
          </div>
        </div>

        {/* Conteúdo Principal Esquerda */}
        <div className="my-12 md:my-0 max-w-lg">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 leading-tight">
            Gestão de Produtos e<br />Pedidos (CRUD)
          </h1>
          <p className="text-gray-400 text-sm md:text-base mb-10">
            Cadastre seus produtos, veja seus pedidos, faça um novo pedido.
          </p>

          <div className="space-y-6">

            <div className="flex items-start space-x-4">
              <div className="bg-[#1a1f4a] p-3 rounded-lg text-gray-300 border border-indigo-900/40 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.5 16.6667C2.04167 16.6667 1.64931 16.5035 1.32292 16.1771C0.996528 15.8507 0.833333 15.4583 0.833333 15V5.60417C0.583333 5.45139 0.381944 5.25347 0.229167 5.01042C0.0763889 4.76736 0 4.48611 0 4.16667V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H15C15.4583 0 15.8507 0.163194 16.1771 0.489583C16.5035 0.815972 16.6667 1.20833 16.6667 1.66667V4.16667C16.6667 4.48611 16.5903 4.76736 16.4375 5.01042C16.2847 5.25347 16.0833 5.45139 15.8333 5.60417V15C15.8333 15.4583 15.6701 15.8507 15.3438 16.1771C15.0174 16.5035 14.625 16.6667 14.1667 16.6667H2.5ZM2.5 5.83333V15H14.1667V5.83333H2.5ZM1.66667 4.16667H15V1.66667H1.66667V4.16667ZM5.83333 10H10.8333V8.33333H5.83333V10Z" fill="#A5B4FC" />
                </svg>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">Controle de Produtos</h3>
                <p className="text-xs text-gray-400">Controle simples de produtos.</p>
              </div>
            </div>

      
            <div className="flex items-start space-x-4">
              <div className="bg-[#1a1f4a] p-3 rounded-lg text-gray-300 border border-indigo-900/40 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 18 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.16667 6.66667L8 5.5L9.3125 4.16667H5.83333V2.5H9.3125L7.97917 1.16667L9.16667 0L12.5 3.33333L9.16667 6.66667ZM5 16.6667C4.54167 16.6667 4.14931 16.5035 3.82292 16.1771C3.49653 15.8507 3.33333 15.4583 3.33333 15C3.33333 14.5417 3.49653 14.1493 3.82292 13.8229C4.14931 13.4965 4.54167 13.3333 5 13.3333C5.45833 13.3333 5.85069 13.4965 6.17708 13.8229C6.50347 14.1493 6.66667 14.5417 6.66667 15C6.66667 15.4583 6.50347 15.8507 6.17708 16.1771C5.85069 16.5035 5.45833 16.6667 5 16.6667ZM13.3333 16.6667C12.875 16.6667 12.4826 16.5035 12.1562 16.1771C11.8299 15.8507 11.6667 15.4583 11.6667 15C11.6667 14.5417 11.8299 14.1493 12.1562 13.8229C12.4826 13.4965 12.875 13.3333 13.3333 13.3333C13.7917 13.3333 14.184 13.4965 14.5104 13.8229C14.8368 14.1493 15 14.5417 15 15C15 15.4583 14.8368 15.8507 14.5104 16.1771C14.184 16.5035 13.7917 16.6667 13.3333 16.6667ZM0 1.66667V0H2.72917L6.27083 7.5H12.1042L15.3542 1.66667H17.25L13.5833 8.29167C13.4306 8.56944 13.2257 8.78472 12.9688 8.9375C12.7118 9.09028 12.4306 9.16667 12.125 9.16667H5.91667L5 10.8333H15V12.5H5C4.375 12.5 3.89931 12.2292 3.57292 11.6875C3.24653 11.1458 3.23611 10.5972 3.54167 10.0417L4.66667 8L1.66667 1.66667H0Z" fill="#A5B4FC" />
                </svg>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white">Gestão de Pedidos</h3>
                <p className="text-xs text-gray-400">Veja os seus pedidos realizados.</p>
              </div>
            </div>
            
          </div>
        </div>


        <div className="pt-8 border-t border-gray-800/60 text-xs text-gray-500" />
      </div>


      {/* Lado Direito */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-100">

          {/* Cabeçalho do Formulário */}
          <div className="mb-6">
            <h2 className="font-bold text-gray-900">
              Seja bem-vindo
            </h2>
            <p className="text-gray-500 mt-1">
              Faça seu cadastro na plataforma.
            </p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>

            <div className="bg-gray-50/80 border border-gray-100 rounded-xl p-3">
              <label className="block text-[10px] font-bold text-gray-400 tracking-wider uppercase mb-2">
                Deseja criar qual tipo de perfil?
              </label>
              <div className="flex bg-gray-200/60 p-1 rounded-lg gap-1">
                {roleOptions.map((role) => {
                  const isSelected = selectedRole === role.value;
                  return (
                    <button
                      key={role.value}
                      type="button"
                      value={role.value}
                      onClick={() => setSelectedRole(role.value)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all duration-200 ${isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-transparent text-gray-600 hover:text-gray-900'
                        }`}
                    >
                      {role.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <Input
              legend="Nome"
              type="text"
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Seu nome"
            />

            <Input
              legend="E-mail"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="seu@email.com"
            />

            <Input
              legend="Senha"
              type="password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
            />

            {errorMessage && (
              <p className="text-sm text-red-600" role="alert">
                {errorMessage}
              </p>
            )}

            <Button
              type="submit"
              isLoading={isLoading}
            >
              Criar Conta
            </Button>
          </form>

          <div className="mt-6 text-center text-gray-500">
            <p>
              Já possui uma conta?
            </p>
            <Link to="/signIn" className="text-indigo-600 font-semibold 
               hover:underline bg-transparent p-0 inline">Faça login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}