'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui/components/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@repo/ui/components/table';
import { useUrls } from '@/app/hooks/use-urls';
import { Copy, ExternalLink } from 'lucide-react';
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
    return <div>Loading...</div>;
  }

  if (urls.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your URLs</CardTitle>
          <CardDescription>No URLs created yet. Create one to get started!</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your URLs</CardTitle>
        <CardDescription>Manage your shortened URLs and view analytics</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Short URL</TableHead>
              <TableHead>Original URL</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {urls.map((url) => {
              const shortUrl = getShortUrl(url.shortCode);
              return (
                <TableRow key={url.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {shortUrl}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(shortUrl)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 max-w-md">
                      <span className="truncate">{url.originalUrl}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(url.originalUrl, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>{url.clickCount}</TableCell>
                  <TableCell>
                    {new Date(url.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        setExpandedUrl(expandedUrl === url.id ? null : url.id)
                      }
                    >
                      {expandedUrl === url.id ? 'Hide' : 'Show'} Analytics
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {expandedUrl && (
          <div className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Click Analytics</CardTitle>
                <CardDescription>
                  Detailed analytics for{' '}
                  {urls.find((u) => u.id === expandedUrl)?.shortCode}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {urls
                  .find((u) => u.id === expandedUrl)
                  ?.clicks.length === 0 ? (
                  <p className="text-muted-foreground">No clicks yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>IP Address</TableHead>
                        <TableHead>User Agent</TableHead>
                        <TableHead>Referer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {urls
                        .find((u) => u.id === expandedUrl)
                        ?.clicks.map((click) => (
                          <TableRow key={click.id}>
                            <TableCell>
                              {new Date(click.createdAt).toLocaleString()}
                            </TableCell>
                            <TableCell>{click.ipAddress || 'N/A'}</TableCell>
                            <TableCell className="max-w-xs truncate">
                              {click.userAgent || 'N/A'}
                            </TableCell>
                            <TableCell>{click.referer || 'N/A'}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
