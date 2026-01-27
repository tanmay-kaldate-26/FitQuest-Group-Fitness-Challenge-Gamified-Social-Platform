import { createContext, useContext, useState } from "react";
// 1. Import useNavigate from react-router-dom
import { useNavigate } from "react-router-dom"; // <--- NEW
import { loginUser, registerUser, logoutUser } from "../services/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    // Only parse if the string is not "undefined" and not null
    return (savedUser && savedUser !== "undefined") ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState(localStorage.getItem("token"));

  // 2. Initialize the hook
  const navigate = useNavigate(); // <--- NEW

  const login = async (email, password) => {
    try {
        const token = await loginUser(email, password); // The response IS the token string
        
        // 1. Save the token string directly
        localStorage.setItem("token", token);
        setToken(token); // Update state as well
        
        // 2. Create a basic user object
        const basicUser = { email: email }; 
        setUser(basicUser);
        localStorage.setItem("user", JSON.stringify(basicUser));

        // 3. Navigate to dashboard (This will now work!)
        navigate("/dashboard");
        
    } catch (err) {
        console.error("Login failed:", err);
        alert("Login failed! Check console.");
    }
  };

  const register = async (payload) => {
    await registerUser(payload);
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setToken(null);
    localStorage.clear();
    navigate("/login"); // Optional: Redirect to login after logout
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);