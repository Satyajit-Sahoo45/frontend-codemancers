"use client";

import React from "react";
import AdminSidebar from "../../../components/Admin/sidebar/AdminSidebar";
import EditProduct from "@/app/components/Admin/product/EditProduct";

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
