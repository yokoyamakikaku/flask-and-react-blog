import { createElement } from 'react'
import classNames from 'classnames'

const Page = ({ className, ...props}) => (
  <main className={classNames(className, 'flex flex-col p-12')} {...props} />
)

export const PageTitle = ({ tag = 'h1', className, ...props}) => (
  createElement(tag, {
    className: classNames(className, 'text-3xl font-bold'),
    ...props,
  })
)

export default Page
