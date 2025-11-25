import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';

const API_BASE_URL = process.env.SERVER_URL || process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

export default async function RedirectPage({ params }: { params: Promise<{ shortCode: string }> }) {
  const { shortCode } = await params;

  if (!shortCode) {
    redirect('/');
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/urls/${shortCode}`, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (error) {
    // Only catch actual fetch errors, not redirect errors
    console.error('Error fetching URL:', error);
    redirect('/');
  }

  if (!response.ok) {
    if (response.status === 404) {
      notFound();
    }
    redirect('/');
  }

  const data = await response.json();
  
  if (data?.originalUrl) {
    redirect(data.originalUrl);
  }

  redirect('/');
}
