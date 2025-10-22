import { PublicHeader } from '@/components/layout/PublicHeader';

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white text-gray-800">
      <PublicHeader />
      <main className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
