import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import './assets/styles/main.scss';

import { HomePage } from './pages/HomePage';
import { LoginScreen } from './pages/LoginScreen';
import { auth, onAuthStateChanged } from "../src/firebase"
import { useEffect } from 'react';

export function App() {

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (userAuth) => {
      if (userAuth) {
        console.log('User is logged in:', userAuth)
        // Handle the case when the user is logged in
      } else {
        console.log('User is logged out')
        // Handle the case when the user is logged out
      }
    })

    return () => unsubscribe()
  }, [])

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route element={<HomePage />} path="/" />
          <Route element={<LoginScreen />} path="/login" />
        </Routes>
      </Router>
    </Provider>
  );
}


