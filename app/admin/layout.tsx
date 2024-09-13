"use client";

import dynamic from "next/dynamic";
const AdminProtected = dynamic(() => import("../hooks/adminProtected"), {
  ssr: false,
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminProtected>{children}</AdminProtected>;
}
