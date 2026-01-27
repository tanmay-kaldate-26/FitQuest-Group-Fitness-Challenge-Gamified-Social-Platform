import api from "./api";

// LOGIN
export const loginUser = async (email, password) => {
  const res = await api.post("/auth/login", { email, password });
  
  // --- ADD THIS "SPY" LINE ---
  console.log("⚠️ REAL BACKEND DATA:", res.data); 
  // ---------------------------
  
  return res.data;
};

// REGISTER
export const registerUser = async (userData) => {
  const res = await api.post("/auth/register", userData);
  return res.data;
};

// LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); // Clear user data too
};