import appApi from "./appApi";

const postsApi = appApi.injectEndpoints({
  endpoints: build => ({
    currentUser: build.query({
      queryFn: async (arg, api, extra, baseQuery) => {
        const {
          data,
          meta: {
            response
          }
        } = await baseQuery('/current_user')

        if (!response.ok) return { data: null }

        return { data }
      }
    }),
    signUp: build.mutation({
      query: ({ username, password }) => ({
        url: '/sign_up',
        method: "POST",
        body: {
          username, password
        }
      })
    }),
    signIn: build.mutation({
      query: ({ username, password }) => ({
        url: '/sign_in',
        method: "POST",
        body: {
          username, password
        }
      })
    }),
    signOut: build.mutation({
      query: () => ({
        url: '/sign_out',
        method: "POST"
      })
    })
  })
})

export const {
  useCurrentUserQuery,
  useLazyCurrentUserQuery,
  useSignInMutation,
  useSignUpMutation,
  useSignOutMutation
} = postsApi
