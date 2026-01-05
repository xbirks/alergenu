
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
import { LogOut, User as UserIcon, Settings, LogIn, Crown, CreditCard, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { auth, db } from '@/lib/firebase/firebase';
import { signOut, User } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initials, setInitials] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<'gratuito' | 'autonomia' | 'premium' | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setUserEmail(currentUser.email || '');
        const docRef = doc(db, 'restaurants', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          const ownerName = data.ownerName || ''; // Asegura que ownerName es una cadena
          setUserName(ownerName);
          setSelectedPlan(data.selectedPlan || 'gratuito');
          const trimmedName = ownerName.trim(); // Eliminar espacios al inicio/final
          const nameParts = trimmedName.split(/\s+/).filter(Boolean); // Dividir por uno o más espacios y eliminar vacíos

          let generatedInitials = '';

          if (nameParts.length > 1) {
            generatedInitials = `${nameParts[0][0]}${nameParts[nameParts.length - 1][0]}`;
          } else if (nameParts.length === 1) {
            generatedInitials = nameParts[0].substring(0, 2);
          } else {
            generatedInitials = 'AU'; // Valor por defecto si no hay nombre
          }

          setInitials(generatedInitials.toUpperCase());
        } else {
          setUserName(currentUser.email || 'Usuario');
          setInitials('AU'); // Cambiado de '?' a 'AU' como valor por defecto
          setSelectedPlan('gratuito');
        }
      } else {
        setInitials('');
        setUserName('');
        setUserEmail('');
        setSelectedPlan(null);
      }
      setLoading(false);
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

  const handleLogin = () => {
    router.push('/login');
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-background/95 backdrop-blur-sm">
      <div className="container flex h-20 items-center justify-between">
        <Link id="tour-back-to-dashboard" href={user ? "/dashboard" : "/home"} className="flex items-center gap-2">
          <Image
            src="/icon_alergenu.png"
            alt="Alergenu Logo"
            width={40}
            height={40}
            priority
          />
        </Link>

        {loading ? (
          <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border">
                  <AvatarFallback className="bg-secondary text-primary font-semibold">
                    {initials || 'AU'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 p-2" align="end" forceMount>
              <DropdownMenuLabel className="font-normal py-2 px-2">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-bold leading-none text-gray-800">{userName}</p>
                  <p className="text-sm text-gray-500 leading-none mt-1">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Mostrar botón de upgrade solo para usuarios con plan gratuito */}
              {selectedPlan === 'gratuito' && (
                <>
                  <div className="p-2">
                    <Button
                      onClick={() => router.push('/dashboard/billing')}
                      className="w-full bg-gradient-to-br from-blue-300 via-blue-500 to-blue-700 hover:from-blue-400 hover:via-blue-600 hover:to-blue-800 text-white font-semibold py-3 rounded-lg shadow-md transition-all"
                    >
                      <Crown className="mr-2 h-5 w-5" />
                      <span>Mejorar Plan</span>
                    </Button>
                  </div>
                  <DropdownMenuSeparator />
                </>
              )}

              {/* Suscripción - Para todos los usuarios */}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/billing" className="flex items-center cursor-pointer text-base py-3 px-2">
                  <CreditCard className="mr-3 h-5 w-5" />
                  <span>Suscripción</span>
                </Link>
              </DropdownMenuItem>

              {/* Historial PDF - Para todos los usuarios */}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/pdf-history" className="flex items-center cursor-pointer text-base py-3 px-2">
                  <FileText className="mr-3 h-5 w-5" />
                  <span>Historial PDF</span>
                </Link>
              </DropdownMenuItem>

              {/* Preferencias */}
              <DropdownMenuItem asChild>
                <Link href="/dashboard/preferences" className="flex items-center cursor-pointer text-base py-3 px-2">
                  <Settings className="mr-3 h-5 w-5" />
                  <span>Preferencias</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={handleLogout} className="text-base py-3 px-2 cursor-pointer text-red-600 focus:text-red-600">
                <LogOut className="mr-3 h-5 w-5" />
                <span>Cerrar sesión</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={handleLogin} variant="outline">
            <LogIn className="mr-2 h-4 w-4" />
            Acceder
          </Button>
        )}
      </div>
    </header>
  );
}
