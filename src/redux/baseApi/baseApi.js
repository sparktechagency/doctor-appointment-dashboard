import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../../utils/constants";
export const baseApi = createApi({
  reducerPath: "pokemonApi",
  baseQuery: fetchBaseQuery({
    // baseUrl: "https://api.budbox.fun/api/v1",
    baseUrl: `${BASE_URL}/api/v1`,
    //baseUrl: "http://localhost:5000/api/v1",
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
