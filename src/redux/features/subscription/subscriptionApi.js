import { baseApi } from "../../baseApi/baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: (data) => {
        const token = sessionStorage.getItem("token"); // Get the token from sessionStorage
        return {
          url: "/subscription", // Adjust the URL as needed
          method: "POST",
          body: data, // Send the form data
          headers: {
            Authorization: `Bearer ${token}`, // Set the Authorization header with Bearer token
          },
          // credentials: "include", // Optional: Include credentials (cookies)
        };
      },
    }),
  }),
});
export const { useCreateSubscriptionMutation } = subscriptionApi;
