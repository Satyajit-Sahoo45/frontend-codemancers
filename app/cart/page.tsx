"use client";

import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import {
  useDeleteCartMutation,
  useDeleteItemFromCartMutation,
  useGetCartDetailsQuery,
} from "@/redux/features/cart/cartApi";
import toast from "react-hot-toast";
import Loader from "../components/Loader";
import axios from "axios";
import Script from "next/script";
import {
  useAddAddressMutation,
  useGetAddressQuery,
} from "@/redux/features/auth/authApi";
import UserProtected from "../hooks/userProtected";

// Type definitions
type CartItem = {
  _id: string;
  productId: {
    imageUrl: object;
    _id: string;
    title: string;
    description: string;
    price: number;
  };
  quantity: number;
};

type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
};

const Cart: React.FC = () => {
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [newAddress, setNewAddress] = useState<Address>({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  });
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const { data, isLoading, refetch } = useGetCartDetailsQuery({});
  const {
    data: addressData,
    isLoading: addressLoading,
    refetch: addressRefetch,
  } = useGetAddressQuery({});
  const [
    addAddress,
    {
      isSuccess: addAddressSuccess,
      isLoading: addAddressLoading,
      error: addAddressError,
    },
  ] = useAddAddressMutation({});
  const [
    deleteItemFromCart,
    { isSuccess, isLoading: itemDeleteLoading, error },
  ] = useDeleteItemFromCartMutation({});
  const [
    deleteCart,
    {
      isSuccess: cartDeleteIsSuccess,
      isLoading: cartDeleteLoading,
      error: cartDelteError,
    },
  ] = useDeleteCartMutation({});

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (addressData) {
      setAddresses(addressData.addresses);
    }
  }, [addressData]);

  useEffect(() => {
    if (data) {
      setCartItems(data.carts.flatMap((cart) => cart.items)); // Flatten the nested cart items
    }
  }, [data]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("item deleted successfully");
    }
  }, [isSuccess]);

  // Function to calculate the subtotal
  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.productId.price * item.quantity,
      0
    );
  };

  // Function to handle quantity change
  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const handleDelete = async (id: string, index: number) => {
    await deleteItemFromCart({ id, cartId: data?.carts[0]?._id });
    refetch();
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const addAddressHandler = async () => {
    try {
      await addAddress({ data: newAddress });
      toast.success("Address added successfully!");
      addressRefetch();
    } catch (error) {
      console.error("Error adding address:", error);
      toast.error("Error adding address.");
    }
  };

  const checkoutHandler = async () => {
    try {
      if (!selectedAddress) {
        toast.error("select an address to checkout");
        return;
      }
      // Fetch the Razorpay key
      const {
        data: { key },
      } = await axios.get("http://localhost:8000/api/getkey");

      // Create a new order on the backend
      const res = await axios.post(
        "http://localhost:8000/api/checkout",
        {
          cart: {
            totalQty: cartItems.reduce(
              (total, item) => total + item.quantity,
              0
            ),
            totalCost: calculateSubtotal(),
            items: cartItems.map((item) => ({
              productId: item.productId._id,
              qty: item.quantity,
              price: item.productId.price,
              title: item.productId.title,
            })),
          },
          address: selectedAddress,
        },
        {
          headers: {
            Authorization: localStorage.getItem("accessToken") || undefined,
            "Content-Type": "application/json",
          },
        }
      );

      // Razorpay options
      const options = {
        key: key,
        amount: res.data.amount,
        currency: res.data.currency,
        name: "Ecommerce",
        description: "Purchase on Ecommerce Platform",
        order_id: res.data.id,
        handler: async function (response: any) {
          try {
            await axios.post(
              "http://localhost:8000/api/payment-verification",
              {
                orderId: res.data.order._id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              },
              {
                headers: {
                  Authorization:
                    localStorage.getItem("accessToken") || undefined,
                  "Content-Type": "application/json",
                },
              }
            );
            toast.success("Payment successful!");
            const resp = await deleteCart({ cartId: data?.carts[0]?._id });
            if (resp?.status === 200) {
              refetch();
            }
          } catch {
            toast.error("Payment verification failed.");
          }
        },
        theme: {
          color: "#121212",
        },
      };

      const razor = new (window as any).Razorpay(options);
      razor.on("payment.failed", function (response: any) {
        toast.error("Payment failed. Please try again.");
      });

      razor.open();
    } catch (error) {
      console.error("Error during checkout:", error);
      toast.error("Something went wrong while processing the payment.");
    }
  };

  if (itemDeleteLoading) {
    return <Loader />;
  }

  return (
    <UserProtected>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      <Header
        route={route}
        setRoute={setRoute}
        open={open}
        setOpen={setOpen}
        activeItem={2}
      />
      <div className="bg-black text-white min-h-screen p-6">
        <h1 className="text-3xl font-bold mb-6">Shopping Cart</h1>
        <div className="max-w-4xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
          {!isLoading && cartItems.length > 0 ? (
            <>
              {cartItems.map((item, index) => (
                <div key={item._id} className="flex items-center mb-4">
                  <img
                    src={item?.productId?.imageUrl?.url}
                    alt={item?.productId?.title}
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                  <div className="ml-4 flex-1">
                    <h2 className="text-lg font-semibold">
                      {item.productId.title}
                    </h2>
                    <p className="text-gray-400">
                      ₹{item.productId.price.toFixed(2)}
                    </p>
                    <p className="text-gray-400">
                      Qty:
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item._id,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-16 ml-2 p-1 text-center border border-gray-600 rounded"
                      />
                    </p>
                    <p className="text-gray-500">
                      {item.productId.description}
                    </p>
                  </div>
                  <p className="text-lg font-semibold">
                    ₹{(item.productId.price * item.quantity).toFixed(2)}
                  </p>
                  <button
                    onClick={() => handleDelete(item._id, index)}
                    className="ml-4 text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </div>
              ))}
              <div className="flex justify-between mt-8 text-xl font-semibold">
                <p>Subtotal ({cartItems.length} items):</p>
                <p>₹{calculateSubtotal().toFixed(2)}</p>
              </div>
            </>
          ) : (
            <p className="text-center"> No items in the cart...</p>
          )}

          {cartItems.length > 0 && (
            <>
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-4">Select Address</h2>
                <select
                  onChange={(e) => setSelectedAddress(e.target.value)}
                  className="bg-gray-700 text-white p-2 rounded"
                >
                  <option value="" disabled selected>
                    Choose your address
                  </option>
                  {addresses.map((address, index) => (
                    <option key={index} value={JSON.stringify(address)}>
                      {address.street}, {address.city}, {address.state},{" "}
                      {address.country}, {address.postalCode}
                    </option>
                  ))}
                </select>
                <h2 className="text-xl font-semibold mt-8 mb-4">
                  Add New Address
                </h2>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <input
                    type="text"
                    name="street"
                    placeholder="Street"
                    value={newAddress.street}
                    onChange={handleAddressChange}
                    className="block w-full mb-2 p-2 bg-gray-600 text-white rounded"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={newAddress.city}
                    onChange={handleAddressChange}
                    className="block w-full mb-2 p-2 bg-gray-600 text-white rounded"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State"
                    value={newAddress.state}
                    onChange={handleAddressChange}
                    className="block w-full mb-2 p-2 bg-gray-600 text-white rounded"
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country"
                    value={newAddress.country}
                    onChange={handleAddressChange}
                    className="block w-full mb-2 p-2 bg-gray-600 text-white rounded"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={newAddress.postalCode}
                    onChange={handleAddressChange}
                    className="block w-full mb-4 p-2 bg-gray-600 text-white rounded"
                  />
                  <button
                    onClick={addAddressHandler}
                    className="bg-yellow-500 text-black py-2 px-4 rounded-lg font-semibold hover:bg-yellow-600"
                  >
                    Add Address
                  </button>
                </div>
              </div>
              <button
                className={`mt-6 w-full bg-yellow-500 text-black py-3 rounded-lg font-semibold shadow-lg hover:bg-yellow-600`}
                onClick={checkoutHandler}
              >
                Proceed to Buy
              </button>
            </>
          )}
        </div>
      </div>
    </UserProtected>
  );
};

export default Cart;
