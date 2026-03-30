import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Nike Puffer Jacket - Wear Your Style with Comfort",
  description: "Interactive Nike puffer jacket showcase with Glassmorphism design",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}