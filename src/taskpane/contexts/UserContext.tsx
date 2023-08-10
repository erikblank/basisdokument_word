import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useState } from "react";
import { IUser } from "../types";

interface IUserContext {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
}

export const UserContext = createContext<IUserContext | null>(null);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<IUser | null>(null);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === null) {
    throw new Error("useUser must be used within an UserProvider");
  }
  return context;
};
