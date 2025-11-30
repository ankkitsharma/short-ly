'use client';

import CreateUrlForm from '@/app/components/create-url-form';
import UrlsList from '@/app/components/urls-list';

export default function HomeClient() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="space-y-10">
        <CreateUrlForm />
        <UrlsList />
      </div>
    </div>
  );
}
