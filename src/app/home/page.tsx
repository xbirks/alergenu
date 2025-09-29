'use client'
import { Button } from "@/components/ui/button";
import { LoginOrDashboardButton } from "@/components/ui/LoginOrDashboardButton";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-background text-center p-4 pt-20 md:pt-28">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Image src="/alergenu.png" alt="Alergenu Logo" width={250} height={80} />
        </div>

        <div>
          <h1 className="text-3xl font-bold mb-8">Cuidamos la <span className="text-blue-600">salud</span> de todos los comales</h1>

          <div className="space-y-4">
            <LoginOrDashboardButton />
            <Button asChild variant="outline" className="w-full text-lg py-6 rounded-full">
              <Link href="/register">Crear una cuenta</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
