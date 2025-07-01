import { baseApi } from "../../baseApi/baseApi";

const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTeamMember: builder.mutation({
      query: (data) => ({
        url: "/team/create-member",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Teams"],
    }),
    getAllTeamMembers: builder.query({
      query: (params = {}) => {
        const defaultParams = {
          sortBy: 'createdAt:desc',
          page: 1,
          limit: 10,
          ...params
        };
        const queryString = new URLSearchParams(defaultParams).toString();
        return {
          url: `team/member/all?${queryString}`,
          method: "GET",
        };
      },
      providesTags: ["Teams"],
      transformResponse: (response) => {
        // Filter to only include admin members if needed
        return response?.data?.attributes?.results || [];
      },
    }),
    getAdminTeamMember: builder.query({
      query: () => ({
        url: '/team/member/admin',
        method: "GET",
      }),
      providesTags: ["Teams"],
      transformResponse: (response) => response?.data || null,
    }),
    getTeamMemberById: builder.query({
      query: (id) => ({
        url: `/team/member/${id}`,
        method: "GET",
        headers: {
          'Content-Type': 'application/json'
        },
      }),
      providesTags: ["Teams"],
      transformResponse: (response) => response,
    }),
    updateTeamMember: builder.mutation({
      query: ({ id, data }) => ({
        url: `/team/member/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Teams"],
    }),
    deleteTeamMember: builder.mutation({
      query: (id) => ({
        url: `/team/member/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Teams"],
    }),
  }),
});

export const {
  useCreateTeamMemberMutation,
  useGetAllTeamMembersQuery,
  useGetAdminTeamMemberQuery,
  useGetTeamMemberByIdQuery,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamApi;