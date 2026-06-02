import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Start Learning for Free',
  description: 'Create your free account on Scratch Code. No local setups, compilers, or IDE config needed. Start writing real code in 30 seconds.',
};

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
