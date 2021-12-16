import { useMemo } from 'react'
import * as Yup from 'yup'

export function useAuthorizeValidationSchema () {
  return useMemo(() => Yup.object({}).shape({
    username: Yup.string()
      .min(3)
      .max(64)
      .required()
      .default(''),
    password: Yup.string()
      .required()
      .default(''),
  }), [])
}
