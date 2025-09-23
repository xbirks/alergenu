import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-3xl font-bold tracking-tight">Bienvenido</CardTitle>
          <CardDescription className="text-lg pt-2">
            ¿Tienes alguna alergia o intolerancia alimentaria?
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-4 p-6">
          <Button variant="outline" size="lg" className="h-20 text-lg rounded-xl border-destructive/50 hover:bg-destructive/10" asChild>
            <Link href="/m/1?alergias=true">
              <ShieldAlert className="mr-3 size-7 text-destructive" />
              <div className="text-left">
                <p className="font-bold">Sí, soy alérgico</p>
                <p className="text-sm font-normal text-muted-foreground">Personalizaré el menú</p>
              </div>
            </Link>
          </Button>
          <Button variant="outline" size="lg" className="h-20 text-lg rounded-xl hover:bg-accent/50" asChild>
            <Link href="/m/1">
               <Shield className="mr-3 size-7 text-primary" />
               <div className="text-left">
                <p className="font-bold">No, todo en orden</p>
                <p className="text-sm font-normal text-muted-foreground">Veré el menú completo</p>
              </div>
            </Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
