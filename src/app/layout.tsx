import type { Metadata, Viewport } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pickflick.jewellcore.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PickFlick — Movie Night, Decided Together",
    template: "%s · PickFlick",
  },
  description:
    "Pick a flick, together. A self-hosted movie night picker for your Jellyfin library — shuffle a genre, nominate movies, and battle head-to-head until one wins.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PickFlick",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "PickFlick",
    title: "PickFlick — Movie Night, Decided Together",
    description:
      "Shuffle a genre, nominate your flicks, and let the family battle it out head-to-head. The fairest way to end movie night indecision.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "PickFlick theatre marquee — Movie night, decided together",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PickFlick — Movie Night, Decided Together",
    description:
      "Shuffle a genre, nominate your flicks, and let the family battle it out head-to-head.",
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#C41E3A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/icon-192.svg" />
      </head>
      <body className="min-h-screen bg-[#0D0508] text-white antialiased">
        {children}
      </body>
    </html>
  );
}
