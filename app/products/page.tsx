"use client";

import React, { useEffect, useState } from "react";
import { useGetProductsForUsersQuery } from "@/redux/features/product/productApi";
import Loader from "../components/Loader";
import Header from "../components/Header";
import { FaStar } from "react-icons/fa"; // Import star icon
import Link from "next/link";

interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: {
    public_id: string;
    url: string;
  };
  ratings: {
    userId: string;
    rating: number;
    review: string;
  }[];
}

type Props = {};

const ProductsPage: React.FC<Props> = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const { data, isLoading } = useGetProductsForUsersQuery(undefined, {});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (data?.products) {
      setProducts(data.products);
    }
  }, [data]);

  const calculateAverageRating = (ratings: Product["ratings"]) => {
    const totalRatings = ratings.length;
    const totalScore = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return totalRatings ? (totalScore / totalRatings).toFixed(1) : 0;
  };

  return (
    <>
      <Header
        route={route}
        setRoute={setRoute}
        open={open}
        setOpen={setOpen}
        activeItem={1}
      />
      <div className="container mx-auto p-6">
        {isLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.map((product) => (
                <Link
                  href={`/product/${product._id}`}
                  key={product._id}
                  className="bg-gray-800 text-white rounded-lg shadow-sm hover:shadow-white cursor-pointer transform transition duration-300 hover:scale-105 hover:shadow-md"
                >
                  <img
                    src={product.imageUrl.url}
                    alt={product.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">
                      {product.title}
                    </h2>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center">
                        {/* Rating inside green box with star */}
                        <div className="bg-green-500 text-white px-2 py-1 rounded flex items-center">
                          <span className="mr-1">
                            {calculateAverageRating(product.ratings)}
                          </span>
                          <FaStar className="w-4 h-4" />
                        </div>
                        <span className="ml-2 text-gray-400">
                          ({product.ratings.length})
                        </span>
                      </div>
                      <span className="text-lg font-bold text-yellow-400">
                        ₹{product.price.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-400">No products available</p>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductsPage;
