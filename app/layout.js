import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "@/app/providers";
import { Toaster } from "sonner";
import Navbar from "./Navbar/page";
export const metadata = {
  title: "AskUp Virtual Interview",
  description: "AI-powered interview preparation system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning={true}>
      <body className="antialiased">
        <Providers>
          <Navbar />
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
