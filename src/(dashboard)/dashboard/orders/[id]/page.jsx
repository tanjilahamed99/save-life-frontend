'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    ArrowLeft,
    Package,
    Clock,
    CheckCircle,
    Truck,
    FileText,
    CreditCard,
} from 'lucide-react';
import DashboardLayout from '@/components/dashboard/dashboard-layout';
import axiosInstance from '@/utils/axios';
import { OrderStatusTimeline } from '@/components/dashboard/OrderStatusTimeline';

export default function OrderDetailPage() {
    const params = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await axiosInstance.get(`/orders/${params.id}`);
                setOrder(orderData?.data?.data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [params.id]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'processing':
                return (
                    <span className="flex items-center text-sm text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full font-medium">
                        <Clock size={16} className="mr-2" />
                        In behandeling
                    </span>
                );
            case 'shipped':
                return (
                    <span className="flex items-center text-sm text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-medium">
                        <Truck size={16} className="mr-2" />
                        Verzonden
                    </span>
                );
            case 'delivered':
                return (
                    <span className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1 rounded-full font-medium">
                        <CheckCircle size={16} className="mr-2" />
                        Afgeleverd
                    </span>
                );
            default:
                return (
                    <span className="flex items-center text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full font-medium">
                        <FileText size={16} className="mr-2" />
                        {status}
                    </span>
                );
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="bg-white rounded-lg shadow p-8 flex flex-col items-center justify-center min-h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-teal-600 border-teal-100"></div>
                    <p className="mt-4 text-gray-500">Bestelling laden...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!loading && !order) {
        return (
            <DashboardLayout>
                <div className="bg-white rounded-lg shadow p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
                        <FileText size={24} className="text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">Bestelling niet gevonden</h2>
                    <p className="text-gray-600 mb-6 max-w-md mx-auto">
                        De bestelling die je zoekt bestaat niet of is niet toegankelijk.
                    </p>
                    <Link
                        href="/dashboard/orders"
                        className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                    >
                        <ArrowLeft size={18} className="mr-2" />
                        Terug naar bestellingen
                    </Link>
                </div>
            </DashboardLayout>
        );
    }

    const formattedDate = new Date(order.createdAt).toLocaleDateString('nl-NL', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    const formattedTime = new Date(order.createdAt).toLocaleTimeString('nl-NL', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <DashboardLayout>
            <div className="space-y-6 pb-8">
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="border-b border-gray-100">
                        <div className="p-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                                <div>
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                                        <h1 className="text-2xl font-bold">
                                            Bestelling #{order?._id.slice(-4)}
                                        </h1>
                                        {getStatusBadge(order.status)}
                                    </div>
                                    <p className="text-gray-600 mt-2">
                                        Geplaatst op {formattedDate} om {formattedTime}
                                    </p>
                                </div>

                                <Link
                                    href="/dashboard/orders"
                                    className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors font-medium self-start"
                                >
                                    <ArrowLeft size={18} className="mr-2" />
                                    Terug naar bestellingen
                                </Link>
                            </div>
                        </div>

                        <div className="px-6 py-3 bg-gray-50 hidden sm:flex text-sm text-gray-500">
                            <div className="w-full grid grid-cols-12 gap-4">
                                <div className="col-span-6">Product</div>
                                <div className="col-span-2 text-center">Aantal</div>
                                <div className="col-span-2 text-center">Prijs</div>
                                <div className="col-span-2 text-right">Totaal</div>
                            </div>
                        </div>
                    </div>

                    {/* Order Items */}
                    <div className="divide-y divide-gray-100">
                        {order.items.map((item, index) => (
                            <div key={index} className="p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
                                    <div className="sm:col-span-5">
                                        <Link
                                            href={`/product/${item.id}`}
                                            className="font-medium text-gray-900 hover:text-teal-600 line-clamp-2"
                                        >
                                            {item.name}
                                        </Link>
                                    </div>

                                    <div className="sm:col-span-2 flex justify-between sm:justify-center items-center">
                                        <span className="sm:hidden text-gray-500">Aantal:</span>
                                        <span className="font-medium">{item.quantity}</span>
                                    </div>

                                    <div className="sm:col-span-2 flex justify-between sm:justify-center items-center">
                                        <span className="sm:hidden text-gray-500">Prijs:</span>
                                        <span className="font-medium">
                                            €{item.price.toFixed(2)}
                                        </span>
                                    </div>

                                    <div className="sm:col-span-2 flex justify-between sm:justify-end items-center">
                                        <span className="sm:hidden text-gray-500">Totaal:</span>
                                        <span className="font-bold text-teal-600">
                                            €{(item.price * item.quantity).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Shipping Information */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center mb-4">
                                    <Truck size={20} className="text-teal-600 mr-2" />
                                    <h2 className="text-lg font-bold">Verzendadres</h2>
                                </div>
                                <div className="space-y-1 text-gray-700">
                                    <p className="font-medium">
                                        {order?.firstName + ' ' + order?.lastName}
                                    </p>
                                    <p>
                                        City: {order?.city}, {order?.postalCode}
                                    </p>
                                    <p>Address: {order?.address}</p>
                                    <p>Country: {order?.country}</p>
                                    <p className="mt-2 font-medium">Email: {order?.email}</p>
                                    <p className="font-medium">Tel: {order?.phone}</p>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow p-6">
                                <div className="flex items-center mb-4">
                                    <FileText size={20} className="text-teal-600 mr-2" />
                                    <h2 className="text-lg font-bold">Factuuradres</h2>
                                </div>
                                <div className="space-y-1 text-gray-700">
                                    <p className="font-medium">
                                        {order?.firstName + ' ' + order?.lastName}
                                    </p>
                                    <p>
                                        City: {order?.city}, {order?.postalCode}
                                    </p>
                                    <p>Address: {order?.address}</p>
                                    <p>Country: {order?.country}</p>
                                    <p className="mt-2 font-medium">Email: {order?.email}</p>
                                    <p className="font-medium">Tel: {order?.phone}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center mb-1">
                                    <CreditCard size={20} className="text-teal-600 mr-2" />
                                    <h2 className="text-lg font-bold">Bestelsamenvatting</h2>
                                </div>
                                <p className="text-sm text-gray-500">
                                    Betaalmethode: {order?.paymentMethod}
                                </p>
                                <p className="text-sm text-gray-500">
                                    Betalingsstatus: {order?.paymentStatus}
                                </p>
                            </div>

                            <div className="p-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Subtotaal</span>
                                        <span className="font-medium">
                                            €{(order.totalAmount - 5.0).toFixed(2)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Verzendkosten</span>
                                        <span className="font-medium">€5.00</span>
                                    </div>
                                    {order.discount && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Korting</span>
                                            <span>-€{order.discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="border-t pt-3 flex justify-between">
                                        <span className="font-bold">Totaal</span>
                                        <span className="font-bold text-xl text-teal-600">
                                            €{order.totalAmount.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow p-6 mt-6">
                            <h3 className="font-bold mb-3">Bestelnotities</h3>
                            {order.notes ? (
                                <p className="text-gray-700">{order.notes}</p>
                            ) : (
                                <p className="text-gray-500 italic">Geen notities toegevoegd</p>
                            )}
                        </div>
                    </div>
                </div>

                <OrderStatusTimeline order={order} />
            </div>
        </DashboardLayout>
    );
}
