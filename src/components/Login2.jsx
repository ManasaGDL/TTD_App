import LoginImage from "../assets/download.jpg";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthProvider";
import apis from "../api/apis";
import { useNavigate } from "react-router-dom";
const Login2 = () => {
    const { login , setAuth} = useContext(AuthContext)
    const [loginDetails , setLoginDetails] = useState({"email":"","password":""})
    const navigate = useNavigate()
    const handleSubmit =async(e)=>{
        e.preventDefault()
      
   try{
    const res = await apis.login(loginDetails)
    console.log(res?.data)
    login(res.data)
    if(res?.data?.access)
        {
            const profile_res = await apis.getProfile();
            localStorage.setItem("email",profile_res?.data?.email)
            localStorage.setItem("is_mla",profile_res.data.is_mla)
            localStorage.setItem("super_user",profile_res.data.is_superuser)
            profile_res.data.constituency && localStorage.setItem("constituency",profile_res.data.constituency)
            setAuth({'token':localStorage.getItem('access_token'),'email':profile_res.data.email,user_id:profile_res.data.user_id,super_user:profile_res.data.is_superuser,isAuthenticated:true,is_mla:profile_res.data.is_mla})
            navigate("/bookings")
        
        }
   }catch(e)
   {
console.log(e)
   }
    }
  return (
    <div className="relative w-full h-screen overflow-hidden bg-zinc-900/90">
      <img
        className="absolute inset-0 w-full h-full object-cover sm:object-cover mix-blend-overlay"
        src={LoginImage}
        alt="Login Background"
      />
      <div className="flex justify-center items-center h-full">
        <form className="max-w-[400px] w-full mx-auto bg-white p-8 rounded-lg " 
        onSubmit={handleSubmit}
        
        >
          <h2 className="text-4xl font-mono text-center py-2 relative">Login</h2>
          <div className="flex flex-col py-2">
            <label className="text-black relative font-mono" >Email</label>
            <input
            name={loginDetails?.email}
            onChange={e=>setLoginDetails({...loginDetails,"email":e.target.value})}
              type="text"
              className="p-2 relative bg-gray-100 rounded-lg border"
            />
          </div>
          <div className="flex flex-col py-2">
            <label className="text-black relative font-mono" htmlFor="password">Password</label>
            <input
              type="password"
              name={loginDetails?.password}
              onChange={e=>setLoginDetails({...loginDetails,"password":e.target.value})}
              className="p-2 relative bg-gray-100 rounded-lg border"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-blue-400 text-center text-white p-2 rounded hover:bg-blue-700 font-mono relative"
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login2;
