import { baseApi } from "../../baseApi/baseApi";

const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStatus: builder.query({
      query: () => ({
        url: "admin/dashboard/totalStatus",
        method: "GET",
      }),
      transformResponse: (response) => response?.data?.attributes,
    }),
    getIncomeRatio: builder.query({
      query: (year) => ({
        url: `admin/dashboard/income-ratio?year=${year}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data?.attributes,
    }),
    getUserRatio: builder.query({
      query: (year) => ({
        url: `admin/dashboard/user-ratio?year=${year}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data?.attributes,
    }),
    getRecentAppointments: builder.query({
      query: () => ({
        url: "appointment/admin/lists?sortBy=createdAt:desc",
        method: "GET",
      }),
      transformResponse: (response) => response?.data?.attributes?.results,
    }),
  }),
});

export const { 
  useGetDashboardStatusQuery, 
  useGetIncomeRatioQuery,
  useGetUserRatioQuery,
  useGetRecentAppointmentsQuery 
} = dashboardApi;