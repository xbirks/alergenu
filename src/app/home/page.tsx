import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-center p-4">
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="mb-8">
          <Image src="/alergenu.png" alt="Alergenu Logo" width={250} height={80} />
        </div>

        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-bold mb-8">Cuidamos la <span className="text-blue-600">salud</span> de todos los comensales</h1>

          <div className="space-y-4">
            <Button asChild className="w-full text-lg py-6 rounded-full" style={{ backgroundColor: 'black', color: 'white' }}>
              <Link href="/login">Iniciar sesión</Link>
            </Button>
            <Button asChild variant="outline" className="w-full text-lg py-6 rounded-full">
              <Link href="/register">Crear una cuenta</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
