import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getSession } from '@/app/lib/auth-client';

const API_BASE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

type SessionData = {
  user: {
    id: string;
    email?: string | null;
    name?: string | null;
    image?: string | null;
  };
  session?: {
    id: string;
    token: string;
  };
} | null;

interface Url {
  id: string;
  shortCode: string;
  originalUrl: string;
  createdAt: string;
  clickCount: number;
  clicks: Array<{
    id: string;
    ipAddress: string | null;
    userAgent: string | null;
    referer: string | null;
    createdAt: string;
  }>;
}

interface CreateUrlResponse {
  id: string;
  shortCode: string;
  originalUrl: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export function useUrls() {
  return useQuery<Url[]>({
    queryKey: ['urls'],
    queryFn: async () => {
      const sessionResult = await getSession() as any;
      
      // Handle the result type - getSession may return { data: session } or session directly
      let session: SessionData = null;
      
      if (sessionResult) {
        if (sessionResult.error) {
          throw new Error('Unauthorized');
        }
        // Check if it's wrapped in a data property
        if (sessionResult.data) {
          session = sessionResult.data as SessionData;
        } else {
          // Assume it's the session directly
          session = sessionResult as SessionData;
        }
      }
      
      if (!session?.user?.id) {
        throw new Error('Unauthorized');
      }

      const response = await fetch(`${API_BASE_URL}/urls`, {
        method: 'GET',
        headers: {
          'X-User-Id': session.user.id,
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }

      return response.json();
    },
  });
}

export function useCreateUrl() {
  const queryClient = useQueryClient();

  return useMutation<CreateUrlResponse, Error, { originalUrl: string; shortCode?: string }>({
    mutationFn: async ({ originalUrl, shortCode }) => {
      const sessionResult = await getSession() as any;
      
      // Handle the result type - getSession may return { data: session } or session directly
      let session: SessionData = null;
      
      if (sessionResult) {
        if (sessionResult.error) {
          throw new Error('Unauthorized');
        }
        // Check if it's wrapped in a data property
        if (sessionResult.data) {
          session = sessionResult.data as SessionData;
        } else {
          // Assume it's the session directly
          session = sessionResult as SessionData;
        }
      }
      
      if (!session?.user?.id) {
        throw new Error('Unauthorized');
      }

      const response = await fetch(`${API_BASE_URL}/urls`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Id': session.user.id,
        },
        credentials: 'include',
        body: JSON.stringify({ originalUrl, shortCode }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Failed to create URL' }));
        throw new Error(error.error || 'Failed to create URL');
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch URLs after creating a new one
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
  });
}
