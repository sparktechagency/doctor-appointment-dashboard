import { baseApi } from "../../baseApi/baseApi";

export const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createTeamMember: builder.mutation({
      query: (data) => ({
        url: "/team/create-member",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['TeamMembers'], // Changed from "Teams" to be more specific
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
      providesTags: (result) => 
        result 
          ? [
              ...result.map(({ id }) => ({ type: 'TeamMembers', id })),
              { type: 'TeamMembers', id: 'LIST' },
            ]
          : [{ type: 'TeamMembers', id: 'LIST' }],
      transformResponse: (response) => {
        return response?.data?.attributes?.results || [];
      },
    }),
    getAdminTeamMember: builder.query({
      query: () => ({
        url: '/team/member/admin',
        method: "GET",
      }),
      providesTags: ['TeamMembers'],
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
      providesTags: (result, error, id) => [{ type: 'TeamMembers', id }],
      transformResponse: (response) => {
        if (response?.data?.attributes?.team?.media && typeof response.data.attributes.team.media === 'string') {
          try {
            response.data.attributes.team.media = JSON.parse(response.data.attributes.team.media);
          } catch (e) {
            console.error('Failed to parse media field', e);
            response.data.attributes.team.media = {};
          }
        }
        return response;
      }
    }),
     updateTeamMember: builder.mutation({
      query: ({ id, data }) => {
        return {
          url: `/team/member/${id}`,
          method: "PUT",
          body: data,
          headers: {
            // No Content-Type header - let the browser set it with boundary
          },
        };
      },
      invalidatesTags: (result, error, { id }) => [
        { type: 'TeamMembers', id },
        { type: 'TeamMembers', id: 'LIST' }
      ],
      transformResponse: (response) => {
        if (response?.data?.attributes?.team?.media && typeof response.data.attributes.team.media === 'string') {
          try {
            response.data.attributes.team.media = JSON.parse(response.data.attributes.team.media);
          } catch (e) {
            console.error('Failed to parse media field', e);
            response.data.attributes.team.media = {};
          }
        }
        return response;
      },
      transformErrorResponse: (response) => {
        return {
          status: response.status,
          message: response.data?.message || 'Failed to update team member',
          data: response.data
        };
      }
    }),
    deleteTeamMember: builder.mutation({
      query: (id) => ({
        url: `/team/member/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: 'TeamMembers', id: 'LIST' }],
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