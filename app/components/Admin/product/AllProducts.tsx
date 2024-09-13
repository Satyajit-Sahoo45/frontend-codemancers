import React, { useEffect, useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useTheme } from "next-themes";
import { FiEdit2 } from "react-icons/fi";
import { format } from "timeago.js";
import { toast } from "react-hot-toast";
import Link from "next/link";
import {
  useDeleteProductMutation,
  useGetAllProductsQuery,
} from "@/redux/features/product/productApi";

const AllProducts = () => {
  const [open, setOpen] = useState(false);
  const [productId, setProductId] = useState("");
  const [rows, setRow] = useState<any[]>([]);
  const { isLoading, data, refetch } = useGetAllProductsQuery(undefined, {});
  const [deleteCourse, { isSuccess, error }] = useDeleteProductMutation({});

  useEffect(() => {
    if (data?.products) {
      setRow(data?.products);
    }
  }, [data, data?.products]);

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
      refetch();
      toast.success("Product Deleted Successfully");
    }
    if (error) {
      const errorMessage = (error as any).data?.message || "Error occurred";
      toast.error(errorMessage);
    }
  }, [isSuccess, error, refetch]);

  const handleDelete = async () => {
    await deleteCourse(productId);
  };

  return (
    <div className="flex-1 h-full flex flex-col items-center justify-center bg-black p-4 mt-16">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="container mx-auto px-4">
          <div className="overflow-x-auto bg-white dark:bg-slate-800 shadow-md rounded-lg p-4">
            <table className="min-w-full bg-white dark:bg-slate-800">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Product Title</th>
                  <th className="px-6 py-3 text-left">Ratings</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Created At</th>
                  <th className="px-6 py-3 text-left">Edit</th>
                  <th className="px-6 py-3 text-left">Delete</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={row._id}
                    className="border-t dark:border-gray-700 dark:text-white"
                  >
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{row.title}</td>
                    <td className="px-6 py-4">{row.ratings.length}</td>
                    <td className="px-6 py-4">₹ {row.price}</td>
                    <td className="px-6 py-4">{format(row.createdAt)}</td>
                    <td className="px-6 py-4">
                      <Link href={`/admin/edit-product/${row._id}`}>
                        <FiEdit2 className="text-blue-600 dark:text-blue-400" />
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setOpen(true);
                          setProductId(row._id);
                        }}
                        className="text-red-600 dark:text-red-400"
                      >
                        <AiOutlineDelete />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {open && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6 w-96">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">
                  Are you sure you want to delete this product?
                </h2>
                <div className="flex justify-between">
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                    onClick={handleDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AllProducts;
