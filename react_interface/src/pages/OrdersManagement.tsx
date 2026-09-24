import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { useOrders } from '../hooks/useOrders';
import type { Order } from '../types/Order';

function getOrderId(order: Order) {
  return order._id ?? '';
}

function getUserName(user: Order['customer']) {
  return typeof user === 'object' && user ? user.name : 'Cliente';
}

function getUserEmail(user: Order['customer']) {
  return typeof user === 'object' && user ? user.email : '';
}

function getProductTitle(product: Order['product']) {
  return product && typeof product === 'object'
    ? product.title
    : 'Produto removido';
}

function formatCurrency(value: number) {
  return value.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function OrdersManagement() {
  const { orders, isLoading, payingOrderId, errorMessage, payOrder } =
    useOrders();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0d102d] text-center mb-10">
            Gestão de Pedidos & Transações
          </h1>

          {errorMessage && (
            <p className="mb-6 text-sm text-red-600" role="alert">
              {errorMessage}
            </p>
          )}

          {isLoading && (
            <p className="py-8 text-center text-sm text-gray-500">
              Carregando pedidos...
            </p>
          )}

          {!isLoading && orders.length === 0 && (
            <p className="py-8 text-center text-sm text-gray-500">
              Nenhum pedido encontrado.
            </p>
          )}

          {!isLoading && orders.length > 0 && (
            <div className="w-full flex flex-col space-y-2">
              <div className="hidden md:flex items-center justify-between bg-[#f0f4ff]/70 text-[11px] font-mono font-bold text-gray-500 uppercase tracking-wider py-4 px-6 rounded-xl mb-2">
                <div className="w-2/6">ID do Pedido</div>
                <div className="w-1/4">Cliente Solicitante</div>
                <div className="w-1/4">Itens Comprados</div>
                <div className="w-1/6 text-right">Valor Total (R$)</div>
                <div className="w-1/6 text-center">Status Atual</div>
                <div className="w-1/6 text-center">Ações</div>
              </div>

              {orders.map((order) => {
                const isPending = order.status === 'pending';
                const isPaid = order.status === 'paid';
                const isCanceled = order.status === 'canceled';
                const orderId = getOrderId(order);

                return (
                  <div
                    key={orderId}
                    className={`flex flex-col md:flex-row md:items-center justify-between py-4 px-6 border-b border-gray-50 hover:bg-gray-50/60 rounded-xl transition-colors ${
                      isCanceled ? 'opacity-40' : ''
                    }`}
                  >
                    <div className="w-full md:w-2/6 font-mono font-bold text-indigo-600 text-xs mb-2 md:mb-0">
                      {orderId}
                    </div>

                    <div className="w-full md:w-1/4 mb-2 md:mb-0">
                      <div className="font-bold text-gray-900 text-xs leading-tight">
                        {getUserName(order.customer)}
                      </div>
                      <div className="font-mono text-[11px] text-gray-400 mt-0.5">
                        {getUserEmail(order.customer)}
                      </div>
                    </div>

                    <div className="w-full md:w-1/4 mb-2 md:mb-0 flex items-center space-x-2">
                      <span className="font-medium text-gray-800 text-xs truncate">
                        {order.quantity}x {getProductTitle(order.product)}
                      </span>
                    </div>

                    <div className="w-full md:w-1/6 text-left md:text-right font-mono font-extrabold text-gray-900 text-xs mb-2 md:mb-0">
                      <span className="text-[10px] text-gray-400 font-normal mr-1">
                        R$
                      </span>
                      {formatCurrency(order.totalAmount)}
                    </div>

                    <div className="w-full md:w-1/6 flex md:justify-center mb-2 md:mb-0">
                      {isPending && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-amber-50 text-amber-600 border border-amber-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                          Pendente
                        </span>
                      )}

                      {isPaid && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />
                          Pago
                        </span>
                      )}
                      {isCanceled && (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold font-mono bg-rose-50 text-rose-600 border border-rose-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
                          Cancelado
                        </span>
                      )}
                    </div>

                    <div className="w-full md:w-1/6 flex md:justify-center items-center">
                      {isPending ? (
                        <Button
                          type="button"
                          onClick={() => void payOrder(orderId)}
                          disabled={payingOrderId === orderId}
                          className=" bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[12px] font-bold"
                        >
                          {payingOrderId === orderId
                            ? 'Atualizando...'
                            : 'Marcar como Pago'}
                        </Button>
                      ) : (
                        <span className="text-xs font-semibold text-gray-400">
                          {isPaid ? 'Liquidado' : '—'}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default OrdersManagement;
