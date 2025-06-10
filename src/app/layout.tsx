import './globals.css';
import type { Metadata } from "next";
import Navbar from './components/Navbar';

export const metadata: Metadata = {
  title: "Forest App",
  description: "Система обліку лісопродукції",
};

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
