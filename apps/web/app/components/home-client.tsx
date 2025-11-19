'use client';

import { Button } from '@repo/ui/components/button';
import { signOut } from '@/app/lib/auth-client';
import { redirect } from 'next/navigation';

export default function HomeClient({ name }: { name: string }) {
  return (
    <div>
      hello {name}
      <Button
        onClick={() =>
          signOut({
            fetchOptions: { onSuccess: () => redirect('/sign-in') },
          })
        }
      >
        Sign Out?
      </Button>
    </div>
  );
}
