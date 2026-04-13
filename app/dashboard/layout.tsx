import SideNav from "../ui/dashboard/sidenav";

export default function DashboardLayout({children,}: {children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen flex-col md:flex-row">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <section className="flex-1 overflow-y-auto bg-gray-100 p-6 md:p-8">
        {children}
      </section>
    </main>
  );
}
