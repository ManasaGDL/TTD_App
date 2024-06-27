import React , { createContext,useState} from 'react'
import { jwtDecode } from "jwt-decode";
export const AuthContext = createContext();

const AuthProvider = ({children}) => {
  
    const [auth, setAuth] = useState(() => {
      const token = localStorage.getItem('access_token');
      if (token) {
        const decoded = jwtDecode(token);
        console.log("decoded",decoded)
        return { token, user: decoded.user_id,isAuthenticated:true };
      }
      return { token: null, user: null };
    })
    const login =async(token)=>{
      const decoded = jwtDecode(token.access);
       localStorage.setItem('access_token',token.access)
       localStorage.setItem('refresh_token',token.refresh)
      localStorage.setItem('userId',decoded.user_id)

       setAuth({token,user_id:decoded.user_id,isAuthenticated:true})
    }
    const logout = () => {
      localStorage.removeItem('access_token');
      setAuth({ token: null, user_id: null,email:'',isAuthenticated:false });
    };
  return (
    <AuthContext.Provider value={{auth,login,logout,setAuth}}>
         {children}
    </AuthContext.Provider>
  )
}

export default AuthProvider
