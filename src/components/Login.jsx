import LoginImage from "../assets/hill.jpg";
import { AuthContext } from "../context/AuthProvider";
const Login = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 h-screen w-full">
      <div className="hidden sm:block h-full">
        <img className="w-full h-full object-contain" src={LoginImage} alt="Login" />
      </div>
      <div className="bg-gray-100 flex flex-col justify-center h-full">
        <form className="max-w-[400px] w-full mx-auto bg-white p-4 rounded shadow-md">
          <h2 className="text-4xl font-bold text-center py-6">Login</h2>
          <div className="flex flex-col py-2">
            <label className="mb-1">Username</label>
            <input type="text" className="p-2 border rounded" />
          </div>
          <div className="flex flex-col py-2">
            <label className="mb-1">Password</label>
            <input type="password" className="p-2 border rounded" />
          </div>
          <div>
            <button className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">Sign In</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
