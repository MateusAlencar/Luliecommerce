import type { Metadata } from "next";
import localFont from "next/font/local";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/context/AuthContext";
import { CartDrawer } from "@/components/cart/CartDrawer";


const softServe = localFont({
  src: "../../public/fonts/softserve-scd.otf",
  variable: "--font-soft-serve",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "Luli Cookies Artesanais",
  description: "Delicious cookies delivered to your door.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning={true}
        className={`${softServe.variable} ${poppins.variable} antialiased min-h-screen flex flex-col font-body`}
      >
        <AuthProvider>
          <UserProvider>
            <CartProvider>
              <Header />
              <CartDrawer />
              <main className="flex-grow">
                {children}
              </main>
            </CartProvider>
          </UserProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
