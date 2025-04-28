import { baseApi } from "../../baseApi/baseApi";

export const subscriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Existing getAllTeams query
    getAllTeams: builder.query({
      query: () => "/team/all", // GET endpoint
      transformResponse: (response) => response.data.attributes, // Get only the array
    }),
    
    // New createMember mutation
    createMember: builder.mutation({
      query: (newMember) => ({
        url: "/team/create-member", // POST endpoint
        method: "POST",
        body: newMember, // Data to be sent in the request body
      }),
    }),
  }),
});

export const {
  useGetAllTeamsQuery,
  useCreateMemberMutation, // Exporting the useCreateMemberMutation hook
} = subscriptionApi;
