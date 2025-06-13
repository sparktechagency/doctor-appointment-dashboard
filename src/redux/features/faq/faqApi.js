import { baseApi } from "../../baseApi/baseApi";

const faqApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addFaq: builder.mutation({
      query: (faqData) => ({
        url: "/faq",
        method: "POST",
        body: faqData,
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      invalidatesTags: ["Faqs"],
    }),
    getFaqs: builder.query({
      query: () => "/faq",
      providesTags: ["Faqs"],
    }),
    getFaqById: builder.query({
      query: (id) => ({
        url: `/faq/${id}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      transformResponse: (response) => response.data.attributes,
      providesTags: (result, error, id) => [{ type: 'Faqs', id }],
    }),
    updateFaq: builder.mutation({
      query: ({ id, ...faqData }) => ({
        url: `/faq/${id}`,
        method: "PATCH",
        body: faqData,
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      invalidatesTags: ["Faqs"],
    }),
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `/faq/${id}`,
        method: "DELETE",
        headers: {
          'Content-Type': 'application/json'
        }
      }),
      invalidatesTags: ["Faqs"],
    }),
  }),
});

export const {
  useAddFaqMutation,
  useGetFaqsQuery,
  useGetFaqByIdQuery,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
} = faqApi;