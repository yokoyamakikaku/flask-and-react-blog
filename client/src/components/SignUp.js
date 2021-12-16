import { useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router"
import { Link } from "react-router-dom"
import { Formik, Form } from "formik"

import { useSignUpMutation } from "../services/authApi"
import { useAuthorizeValidationSchema } from '../hooks/auth'

import Page, { PageTitle } from './Page'
import Field from './Field'
import Button from './Button'

export default function SignIn () {
  const navigate = useNavigate()

  const validationSchema = useAuthorizeValidationSchema()
  const initialValues = useMemo(() => validationSchema.cast({}), [validationSchema])

  const [signUp, {
    isSuccess: isSignedUp,
    isLoading: isSigningUp,
    error,
  }] = useSignUpMutation()

  const handleSubmit = useCallback(({ username, password }) => {
    signUp({ username, password})
  }, [signUp])

  useEffect(() => {
    if (!isSignedUp) return
    alert('アカウントを作成しました')
    navigate('/signin')
  }, [isSignedUp, navigate])

  return (
    <Page className="gap-8">
      <PageTitle>アカウント作成</PageTitle>
      <Formik validationSchema={validationSchema} initialValues={initialValues} onSubmit={handleSubmit}>
        {props => (
          <Form className="flex flex-col gap-4 max-w-lg">
            <Field label="ユーザ名" name="username" />
            <Field label="パスワード" name="password" type="password" />
            {error && (
              <div className="bg-red-100 text-red-500 p-1">{error.message}</div>
            )}
            <Button disabled={!props.isValid || isSigningUp} type="submit">
              アカウントを作成する
            </Button>
            <div className="text-center">
              <Link className="text-blue-500 underline" to="/signin">ログイン</Link>
            </div>
          </Form>
        )}
      </Formik>
    </Page>
  )
}
