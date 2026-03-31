import { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

// Create context
const AuthContext = createContext();

// Custom hook to use the context easily
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user object
  const [token, setToken] = useState(null);// JWT token
  const [role, setRole] = useState(null); // user role
  const [loading, setLoading] = useState(true); // track hydration status

  // Load user/token from localStorage on app load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    
    if (storedUser && storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;

        // Check if token is expired
        if (decodedToken.exp < currentTime) {
          console.warn("Token expired. Logging out...");
          logout();
        } else {
          setUser(storedUser);
          setToken(storedToken);
          setRole(storedUser.role || null);
        }
      } catch (error) {
        console.error("Invalid token found in storage. Clearing...", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, jwtToken, userRole) => {
    setUser(userData);
    setToken(jwtToken);
    setRole(userRole || userData.role);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
    
    console.log("User logged in:", userData);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  const updateUser = (updatedUserData) => {
    const newUser = { ...user, ...updatedUserData };
    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    console.log("User state updated:", newUser);
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
