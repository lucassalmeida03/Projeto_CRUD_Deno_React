import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { useCustomerOrders } from '../hooks/useCustomerOrders';
import type { Order } from '../types/Order';

function getOrderId(order: Order) {
  return order._id ?? '';
}

function getSellerName(seller: Order['seller']) {
  return seller && typeof seller === 'object' ? seller.name : 'Vendedor';
}

function getSellerEmail(seller: Order['seller']) {
  return seller && typeof seller === 'object' ? seller.email : '';
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

export function CustomerOrders() {
  const {
    orders,
    isLoading,
    processingOrderId,
    errorMessage,
    handleCancelOrder,
    handleDeleteOrder,
  } = useCustomerOrders();

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-6 py-10">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 md:p-10">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#0d102d] text-center mb-10">
            Meus Pedidos de Compra
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
                <div className="w-1/4">Vendedor / Loja</div>
                <div className="w-1/4">Itens Pedidos</div>
                <div className="w-1/6 text-right">Valor Total (R$)</div>
                <div className="w-1/6 text-center">Status</div>
                <div className="w-1/5 text-center">Ações</div>
              </div>

              {orders.map((order) => {
                const orderId = getOrderId(order);
                const isPending = order.status === 'pending';
                const isCanceled = order.status === 'canceled';
                const isProcessing = processingOrderId === orderId;

                return (
                  <div
                    key={orderId}
                    className={`flex flex-col md:flex-row md:items-center justify-between py-4 px-6 border-b border-gray-50 hover:bg-gray-50/60 rounded-xl transition-colors ${
                      isCanceled ? 'opacity-75' : ''
                    }`}
                  >
                    <div className="w-full md:w-2/6 font-mono font-bold text-indigo-600 text-xs mb-2 md:mb-0">
                      {orderId}
                    </div>

                    <div className="w-full md:w-1/4 mb-2 md:mb-0">
                      <div className="font-bold text-gray-900 text-xs leading-tight">
                        {getSellerName(order.seller)}
                      </div>
                      <div className="font-mono text-[11px] text-gray-400 mt-0.5">
                        {getSellerEmail(order.seller)}
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
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border ${
                          isPending
                            ? 'bg-amber-50 text-amber-600 border-amber-100'
                            : isCanceled
                              ? 'bg-rose-50 text-rose-600 border-rose-100'
                              : 'bg-emerald-50 text-emerald-600 border-emerald-100'
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                            isPending
                              ? 'bg-amber-500'
                              : isCanceled
                                ? 'bg-rose-500'
                                : 'bg-emerald-500'
                          }`}
                        />
                        {isPending
                          ? 'Pendente'
                          : isCanceled
                            ? 'Cancelado'
                            : 'Pago'}
                      </span>
                    </div>

                    <div className="w-full md:w-1/5 flex md:justify-center items-center space-x-2">
                      {isPending && (
                        <Button
                          type="button"
                          onClick={() => void handleCancelOrder(orderId)}
                          disabled={isProcessing}
                          className="bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 text-[10px] font-bold"
                        >
                          Cancelar
                        </Button>
                      )}

                      {isCanceled && (
                        <Button
                          type="button"
                          onClick={() => {
                            const valid = confirm(
                              'Tem certeza que deseja excluir esse pedido?'
                            );
                            if (valid) {
                              void handleDeleteOrder(orderId);
                            }
                          }}
                          disabled={isProcessing}
                          className="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 text-[10px] font-bold"
                        >
                          Excluir
                        </Button>
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

export default CustomerOrders;
