import { HeaderB2B } from "@/components/lilunch/HeaderB2B";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <HeaderB2B />
      <main className="flex-1 container py-8">{children}</main>
    </div>
  );
}
