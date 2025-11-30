'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import { useUrls } from '@/app/hooks/use-urls';
import { Copy, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@repo/ui/components/button';
import { toast } from 'sonner';

export default function UrlsList() {
  const { data: urls = [], isLoading, error } = useUrls();
  const [expandedUrl, setExpandedUrl] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      toast.error('Failed to fetch URLs');
    }
  }, [error]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const getShortUrl = (shortCode: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/r/${shortCode}`;
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </div>
    );
  }

  if (urls.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-sm">
        <div className="text-center py-12 px-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            No shortened links yet
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Create your first short link above
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 overflow-hidden">
      <div className="px-8 py-5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Your shortened links</h2>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-white dark:bg-gray-900 border-b-2 border-gray-200 dark:border-gray-800">
              <TableHead className="font-semibold text-gray-800 dark:text-gray-200 py-4 px-8">Short link</TableHead>
              <TableHead className="font-semibold text-gray-800 dark:text-gray-200 py-4 px-8">Original link</TableHead>
              <TableHead className="font-semibold text-gray-800 dark:text-gray-200 py-4 px-8 text-center">Clicks</TableHead>
              <TableHead className="font-semibold text-gray-800 dark:text-gray-200 py-4 px-8">Created</TableHead>
              <TableHead className="font-semibold text-gray-800 dark:text-gray-200 py-4 px-8"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.map((url) => {
              const shortUrl = getShortUrl(url.shortCode);
              return (
                <TableRow key={url.id} className="hover:bg-blue-50/50 dark:hover:bg-blue-950/10 border-b border-gray-100 dark:border-gray-800 transition-colors">
                  <TableCell className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <a 
                        href={shortUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
                      >
                        {shortUrl}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(shortUrl)}
                        className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md transition-colors"
                        title="Copy"
                      >
                        <Copy className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-8">
                    <div className="flex items-center gap-3 max-w-md">
                      <a 
                        href={url.originalUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="truncate text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:underline"
                      >
                        {url.originalUrl}
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(url.originalUrl, '_blank')}
                        className="h-8 w-8 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-md shrink-0 transition-colors"
                        title="Open in new tab"
                      >
                        <ExternalLink className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="py-5 px-8 text-center">
                    <span className="inline-flex items-center justify-center min-w-[3rem] px-3 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-sm font-semibold text-blue-700 dark:text-blue-300">
                      {url.clickCount}
                    </span>
                  </TableCell>
                  <TableCell className="py-5 px-8">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(url.createdAt).toLocaleDateString()}
                    </span>
                  </TableCell>
                  <TableCell className="py-5 px-8">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setExpandedUrl(expandedUrl === url.id ? null : url.id)
                      }
                      className="h-9 px-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20 rounded-md transition-colors"
                    >
                      {expandedUrl === url.id ? 'Hide' : 'View'} details
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

        {expandedUrl && (
          <div className="px-8 py-6 border-t-2 border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
            <div className="mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                Click details
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Analytics for{' '}
                <code className="px-2 py-1 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 font-mono text-xs font-semibold">
                  {urls.find((u) => u.id === expandedUrl)?.shortCode}
                </code>
              </p>
            </div>
            {urls
              .find((u) => u.id === expandedUrl)
              ?.clicks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-gray-600 dark:text-gray-400">No clicks yet</p>
              </div>
            ) : (
              <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden bg-white dark:bg-gray-900">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800/50">
                      <TableHead className="font-medium text-gray-700 dark:text-gray-300 text-xs py-2 px-4">Date</TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-300 text-xs py-2 px-4">IP Address</TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-300 text-xs py-2 px-4">User Agent</TableHead>
                      <TableHead className="font-medium text-gray-700 dark:text-gray-300 text-xs py-2 px-4">Referer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {urls
                      .find((u) => u.id === expandedUrl)
                      ?.clicks.map((click) => (
                        <TableRow key={click.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/30 border-b border-gray-100 dark:border-gray-800">
                          <TableCell className="font-mono text-xs text-gray-600 dark:text-gray-400 py-2 px-4">
                            {new Date(click.createdAt).toLocaleString()}
                          </TableCell>
                          <TableCell className="font-mono text-xs text-gray-600 dark:text-gray-400 py-2 px-4">
                            {click.ipAddress || 'N/A'}
                          </TableCell>
                          <TableCell className="max-w-xs truncate text-xs text-gray-600 dark:text-gray-400 py-2 px-4">
                            {click.userAgent || 'N/A'}
                          </TableCell>
                          <TableCell className="text-xs text-gray-600 dark:text-gray-400 py-2 px-4">
                            {click.referer || 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
    </div>
  );
}
