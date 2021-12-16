import { useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useCurrentUserQuery, useLazyCurrentUserQuery, useSignOutMutation } from '../services/authApi'

export default function Header () {
  const {
    data: currentUser,
  } = useCurrentUserQuery()

  const [signOut, {
    isSuccess
  }] = useSignOutMutation()

  const [getCurrentUser] = useLazyCurrentUserQuery()

  useEffect(() => {
    if(!isSuccess) return
    getCurrentUser()
  }, [isSuccess, getCurrentUser])

  return (
    <div className="py-6 px-12 flex flex-col gap-4">
      <h1 className="font-bold text-3xl">
        <Link to="/">Blog</Link>
      </h1>
      {currentUser ? (
        <div className="flex flex-row gap-2">
          <div className="flex gap-3 flex-grow items-center">
            <div className="bg-gray-100 rounded-full flex justify-center items-center w-10 h-10 uppercase">
              {currentUser.username[0]}
            </div>
            <div className="text-sm">{currentUser.username}</div>
          </div>
          <button onClick={signOut} className="py-2 px-4 bg-gray-100 rounded">ログアウト</button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Link className="block p-1 text-blue-500 underline" to="/signin">ログイン</Link>
          <Link className="block p-1 text-blue-500 underline" to="/signup">アカウント作成</Link>
        </div>
      )}
    </div>
  )
}
