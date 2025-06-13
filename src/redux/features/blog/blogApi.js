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
    updateBlog: builder.mutation({
      query: ({ slug, data }) => ({
        url: `/blogs/${slug}`,
        method: "PATCH",
        body: data
      }),
      invalidatesTags: ['Blogs']
    }),
    getSingleBlog: builder.query({
      query: (slug) => ({
        url: `/blogs/${slug}`,
        method: "GET"
      }),
      providesTags: ['Blog']
    }),
  }),

  

});

export const { 
  useCreateBlogMutation, 
  useListBlogQuery,
  useDeleteBlogMutation,useUpdateBlogMutation,
  useGetSingleBlogQuery
} = blogApi;