import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PickFlick",
  description:
    "Pick a flick, together — a self-hosted movie night picker for your Jellyfin library",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0D0508] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
