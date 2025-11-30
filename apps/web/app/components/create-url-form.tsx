'use client';

import { useState, useEffect } from 'react';
import { Button } from '@repo/ui/components/button';
import { Input } from '@repo/ui/components/input';
import { Label } from '@repo/ui/components/label';
import { useCreateUrl } from '@/app/hooks/use-urls';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

export default function CreateUrlForm() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortCode, setShortCode] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const createUrlMutation = useCreateUrl();

  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

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
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">Shorten a long link</h2>
        <p className="text-base text-gray-600 dark:text-gray-400">Paste your long URL and click Shorten URL</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="originalUrl" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Paste your long URL
          </Label>
          <Input
            id="originalUrl"
            type="url"
            placeholder="https://example.com/very/long/url"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            required
            className="h-14 text-base border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="shortCode" className="text-sm font-semibold text-gray-800 dark:text-gray-200">
            Custom back-half (optional)
          </Label>
          <div className="flex items-stretch">
            <div className="flex items-center h-14 px-4 bg-gray-50 dark:bg-gray-800 border-2 border-r-0 border-gray-200 dark:border-gray-700 rounded-l-lg">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{baseUrl || 'https://short.ly'}/r/</span>
            </div>
            <Input
              id="shortCode"
              type="text"
              placeholder="my-custom-link"
              value={shortCode}
              onChange={(e) => setShortCode(e.target.value)}
              pattern="[a-zA-Z0-9_-]+"
              minLength={3}
              maxLength={20}
              className="h-14 rounded-l-none flex-1 border-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900"
            />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 ml-1">
            Letters, numbers, hyphens, and underscores only. 3-20 characters.
          </p>
        </div>
        <Button 
          type="submit" 
          disabled={createUrlMutation.isPending}
          className="w-full h-14 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-base shadow-md hover:shadow-lg transition-all duration-200"
        >
          {createUrlMutation.isPending ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Shortening...
            </>
          ) : (
            'Shorten URL'
          )}
        </Button>
      </form>
    </div>
  );
}
