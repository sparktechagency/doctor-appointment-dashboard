import { baseApi } from "../../baseApi/baseApi";

const blogApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createBlog: builder.mutation({
      query: (data) => ({
        url: "/blogs",
        method: "POST",
        body: data
      }),
      invalidatesTags: ['Blogs']
    }),
    listBlog: builder.query({
      query: (params) => ({
        url: "/blogs",
        method: "GET",
        params: {
          page: params?.page || 1,
          limit: params?.limit || 10,
          sortBy: params?.sortBy || 'createdAt:desc',
          search: params?.search,
          category: params?.category
        }
      }),
      providesTags: ['Blogs'],
      transformResponse: (response) => {
        return {
          data: response.data,
          meta: response.data?.attributes
        };
      }
    }),
    deleteBlog: builder.mutation({
      query: (slug) => ({
        url: `/blogs/${slug}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Blogs']
    }),
  }),
});

export const { 
  useCreateBlogMutation, 
  useListBlogQuery,
  useDeleteBlogMutation 
} = blogApi;