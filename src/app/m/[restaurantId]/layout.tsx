import { Header } from '@/components/lilunch/Header';
import { LegalFooter } from '@/components/lilunch/LegalFooter';

export default function MenuLayout({
  children,
}: {
  children: React.ReactNode;
  params: { restaurantId: string };
}) {
  return (
    <div className="relative min-h-screen bg-background">
      <Header />
      <main className="pb-24 pt-4">{children}</main>
      <LegalFooter />
    </div>
  );
}
