import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Andro Card",
  description: "Shareable profile cards for developers, freelancers, and creators"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
