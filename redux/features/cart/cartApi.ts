import { apiSlice } from "../api/apiSlice";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCartDetails: builder.query({
      query: () => ({
        url: "cart",
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("accessToken") || undefined,
          "Content-Type": "application/json",
        },
        credentials: "include" as const,
      }),
    }),
    addToCart: builder.mutation({
      query: (data) => ({
        url: "cart",
        method: "PUT",
        headers: {
          Authorization: localStorage.getItem("accessToken") || undefined,
          "Content-Type": "application/json",
        },
        body: data,
        credentials: "include" as const,
      }),
    }),
    deleteItemFromCart: builder.mutation({
      query: ({ id, cartId }) => ({
        url: `/cart/${id}`,
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("accessToken") || undefined,
          "Content-Type": "application/json",
        },
        body: {
          cartId,
        },
        credentials: "include" as const,
      }),
    }),
    deleteCart: builder.mutation({
      query: ({ cartId }) => ({
        url: `/delete-cart/${cartId}`,
        method: "DELETE",
        headers: {
          Authorization: localStorage.getItem("accessToken") || undefined,
          "Content-Type": "application/json",
        },
        body: {
          cartId,
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useGetCartDetailsQuery,
  useAddToCartMutation,
  useDeleteItemFromCartMutation,
  useDeleteCartMutation,
} = cartApi;
