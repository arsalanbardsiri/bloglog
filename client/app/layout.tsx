import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/context/AuthContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Blog Lounge | Premium Content Platform",
    template: "%s | Blog Lounge",
  },
  description: "A high-scale distributed content platform for modern engineering. Featuring Redis caching, rate limiting, and microservices.",
  openGraph: {
    title: "Blog Lounge | Premium Content Platform",
    description: "A high-scale distributed content platform for modern engineering.",
    url: "https://blog-lounge.demo",
    siteName: "Blog Lounge",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Lounge | Premium Content Platform",
    description: "A high-scale distributed content platform for modern engineering.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
