"use client";

import React from "react";
import dynamic from "next/dynamic";
const AdminSidebar = dynamic(
  () => import("../../components/Admin/sidebar/AdminSidebar"),
  { ssr: false }
);
const CreateProduct = dynamic(
  () => import("@/app/components/Admin/product/CreateProduct"),
  { ssr: false }
);

type Props = {};

const page = (props: Props) => {
  return (
    <div>
      <div className="flex">
        <AdminSidebar />
        <div className="w-full">
          <CreateProduct />
        </div>
      </div>
    </div>
  );
};

export default page;
