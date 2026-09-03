import type { Metadata, Viewport } from 'next';
import { Playfair_Display, Inter, Space_Grotesk } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import { AuthProvider } from '@/context/AuthContext';
import SmoothScroll from '@/components/SmoothScroll';
import '@/styles/globals.css';

/* Display/Serif: Playfair Display — high-contrast editorial serif with sharp details.
   Body/UI: Inter — the gold standard for clean, legible UI text with tabular figures.
   Numbers: Space Grotesk — geometric sans with clear, elegant digits for prices & coordinates. */
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-serif',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-manrope',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
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
        {/* Pre-connect to the video CDN so TLS handshake happens early */}
        <link rel="preconnect" href="https://d8j0ntlcm91z4.cloudfront.net" />
        <link rel="dns-prefetch" href="https://d8j0ntlcm91z4.cloudfront.net" />
        {/* Pre-connect to image CDN for below-fold unsplash images */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
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
        className={`${playfair.variable} ${inter.variable} ${spaceGrotesk.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <CurrencyProvider>
            <AuthProvider>
              <SmoothScroll>{children}</SmoothScroll>
            </AuthProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
