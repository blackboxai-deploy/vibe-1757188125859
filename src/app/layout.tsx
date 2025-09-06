import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FutMap - Encontre Campos de Futebol",
  description: "Encontre e reserve os melhores campos de futebol da sua região. Sistema completo de mapeamento e reservas para jogadores e times.",
  keywords: ["futebol", "campos", "reservas", "pelada", "futsal", "society"],
  authors: [{ name: "FutMap Team" }],
  viewport: "width=device-width, initial-scale=1",
  robots: "index, follow",
  openGraph: {
    title: "FutMap - Encontre Campos de Futebol",
    description: "Encontre e reserve os melhores campos de futebol da sua região",
    type: "website",
    locale: "pt_BR",
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className="h-full">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased",
        inter.className
      )}>
        <div className="relative flex min-h-screen flex-col">
          <main className="flex-1">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}