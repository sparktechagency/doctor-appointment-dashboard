// src/redux/features/notification/notificationApi.ts
import { baseApi } from "../../baseApi/baseApi";




export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotifications: builder.query({
      query: () => '/info/notifications',
      providesTags: ['Notifications'],
    }),
   
   
  }),
});

export const {
  useGetNotificationsQuery,

} = notificationApi;