// PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useContext } from 'react';
import { AuthContext } from './context/AuthProvider';

const PrivateRoute = ({children}) => {
const { auth }= useContext(AuthContext)
  return auth.isAuthenticated? <>{children}</> : <Navigate to="/login" />;

};



export default PrivateRoute;
