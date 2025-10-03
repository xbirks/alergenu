'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { LogIn } from 'lucide-react';

export function PublicHeader() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleAccess = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-card">
      <Image 
        src="/icon_alergenu.png" 
        alt="Alergenü Icon" 
        width={40} 
        height={40} 
        className="cursor-pointer"
        onClick={() => router.push('/home')}
      />
      <div>
        {loading ? (
          <div className="h-10 w-28 rounded-full bg-muted animate-pulse" />
        ) : (
          <Button onClick={handleAccess} variant="outline" className="rounded-full">
            <LogIn className="mr-2 h-4 w-4" />
            Acceder
          </Button>
        )}
      </div>
    </header>
  );
}
