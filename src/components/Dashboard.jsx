import React, { useContext } from 'react'

import { AuthContext } from '../context/AuthProvider'
const Dashboard = () => {
  const { auth} = useContext(AuthContext)
  return (
    <div>
     <h3>Dashboard</h3>
     <h1 className="text-3xl mt-10">Welcome, {auth.user}!</h1>
      
      {/* <button
        onClick={logout}
        className="bg-red-500 text-white py-2 px-4 rounded mt-4"
      >
        Logout
      </button> */}
    </div>
  )
}

export default Dashboard
