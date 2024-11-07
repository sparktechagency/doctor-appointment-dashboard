import { baseApi } from "../../baseApi/baseApi";

const categoryApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addCategory: builder.mutation({
      query: (data) => ({
        url: "/admin/category",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Categories"],
      transformResponse: (response) => response?.data?.attributes,
    }),
    getAllCategories: builder.query({
      query: () => ({
        url: "/admin/categorys",
        method: "GET",
      }),
      providesTags: ["Categories"],
      transformResponse: (response) => response?.data?.attributes,
    }),
    getCategoryById: builder.query({
      query: (id) => ({
        url: `/admin/category/${id}`,
        method: "GET",
      }),
      providesTags: ["Categories"],
      transformResponse: (response) => response?.data?.attributes,
    }),
    updateCategory: builder.mutation({
      query: ({id, data}) => ({
        url: `/admin/category/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Categories"],
      transformResponse: (response) => response?.data?.attributes,
    }),
    deleteCategory: builder.mutation({
      query: (id) => {
        console.log(id)
        return {
          url: `/admin/category/${id}`,
          method: "DELETE",
        };
      },
      invalidatesTags: ["Categories"],
      transformResponse: (response) => response?.data,
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useAddCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryByIdQuery,
  useUpdateCategoryMutation,
} = categoryApi;
