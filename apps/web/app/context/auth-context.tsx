import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

type DecodedToken = {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
};

type User = {
  id: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  setToken: (token: string | null) => void;
  signOut: () => void;
  isInitialized: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("authToken", token);
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        setUser({
          id: decoded.userId,
          email: decoded.email,
          role: decoded.role,
        });
      } catch (err) {
        console.error("Invalid token");
        setUser(null);
        localStorage.removeItem("authToken");
      }
      setTokenState(token);
    } else {
      localStorage.removeItem("authToken");
      setUser(null);
      setTokenState(null);
    }
  };

  const signOut = () => {
    setToken(null);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
    setIsInitialized(true); // <-- selesai init
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, setToken, signOut, isInitialized }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
