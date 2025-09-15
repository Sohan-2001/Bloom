import type { Metadata } from 'next';
import { Righteous, Inter } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import Footer from '@/components/layout/footer';

const fontSans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const fontHeading = Righteous({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-heading',
});

export const metadata: Metadata = {
  title: 'Project Bloom',
  description: 'A vibrant community for creative projects.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased overflow-x-hidden',
          fontSans.variable,
          fontHeading.variable
        )}
      >
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <div className="flex flex-col min-h-screen">
              <div className="flex-grow">
                {children}
              </div>
              <Footer />
            </div>
            <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
