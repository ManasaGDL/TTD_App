
import { FiMenu} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { useState} from 'react'
import { IoMdClose } from "react-icons/io";
import LordImage from "../../assets/LordImage.jpg"
import politicalIcon from "../../assets/politicalIcon.jpg"
import { useContext ,useRef ,useEffect} from 'react';
import clsx from 'clsx'
import { AuthContext } from '../../context/AuthProvider';
const Navbar = () => {
    const [ isSideMenuOpen , setMenu] = useState(false);
    const { auth,logout,} = useContext(AuthContext)
    const [ openUserSettings , setOpenUserSettings] = useState(false)
    const userSettingsRef = useRef(null)
const navLinks = [{label:"Dashboard",href:"/dashboard"},
    {label:"Bookings",href:"/bookings"},
    {label:"About",href:"/about"},
    {label:"Contact",href:"/contact"},
    
]

const toggleUserSettings = ()=>{
  setOpenUserSettings(prev=>!prev)
}
useEffect(()=>{
const handleClickOutside =(e)=>{
  if(userSettingsRef.current && !userSettingsRef.current.contains(e.target))
setOpenUserSettings(false)
  }
  document.addEventListener('mousedown',handleClickOutside)
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
},[])
  return (
    <main>
  <nav className="flex justify-between lg:px-94  px-8 items-center py-6">
    <div className="flex items-center gap-8">
    <section className="flex items-center gap-4">
        <FiMenu className= 'text-3xl cursor-pointer lg:hidden' onClick={()=>setMenu(true)}/>
  <Link to="/"> <img src={LordImage} alt="Logo" className="w-28 h-28 hidden sm:block" /></Link>
        {/*menu*/}
         {/*logo*/}
    </section>
    {navLinks.map((link,key)=>{
    return <Link to={link.href} key={key} 
  

    className={`font-mono  hover:text-xl hidden sm:block
      ${
        location.pathname === link.href ? 'text-red-400 text-xl' : 'text-black-400'
      }`
    }
      >
   {link.label}
    </Link>
  })}
  </div>
    {/*sidebar mobie screens */}
    <div className={clsx('fixed h-full w-screen lg:hidden bg-black/50 backdrop-blur-sm top-0 right-0 -translate-x-full transition-all',isSideMenuOpen && 'translate-x-0')}>
  <section className="text-black w-56 bg-white flex-col absolute left-0 top-0 h-screen p-8 gap-8 z-50 flex">
  <IoMdClose className="text-3xl mt-0 mb-8 cursor-pointer"
  onClick={()=>setMenu(false)}/>
  {navLinks.map((link,key)=>{
    return <Link to={link.href} key={key} className='font-mono text-black-900'>
{link.label}
    </Link>
  })}
  </section>
    </div>
    <section className="flex items-center gap-4 font-mono">
      <span>{localStorage.getItem('email')}</span>
      <div className='relative'>
    <button onClick={toggleUserSettings}><img
        className="inline-block h-20 w-20 rounded-full"
        src={politicalIcon}
        alt=""
      />
      </button>
{/*avatar img*/}
        
    
{openUserSettings && <div className="absolute right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg" ref={userSettingsRef}>
              <Link to="/blockdates" className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 ${location.pathname==="/blockdates"?'text-red-400 text-xl' : 'text-black-400'}`}>Block</Link>
              {localStorage.getItem("super_user") === true&& <Link to="/add_newuser" className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 ${location.pathname==="/add_newuser"?'text-red-400 text-xl' : 'text-black-400'}`}>Add NewUser</Link>}
              <button onClick={() => logout()} className={`block px-4 py-2 text-gray-800 `}>Logout</button>
            </div>}
            </div>
            </section>    
  </nav>
  
  {/* <hr className="lg:mx-24"/> */}
  </main>
  )
}

export default Navbar
