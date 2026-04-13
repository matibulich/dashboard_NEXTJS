import { Suspense } from "react";
import RevenueChart from "../ui/dashboard/revenue-chart";
import { RevenueChartSkeleton } from "../ui/skeletons";
import LatestInvoices from "../ui/dashboard/latest-invoices";


export default async function PageDashboard() {

 
  return (
    <div className="space-y-6">
      <header className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Resumen de negocio
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-8">
        <div className="xl:col-span-4">

          <Suspense fallback={
          <>
            <div>Cargando</div>
            <RevenueChartSkeleton revenue={[]}  />
            
          </>
        }>
            <RevenueChart />
          </Suspense>
        </div>

        <div className="xl:col-span-4">
          <Suspense fallback={<LatestInvoices/>}>
            <LatestInvoices />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
