import { useState } from "react";
import { AuthContext } from "./auth-context";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("vhx_user");
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData, token) => {
    localStorage.setItem("vhx_user", JSON.stringify(userData));
    localStorage.setItem("vhx_token", token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("vhx_user");
    localStorage.removeItem("vhx_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: Boolean(user),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}