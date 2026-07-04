import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  user: any | null;
  loading: boolean;
  signIn: (email: string, name?: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check local storage for mock session
    const savedUser = localStorage.getItem("memoria_mock_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, name?: string) => {
    setLoading(true);
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockUser = {
      id: "mock-user-123",
      email: email,
      user_metadata: {
        full_name: name || email.split("@")[0],
      }
    };
    setUser(mockUser);
    localStorage.setItem("memoria_mock_user", JSON.stringify(mockUser));
    setLoading(false);
  };

  const signOut = async () => {
    setUser(null);
    localStorage.removeItem("memoria_mock_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
