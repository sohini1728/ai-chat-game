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
      <body className={`${inter.className} min-h-screen bg-black antialiased`}>
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
        <div className="fixed inset-0 bg-gradient-to-br from-black via-purple-950 to-black" />
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
