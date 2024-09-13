"use client";
import React from "react";
import dynamic from "next/dynamic";
const AdminProtected = dynamic(() => import("../hooks/adminProtected"), {
  ssr: false,
});
const AdminSidebar = dynamic(
  () => import("../components/Admin/sidebar/AdminSidebar"),
  {
    ssr: false,
  }
);

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <AdminProtected>
        <div className="flex min-h-screen">
          <div className="md:w-[16%] w-1/5">
            <AdminSidebar />
          </div>
        </div>
      </AdminProtected>
    </div>
  );
};

export default page;
