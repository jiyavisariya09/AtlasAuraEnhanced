import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Manrope, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import '@/styles/globals.css';

/* Display/Serif: High-legibility, elegant Playfair Display with full weight range (400-800).
   Body/UI: Clean geometric Manrope.
   Mono: JetBrains Mono for coordinates, counts, and financial values. */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
});

const manrope = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
  variable: '--font-manrope',
});

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
});

export const metadata: Metadata = {
  title: 'AtlasAura — 50,000 memories, pinned to the places that made them',
  description:
    'Travellers leave notes at the exact coordinates where something happened to them. Read them, add your own, and plan a trip around the moments rather than the landmarks.',
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#080B14' },
    { media: '(prefers-color-scheme: light)', color: '#F5F8FC' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        {/* Resolve the theme before first paint so there is no flash. Night is
            the default; only an explicit 'light' preference switches away.
            Falls back to the OS preference on a first visit. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('atlasaura-theme');var t=s==='light'||s==='dark'?s:(window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark');document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${playfair.variable} ${manrope.variable} ${jetbrains.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <CurrencyProvider>{children}</CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
