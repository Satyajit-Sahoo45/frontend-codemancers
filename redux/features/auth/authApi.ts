import { apiSlice } from "../api/apiSlice";
import { userLoggedIn, userLoggedOut, userRegistration } from "./authSlice";

type RegistrationResponse = {
  message: string;
  accessToken: string;
};

type RegistrationData = {};

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation<RegistrationResponse, RegistrationData>({
      query: (data) => ({
        url: "signup",
        method: "POST",
        body: data,
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userRegistration({
              token: result.data.accessToken,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: "login",
        method: "POST",
        body: {
          email,
          password,
        },
        credentials: "include" as const,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            userLoggedIn({
              accessToken: result.data.accessToken,
              user: result.data.user,
            })
          );
        } catch (error: any) {
          console.log(error);
        }
      },
    }),
    addAddress: builder.mutation({
      query: (data) => ({
        url: "add-address",
        method: "POST",
        headers: {
          Authorization: localStorage.getItem("accessToken") || undefined,
          "Content-Type": "application/json",
        },
        body: data,
        credentials: "include" as const,
      }),
    }),
    getAddress: builder.query({
      query: () => ({
        url: "get-address",
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
  useSignupMutation,
  useLoginMutation,
  useAddAddressMutation,
  useGetAddressQuery,
} = authApi;
