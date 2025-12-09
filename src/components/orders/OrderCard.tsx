import React from 'react';
import Image from 'next/image';

interface OrderItem {
    id: number;
    product: {
        name: string;
        image_front_url: string | null;
    } | null;
    quantity: number;
    price: number;
}

interface OrderCardProps {
    id: number;
    date: string;
    status: string | null;
    total: number;
    items: OrderItem[];
}

export function OrderCard({ id, date, status, total, items }: OrderCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatPrice = (price: number) => {
        return price.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    };

    const getStatusColor = (status: string | null) => {
        switch (status?.toLowerCase()) {
            case 'entregue':
                return 'bg-green-100 text-green-800';
            case 'em andamento':
            case 'preparando':
                return 'bg-blue-100 text-blue-800';
            case 'cancelado':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 mb-4 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                <div>
                    <h3 className="font-poppins font-semibold text-[#8D61C6] text-lg">Pedido #{id}</h3>
                    <p className="text-gray-500 text-sm">{formatDate(date)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}>
                        {status || 'Pendente'}
                    </span>
                    <span className="font-bold text-gray-800">{formatPrice(total)}</span>
                </div>
            </div>

            <div className="space-y-4">
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                        <div className="relative w-16 h-16 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                            {item.product?.image_front_url ? (
                                <Image
                                    src={item.product.image_front_url}
                                    alt={item.product.name}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    Cookie
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-medium text-gray-800">{item.product?.name || 'Produto indisponível'}</h4>
                            <div className="text-sm text-gray-500 flex justify-between mt-1">
                                <span>Qtd: {item.quantity}</span>
                                <span>{formatPrice(item.price)}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* <div className="mt-4 pt-4 border-t border-gray-50 flex justify-end">
                <button className="text-[#8D61C6] text-sm font-semibold hover:text-[#7a52aa] transition-colors">
                    Ver Detalhes
                </button>
            </div> */}
        </div>
    );
}
