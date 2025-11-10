import styles from './page.module.css';
import { prisma } from '@repo/db';
import { Button } from '@repo/ui/components/button';
import SignIn from '@/app/components/sign-in';
import { getSession } from '@/app/lib/auth-client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Home() {
  // const user = await prisma.user.findFirst();
  const { data: session } = await getSession();

  if (!session) {
    redirect('/sign-in');
  }
  return <div className={styles.page}>hello world</div>;
}
