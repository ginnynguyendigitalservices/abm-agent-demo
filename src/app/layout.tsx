import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ginny-nguyen-abm-demo.vercel.app"),
  title: {
    default: "ABM Agent Demo — by Ginny Nguyen",
    template: "%s | ABM Agent Demo",
  },
  description:
    "The self-serve aha-moment Prismic's ABM Landing Page Builder doesn't have. Enter a company URL — get back a personalised landing page and a quantified growth brief, generated in ~10 seconds.",
  openGraph: {
    title: "ABM Agent Demo — by Ginny Nguyen",
    description:
      "Enter a company URL. Get a personalised landing page + quantified growth brief in 10 seconds. Built for the Prismic AI Solutions Engineer role.",
    type: "website",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "ABM Agent Demo — by Ginny Nguyen",
    description:
      "Enter a company URL. Get a personalised landing page + quantified growth brief in 10 seconds.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <Toaster theme="dark" position="top-right" />
      </body>
    </html>
  );
}
