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
      transformResponse: (response) => response?.data?.attributes?.results || [],
    }),
    getTeamMemberById: builder.query({
      query: (id) => ({
        url: `/team/member/${id}`,
        method: "GET",  headers: {
          'Content-Type': 'application/json'
        },
      }),
      providesTags: ["Teams"],
      transformResponse: (response) => response?.data?.attributes.team,
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
  useGetTeamMemberByIdQuery,
  useUpdateTeamMemberMutation,
  useDeleteTeamMemberMutation,
} = teamApi;