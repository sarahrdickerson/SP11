import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";
import Navbar from "@/components/nav/navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "SP11 Music Generator",
  description: "A AI Powered Music Generator",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className=" min-h-screen h-full w-screen flex-col md:flex bg-[#efefef]">
          <AuthProvider>
            <Navbar></Navbar>
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
