import { redirect } from "next/navigation";
import React from "react";

interface UserProtectedProps {
  children: React.ReactNode;
}

const UserProtected = ({ children }: UserProtectedProps) => {
  const user = JSON.parse(localStorage.getItem("user") as string);

  if (user) {
    const isUser = user?.role === "user";
    return isUser ? children : redirect("/");
  }
};

export default UserProtected;
