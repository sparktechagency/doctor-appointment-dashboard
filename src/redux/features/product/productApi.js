import { baseApi } from "../../baseApi/baseApi";

const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addProduct: builder.mutation({
      query: (formdata) => {
        return {
          url: "/admin/product",
          method: "POST",
          body: formdata,
        };
      },
      invalidatesTags: ["Products"],
    }),
    getAllProducts: builder.query({
      query: () => ({
        url: "/admin/products",
        method: "GET",
      }),
      providesTags: ["Products"],
      transformResponse: (response) => response?.data?.attributes?.results,
    }),
    getProductById: builder.query({
      query: (id) => ({
        url: `/admin/product/${id}`,
        method: "GET",
      }),
      providesTags: ["Products"],
      transformResponse: (response) => response?.data?.attributes,
    }),
    updateProduct: builder.mutation({
      query: ({id, formdata}) => {
        return {
          url: `/admin/product/${id}`,
          method: "PATCH",
          body: formdata,
        };
      },
      invalidatesTags: ["Products"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/admin/product/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetAllProductsQuery,
  useDeleteProductMutation,
  useUpdateProductMutation,
  useGetProductByIdQuery,
} = productApi;
