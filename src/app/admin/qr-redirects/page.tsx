import AdminBackButton from '@/components/admin/AdminBackButton';
import { QrRedirects } from '@/components/admin/qr-redirects';

export default function QrRedirectsPage() {
  return (
    <div className="flex flex-col gap-8 p-4 sm:p-8 min-h-screen bg-white">
      <AdminBackButton />

      <header className="pb-4 border-b border-gray-200">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900 mb-2">Gestión de Códigos QR</h1>
          <p className="text-md sm:text-lg text-muted-foreground font-regular">
              Aquí puedes configurar las URLs de destino para tus códigos QR dinámicos.
          </p>
      </header>

      <main className="w-full">
        <QrRedirects />
      </main>

    </div>
  );
}
