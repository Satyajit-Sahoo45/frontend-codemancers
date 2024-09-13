import { apiSlice } from "../api/apiSlice";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    checkout: builder.mutation({
      query: (data) => ({
        url: "checkout",
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("accessToken") || undefined,
          "Content-Type": "application/json",
        },
        body: data,
        credentials: "include" as const,
      }),
    }),
    paymentVerification: builder.mutation({
      query: (data) => ({
        url: "payment-verification",
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("accessToken") || undefined,
          "Content-Type": "application/json",
        },
        body: data,
        credentials: "include" as const,
      }),
    }),
    getUserOrders: builder.query({
      query: ({ userId }) => ({
        url: `all-orders`,
        method: "GET",
        headers: {
          Authorization: localStorage.getItem("accessToken") || undefined,
          "Content-Type": "application/json",
        },
        credentials: "include" as const,
      }),
    }),
  }),
});

export const {
  useCheckoutMutation,
  usePaymentVerificationMutation,
  useGetUserOrdersQuery,
} = cartApi;
