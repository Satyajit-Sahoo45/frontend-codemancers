"use client";

import AdminProtected from "../hooks/adminProtected";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AdminProtected>{children}</AdminProtected>;
}
