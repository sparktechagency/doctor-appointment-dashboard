import { baseApi } from "../../baseApi/baseApi";

const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (args) => {
        console.log(args);
        const params = new URLSearchParams();

        if (args) {
          args.forEach((item) => {
            params.append(item.name, item.value);
          });
        }
        return {
          url: "/admin/all-users",
          method: "GET",
          params,
        };
      },
    }),
  }),
});

export const { useGetAllUsersQuery } = userApi;
