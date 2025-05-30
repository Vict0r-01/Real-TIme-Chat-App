import { AuthProvider } from "./context/authContext";
import "./globals.css";
import {Inter} from "next/font/google";
export const metadata = {
  title: "VaikroChat App",
  description: "Demo Real-time Chat Application"
};
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});
export default function RootLayout({ children }) {
  
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
