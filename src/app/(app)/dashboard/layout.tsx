import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coder HUD',
  description: 'Track your coding stats, view leaderboard ranks, continue your language courses, and review recent achievements.',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
