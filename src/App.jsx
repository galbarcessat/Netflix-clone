import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import './assets/styles/main.scss';

import { HomePage } from './pages/HomePage';
import { LoginScreen } from './pages/LoginScreen';
import { auth, onAuthStateChanged } from "../src/firebase"
import { useEffect } from 'react';
import { SET_USER } from './store/reducers/user.reducer';
import { ProfileScreen } from './pages/ProfileScreen';
import { MovieDetails } from './pages/MovieDetails';

export function App() {
  const dispatch = useDispatch()
  const user = useSelector(state => state.userModule.user)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        console.log('User is logged in:', userAuth)
        dispatch({
          type: SET_USER, user: {
            uid: userAuth.uid,
            email: userAuth.email
          }
        })

      } else {
        dispatch({ type: SET_USER, user: null })
        console.log('User is logged out')
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <Router>
      {!user ?
        <LoginScreen />
        :
        (<Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<MovieDetails />} path="/movie" />
          <Route element={<LoginScreen />} path="/login" />
          <Route element={<ProfileScreen />} path="/profile" />
        </Routes>)}
    </Router>
  )
}


