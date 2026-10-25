import type { Metadata, Viewport } from 'next';
import { Sora, Inter } from 'next/font/google';
import { CustomCursor } from '../src/components/common/CustomCursor';
import '../src/index.css';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
  weight: ['400', '600', '700', '800'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Yogesh | Creative Frontend Developer Portfolio',
  description:
    'Creative frontend developer specializing in responsive interfaces, interactive web experiences, and performant design systems.',
  openGraph: {
    title: 'Yogesh | Creative Frontend Developer Portfolio',
    description:
      'Creative frontend developer specializing in responsive interfaces, interactive web experiences, and performant design systems.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Host+Grotesk:ital,wght@0,300..800;1,300..800&family=Cinzel:wght@600;700;900&family=Inter:wght@400;600;700;800&family=Montserrat:wght@600;700;800;900&family=Orbitron:wght@600;700;800;900&family=Outfit:wght@600;700;800;900&family=Playfair+Display:wght@600;700;800;900&family=Plus+Jakarta+Sans:wght@600;700;800&family=Sora:wght@600;700;800&family=Space+Grotesk:wght@600;700&family=Syne:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        className="bg-[#09080B] text-[#F8F4F0] selection:bg-[#FF4A16] selection:text-white antialiased overflow-x-hidden"
        suppressHydrationWarning
      >
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}

