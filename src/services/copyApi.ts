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
    getUserCopies: builder.query<CopyType, string>({
      query: (userId) => `/copies`,
      providesTags: [{ type: 'Copy', id: 'LIST' }],
    }),
    addCopy: builder.mutation<
      { name: string; number: string },
      { name: string; number: string }
    >({
      query(pokemon) {
        return {
          url: `/info`,
          method: 'POST',
          body: pokemon,
        }
      },
      invalidatesTags: [{ type: 'Copy', id: 'LIST' }],
    }),
  }),
})

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetUserCopiesQuery, useAddCopyMutation } = copyApi
