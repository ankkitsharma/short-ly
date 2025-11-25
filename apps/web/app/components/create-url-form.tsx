'use client';

import { useState } from 'react';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import { useCreateUrl } from '@/app/hooks/use-urls';
import { toast } from 'sonner';

export default function CreateUrlForm() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const createUrlMutation = useCreateUrl();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createUrlMutation.mutate(
      { originalUrl, shortCode: shortCode || undefined },
      {
        onSuccess: () => {
          toast.success('URL shortened successfully!');
          setOriginalUrl('');
          setShortCode('');
        },
        onError: (error) => {
          toast.error(error.message || 'Failed to create short URL');
        },
      },
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Short URL</CardTitle>
        <CardDescription>Enter a URL to shorten</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="originalUrl">Original URL</Label>
            <Input
              id="originalUrl"
              type="url"
              placeholder="https://example.com"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="shortCode">Custom Short Code (optional)</Label>
            <Input
              id="shortCode"
              type="text"
              placeholder="my-link"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              pattern="[a-zA-Z0-9_-]+"
              minLength={3}
              maxLength={20}
            />
          </div>
          <Button type="submit" disabled={createUrlMutation.isPending}>
            {createUrlMutation.isPending ? 'Creating...' : 'Create Short URL'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
