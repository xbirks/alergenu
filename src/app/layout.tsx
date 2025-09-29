
import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { LegalFooter } from '@/components/layout/Footer';

const manrope = Manrope({ 
  subsets: ["latin"], 
  variable: "--font-sans",
  weight: ['400', '500', '700', '800']
});

export const metadata: Metadata = {
  title: "Alergenu - Panel de control para restaurantes",
  description: "Gestiona tu carta digital y alérgenos de forma sencilla e intuitiva.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`flex flex-col min-h-screen bg-white ${manrope.className}`}>
        <div className="flex-grow">{children}</div>
        <LegalFooter />
      </body>
    </html>
  );
}
