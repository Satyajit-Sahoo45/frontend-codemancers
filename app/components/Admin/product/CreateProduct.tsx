"use client";

import { useCreateProductMutation } from "@/redux/features/product/productApi";
import { redirect } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

type Product = {
  title: string;
  description: string;
  price: number;
  image: string | null;
};

const CreateProduct: React.FC = () => {
  const [createProduct, { isLoading, isSuccess, error }] =
    useCreateProductMutation();

  const [product, setProduct] = useState<Product>({
    title: "",
    description: "",
    price: 0,
    image: null,
  });

  const [errors, setErrors] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success("Product created successfully");
      redirect("/admin/products");
    }
    if (error) {
      if ("data" in error) {
        const errorMessage = error as any;
        toast.error(errorMessage.data.message);
      }
    }
  }, [isSuccess, error]);

  const validate = () => {
    let valid = true;
    const newErrors = {
      title: "",
      description: "",
      price: "",
      image: "",
    };

    if (!product.title) {
      newErrors.title = "Please enter product title";
      valid = false;
    }
    if (!product.description) {
      newErrors.description = "Please enter product description!";
      valid = false;
    }
    if (!product.price || product.price <= 0) {
      newErrors.price = "Please enter a valid product price";
      valid = false;
    }
    if (!product.image) {
      newErrors.image = "Please upload a product image";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prevProduct) => ({
      ...prevProduct,
      [name]: name === "price" ? parseFloat(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setProduct((prevProduct) => ({
            ...prevProduct,
            image: reader.result as string,
          }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      const token = localStorage.getItem("accessToken");

      try {
        const result = await createProduct({
          ...product,
          headers: {
            Authorization: token,
          },
        });
      } catch (err) {
        console.error("Error creating product:", err);
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-black p-4 mt-16">
      <div className="bg-gray-800 p-8 w-full md:w-2/3 lg:w-1/2 h-full">
        <h2 className="text-3xl font-bold text-white mb-6 text-center">
          Create a Product
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
              {product?.image ? (
                <div className="p-2 bg-[#F8F9FD]">
                  <img
                    src={product?.image}
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
          >
            Create Product
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateProduct;
