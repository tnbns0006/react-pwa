import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TMS Maintenance',
  description: 'Progressive Web App for TMS Maintenance',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
        <title>TMS Maintenance</title>
      </head>
      <body>{children}</body>
    </html>
  );
}
