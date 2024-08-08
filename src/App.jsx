// App.jsx
import React from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Login2 from './components/Login2';
import Layouts from './components/app-layouts/Layouts';
import Dashboard from './components/Dashboard';
import Bookings from './components/Bookings';
import Contact from './components/Contact';
import About from './components/About';
import PrivateRoute from './PrivateRoute';
import { AuthContext } from './context/AuthProvider';
import { useContext } from 'react';
import BlockedDateSelector from './components/BlockDateSelector';
import AddUser from './components/AddUser';
import ViewUsers from './components/ViewUsers';
import { useLoading } from './context/LoadingContext';
import Spinner from './components/Common/Spinner';
import ChakramSpinner from './components/Common/ChakramSpinner';
import  EditCredentials from "./components/EditCredentials"
const App = () => {
  const { auth } = useContext(AuthContext);
  const { isLoading } = useLoading();
  return (
    <div className="relative">
    {isLoading && <ChakramSpinner/>}
    <Routes>
      <Route path="/" element={<NavLink to="/login"><Login2/></NavLink>}/>
      <Route path="/login" element={<Login2 />} />
      <Route
         path="/dashboard"
        // authenticated={auth?.isAuthenticated}
        element={<PrivateRoute ><Layouts><Dashboard /></Layouts></PrivateRoute>}
      />
{/* <Route path="/dashboard" element={<Layouts><Dashboard /></Layouts>} /> */}
      <Route path="/bookings" element={<PrivateRoute ><Layouts><Bookings /></Layouts></PrivateRoute>} />
      <Route path="/about" element={<PrivateRoute><Layouts><About /></Layouts></PrivateRoute>} />
      <Route path="/contact" element={<PrivateRoute><Layouts><Contact /></Layouts></PrivateRoute>} />
      <Route path="/blockdates" element={<PrivateRoute><Layouts><BlockedDateSelector /></Layouts></PrivateRoute>} />
      <Route path="/edit_user/:id" element={<PrivateRoute><Layouts><AddUser/></Layouts></PrivateRoute>} />
      <Route path="/add_newuser" element={<PrivateRoute><Layouts><AddUser/></Layouts></PrivateRoute>} />
      <Route path="/view-users" element={<PrivateRoute><Layouts><ViewUsers/></Layouts></PrivateRoute>}/>
      <Route path="/edit-credentials/:id" element={<PrivateRoute><Layouts><EditCredentials/></Layouts></PrivateRoute>}/>
    </Routes>
    </div>
  );
};

export default App;
