import { FiMenu } from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';
import { useState, useContext, useRef, useEffect } from 'react';
import { IoMdClose } from 'react-icons/io';
import LordImage from '../../assets/LordImage.jpg';
import { AuthContext } from '../../context/AuthProvider';
import { RxAvatar } from 'react-icons/rx';
import clsx from 'clsx';

const Navbar = () => {
  const [isSideMenuOpen, setMenu] = useState(false);
  const { auth, logout } = useContext(AuthContext);
  const [openUserSettings, setOpenUserSettings] = useState(false);
  const userSettingsRef = useRef(null);
  const location = useLocation();

  const navLinks = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Bookings", href: "/bookings" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ];

  const toggleUserSettings = () => {
    setOpenUserSettings(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userSettingsRef.current && !userSettingsRef.current.contains(e.target)) {
        setOpenUserSettings(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <main>
      <nav className="flex justify-between px-4 sm:px-8 items-center py-4">
        <div className="flex items-center gap-4">
          <FiMenu className="text-3xl cursor-pointer lg:hidden" onClick={() => setMenu(true)} />
          <Link to="/">
            <img src={LordImage} alt="Logo" className="w-16 h-16 sm:w-28 sm:h-28 hidden sm:block" />
          </Link>
          {navLinks.map((link, key) => (
            <Link
              to={link.href}
              key={key}
              className={`font-mono hover:text-xl hidden sm:block ${
                location.pathname === link.href ? 'text-lime-500 text-xl' : 'text-black-400'
              }`}
            >
              {link.label}
            </Link>
          ))}
          {localStorage.getItem("super_user") === "true" && (
            <Link
              to="/view-users"
              key="view-users"
              className={`font-mono hover:text-xl hidden sm:block ${
                location.pathname === "/view-users" ? 'text-lime-500 text-xl' : 'text-black-400'
              }`}
            >
              ViewUsers
            </Link>
          )}
        </div>
        <div
          className={clsx(
            'fixed h-full w-screen lg:hidden bg-black/50 backdrop-blur-sm top-0 right-0 transition-transform transform',
            isSideMenuOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <section className="text-black w-64 bg-white flex flex-col absolute right-0 top-0 h-screen p-6 gap-6 z-50">
            <IoMdClose className="text-3xl cursor-pointer self-end" onClick={() => setMenu(false)} />
            {navLinks.map((link, key) => (
              <Link to={link.href} key={key} className="font-mono text-black-900">
                {link.label}
              </Link>
            ))}
            {localStorage.getItem("super_user") === "true" && (
              <Link
                to="/view-users"
                key="view-users-mobile"
                className="font-mono text-black-900"
              >
                ViewUsers
              </Link>
            )}
          </section>
        </div>
        <section className="flex items-center gap-4 font-mono">
          <span>{localStorage.getItem('email')}</span>
          <div className="relative">
            <button onClick={toggleUserSettings}>
              <RxAvatar className="h-10 w-10 text-green-500 text-sm" />
            </button>
            {openUserSettings && (
              <div className="absolute right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg" ref={userSettingsRef}>
                <Link
                  to="/blockdates"
                  className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 ${
                    location.pathname === "/blockdates" ? 'text-red-400 text-xl' : 'text-black-400'
                  }`}
                >
                  Block
                </Link>
                {localStorage.getItem("super_user") === 'true' && (
                  <Link
                    to="/add_newuser"
                    className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 ${
                      location.pathname === "/add_newuser" ? 'text-red-400 text-xl' : 'text-black-400'
                    }`}
                  >
                    Add New User
                  </Link>
                )}
                <button onClick={() => logout()} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Logout
                </button>
              </div>
            )}
          </div>
        </section>
      </nav>
    </main>
  );
};

export default Navbar;
