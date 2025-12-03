'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { DownloadableQrCode } from '@/components/admin/DownloadableQrCode';

const FormSchema = z.object({
  qr1: z.string().url({ message: 'Por favor, introduce una URL válida.' }),
  qr2: z.string().url({ message: 'Por favor, introduce una URL válida.' }),
});

export function QrRedirects() {
  const { toast } = useToast();
  const [redirects, setRedirects] = useState({ qr1: '', qr2: '' });
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      qr1: '',
      qr2: '',
    },
  });
  const { formState: { isSubmitting } } = form;

  useEffect(() => {
    const origin = window.location.origin;
    fetch('/api/qr-redirects')
      .then(res => res.json())
      .then(data => {
        form.reset(data);
        // Usamos las nuevas URLs acortadas
        setRedirects({
          qr1: `${origin}/q/1`,
          qr2: `${origin}/q/2`
        });
      });
  }, [form]);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    try {
        const response = await fetch('/api/qr-redirects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('La respuesta del servidor no fue exitosa.');
        }

        toast({ 
            title: '¡Guardado!',
            description: 'Las URLs de los códigos QR se han actualizado correctamente.',
        });

    } catch (error) {
        console.error("Error al actualizar las URLs:", error);
        toast({ 
            title: 'Error', 
            description: 'No se pudieron actualizar las URLs. Por favor, inténtalo de nuevo.', 
            variant: 'destructive' 
        });
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

        {/* Columna del formulario */}
        <div className="md:col-span-2">
            <Card className="rounded-2xl shadow-sm">
                <CardHeader>
                    <CardTitle className="text-3xl font-extrabold text-gray-800">Configuración de Redirecciones</CardTitle>
                    <CardDescription>Modifica las URLs de destino para tus códigos QR dinámicos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="qr1"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xl font-bold text-gray-700">URL para el QR 1</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://tu-sitio.com/destino-1" {...field} className="text-base" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="qr2"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-xl font-bold text-gray-700">URL para el QR 2</FormLabel>
                                        <FormControl>
                                            <Input placeholder="https://tu-sitio.com/destino-2" {...field} className="text-base" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex justify-end">
                              <Button type="submit" disabled={isSubmitting} className="rounded-full h-14 text-lg" size="lg">
                                  {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                              </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>

        {/* Columna de los QR */}
        <div className="space-y-8">
          <DownloadableQrCode 
            qrId="qr-1"
            url={redirects.qr1}
            title="Código QR 1"
            description={`Apunta a: ${form.getValues('qr1') || 'No definida'}`}
            filename="qr-dinamico-1.png"
          />
          <DownloadableQrCode 
            qrId="qr-2"
            url={redirects.qr2}
            title="Código QR 2"
            description={`Apunta a: ${form.getValues('qr2') || 'No definida'}`}
            filename="qr-dinamico-2.png"
          />
        </div>

    </div>
  );
}
