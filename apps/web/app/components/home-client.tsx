'use client';

import { Button } from '@repo/ui/components/button';
import { signOut } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation';
import CreateUrlForm from '@/app/components/create-url-form';
import UrlsList from '@/app/components/urls-list';

export default function HomeClient() {
  const router = useRouter();

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">URL Shortener</h1>
        <Button
          variant="outline"
          onClick={() =>
            signOut({
              fetchOptions: { onSuccess: () => router.push('/sign-in') },
            })
          }
        >
          Sign Out
        </Button>
      </div>

      <CreateUrlForm />
      <UrlsList />
    </div>
  );
}
