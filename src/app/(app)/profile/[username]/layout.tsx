import { Metadata } from 'next';

type Props = {
  params: Promise<{ username: string }>;
  children: React.ReactNode;
};

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const username = resolvedParams.username;
  
  return {
    title: `@${username} Profile`,
    description: `View @${username}'s coding achievements, cumulative experience points (XP), streak progression, and level badges.`,
  };
}

export default function UserProfileLayout({ children }: Props) {
  return <>{children}</>;
}
