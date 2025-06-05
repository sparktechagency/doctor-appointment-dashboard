import { baseApi } from "../../baseApi/baseApi";

const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addSubscription: builder.mutation({
      query: (subscriptionData) => ({
        url: "/subscription",
        method: "POST",
        body: subscriptionData,
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    getSubscriptions: builder.query({
      query: () => "/subscription/all",
      transformResponse: (response) => response.data.attributes,
        headers: {
          'Content-Type': 'application/json'
        },
      providesTags: ["Subscriptions"],
    }),
getSubscriptionById: builder.query({
  query: (id) => ({
    url: `/subscription/${id}`,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }),
  transformResponse: (response) => response.data.attributes,
  providesTags: (result, error, id) => [{ type: 'Subscriptions', id }],
}),
    updateSubscription: builder.mutation({
      query: ({ id, ...subscriptionData }) => ({
        url: `/subscription/${id}`,
        method: "PUT",
        body: subscriptionData,
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      invalidatesTags: ["Subscriptions"],
    }),
    deleteSubscription: builder.mutation({
      query: (id) => ({
        url: `/subscription/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Subscriptions"],
    }),
  }),
});

export const {
  useAddSubscriptionMutation,
  useGetSubscriptionsQuery,
  useGetSubscriptionByIdQuery,
  useUpdateSubscriptionMutation,
  useDeleteSubscriptionMutation,
} = subscriptionApi;