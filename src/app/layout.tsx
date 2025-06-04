import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Forest App",
  description: "Система обліку лісопродукції",
};

import Navbar from './components/Navbar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
