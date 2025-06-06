import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/providers/theme-provider";
import { TooltipProvider } from "@/providers/tooltip-provider";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AnimatedTitle from "@/components/animated-title"; // Import the animated title component
import ClientProvider from "@/providers/client-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "ＶＥＬＯＣＩＲＥＰＯＲＴ ",
  description: "Create your business reports with ease",
  icons: {
    icon: "/favicon.ico",
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ClientProvider>
            <TooltipProvider>
              {children}
              <Toaster />
              <AnimatedTitle /> {/* Insert client-side animation logic */}
            </TooltipProvider>
          </ClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
