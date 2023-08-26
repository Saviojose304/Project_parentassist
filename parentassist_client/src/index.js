import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '../node_modules/react-bootstrap/dist/react-bootstrap.js';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import Register from './components/Register';
import Home from './components/Home';
import Login from './components/Login';
import ChildProfile from './components/Users/ChildProfile';
import Parent from './components/Users/Parent';
import Doctor from './components/Users/Doctor';
import Admin from './components/Users/Admin';
import Forgotpassmail from './components/forgotpass/Forgotpassmail';
import Emailverification from './components/Emailverification/Emailverification';

const router = createBrowserRouter([
  {
    path: "/Register",
    element: <Register />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path:"/Login",
    element: <Login />
  },
  {
    path:"/Parent",
    element: <Parent />
  },
  {
    path:"/ChildProfile",
    element: <ChildProfile />
  },
  {
    path:"/verify/:token",
    element:<Emailverification />
  },
  {
    path:"/Doctor",
    element: <Doctor />
  },
  {
    path:"/Admin",
    element: <Admin />
  },
  {
    path:"/Forgotpassmail",
    element: <Forgotpassmail />
  }
  

]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId='1036301114388-7dmjgf311vbmvjv0rc0srar6bf9u7jb5.apps.googleusercontent.com'>
    <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
  </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
