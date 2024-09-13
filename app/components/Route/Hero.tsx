import SquigglyLines from "@/app/utils/SquigglyLines";
import Link from "next/link";
import React from "react";

export const Hero = () => {
  const userData = JSON.parse(localStorage.getItem("user") as string);

  return (
    <main className="flex flex-1 w-full flex-col items-center justify-center text-center px-4 sm:mt-20 mt-20 background-gradient">
      <h1 className="mx-auto max-w-4xl font-display text-5xl font-bold tracking-normal text-gray-300 sm:text-7xl">
        {userData ? (
          <div className="leading-normal">
            Hello
            <span className="relative text-blue-600">
              <SquigglyLines />
              <span className="relative ml-2">{userData.name}</span>
            </span>{" "}
            welcome back.
          </div>
        ) : (
          <div className="text-5xl">
            Hello!{" "}
            <div>
              <a className="text-blue-600 underline">Log in</a>
            </div>{" "}
            to see your personalized content.
          </div>
        )}
      </h1>
    </main>
  );
};
