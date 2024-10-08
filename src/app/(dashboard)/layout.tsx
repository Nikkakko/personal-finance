import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-row min-h-screen bg-theme-background">
      <Sidebar />
      <main className="flex flex-col p-10 w-full container mx-auto">
        {children}
      </main>
    </section>
  );
}
