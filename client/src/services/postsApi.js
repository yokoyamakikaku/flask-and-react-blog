import appApi from "./appApi";

const postsApi = appApi.injectEndpoints({
  endpoints: build => ({
    getPosts: build.query({
      query: () => `/posts`
    }),
    getPost: build.query({
      query: ({ postId }) => ({
        url: `/posts/${postId}`
      })
    }),
    createPost: build.mutation({
      query: ({ post }) => ({
        url: `/posts`,
        method: "POST",
        body: post
      })
    }),
    updatePost: build.mutation({
      query: ({ postId, post }) => ({
        url: `/posts/${postId}`,
        method: "PUT",
        body: post
      })
    }),
    deletePost: build.mutation({
      query: ({ postId }) => ({
        url: `/posts/${postId}`,
        method: "DELETE",
      })
    }),
  })
})

export const {
  useGetPostsQuery,
  useLazyGetPostsQuery,
  useGetPostQuery,
  useLazyGetPostQuery,
  useCreatePostMutation,
  useDeletePostMutation,
  useUpdatePostMutation,
} = postsApi
