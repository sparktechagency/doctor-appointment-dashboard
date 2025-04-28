import { baseApi } from "../../baseApi/baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Existing getAllTeams query
    getAllTeams: builder.query({
      query: () => "/team/all", // GET endpoint
      transformResponse: (response) => response.data.attributes, // Get only the array
    }),
    getAllTeamsArray: builder.query({
      query: () => "/team/all", // GET endpoint
      transformResponse: (response) => response.data.attributes.result, // Get only the array
    }),

    // New createMember mutation
    createMember: builder.mutation({
      query: (newMember) => ({
        url: "/team/create-member", // POST endpoint
        method: "POST",
        body: newMember, // Data to be sent in the request body
      }),
    }),
    deleteMember: builder.mutation({
        query: (id) => ({
          url: `/team/${id}`, // DELETE endpoint for deleting a member
          method: "DELETE",
        }),
      }),
    updateMember: builder.mutation({
        query: (id) => ({
          url: `/team/${id}`, // DELETE endpoint for deleting a member
          method: "PUT",
        }),
      }),
    }),
  });

export const {
  useGetAllTeamsQuery,
  useGetAllTeamsArrayQuery,
  useCreateMemberMutation,
  useDeleteMemberMutation, 
  useUpdateMemberMutation
} = subscriptionApi;
