"use client";

import React from "react";
import dynamic from "next/dynamic";
const AdminSidebar = dynamic(
  () => import("../../../components/Admin/sidebar/AdminSidebar"),
  { ssr: false }
);
const EditProduct = dynamic(
  () => import("@/app/components/Admin/product/EditProduct"),
  { ssr: false }
);

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <div className="flex">
        <AdminSidebar />
        <div className="w-full">
          <EditProduct />
        </div>
      </div>
    </div>
  );
};

export default page;
