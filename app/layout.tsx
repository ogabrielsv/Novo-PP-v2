import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlayPrêmios",
  description: "Sistema de Rifas",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased bg-black text-white">
        {children}
      </body>
    </html>
  );
}
