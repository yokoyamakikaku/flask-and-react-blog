import { useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { Formik, Form } from "formik"

import {
  useSignInMutation,
  useLazyCurrentUserQuery
} from "../services/authApi"
import { useAuthorizeValidationSchema } from '../hooks/auth'

import Page, { PageTitle } from './Page'
import Field from './Field'
import Button from "./Button"
import ErrorAlert from "./ErrorAlert"

export default function SignIn () {
  const navigate = useNavigate()

  const validationSchema = useAuthorizeValidationSchema()
  const initialValues = useMemo(() => validationSchema.cast({}), [validationSchema])

  const [signIn, {
    isSuccess: isSignedIn,
    isLoading: isSigningIn,
    error
  }] = useSignInMutation()
  const [getCurrentUser] = useLazyCurrentUserQuery()

  const handleSubmit = useCallback(({ username, password }) => {
    signIn({ username, password})
  }, [signIn])

  useEffect(() => {
    if (!isSignedIn) return
    getCurrentUser()
    alert('ログインしました')
    navigate('/')
  }, [isSignedIn, navigate, getCurrentUser])

  return (
    <Page className="gap-8">
      <PageTitle>ログイン</PageTitle>
      <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit}>
        {props => (
          <Form className="flex flex-col gap-4 max-w-lg">
            <Field label="ユーザ名" name="username" />
            <Field label="パスワード" name="password" type="password" />
            <ErrorAlert error={error} />
            <Button disabled={!props.isValid || isSigningIn}>ログイン</Button>
            <div className="text-center">
              <Link className="text-blue-500 underline" to="/signup">アカウント作成</Link>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  )
}
