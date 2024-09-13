import { apiSlice } from "../api/apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createProduct: builder.mutation({
      query: (data) => ({
        url: "add-product",
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("accessToken") || undefined,
          "Content-Type": "application/json",
        },
        body: data,
        credentials: "include" as const,
      }),
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: "get-admin-products",
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("accessToken") || undefined,
          "Content-Type": "application/json",
        },
        credentials: "include" as const,
      }),
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/delete-product/${id}`,
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("accessToken") || undefined,
          "Content-Type": "application/json",
        },
        credentials: "include" as const,
      }),
    }),
    editProduct: builder.mutation({
      query: ({ id, data }) => ({
        url: `edit-product/${id}`,
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("accessToken") || undefined,
          "Content-Type": "application/json",
        },
        body: data,
        credentials: "include" as const,
      }),
    }),
    getProductsForUsers: builder.query({
      query: () => ({
        url: "products",
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    getProductDetails: builder.query({
      query: (id: any) => ({
        url: `/product/${id}`,
        method: "GET",
        credentials: "include" as const,
      }),
    }),
    addReviewInProduct: builder.mutation({
      query: ({ review, rating, productId }: any) => ({
        url: `add-review/${productId}`,
        headers: {
          Authorization: localStorage.getItem("accessToken") || undefined,
          "Content-Type": "application/json",
        },
        body: {
          review,
          rating,
        },
        method: "PUT",
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useEditProductMutation,
  useGetProductsForUsersQuery,
  useGetProductDetailsQuery,
  useAddReviewInProductMutation,
} = productApi;
