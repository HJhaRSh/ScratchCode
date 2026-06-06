import { Metadata } from 'next';

type Props = {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const formatSlug = (s: string) => {
    if (s === 'html-css') return 'HTML & CSS';
    if (s === 'c-programming') return 'C Programming';
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  
  const trackName = formatSlug(slug);
  
  return {
    title: `${trackName} Curriculum`,
    description: `Master ${trackName} step-by-step through interactive units and live, sandboxed compilation in your browser.`,
  };
}

export default function TrackDetailLayout({ children }: Props) {
  return <>{children}</>;
}
