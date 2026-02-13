import React from "react";
import "./globals.css";
import Providers from "@/app/(site)/Providers";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
