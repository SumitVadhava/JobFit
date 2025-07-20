import { createContext, useContext, useState, useEffect } from "react";

// Create context
const AuthContext = createContext();

// Custom hook to use the context easily
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user object
  const [token, setToken] = useState(null);// JWT token
  const [role, setRole] = useState(null); // user role
  // const [hasHydrated, setHasHydrated] = useState(false); 

  // Load user/token from localStorage on app load
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");


    if (storedUser && storedToken && storedRole) {
      setUser(storedUser);
      setToken(storedToken);
      setRole(storedRole);
    }
    // setHasHydrated(true);
  }, []);

  const login = (userData, jwtToken, userRole) => {
    setUser(userData);
    setToken(jwtToken);
    setRole(userRole)
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", jwtToken);
    localStorage.setItem("role", userRole);

    console.log(userData);
    console.log(jwtToken);
    console.log(userRole);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ user, token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
