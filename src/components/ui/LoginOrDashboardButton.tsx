'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export function LoginOrDashboardButton() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleClick = () => {
    if (user) {
      router.push('/dashboard');
    } else {
      router.push('/login');
    }
  };

  return (
    <Button 
      onClick={handleClick} 
      disabled={loading} 
      className="w-full text-lg py-6 rounded-full" 
      style={{ backgroundColor: 'black', color: 'white' }}
    >
      {loading ? <Loader2 className="animate-spin" /> : 'Iniciar sesión'}
    </Button>
  );
}
