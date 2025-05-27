import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pathfinding Visualizer',
  description: 'Interactive pathfinding algorithm visualization tool',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
