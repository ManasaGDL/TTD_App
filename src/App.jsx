// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
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

const App = () => {
  const { auth } = useContext(AuthContext);
  
  return (
    <Routes>
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
    </Routes>
  );
};

export default App;
