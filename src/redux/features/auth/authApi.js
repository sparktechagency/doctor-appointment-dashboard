import { baseApi } from "../../baseApi/baseApi";


const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "/auth/login",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    forgotPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
    verifyEmail: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
    }),
    resetPassword: builder.mutation({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),
    getPrivacyPolicy: builder.query({
      query: (data) => ({
        url: "/info/privacy-policy",
        method: "GET",
        body: data,
      }),
    }),
    getTermsCondition: builder.query({
      query: (data) => ({
        url: "/info/terms-condition",
        method: "GET",
        body: data,
      }),
    }),
    getAboutUs: builder.query({
      query: (data) => ({
        url: "/info/about-us",
        method: "GET",
        body: data,
      }),
    }),
    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/self/update`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ['User'], // Optional: if you're using tags for caching
    }),
 getUser: builder.query({
  query: () => ({
    url: `/users/self/in`,
    method: "GET",
  }),
  providesTags: ['User'], // Changed from invalidatesTags to providesTags for queries
})
  }),


  })


export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useVerifyEmailMutation,useGetPrivacyPolicyQuery,useGetTermsConditionQuery, useGetAboutUsQuery,
  useResetPasswordMutation,  useChangePasswordMutation,useUpdateUserMutation,useGetUserQuery
} = authApi;
