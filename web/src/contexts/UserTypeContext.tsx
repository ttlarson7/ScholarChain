import React, { createContext, useState, useContext, useEffect } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";

// Define user types
export type UserType = "student" | "validator" | "sponsor" | null;

// Define context type
type UserTypeContextType = {
  userType: UserType;
  setUserType: (type: UserType) => void;
  isLoggedIn: boolean;
};

// Create context with default values
const UserTypeContext = createContext<UserTypeContextType>({
  userType: null,
  setUserType: () => {},
  isLoggedIn: false,
});

// Create provider component
export const UserTypeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userType, setUserType] = useState<UserType>(null);
  const currentAccount = useCurrentAccount();
  const isLoggedIn = !!currentAccount;

  // Load user type from localStorage on mount if user is logged in
  useEffect(() => {
    if (currentAccount) {
      const savedUserType = localStorage.getItem(
        `userType_${currentAccount.address}`
      ) as UserType;
      if (savedUserType) {
        setUserType(savedUserType);
      }
    } else {
      // Reset user type when wallet is disconnected
      setUserType(null);
    }
  }, [currentAccount]);

  // Save user type to localStorage when it changes and user is logged in
  useEffect(() => {
    if (currentAccount && userType) {
      localStorage.setItem(`userType_${currentAccount.address}`, userType);
    }
  }, [userType, currentAccount]);

  return (
    <UserTypeContext.Provider value={{ userType, setUserType, isLoggedIn }}>
      {children}
    </UserTypeContext.Provider>
  );
};

// Custom hook to use the user type context
export const useUserType = () => useContext(UserTypeContext);
