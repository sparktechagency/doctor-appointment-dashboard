import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://api.budbox.fun/api/v1",
    baseUrl: "https://api.trustedgpclinic.com/api/v1",
    prepareHeaders: (headers, { getState }) => {
      // Retrieve the token from your store or local storage
      const token = getState().auth.token;
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Categories", "ComboBox", "Products"],
  endpoints: () => ({}),
});
