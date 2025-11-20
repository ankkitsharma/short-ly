'use client';

import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/ui/components/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/ui/components/avatar';
import { Button } from '@repo/ui/components/button';
import { Settings, LogOut, User } from 'lucide-react';
import { useAuth } from './auth-provider';
import { SettingsModal } from './settings-modal';
import { signOut } from '@/app/lib/auth-client';
import { useRouter } from 'next/navigation';

export function UserProfileButton() {
  const { user, isLoading } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const router = useRouter();

  if (isLoading) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9" disabled>
        <User className="h-5 w-5" />
      </Button>
    );
  }

  if (!user) {
    return null;
  }

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

  const handleSignOut = async () => {
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
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-9 w-9 rounded-full"
            aria-label="User menu"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage src={user.image} alt={user.name || user.email || 'User'} />
              <AvatarFallback>
                {user.name
                  ? user.name
                      .split(' ')
                      .map((n) => n?.[0])
                      .filter(Boolean)
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)
                  : getInitials(user.email || '')}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {user.name || 'User'}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email || ''}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleSignOut} variant="destructive">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
    </>
  );
}
