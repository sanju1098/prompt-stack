import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';
import { Navbar } from '@/components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'PromptStack - AI Prompt Management Platform',
  description: 'Create, manage, and execute AI prompts with dynamic variables. Support for Google Gemini and GroqCloud.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-dvh bg-background">
        <Toaster position="top-right" richColors />
        <Navbar />
        {children}
        <footer className="border-t border-border py-8">
          <div className="mx-auto max-w-7xl px-4 text-sm text-muted-foreground sm:px-6 lg:px-8">
            PromptStack · Powered by AI
          </div>
        </footer>
      </body>
    </html>
  );
}
