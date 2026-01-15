import type { Metadata } from "next";
import "./globals.css";
import localFont from "next/font/local";
import { StoreProvider } from "@/app/shared/redux/StoreProvider";
import { ThemeProvider } from "@/app/shared/contexts/ThemeContext";
import { Footer } from "@/app/components/Footer";
import { Header } from "@/app/components/Header";
import { AuthChecker } from "@/app/components/AuthChecker";
import { Suspense } from "react";

const AA_Stetica_Bold = localFont({
  src: "../public/fonts/AA_Stetica_Bold.otf",
  variable: "--font-stetica-bold",
});

const AA_Stetica_Medium = localFont({
  src: "../public/fonts/AA_Stetica_Medium.otf",
  variable: "--font-stetica-medium",
});

const AA_Stetica_Regular = localFont({
  src: "../public/fonts/AA_Stetica_Regular.otf",
  variable: "--font-stetica-regular",
});

export const metadata: Metadata = {
  title: "Dream House",
  description: "Dream House",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <StoreProvider>
        <ThemeProvider>
          <body
            className={`${AA_Stetica_Bold.variable} ${AA_Stetica_Medium.variable} ${AA_Stetica_Regular.variable} antialiased flex flex-col min-h-screen`}
            style={{
              backgroundColor: "var(--bg-primary)",
              color: "var(--text-primary)",
            }}
          >
            <AuthChecker />
            <Header />
            <Suspense>
              <main className="flex-1">{children}</main>
            </Suspense>
            <Footer />
          </body>
        </ThemeProvider>
      </StoreProvider>
    </html>
  );
}
