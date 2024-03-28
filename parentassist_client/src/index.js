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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Register from './components/Register';
import Home from './components/Home';
import Login from './components/Login';
import ChildProfile from './components/Users/ChildProfile';
import Parent from './components/Users/Parent';
import Doctor from './components/Users/Doctor';
import Admin from './components/Users/Admin';
import Emailverification from './components/Emailverification/Emailverification';
import Resetpass from './components/forgotpass/Resetpass';
import ParentRegister from './components/Users/ParentRegister';
import DoctorRegister from './components/Users/DoctorRegister';
import ChildProfileUpdate from './components/Users/ChildProfileUpdate';
import ParentProfileUpdate from './components/Users/ParentProfileUpdate';
import DoctorProfileUpdate from './components/Users/DoctorProfileUpdate';
import ChildParentView from './components/UsersView/ChildParentView';
import ChildDoctorView from './components/UsersView/ChildDoctorView';
import DoctorBooking from './components/Booking/DoctorBooking';
import DoctorsPatientDetails from './components/Booking/DoctorPatientDetails';
import AdminUserView from './components/UsersView/AdminUserView';
import AdminAddServices from './components/UsersView/AdminAddServices';
import ParentServiceView from './components/UsersView/ParentServiceView';
import TermsCondition from './components/UsersView/TermsContion';
import ServiceProviderRegister from './components/HomeMaintenance/ServiceProviderRegister.js';
import MedicineSeller from './components/Users/MedicineSeller';
import MedSellerProfileUpdate from './components/Users/MedSellerProfileUpdate';
import ParentTherapyBooking from './components/Booking/ParentTherapyBooking';
import TherapyBookingBilling from './components/Billing Page/TherapyBookingBilling';
import ParentBookedTherapyView from './components/UsersView/ParentBookedTherapyView';
import ChildReports from './components/Reports/ChildReports';
import Logout from './components/Logout';
import HomeMaintenance from './components/HomeMaintenance/HomeMaintenancePage.js';
import ServiceProviderHomePage from './components/Users/ServiceProvideHomePage.js';
import AddService from './components/HomeMaintenance/AddService.js';
import ChildProfileRequestService from './components/Users/ChildProfileRequestService.js';
import ParentRequsetService from './components/Users/ParentRequestService.js';
import Diabetes_prd from './components/MachineLearing/Diabetes_prd.js';
import ServiceProfile from './components/HomeMaintenance/ServiceProviderProfilePage.js';

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
    path:"/reset-password/:token",
    element: <Resetpass />
  },
  {
    path:"/ParentRegister",
    element: <ParentRegister />
  },
  {
    path:"/DoctorRegister",
    element: <DoctorRegister />
  },
  {
    path:"/ChildProfileUpdate",
    element: <ChildProfileUpdate />
  },
  {
    path:"/ParentProfileUpdate",
    element: <ParentProfileUpdate />
  },
  {
    path:"/DoctorProfileUpdate",
    element: <DoctorProfileUpdate />
  },
  {
    path:"/ChildParentView",
    element: <ChildParentView />
  },
  {
    path:"/ChildDoctorView",
    element: <ChildDoctorView />
  },
  {
    path:"/DoctorBooking",
    element: <DoctorBooking />
  },
  {
    path:"/DoctorPatientDetails",
    element: <DoctorsPatientDetails />
  },
  {
    path:"/DoctorPatientDetails/:parentId",
    element: <DoctorsPatientDetails />
  },
  {
    path:"/AdminUserView",
    element: <AdminUserView />
  },
  {
    path:"/AdminAddServices",
    element: <AdminAddServices />
  },{
    path:"/ParentServiceView",
    element: <ParentServiceView />
  },
  {
    path:"/term-condition/:token",
    element: <TermsCondition />
  },
  {
    path:"/service-registration",
    element: <ServiceProviderRegister />
  },
  {
    path:"/MedicineSeller",
    element: <MedicineSeller />
  },
  {
    path:"/MedSellerProfileUpdate",
    element: <MedSellerProfileUpdate />
  },
  {
    path:"/ParentTherapyBooking",
    element: <ParentTherapyBooking />
  },
  {
    path:"/therapy-booking-billing/:selectedDate/:parentUserId/:doctorId",
    element: <TherapyBookingBilling />
  },
  {
    path:"/ParentBookedTherapyView",
    element: <ParentBookedTherapyView />
  },
  {
    path:"/ChildReports",
    element: <ChildReports />
  },
  {
    path:"/LogOut",
    element: <Logout />
  },
  {
    path:"/HomeMaintenancePage",
    element: <HomeMaintenance />
  },
  {
    path:"/ServiceProviderHomePage",
    element: <ServiceProviderHomePage />
  },
  {
    path:"/AddService",
    element: <AddService />
  },
  {
    path:"/requestService",
    element: <ChildProfileRequestService />
  },
  {
    path:"/parentRequestService",
    element: <ParentRequsetService />
  },
  {
    path:"/Diabetes_prd",
    element: <Diabetes_prd />
  },
  {
    path:"/ServiceProviderProfilePage",
    element: <ServiceProfile />
  }
  

]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId='1036301114388-7dmjgf311vbmvjv0rc0srar6bf9u7jb5.apps.googleusercontent.com'>
    <React.StrictMode>
    <RouterProvider router={router}>
      <App />
    </RouterProvider>
    <ToastContainer />
  </React.StrictMode>
  </GoogleOAuthProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
