import type { Metadata } from "next";
import { headers } from "next/headers";
import { Instrument_Serif, DM_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Cardfoi",
  description:
    "Shareable profile cards for developers, freelancers, and creators",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${instrumentSerif.variable} ${dmSans.variable}`}
    >
      <body className="font-['DM_Sans','sans-serif']">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
