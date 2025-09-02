import { Outfit } from "next/font/google";
import "./globals.css";
import LayoutWrapper from "./components/LayoutWrapper";
import { ThemeProvider } from "./components/ThemeProvider";
// import LenisProvider from "./components/LenisProvider"
import ClientAuthWrapper from "./components/ClientAuthWrapper";

const outfit = Outfit({
  weight: "400",
  subsets: ["latin"],
});

export const metadata = {
  title: "NextDocs",
  description: "Modern documentation platform built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={outfit.className}
        style={{ background: "var(--background)" }}
      >
        <ThemeProvider>
          <ClientAuthWrapper>
            {/* LenisProvider removed */}
            <LayoutWrapper>{children}</LayoutWrapper>
          </ClientAuthWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
