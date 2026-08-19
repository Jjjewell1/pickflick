import type { Metadata, Viewport } from "next";
import "./globals.css";
import PwaInstall from "@/components/PwaInstall";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://pickflick.jewellcore.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PickFlick — Your Movie Night, Solved",
    template: "%s · PickFlick",
  },
  description:
    "Pick a flick, together. Your movie night, solved — shuffle a genre, nominate movies, and battle head-to-head until one wins.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "PickFlick",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName: "PickFlick",
    title: "PickFlick — Your Movie Night, Solved",
    description:
      "Shuffle a genre, nominate your flicks, and let the family battle it out head-to-head. The fairest way to end movie night indecision.",
    locale: "en_US",
    images: [
      {
        url: `${siteUrl}/og.png`,
        width: 1200,
        height: 630,
        alt: "PickFlick logo — Your Movie Night, Solved",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PickFlick — Your Movie Night, Solved",
    description:
      "Shuffle a genre, nominate your flicks, and let the family battle it out head-to-head.",
    images: [`${siteUrl}/og.png`],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#060810",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/icon-192.png" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#060810] text-white antialiased">
        {children}
        <PwaInstall />
      </body>
    </html>
  );
}
