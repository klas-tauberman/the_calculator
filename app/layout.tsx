import type { Metadata } from "next";
import { Inter } from 'next/font/google'
import "./globals.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Baker's Percentage Calculator",
  description: "A simple calculator for baker's percentages",
  keywords: ["baking", "baker's percentage", "bread", "calculator", "sourdough", "hydration"],
  openGraph: {
    title: "Calculate Baker's Percentages Easily | Baker's Calculator",
    description: "Simplify your baking with our easy-to-use Baker's Percentage Calculator. Perfect for professional and home bakers alike.",
    type: "website",
    url: "https://calculator.tauberman.se",
    siteName: "Baker's Percentage Calculator",
    locale: "en_US",
    images: [{
      url: "/og-preview.jpg",
      width: 1200,
      height: 630,
      alt: "Baker's Percentage Calculator interface with artisanal bread background",
    }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

