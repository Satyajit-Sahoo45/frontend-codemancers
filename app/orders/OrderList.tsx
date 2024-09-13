// components/OrderList.tsx
import React from "react";
import Image from "next/image";

interface OrderItem {
  _id: string;
  cart: {
    totalQty: number;
    totalCost: number;
    items: {
      productId: {
        imageUrl: {
          url: string;
        };
        title: string;
        description: string;
        price: number;
      };
      qty: number;
      price: number;
      title: string;
      _id: string;
    }[];
  };
  address: string;
  paymentId: string;
  delivered: boolean;
  createdAt: string;
  updatedAt: string;
}

interface OrderListProps {
  orders: OrderItem[];
}

const OrderList: React.FC<OrderListProps> = ({ orders }) => {
  return (
    <div className="p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-4xl font-extrabold mb-8 text-center">
        Order History
      </h1>
      <div className="space-y-8">
        {orders.map((order) => (
          <div
            key={order._id}
            className="p-6 bg-gray-800 rounded-xl shadow-lg border border-gray-700"
          >
            <h2 className="text-2xl font-semibold mb-4 border-b border-gray-600 pb-2">
              Order ID: {order._id}
            </h2>
            <div className="mb-4">
              <p className="text-lg mb-1">
                Address: <span className="font-light">{order.address}</span>
              </p>
              <p className="text-lg mb-1">
                Total Quantity:{" "}
                <span className="font-light">{order.cart.totalQty}</span>
              </p>
              <p className="text-lg mb-1">
                Total Cost:{" "}
                <span className="font-light">
                  ${order.cart.totalCost.toFixed(2)}
                </span>
              </p>
              <p className="text-lg mb-1">
                Payment Done:{" "}
                <span
                  className={`font-light ${
                    order.delivered ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {order.delivered ? "Yes" : "No"}
                </span>
              </p>
              <p className="text-lg">
                Ordered At:{" "}
                <span className="font-light">
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-medium mb-4 border-b border-gray-600 pb-2">
                Items:
              </h3>
              {order.cart.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center mb-6 border-b border-gray-700 pb-4"
                >
                  <div className="w-20 h-20 mr-6 rounded-lg overflow-hidden">
                    <Image
                      src={item.productId.imageUrl.url}
                      alt={item.productId.title}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold">
                      {item.productId.title}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {item.productId.description}
                    </p>
                    <p className="text-sm text-gray-300">Qty: {item.qty}</p>
                    <p className="text-sm text-gray-300">
                      Price: ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;
