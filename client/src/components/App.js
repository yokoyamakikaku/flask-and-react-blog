import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'

import store from '../store'

import Header from './Header'

import Home from './Home'
import SignIn from './SignIn'
import SignOut from './SignOut'
import SignUp from './SignUp'

export default function App () {
  return (
    <Provider store={store}>
    <Router>
      <Header />
      <Routes path="/">
        <Route index element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signout" element={<SignOut />} />
      </Routes>
    </Router>
    </Provider>
  )
}
