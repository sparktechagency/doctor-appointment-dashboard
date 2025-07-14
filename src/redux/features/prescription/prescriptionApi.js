import { baseApi } from "../../baseApi/baseApi";

export const prescriptionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    writePrescription: builder.mutation({
      query: (data) => ({
        url: "/appointment/admin/write-prescription",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ['Appointments'],
    }),
  }),
});

export const { useWritePrescriptionMutation } = prescriptionApi;