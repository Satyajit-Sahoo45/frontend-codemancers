"use client";

import {
  useEditProductMutation,
  useGetAllProductsQuery,
} from "@/redux/features/product/productApi";
import { redirect, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Loader from "../../Loader";

interface ProductInfo {
  title: string;
  description: string;
  price: string;
  ratings: null;
  image: { public_id: string; url: string | ArrayBuffer | null };
}

const EditProduct = () => {
  const { id } = useParams(); // Extract the product ID from the params
  const [productInfo, setProductInfo] = useState({
    title: "",
    description: "",
    price: "",
    ratings: null,
    image: null,
  });
  const [productData, setProductData] = useState({});
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    price: "",
  });

  const [editProduct, { isLoading, isSuccess, error }] =
    useEditProductMutation();
  const { data, refetch } = useGetAllProductsQuery(
    {},
    { refetchOnMountOrArgChange: true }
  );

  // Get the product to edit based on the ID
  const editProductData = data?.products.find((i: any) => i._id === id);

  // Handle side effects after mutation
  useEffect(() => {
    if (isSuccess) {
      toast.success("Product updated successfully");
      redirect("/admin/products"); // Redirect after success
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

  // Populate form with product data
  useEffect(() => {
    if (editProductData) {
      setProductInfo({
        title: editProductData.title,
        description: editProductData.description,
        price: editProductData.price,
        ratings: editProductData?.ratings,
        image: editProductData?.imageUrl || "",
      });
    }
  }, [editProductData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProductInfo({
      ...productInfo,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductInfo((prev) => ({
          ...prev,
          image: { public_id: prev.image.public_id, url: reader.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!productInfo.title || !productInfo.description || !productInfo.price) {
      setErrors({
        title: !productInfo.title ? "Title is required" : "",
        description: !productInfo.description ? "Description is required" : "",
        price: !productInfo.price ? "Price is required" : "",
      });
      return;
    }

    try {
      await editProduct({ id, data: productInfo });
    } catch (error) {
      console.error("Error editing product", error);
    }
  };

  if (!editProductData) {
    return <Loader />;
  }

  return (
    <div className="flex items-center justify-center bg-black h-full mt-16">
      <div className="bg-gray-800 p-8 w-full h-full">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Edit Product
        </h2>

        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4 w-full">
            <label className="block text-white text-sm font-semibold mb-2">
              Product Title
            </label>
            <input
              type="text"
              placeholder="Enter product title"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              name="title"
              value={productInfo.title}
              onChange={handleChange}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title}</p>
            )}
          </div>

          <div className="mb-4 w-full">
            <label className="block text-white text-sm font-semibold mb-2">
              Description
            </label>
            <textarea
              placeholder="Enter product description"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent h-24"
              name="description"
              value={productInfo.description}
              onChange={handleChange}
            ></textarea>
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <div className="mb-4 w-full">
            <label className="block text-white text-sm font-semibold mb-2">
              Price
            </label>
            <input
              type="number"
              placeholder="0"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              name="price"
              value={productInfo.price}
              onChange={handleChange}
            />
            {errors.price && (
              <p className="text-red-500 text-sm">{errors.price}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-semibold mb-2">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              id="file"
              className="hidden"
              onChange={handleFileChange}
            />
            <label htmlFor="file" className="cursor-pointer">
              {productInfo.image ? (
                <div className="p-2 bg-[#F8F9FD]">
                  <img
                    src={productInfo?.image?.url || productInfo.image}
                    alt="Product"
                    className="max-h-full w-full object-cover"
                  />
                </div>
              ) : (
                <span className="text-[#666666] border-2 w-fit inline-flex border-[#D9D9D9] rounded-md py-1 px-6 items-center gap-2">
                  Upload
                </span>
              )}
            </label>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300"
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProduct;
