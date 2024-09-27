import { createContext, useEffect, useState } from "react";

export const ForgotPasswordContext = createContext();

export const ForgotPasswordContextProvider = ({ children }) => {
  const [user, setUser] = useState({});

  const contextValues = {
    user,
    setUser,
  };
  return (
    <ForgotPasswordContext.Provider value={contextValues}>
      {children}
    </ForgotPasswordContext.Provider>
  );
};
