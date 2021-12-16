import { createElement } from "react";
import classNames from 'classnames'

export default function Button ({tag = 'button', variant = 'primary', ...props }) {
  return createElement(tag, {
    className: classNames(
      'rounded w-full p-2 ',
      {
        'bg-blue-500 text-white': variant === 'primary',
        'bg-gray-100 text-gray-900': variant === 'secondary',
        'bg-red-500 text-white': variant === 'danger'
      }
    ),
    ...props,
  })
}
