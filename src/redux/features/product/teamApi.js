import { baseApi } from "../../baseApi/baseApi";

const teamApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addTeamMember: builder.mutation({
      query: (formdata) => ({
        url: "/team/member",
        method: "POST",
        body: formdata,
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
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
      providesTags: ["Teams"],
      transformResponse: (response) => response?.data?.attributes?.results || [],
    }),
    getTeamMemberById: builder.query({
      query: (id) => ({
        url: `/team/member/${id}`,
        method: "GET",
      }),
      providesTags: ["Teams"],
      transformResponse: (response) => response?.data?.attributes,
    }),
    updateTeamMember: builder.mutation({
      query: ({ id, formdata }) => ({
        url: `/team/member/${id}`,
        method: "PATCH",
        body: formdata,
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
  useAddTeamMemberMutation,
  useGetAllTeamMembersQuery,
  useDeleteTeamMemberMutation,
  useUpdateTeamMemberMutation,
  useGetTeamMemberByIdQuery,
} = teamApi;