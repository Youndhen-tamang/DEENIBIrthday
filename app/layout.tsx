import type { Metadata } from "next";
import { Playfair_Display, Alex_Brush, Nunito } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-playfair",
});

const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-script",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Kingdom of Deeni — Royal Passport RSVP",
  description:
    "You're invited to Princess Deeni's Kingdom! RSVP for the celebration on August 8, 2026.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${playfair.variable} ${alexBrush.variable} ${nunito.variable} font-body`}
      >
        {children}
      </body>
    </html>
  );
}
