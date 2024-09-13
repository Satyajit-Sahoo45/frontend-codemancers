"use client";
import React from "react";
import AdminProtected from "../hooks/adminProtected";
import AdminSidebar from "../components/Admin/sidebar/AdminSidebar";

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
