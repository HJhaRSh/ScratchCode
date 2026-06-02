import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Language Tracks',
  description: 'Select your coding path. Run python, javascript, html, css, c++, java, and more directly in your browser without installs.',
};

export default function TracksLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
