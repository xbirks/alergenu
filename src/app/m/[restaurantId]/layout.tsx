import { Header } from '@/components/lilunch/Header';
import { LegalFooter } from '@/components/lilunch/LegalFooter';

export default async function MenuLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      <main className="pt-4">{children}</main>
      <LegalFooter />
    </div>
  );
}
