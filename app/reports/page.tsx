// app/reports/page.tsx
"use client";
import ReportsGraph from "./reportsGraph";
import {MonthlyBarChart} from "./reportBarGraph";

export default function ReportsPage() {
  return (
    <div className="p-16 mt-32 mx-auto h-full flex flex-col space-y-10">
        <h1 className="text-3xl font-bold text-center text-white mb-6">
          Financial Reports
        </h1>
      <div className="w-full mx-auto max-w-6xl space-y-12">
        <MonthlyBarChart />
        <ReportsGraph />
      </div>
    </div>
  );
}
