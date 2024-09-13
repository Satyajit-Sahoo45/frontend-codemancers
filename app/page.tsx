"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
const Header = dynamic(() => import("./components/Header"), { ssr: false });
const Hero = dynamic(() => import("./components/Route/Hero"), { ssr: false });

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
