import styles from './page.module.css';
import { Button } from '@repo/ui/components/button';
import { auth } from '@repo/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import HomeClient from '@/app/components/home-client';

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  return <HomeClient name={session.user.email} />;
}
