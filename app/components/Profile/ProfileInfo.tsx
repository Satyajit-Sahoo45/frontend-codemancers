import Image from "next/image";
import React, { FC, useEffect, useState } from "react";
import { styles } from "../styles/style";

type Props = {
  user: any;
};

const ProfileInfo: FC<Props> = ({ user }) => {
  const { name, email } = JSON.parse(user);

  return (
    <>
      <div className="w-full pl-6 800px:pl-10">
        <form onSubmit={() => {}}>
          <div className="800px:w-[50%] m-auto block pb-4">
            <div className="w-[100%]">
              <label className="block pb-2">Full Name</label>
              <input
                type="text"
                className={`${styles.input} !w-[95%] mb-4 800px:mb-0`}
                required
                value={name}
                onChange={() => {}}
              />
            </div>
            <div className="w-[100%] pt-2">
              <label className="block pb-2">Email Address</label>
              <input
                type="text"
                readOnly
                className={`${styles.input} !w-[95%] mb-1 800px:mb-0`}
                required
                value={email}
              />
            </div>
            <input
              className={`w-full 800px:w-[250px] h-[40px] border border-[#37a39a] text-center dark:text-[#fff] text-black rounded-[3px] mt-8 cursor-pointer`}
              required
              value="Update"
              type="submit"
            />
          </div>
        </form>
        <br />
      </div>
    </>
  );
};

export default ProfileInfo;
