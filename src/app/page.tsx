import DealProvider from "@/components/deal-provider";
import SummaryCards from "@/components/summary-cards";
import PipelineBar from "@/components/pipeline-bar";
import DealTable from "@/components/deal-table";

export default function Home() {
  return (
    <DealProvider>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              SalesHub
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              営業案件ダッシュボード
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-medium text-white">
              Y
            </div>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-6">
          <SummaryCards />
        </section>

        {/* Pipeline */}
        <section className="mb-6">
          <PipelineBar />
        </section>

        {/* Deal List */}
        <section>
          <DealTable />
        </section>
      </div>
    </DealProvider>
  );
}
