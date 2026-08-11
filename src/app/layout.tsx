import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { ThemeProvider } from '@/context/ThemeContext';
import { CurrencyProvider } from '@/context/CurrencyContext';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });

export const metadata: Metadata = {
  title: 'AtlasAura - Discover Your World',
  description: 'A community of wanderers sharing stories, memories, and hidden gems',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent flash: set data-theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var t=localStorage.getItem('atlasaura-theme');document.documentElement.setAttribute('data-theme',t==='dark'?'dark':'light');})();`,
          }}
        />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <ThemeProvider>
          <CurrencyProvider>{children}</CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
