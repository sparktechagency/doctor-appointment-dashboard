import { baseApi } from "../../baseApi/baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createSubscription: builder.mutation({
      query: (data) => {
        const token = sessionStorage.getItem("token"); // Get the token from sessionStorage
        return {
          url: "/subscription", // POST endpoint
          method: "POST",
          body: data,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
      },
    }),
    getAllSubscriptions: builder.query({
      query: () => "/subscription/all", // GET endpoint
      transformResponse: (response) => response.data.attributes, // Get only the array
    }),
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `/subscription/${id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const { useCreateSubscriptionMutation, useGetAllSubscriptionsQuery, useDeleteSubscriptionMutation } = subscriptionApi;
