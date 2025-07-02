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
    getAppointmentById: builder.query({
      query: (appointmentId) => ({
        url: `appointment/${appointmentId}`,
        method: "GET",
      }),
      transformResponse: (response) => response?.data,
    }),
    getAllUsers: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.date) {
          queryParams.append('date', params.date);
        }
        if (params.userName) {
          queryParams.append('userName', params.userName);
        }
        if (params.page) {
          queryParams.append('page', params.page);
        }
        
        return {
          url: `admin/users?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response?.data?.attributes,
    }),
 getAppointments: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.date) {
          queryParams.append('date', params.date);
        }
        if (params.patientName) {
          queryParams.append('patientName', params.patientName);
        }
        if (params.page) {
          queryParams.append('page', params.page);
        }
        if (params.status) {
          queryParams.append('status', params.status);
        }
        
        return {
          url: `appointment/admin/lists?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response?.data?.attributes,
    }),
   getEarnings: builder.query({
      query: (params = {}) => {
        const queryParams = new URLSearchParams();
        
        if (params.date) {
          queryParams.append('createdAt', params.date);
        }
        if (params.page) {
          queryParams.append('page', params.page);
        }
        if (params.status) {
          queryParams.append('status', params.status);
        }
        
        return {
          url: `admin/earnings?${queryParams.toString()}`,
          method: "GET",
        };
      },
      transformResponse: (response) => response?.data?.attributes,
    }),
  }),
  
});

export const { 
  useGetDashboardStatusQuery, 
  useGetIncomeRatioQuery,
  useGetUserRatioQuery,
  useGetRecentAppointmentsQuery,  useGetAppointmentsQuery,useGetEarningsQuery,  useGetAppointmentByIdQuery,
  useGetAllUsersQuery
} = dashboardApi;