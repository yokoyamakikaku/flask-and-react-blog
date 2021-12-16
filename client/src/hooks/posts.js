import { useMemo } from "react";
import * as Yup from 'yup'

export function usePostValidationSchema() {
  return useMemo(() => Yup.object({}).shape({
    title: Yup.string().required().default(''),
    body: Yup.string().required().default('')
  }), [])
}
