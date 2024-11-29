import "./globals.css";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import { Suspense } from "react";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "AI Chat Game",
  description: 'Try to "rizz" an AI character in this fun chat game!',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-gradient-to-b from-background to-background/80 antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <main className="relative flex min-h-screen flex-col">
            <Toaster position="top-center" />
            <Suspense fallback={null}>{children}</Suspense>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
