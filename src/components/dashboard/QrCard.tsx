'use client';

import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface QrCardProps {
  slug: string;
}

export function QrCard({ slug }: QrCardProps) {
  const qrRef = useRef<HTMLDivElement>(null);
  const menuUrl = `${window.location.origin}/menu/${slug}`;

  const handleDownload = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `qr-alergenu-${slug}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tu Código QR</CardTitle>
        <CardDescription>
          Este es el código QR que tus clientes escanearán para ver el menú. Descárgalo y úsalo en tu material impreso.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-6">
        <div ref={qrRef} className="p-4 bg-white rounded-lg">
          {/* Usamos QRCodeCanvas para poder descargarlo, lo ocultamos y mostramos el SVG que es más nítido */}
          <QRCodeCanvas
            value={menuUrl}
            size={256}
            level={"H"}
            imageSettings={{
              src: '/alergenu_square.png',
              height: 40,
              width: 40,
              excavate: true,
            }}
            style={{ display: 'none' }} // Ocultamos el canvas
          />
          <QRCodeSVG
            value={menuUrl}
            size={256}
            level={"H"}
            imageSettings={{
              src: '/alergenu_square.png',
              height: 40,
              width: 40,
              excavate: true,
            }}
          />
        </div>
        <p className="text-sm text-muted-foreground font-mono bg-slate-100 px-2 py-1 rounded break-all">{menuUrl}</p>
        <Button id="tour-download-qr-button" onClick={handleDownload} className="w-full max-w-xs">
          Descargar QR
        </Button>
      </CardContent>
    </Card>
  );
}
