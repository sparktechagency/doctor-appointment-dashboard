import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://10.0.60.206:6060/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
    // credentials: "include", // This ensures credentials (like cookies) are included
  }),
  tagTypes: ["User", "Categories", "ComboBox", "Products"],
  endpoints: () => ({}),
});
