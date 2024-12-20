import React, { createContext, useContext, useState } from "react";

type FollowedUsersContextType = {
  followedUsers: Set<string>;
  setFollowedUsers: React.Dispatch<React.SetStateAction<Set<string>>>;
};

const FollowedUsersContext = createContext<
  FollowedUsersContextType | undefined
>(undefined);

export const FollowedUsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(new Set());

  return (
    <FollowedUsersContext.Provider value={{ followedUsers, setFollowedUsers }}>
      {children}
    </FollowedUsersContext.Provider>
  );
};

export const useFollowedUsers = (): FollowedUsersContextType => {
  const context = useContext(FollowedUsersContext);
  if (!context) {
    throw new Error(
      "useFollowedUsers must be used within a FollowedUsersProvider"
    );
  }
  return context;
};
