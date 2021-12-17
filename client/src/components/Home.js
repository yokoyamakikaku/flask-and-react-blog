import { useState, useMemo, useEffect, useCallback } from 'react'
import { Formik, Form } from 'formik'

import { useCreatePostMutation, useDeletePostMutation, useGetPostsQuery, useLazyGetPostsQuery } from '../services/postsApi'
import { useCurrentUserQuery } from '../services/authApi'

import { usePostValidationSchema } from '../hooks/posts'

import Button from './Button'
import Field from './Field'

function CreatePostForm ({ onCreated }) {
  const validationSchema = usePostValidationSchema()
  const initialValues = useMemo(()=> validationSchema.cast({}), [validationSchema])

  const [create,{
    isSuccess: isCreated,
    isLoading: isCreating,
    fulfilledTimeStamp
  }] = useCreatePostMutation()

  const handleSubmit = useCallback(({ title, body}) => {
    create({ post: { title, body }})
  }, [create])

  useEffect(() => {
    if (!isCreated) return
    onCreated && onCreated()
  }, [isCreated, onCreated])

  return (
    <Formik key={fulfilledTimeStamp} validtionSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit}>
      {props => (
        <Form className="flex flex-col gap-4">
          <Field name="title" label="タイトル" />
          <Field name="body" label="本文" tag="textarea" rows={20} />
          <Button type="submit" disabled={isCreating || !props.isValid}>記事を作成する</Button>
        </Form>
      )}
    </Formik>
  )
}

function UpdatePostForm ({ onUpdated, post }) {
  const validationSchema = usePostValidationSchema()
  const initialValues = useMemo(()=> validationSchema.cast(post), [validationSchema, post])

  const [update,{
    isSuccess: isUpdated,
    isLoading: isCreating
  }] = useCreatePostMutation()

  const handleSubmit = useCallback(({ title, body}) => {
    update({ postId: post.id, post: {title, body} })
  }, [post.id, update])

  useEffect(() => {
    if (!isUpdated) return
    onUpdated && onUpdated()
  }, [isUpdated, onUpdated])

  return (
    <Formik validtionSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit}>
      {props => (
        <Form className="flex flex-col gap-4">
          <Field name="title" label="タイトル" />
          <Field name="body" label="本文" tag="textarea" rows={20} />
          <Button type="submit" disabled={isCreating || !props.isValid}>記事を編集する</Button>
        </Form>
      )}
    </Formik>
  )
}

function Post ({ post, onUpdated, onDeleted }) {
  const [isEditing, setIsEditing] = useState(false)
  const { data: currentUser } = useCurrentUserQuery()

  const isEditable = useMemo(() => post.username === currentUser?.username, [post.username, currentUser])

  const [deletePost, {
    isLoading: isDeleting,
    isSuccess: isDeleted
  }] = useDeletePostMutation()

  const handleDelete = useCallback(() => {
    const isConfirmed = window.confirm("記事を削除していいですか？")
    if (!isConfirmed) return
    deletePost({ postId: post.id })
  }, [deletePost, post.id])

  useEffect(() => {
    if(!isDeleted) return
    window.alert("記事を削除しました")
    onDeleted && onDeleted()
  }, [isDeleted, onDeleted])

  return (
    <div className="border p-4 flex flex-col gap-4 rounded">
      {isEditing ? (
        <div className="flex flex-col gap-8">
          <UpdatePostForm post={post} onUpdated={onUpdated} />
          <Button disabled={isDeleting} onClick={handleDelete} variant='danger'>記事を削除する</Button>
        </div>
      ) : (
        <>
          <div className="flex gap-2 items-start">
            <div className="flex flex-col flex-grow gap-2 ">
              <div className="font-bold text-2xl ">{post.title}</div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
                  <div className="text-xs uppercase">{post.username[0]}</div>
                </div>
                <div className="text-sm text-gray-800">{post.username}</div>
              </div>
            </div>
            {isEditable && (
              <div className="flex text-sm gap-2">
                <button onClick={() => setIsEditing(true)} className="p-1 text-blue-500">編集する</button>
              </div>
            )}
          </div>
        <div className="text-sm text-gray-600">{post.body}</div>
      </>
      )}
    </div>
  )
}


export default function Home () {
  const { data: currentUser} = useCurrentUserQuery()
  const { data: posts, isLoading } = useGetPostsQuery()

  const [refresh] = useLazyGetPostsQuery()

  return (
    <div className="px-12 py-6 flex flex-col gap-6 max-w-xl" key={currentUser?.username}>
      {isLoading && (
        <div className="text-gray-500 py-4">Loading</div>
      )}
      {posts && (
        <div className="flex flex-col gap-4">
          {posts.map(post => <Post key={post.id} post={post} onUpdated={refresh} onDeleted={refresh} />)}
        </div>
      )}
      <CreatePostForm onCreated={refresh} />
      {currentUser && <CreatePostForm onCreated={refresh} />}
    </div>
  )
}
