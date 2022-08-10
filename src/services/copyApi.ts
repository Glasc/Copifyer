// Need to use the React-specific entry point to import createApi
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

interface CopyType {
  id: number
  userId: string
  content: string
  date: string
  title: string
}

// Define a service using a base URL and expected endpoints
export const copyApi = createApi({
  reducerPath: 'copyApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: ['Copy'],
  endpoints: (builder) => ({
    getUserCopies: builder.query<CopyType[], void>({
      query: () => `/copies`,
      providesTags: ['Copy'],
    }),
    addNewCopy: builder.mutation<void, { title: string; content: string }>({
      query(copy) {
        return {
          url: `/copies`,
          method: 'POST',
          body: copy,
        }
      },
      invalidatesTags: ['Copy'],
    }),
    deleteCopy: builder.mutation<{ success: boolean }, number>({
      query(id) {
        return {
          url: `/copies`,
          method: 'DELETE',
          body: id,
        }
      },
      invalidatesTags: ['Copy'],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetUserCopiesQuery,
  useAddNewCopyMutation,
  useDeleteCopyMutation,
} = copyApi
