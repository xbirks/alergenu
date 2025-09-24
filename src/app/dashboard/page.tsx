import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header and Main Action Button */}
      <div>
        <div className="space-y-2 mb-4">
          <h1 className="text-3xl font-bold tracking-tight">
            ¡Hola, bienvenido de nuevo!
          </h1>
          <p className="text-muted-foreground">
            Aquí tienes un resumen de tu restaurante y el rendimiento de tu menú.
          </p>
        </div>
        <Button asChild size="lg" className="w-full rounded-full">
          <Link href="/dashboard/dishes">Editar Carta</Link>
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Platos en la Carta</CardTitle>
            <CardDescription>
              Total de platos activos en tu menú digital.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Visitas al Menú</CardTitle>
            <CardDescription>
              Escaneos del QR en los últimos 30 días.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">1,204</p>
          </CardContent>
        </Card>
      </div>

      {/* QR Code and Recent Dishes Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* QR Code Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Tu Código QR</CardTitle>
            <CardDescription>
              Tus clientes pueden escanear este código para ver tu menú.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6">
            <div className="bg-muted p-4 rounded-lg">
              <QrCode className="h-32 w-32" />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Descargar QR</Button>
          </CardFooter>
        </Card>

        {/* Recent Dishes Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Últimos Platos Editados</CardTitle>
            <CardDescription>
              Un vistazo rápido a tus modificaciones más recientes.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/01.png" alt="Avatar" />
                  <AvatarFallback>PZ</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Pizza Margherita
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Precio actualizado
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">
                  hace 5 min
                </div>
              </div>
              <div className="flex items-center">
                <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                  <AvatarImage src="/avatars/02.png" alt="Avatar" />
                  <AvatarFallback>BT</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Bravas Tradicionales
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Añadido nuevo alérgeno
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">
                  hace 2 horas
                </div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/03.png" alt="Avatar" />
                  <AvatarFallback>CR</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Croquetas de Jamón
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Descripción modificada
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">
                  ayer
                </div>
              </div>
              <div className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/avatars/04.png" alt="Avatar" />
                  <AvatarFallback>TQ</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    Tarta de Queso
                  </p>
                  <p className="text-sm text-muted-foreground">
                    ¡Nuevo plato añadido!
                  </p>
                </div>
                <div className="ml-auto font-medium text-sm text-muted-foreground">
                  hace 2 días
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
