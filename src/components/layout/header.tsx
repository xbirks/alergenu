'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/firebase';
import { signOut } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

export function Header() {
  const router = useRouter();
  const [initials, setInitials] = useState('');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const docRef = doc(db, 'restaurants', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const ownerName = docSnap.data().ownerName || '';
          setUserName(ownerName);
          const nameParts = ownerName.split(' ');
          const initials =
            nameParts.length > 1
              ? `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`
              : nameParts[0]?.substring(0, 2) || '';
          setInitials(initials.toUpperCase());
        } else {
          setInitials('?');
        }
      } else {
        setInitials('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/icon_alergenu.png" 
            alt="Alergenu Logo"
            width={40}      // <-- Tamaño corregido
            height={40}     // <-- Tamaño corregido
            priority
          />
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10 border">
                <AvatarFallback className="bg-secondary text-primary font-semibold">
                  {initials || <UserIcon />}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold leading-none">{userName || 'Mi Cuenta'}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
