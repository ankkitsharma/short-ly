'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/ui/components/dialog';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { signOut } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useAuth } from './auth-provider';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push('/sign-in');
          },
        },
      });
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  const getInitials = (email: string) => {
    const localPart = email.split('@')[0] || email;
    return localPart
      .split('.')
      .map((n) => n[0])
      .filter(Boolean)
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings and preferences.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Profile Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={user?.image} alt={user?.name || user?.email} />
                <AvatarFallback>
                  {user?.name
                    ? user.name
                        .split(' ')
                        .map((n) => n?.[0])
                        .filter(Boolean)
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : getInitials(user?.email || '')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold text-sm">
                  {user?.name || 'User'}
                </h3>
                <p className="text-sm text-muted-foreground">{user?.email || ''}</p>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
            </div>
            {user?.name && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  value={user.name}
                  disabled
                  className="bg-muted"
                />
              </div>
            )}
          </div>

          {/* Sign Out Section */}
          <div className="pt-4 border-t">
            <Button
              variant="destructive"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="w-full"
            >
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
