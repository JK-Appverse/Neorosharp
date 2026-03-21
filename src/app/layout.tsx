
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import Script from 'next/script';

export const metadata: Metadata = {
  title: 'NeuroSharp | Cognitive Training',
  description: 'Master your mind with offline cognitive exercises and brain training games.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased bg-background text-foreground min-h-screen">
        {children}
        <Toaster />
        {/* Ad script that opens on interaction/click */}
        <Script 
          src="https://pl28953843.profitablecpmratenetwork.com/05/39/d8/0539d87c413445d27a41866f8c6871b6.js" 
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
