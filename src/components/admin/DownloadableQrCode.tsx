'use client';

import { QRCodeSVG, QRCodeCanvas } from 'qrcode.react';
import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from 'lucide-react';

interface DownloadableQrCodeProps {
  qrId: string;
  url: string;
  title: string;
  description: string;
  filename: string;
}

export function DownloadableQrCode({ qrId, url, title, description, filename }: DownloadableQrCodeProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    if (qrRef.current) {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-800">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center gap-4">
        <div ref={qrRef} className="p-4 bg-white rounded-lg border border-gray-200">
          <QRCodeCanvas
            value={url}
            size={256}
            level={"H"}
            imageSettings={{
              src: '/alergenu_square.png',
              height: 40,
              width: 40,
              excavate: true,
            }}
            style={{ display: 'none' }} // Hidden canvas for download
          />
          <QRCodeSVG
            value={url}
            size={200} // Display size
            level={"H"}
            imageSettings={{
              src: '/alergenu_square.png',
              height: 35,
              width: 35,
              excavate: true,
            }}
          />
        </div>
        <Button onClick={handleDownload} className="w-full rounded-full h-14 text-lg" size="lg">
            <Download className="mr-2 h-4 w-4" />
            Descargar PNG
        </Button>
      </CardContent>
    </Card>
  );
}
