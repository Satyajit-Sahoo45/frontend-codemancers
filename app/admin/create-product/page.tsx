"use client";

import React from "react";
import AdminSidebar from "../../components/Admin/sidebar/AdminSidebar";
import CreateProduct from "@/app/components/Admin/product/CreateProduct";

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
