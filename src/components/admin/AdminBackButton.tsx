'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AdminBackButton() {
  const router = useRouter();
  
  return (
    <Button 
      variant="default" // Changed to default for a solid button
      onClick={() => router.push('/dashboard')}
      className="w-fit rounded-full font-bold bg-blue-800 hover:bg-blue-900 text-white"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Volver al Dashboard
    </Button>
  );
}
