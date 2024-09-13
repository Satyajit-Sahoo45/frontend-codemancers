"use client";

import React from "react";
import dynamic from "next/dynamic";
const AdminSidebar = dynamic(
  () => import("../../components/Admin/sidebar/AdminSidebar"),
  { ssr: false }
);
const AllProducts = dynamic(
  () => import("@/app/components/Admin/product/AllProducts"),
  { ssr: false }
);

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <div className="flex">
        <AdminSidebar />
        <div className="w-full">
          <AllProducts />
        </div>
      </div>
    </div>
  );
};

export default page;
