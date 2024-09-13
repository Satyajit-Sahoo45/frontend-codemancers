"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  useAddReviewInProductMutation,
  useGetProductDetailsQuery,
} from "@/redux/features/product/productApi";
import { useParams, useRouter } from "next/navigation";
import { FaStar } from "react-icons/fa";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { styles } from "@/app/components/styles/style";
import toast from "react-hot-toast";
const Header = dynamic(() => import("@/app/components/Header"), { ssr: false });
import { useAddToCartMutation } from "@/redux/features/cart/cartApi";
import Loader from "@/app/components/Loader";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { data: product, isLoading, refetch } = useGetProductDetailsQuery(id);
  const [addToCart, { isLoading: addToCartLoading, isSuccess, error }] =
    useAddToCartMutation();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(1);
  const [quantity, setQuantity] = useState(1); // Added state for quantity
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const [
    addReviewInProduct,
    {
      isSuccess: reviewSuccess,
      error: reviewError,
      isLoading: reviewCreationLoading,
    },
  ] = useAddReviewInProductMutation();

  useEffect(() => {
    if (isSuccess) {
      router.push("/cart");
    }
  }, [isSuccess]);

  if (isLoading) return <Loader />;
  if (!product) return <div>Product not found</div>;

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (review.length === 0) {
      toast.error("Review can't be empty");
      return;
    }

    try {
      const response = await addReviewInProduct({
        review,
        rating,
        productId: id,
      }).unwrap();
      toast.success("Review added successfully");
      setReview("");
      refetch();
    } catch (error: any) {
      if (error?.status === 401) {
        setRoute("Login");
        setOpen(true);
        toast.error("Please log in to access this resource");
      } else {
        toast.error(
          error?.message || "An error occurred while submitting the review"
        );
      }
    }
  };

  const handleAddToCart = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const data = { items: [{ productId: id, quantity }] };
      const res = await addToCart({ data }).unwrap();
      toast.success("Item added to cart successfully");
    } catch (error: any) {
      if (error?.status === 401) {
        setRoute("Login");
        setOpen(true);
        toast.error("Please log in to access this resource");
      } else {
        toast.error(error?.message || "An error occurred while adding to cart");
      }
    }
  };

  const calculateAverageRating = (ratings: any) => {
    const totalRatings = ratings.length;
    const totalScore = ratings.reduce(
      (acc: number, rating: number) => acc + rating.rating,
      0
    );
    return totalRatings ? (totalScore / totalRatings).toFixed(1) : 0;
  };

  if (addToCartLoading) {
    return <Loader />;
  }

  return (
    <>
      <Header
        route={route}
        setRoute={setRoute}
        open={open}
        setOpen={setOpen}
        activeItem={1}
      />
      <div className="bg-black text-white min-h-screen flex items-center justify-center flex-col p-5">
        <div className="container mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="flex justify-center">
            <img
              src={product?.product?.imageUrl.url}
              alt={product?.product?.title}
              className="w-full h-full rounded-lg shadow-lg object-cover"
            />
          </div>
          <div className="flex flex-col justify-start">
            <h1 className="text-3xl font-bold mb-4 text-center md:text-left">
              {product?.product?.title}
            </h1>
            <div className="flex justify-center md:justify-start items-center mb-2">
              <span className="bg-green-600 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded">
                {product?.product?.rating} <FaStar className="inline mb-1" />
              </span>
              <span>{product?.product?.ratings?.length} Ratings & Reviews</span>
            </div>
            <p className="text-2xl font-semibold mb-2 text-center md:text-left">
              ₹{product.product.price}
            </p>
            <div className="mt-4">
              <h3 className="font-bold mb-2 text-center md:text-left">
                Available Offers
              </h3>
              <ul className="list-disc pl-5 space-y-2 text-center md:text-left">
                <li>{product?.product?.description}</li>
              </ul>
            </div>
            <div className="mt-4 flex flex-col md:flex-row items-center md:justify-start">
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="border border-gray-400 rounded p-2 mr-2 mb-2 md:mb-0 text-black"
              />
              <button
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded shadow-lg mr-2"
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
        {/* Reviews Section */}
        <div className="mt-8 w-full bg-gray-800 text-white p-6 rounded-lg shadow-lg">
          <div className="w-full">
            <h5 className="pl-3 text-sm font-[500] dark:text-white text-black ">
              Give a Rating <span className="text-red-500">*</span>
            </h5>
            <div className="flex w-full ml-2 pb-3">
              {[1, 2, 3, 4, 5].map((i) =>
                rating >= i ? (
                  <AiFillStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={20}
                    onClick={() => setRating(i)}
                  />
                ) : (
                  <AiOutlineStar
                    key={i}
                    className="mr-1 cursor-pointer"
                    color="rgb(246,186,0)"
                    size={20}
                    onClick={() => setRating(i)}
                  />
                )
              )}
            </div>
            <textarea
              name=""
              value={review}
              onChange={(e) => setReview(e.target.value)}
              id=""
              cols={40}
              rows={4}
              placeholder="Write your comment..."
              className="outline-none bg-transparent 800px:ml-3 dark:text-white text-black border border-[#00000027] dark:border-[#ffffff57] w-[95%] 800px:w-full p-2 rounded text-[18px] font-sans"
            ></textarea>
            <div
              className={`${
                styles.button
              } !w-[120px] !h-[40px] text-[14px] mt-5 md:mr-0 mr-2 mb-2 ${
                reviewCreationLoading && "cursor-no-drop"
              }`}
              onClick={handleReviewSubmit}
            >
              Submit
            </div>
          </div>
          <h2 className="text-xl font-bold mb-6">Ratings & Reviews</h2>
          <div className="flex items-center mb-6">
            <span className="text-5xl font-bold mr-4">
              {Math.floor(calculateAverageRating(product?.product?.ratings))}
            </span>
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`h-6 w-6 ${
                    i <
                    Math.floor(
                      calculateAverageRating(product?.product?.ratings)
                    )
                      ? "text-yellow-400"
                      : "text-gray-500"
                  }`}
                />
              ))}
            </div>
            <span className="ml-4 text-lg">
              {product?.product?.totalRatings} Ratings &{" "}
              {product?.product?.reviews?.length} Reviews
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {product?.product?.ratings?.map((review, index) => (
              <div
                key={index}
                className="bg-gray-900 p-4 rounded-lg shadow-lg transition-transform transform hover:scale-105"
              >
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < review.rating ? "text-yellow-400" : "text-gray-500"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-lg font-semibold mb-2">{review?.title}</p>
                <p className="text-sm text-gray-400 mb-4">{review?.review}</p>
                <p className="text-sm text-gray-500">By {review?.userName}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetailPage;
