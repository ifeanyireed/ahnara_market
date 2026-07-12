import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ahnara/ThemeProvider";
import { NicheProvider } from "@/components/ahnara/NicheContext";
import { AuthProvider } from "@/components/ahnara/AuthContext";
import { LocationProvider } from "@/components/ahnara/LocationContext";

export const metadata: Metadata = {
  title: "Ahnara Market",
  description: "E-prescription checkouts, diagnostic scan bookings, last-mile retail pharmacy delivery, and cold-chain parcel tracking.",
  icons: {
    icon: "/logo-white.png",
    shortcut: "/logo-white.png",
    apple: "/logo-white.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>
            <NicheProvider>
              <LocationProvider>
                {children}
              </LocationProvider>
            </NicheProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
