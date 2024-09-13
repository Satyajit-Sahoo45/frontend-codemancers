"use client";

import OrderList from "./OrderList";
import { useGetUserOrdersQuery } from "@/redux/features/order/orderApi";
import { useEffect, useState } from "react";
import Loader from "../components/Loader";
import Header from "../components/Header";
import UserProtected from "../hooks/userProtected";

const Page = () => {
  const [orders, setOrders] = useState([]);
  const { data, isLoading, refetch } = useGetUserOrdersQuery({});
  const [route, setRoute] = useState("Login");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (data) {
      setOrders(data.orders);
    }
  }, [data]);
  return (
    <UserProtected>
      <div>
        <Header
          route={route}
          setRoute={setRoute}
          open={open}
          setOpen={setOpen}
          activeItem={3}
        />
        {isLoading ? <Loader /> : <OrderList orders={orders} />}
      </div>
    </UserProtected>
  );
};

export default Page;
