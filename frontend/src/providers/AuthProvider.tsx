import { createContext, useContext, useEffect, useState } from "react";
import { getMe } from "../api/auth.api";
import { useLocation } from "react-router-dom";

type AuthContextType = {
  isAuth: boolean;
  loading: boolean;
  refetchUser: () => Promise<void>;
  logoutLocal: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuth: false,
  loading: true,
  refetchUser: async () => {},
  logoutLocal: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const location = useLocation();

  const fetchUser = async () => {
    try {
      await getMe();
      setIsAuth(true);
    } catch {
      setIsAuth(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const isPublic = location.pathname === "/login" || location.pathname === "/register";

    if (!isPublic) {
      fetchUser();
    }
  }, [location.pathname]);

  const logoutLocal = () => {
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        loading,
        refetchUser: fetchUser,
        logoutLocal,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
