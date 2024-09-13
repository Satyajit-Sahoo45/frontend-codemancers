"use client";

import { useState } from "react";
import Header from "./components/Header";
import { Hero } from "./components/Route/Hero";
import Script from "next/script";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(0);
  const [route, setRoute] = useState("Login");
  return (
    <>
      <Header
        open={open}
        setOpen={setOpen}
        activeItem={activeItem}
        setRoute={setRoute}
        route={route}
      />

      <Hero />
    </>
  );
}

export function Payment() {
  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </>
  );
}
