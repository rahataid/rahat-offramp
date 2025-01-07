import { Poppins } from "next/font/google";
import "./globals.css";

const inter = Poppins();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={`${inter.className} font-sans`}>{children}</body>
    </html>
  );
}
