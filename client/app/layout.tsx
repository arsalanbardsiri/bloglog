import type { Metadata } from "next";
import "./globals.css";
import { NotebookLayout } from "@/components/NotebookLayout";
import { AuthProvider } from "@/context/AuthContext";



export const metadata: Metadata = {
  title: {
    default: "Blog Lounge | The Developer's Notebook",
    template: "%s | Blog Lounge",
  },
  description: "A community for developers to share knowledge, snippets, and ideas. Featuring markdown support, code highlighting, and a unique origami-inspired design.",
  keywords: ["developer blog", "coding community", "markdown notes", "programmer portfolio", "tech sharing", "nextjs", "react", "origami design"],
  openGraph: {
    title: "Blog Lounge | The Developer's Notebook",
    description: "Share your code, ideas, and stories in a beautiful, origami-inspired digital notebook.",
    url: "https://blog-lounge.demo",
    siteName: "Blog Lounge",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog Lounge | The Developer's Notebook",
    description: "Share your code, ideas, and stories in a beautiful, origami-inspired digital notebook.",
  },
  icons: {
    icon: "/icon.jpg",
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
