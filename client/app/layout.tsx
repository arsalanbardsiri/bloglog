import type { Metadata } from "next";
import "./globals.css";
import { NotebookLayout } from "@/components/NotebookLayout";
import { AuthProvider } from "@/context/AuthContext";



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
      <body>
        <AuthProvider>
          <NotebookLayout>
            {children}
          </NotebookLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
