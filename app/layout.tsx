import type { Metadata } from "next";
import "./globals.css";

const publicSiteUrl = process.env.NEXT_PUBLIC_SITE_URL
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(publicSiteUrl),
  title: "Happy Birthday, Mohima",
  description: "A birthday wish for Mohima: make a wish, play a little birthday song, and celebrate some favorite moments.",
  openGraph: {
    title: "Happiest birthday, Mohima!",
    description: "Make a wish. It’s your day. A birthday keepsake made with love.",
    type: "website",
    siteName: "A little celebration for Mohima",
    images: [{
      url: "/opengraph-image.png",
      width: 1200,
      height: 630,
      alt: "A birthday cake and a pink birthday wish for Mohima",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Happiest birthday, Mohima!",
    description: "Make a wish. It’s your day. A birthday keepsake made with love.",
    images: ["/opengraph-image.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
