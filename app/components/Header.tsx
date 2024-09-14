"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import React, { Component, FC, useEffect, useState } from "react";
import NavItems from "../utils/NavItems";
import { HiOutlineMenuAlt3, HiOutlineUserCircle } from "react-icons/hi";
import { useSelector } from "react-redux";
import Image from "next/image";
import toast from "react-hot-toast";
const Login = dynamic(() => import("./Auth/Login"), { ssr: false });
const SignUp = dynamic(() => import("./Auth/SignUp"), { ssr: false });
const CustomModal = dynamic(() => import("../utils/CustomModal"), {
  ssr: false,
});
import { MdExitToApp } from "react-icons/md";
import { redirect, useRouter } from "next/navigation";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  activeItem: number;
  route: string;
  setRoute: (route: string) => void;
};

const Header: FC<Props> = ({ activeItem, setOpen, route, open, setRoute }) => {
  const [active, setActive] = useState(false);
  const [openSidebar, setOpenSidebar] = useState(false);
  const userData = JSON.parse(localStorage.getItem("user") as string);
  const router = useRouter();

  const handleClose = (e: any) => {
    if (e.target.id === "screen") {
      setOpenSidebar(false);
    }
  };
  const logoutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  return (
    <div className="w-full relative">
      <div
        className={`${
          active
            ? "dark:bg-opacity-50 dark:bg-gradient-to-b dark:from-gray-900 dark:to-black fixed top-0 left-0 w-full h-[80px] z-[80] border-b dark:border-[#ffffff1c] shadow-xl transition duration-500"
            : "w-full border-b dark:border-[#ffffff1c] h-[80px] z-[80] dark:shadow"
        }`}
      >
        <div className="w-[95%] 800px:w-[92%] py-2 m-auto h-full">
          <div className="w-full h-[80px] flex items-center justify-between p-3">
            <div className="font-[500] text-[25px] dark:text-white text-black font-sans">
              <Link href={"/"}>
                {userData?.role === "admin" ? "Admin Ecommerce" : "Ecommerce"}
              </Link>
            </div>
            <div className="flex items-center">
              <NavItems
                activeItem={activeItem}
                isMobile={false}
                userData={userData}
                isLoggedIn={userData ? true : false}
              />
              {/* only for mobile */}
              <div className="md:hidden pr-2">
                <HiOutlineMenuAlt3
                  size={20}
                  className="cursor-pointer dark:text-white text-black"
                  onClick={() => setOpenSidebar(true)}
                />
              </div>
              {userData ? (
                <button
                  className="py-2 px-4 bg-blue-600 text-white rounded-md flex items-center gap-2"
                  onClick={logoutHandler}
                >
                  <MdExitToApp /> Logout
                </button>
              ) : (
                <button
                  className="py-2 px-4 bg-blue-600 text-white rounded-md"
                  onClick={() => setOpen(true)}
                >
                  LogIn
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Mobile sidebar */}
        {openSidebar && (
          <div
            className="fixed w-full h-screen top-0
            z-[99999] dark:bg-[unset] bg-[#00000024]"
            onClick={handleClose}
            id="screen"
          >
            <div className="w-[70%] fixed z-[999999999] h-screen bg-white dark:bg-slate-900 dark:bg-opacity-90 top-0 right-0">
              <NavItems
                activeItem={activeItem}
                isMobile={true}
                userData={userData}
                isLoggedIn={userData ? true : false}
              />
              <br />
              <br />
              <p className="text-[16px] px-2 pl-5 text-black dark:text-white">
                Copywrite © {new Date().getFullYear()} Ecommerce
              </p>
            </div>
          </div>
        )}
      </div>

      {route === "Login" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={Login}
            />
          )}
        </>
      )}

      {route === "Sign-Up" && (
        <>
          {open && (
            <CustomModal
              open={open}
              setOpen={setOpen}
              setRoute={setRoute}
              activeItem={activeItem}
              component={SignUp}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Header;
