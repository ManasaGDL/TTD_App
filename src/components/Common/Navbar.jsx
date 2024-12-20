import { FiMenu } from "react-icons/fi";
import { Link, useLocation, useParams } from "react-router-dom";
import { useState, useContext, useRef, useEffect } from "react";
import { IoMdClose } from "react-icons/io";
import LordImage from "../../assets/LordImage.jpg";
import { AuthContext } from "../../context/AuthProvider";
import { RxAvatar } from "react-icons/rx";
import clsx from "clsx";

const Navbar = ({ setBlur }) => {
    const [isSideMenuOpen, setMenu] = useState(false);
    const { auth, logout } = useContext(AuthContext);
    const [openUserSettings, setOpenUserSettings] = useState(false);
    const location = useLocation();
    const id = localStorage.getItem("userId");
    const navLinks = [
        { label: "Bookings", href: "/bookings" },
        { label: "Booking History", href: "/history" },
    ];

    const toggleUserSettings = () => {
        setOpenUserSettings((prev) => !prev);
    };
    useEffect(() => {
        setBlur(isSideMenuOpen);
    }, [isSideMenuOpen, setBlur]);

    return (
        <main>
            <nav className="flex justify-between px-4 sm:px-8 items-center py-4">
                {/*---------------------- Desktop nav ----------------------*/}
                <div className="flex  items-center gap-4">
                    <FiMenu className="text-3xl cursor-pointer lg:hidden" onClick={() => setMenu(true)} />
                    <Link to="/">
                        <img src={LordImage} alt="Logo" className="h-20 aspect-auto sm:h-18 xs:10  sm:block" />
                    </Link>
                    {navLinks.map((link, key) => (
                        <Link
                            to={link.href}
                            key={key}
                            className={`font-mono hover:text-custom-header-bg underline-animate hidden lg:block ${location.pathname === link.href ? "text-lime-500 after:w-4" : "text-black-400"}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    {localStorage.getItem("super_user") === "true" && (
                        <Link
                            to="/view-users"
                            key="view-users"
                            className={`font-mono hover:text-custom-header-bg underline-animate hidden lg:block ${location.pathname === "/view-users" ? "text-lime-500 after:w-4" : "text-black-400"}`}
                        >
                            Users
                        </Link>
                    )}
                </div>
                {/*---------------------- Mobile nav ----------------------*/}
                <div
                    className={clsx(
                        "fixed h-full w-screen lg:hidden bg-black/50 backdrop-blur-sm top-0 right-0 transition-transform transform z-50",
                        isSideMenuOpen ? "translate-x-0" : "translate-x-full"
                    )}
                >
                    <section className="text-black w-64 bg-white flex flex-col absolute left-0 top-0 h-screen p-8 gap-8 z-50">
                        <IoMdClose className="text-3xl cursor-pointer self-end" onClick={() => setMenu(false)} />
                        {navLinks.map((link, key) => (
                            <Link to={link.href} key={key} className={`w-max font-mono text-black-900 hover:text-custom-header-bg  underline-animate block ${location.pathname === link.href ? "text-lime-500 after:w-4" : "text-black-400"}`} onClick={() => setMenu(false)}>
                                {link.label}
                            </Link>
                        ))}
                        {localStorage.getItem("super_user") === "true" && (
                            <Link to="/view-users" key="view-users-mobile" className={`w-max font-mono text-black-900 hover:text-custom-header-bg  underline-animate block ${location.pathname === '/view-users' ? "text-lime-500 after:w-4" : "text-black-400"}`} onClick={() => setMenu(false)}>
                                Users
                            </Link>
                        )}
                    </section>
                </div>

                {/*---------------------- User Info ----------------------*/}

                <section className="flex flex-col sm:flex-row items-center gap-1 sm:gap-4 font-mono">
                    {/* User Info */}
                    <div className="flex flex-col text-center sm:text-left">
                        {localStorage.getItem("super_user") === "true" ? (
                            <div className="flex flex-col sm:text-sm text-xs">
                                <div className=" flex flex-row">
                                    <span className="text-custom-header-bg capitalize sm:text-base text-md font-sans font-semibold">{localStorage.getItem("user_name")}, </span>
                                    {localStorage.getItem("super_user") === "true" && (
                                        <span className="font-mono  text-custom-color-danger ml-2 sm:text-base text-center text-sm font-semibold">Admin</span>
                                    )}
                                </div>
                                <span className="text-gray-700">{localStorage.getItem("email")}</span>
                            </div>
                        ) : (
                            <div>
                                <span className="sm:text-base text-md capitalize text-green-600 font-sans font-semibold">
                                    {localStorage.getItem("user_name")},{" "}
                                    <span className=" text-custom-color-danger">{localStorage.getItem("is_mla") === "true" ? "MLA" : localStorage.getItem("is_mla") === "false" ? "MP" : "Admin"}</span>
                                </span>
                                <div className="flex flex-col sm:text-sm text-xs">
                                    <span className="text-gray-700">{localStorage.getItem("email")}</span>
                                    <span className="text-gray-700 ">{localStorage.getItem("constituency")} Constituency</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/*---------------------- User Settings ----------------------*/}
                    <div className="relative sm:mt-0">
                        <button onClick={toggleUserSettings} className="p-2 rounded-full bg-green-500 hover:bg-green-600 transition-colors">
                            <RxAvatar className=" h-4 w-4 sm:h-8 sm:w-8 text-white" />
                        </button>
                        {openUserSettings && (
                            <>
                                <div
                                    className="fixed inset-0"
                                    onClick={() => {
                                        setOpenUserSettings(false);
                                    }}
                                ></div>
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    <Link
                                        to="/blockdates"
                                        className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 ${location.pathname === "/blockdates" ? "text-red-500 font-semibold" : "text-gray-700"}`}
                                    >
                                        Block/Unblock
                                    </Link>
                                    {localStorage.getItem("super_user") === "true" && (
                                        <Link
                                            to="/add_newuser"
                                            className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 ${location.pathname === "/add_newuser" ? "text-red-500 font-semibold" : "text-gray-700"}`}
                                        >
                                            Add New-User
                                        </Link>
                                    )}
                                    <Link
                                        to={`/edit-credentials/${id}`}
                                        className={`block px-4 py-2 text-gray-800 hover:bg-gray-100 ${
                                            location.pathname === `/edit-credentials/${id}` ? "text-red-500 font-semibold" : "text-gray-700"
                                        }`}
                                    >
                                        Change Password
                                    </Link>
                                    <button onClick={() => logout()} className="block px-4 py-2 w-full text-left text-gray-800 hover:bg-gray-100">
                                        Logout
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </nav>
        </main>
    );
};

export default Navbar;
