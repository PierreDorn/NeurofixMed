import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NeuroFix Med — Fixação inteligente para medicina',
  description: 'Transforme estudo em memória. Memória em aprovação.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'NeuroFix Med',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: '/neurofix-logo.png',
    apple: '/neurofix-logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#C9A84C',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
