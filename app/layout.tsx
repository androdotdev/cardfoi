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
  title: "Cardfoi - Shareable Profile Cards for Developers",
  description:
    "Create beautiful developer portfolio profile cards in minutes. Share your skills, projects, and contact info with a single link. Free, fast, and customizable.",
  metadataBase: new URL("https://cardfoi.vercel.app"),
  openGraph: {
    type: "website",
    siteName: "Cardfoi",
    title: "Cardfoi - Shareable Profile Cards for Developers",
    description:
      "Create beautiful developer portfolio profile cards in minutes. Share your skills, projects, and contact info with a single link.",
    url: "https://cardfoi.vercel.app",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cardfoi - Shareable Profile Cards for Developers",
    description:
      "Create beautiful developer portfolio profile cards in minutes. Share your skills, projects, and contact info with a single link.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/icon.svg",
  },
  alternates: {
    canonical: "https://cardfoi.vercel.app",
  },
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
