
import PropTypes from 'prop-types'
import Navbar from '../Common/Navbar'
import { useState } from 'react';
const Layouts = ({children}) => {
  const [isBlurred, setBlur] = useState(false);
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar setBlur={setBlur}/>
      <div className={`container mx-auto flex-1 `}>
        {/* // ${isBlurred ? 'backdrop-blur-sm translate-x-0' : ''}`}> */}
      {/* 'fixed h-full w-screen lg:hidden bg-black/50 backdrop-blur-sm top-0 right-0 transition-transform transform',
      isSideMenuOpen ? 'translate-x-0' : 'translate-x-full' */}
       {children}
    </div>
    </div>
  )
}

export default Layouts
Layouts.propTypes ={
    children:PropTypes.node.isRequired
}