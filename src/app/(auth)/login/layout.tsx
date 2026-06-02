import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Sign In to Your HUD',
  description: 'Access your learning achievements, daily streaks, customizable workspaces, and code modules.',
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
