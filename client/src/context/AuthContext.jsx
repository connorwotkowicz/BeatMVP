
import React, { createContext } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const dummyUser = null;

  return (
    <AuthContext.Provider value={{ user: dummyUser }}>
      {children}
    </AuthContext.Provider>
  );
};
