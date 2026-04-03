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
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;

        // Check if token is expired
        if (decodedToken.exp < currentTime) {
          console.warn("Token expired. Logging out...");
          logout();
        } else {
          setToken(storedToken);
          const storedUser = localStorage.getItem("user");
          let userData = {
            id: decodedToken.id,
            email: decodedToken.email,
            picture: decodedToken.picture,
            userName: decodedToken.userName || decodedToken.name,
            role: decodedToken.role
          };

          if (storedUser) {
            try {
              const parsedUser = JSON.parse(storedUser);
              // Only use stored user if it matches the token's user ID
              if (parsedUser.id === decodedToken.id || parsedUser._id === decodedToken.id) {
                userData = { ...userData, ...parsedUser };
              }
            } catch (e) {
              console.error("Error parsing stored user data:", e);
            }
          }

          setUser(userData);
          setRole(decodedToken.role || userData.role || null);
        }
      } catch (error) {
        console.error("Invalid token found in storage. Clearing...", error);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = (jwtToken) => {
    try {
      const decodedToken = jwtDecode(jwtToken);
      const userData = {
        id: decodedToken.id,
        email: decodedToken.email,
        picture: decodedToken.picture,
        userName: decodedToken.userName || decodedToken.name,
        role: decodedToken.role
      };

      setUser(userData);
      setToken(jwtToken);
      setRole(decodedToken.role);

      localStorage.setItem("token", jwtToken);
      localStorage.setItem("user", JSON.stringify(userData)); // Keeping user in storage for convenience
    } catch (error) {
      console.error("Error during login (token decode):", error);
    }
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
  };

  return (
    <AuthContext.Provider value={{ user, token, role, loading, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
