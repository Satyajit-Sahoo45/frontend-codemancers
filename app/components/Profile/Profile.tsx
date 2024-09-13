import React, { FC, useState } from "react";
import ProfileInfo from "./ProfileInfo";
import { redirect, useRouter } from "next/navigation";
import SideBarProfile from "./SideBarProfile";

type Props = {
  user: any;
};

export const Profile: FC<Props> = ({ user }) => {
  const [scroll, setScroll] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const [active, setActive] = useState(1);
  const [logout, setLogout] = useState(false);
  const router = useRouter();

  if (typeof window !== "undefined") {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 85) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    });
  }

  const logOutHandler = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    router.push("/");
  };

  return (
    <div className="w-[85%] flex mx-auto">
      <div
        className={`w-[60px] md:w-[300px] h-[450px] dark:bg-slate-900 bg-opacity-90 border bg-white dark:border-[#ffffff1d] border-[#00000014] rounded-[5px] shadow-sm dark:shadow-sm mt-[80px] mb-[80px] sticky ${
          scroll ? "top-[120px]" : "top-[30px]"
        } left-[30px]`}
      >
        <SideBarProfile
          user={user}
          active={active}
          avatar={avatar}
          setActive={setActive}
          logOutHandler={logOutHandler}
        />
      </div>
      {active === 1 && (
        <div className="w-full h-full bg-transparent mt-[80px]">
          <ProfileInfo user={user} />
        </div>
      )}
    </div>
  );
};
