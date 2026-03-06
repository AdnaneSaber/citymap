import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CityMap — Signalement Citoyen | Kenitra",
  description: "Signalez les problèmes urbains à Kenitra. Voirie, éclairage, propreté et plus encore.",
  openGraph: {
    title: "CityMap — Signalement Citoyen",
    description: "Signalez les problèmes urbains à Kenitra",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <meta name="theme-color" content="#2563eb" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={inter.className}><Providers>{children}</Providers></body>
    </html>
  );
}
