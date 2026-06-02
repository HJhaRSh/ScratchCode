import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Interactive Coding Studio',
  description: 'Write real code, compile live sandbox solutions, and chat with AI Mentor for instant, guided help.',
};

export default function LearnLessonLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
