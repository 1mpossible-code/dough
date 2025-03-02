"use client";

import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import axios from "axios";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export function MonthlyBarChart() {
  const [chartData, setChartData] = useState([]);
  const colors = [
    "#ff5733",
    "#33ff57",
    "#3357ff",
    "#ff33a1",
    "#facc15",
    "#22c55e",
    "#ff914d",
    "#ff33ff",
    "#00ffff",
    "#ff4500",
  ];

  useEffect(() => {
    axios
      .get("http://172.16.130.45:3000/api/v1/reports?period=monthly")
      .then((response) => {
        if (response.data && response.data.report) {
          const sortedData = response.data.report.sort(
            (a: any, b: any) =>
              new Date(b.month).getTime() - new Date(a.month).getTime()
          );
          const formattedData = sortedData
            .slice(0, 6) // Get last 6 months in correct order
            .map((item: any, index: number) => ({
              month: item.month,
              totalExpenses: item.totalExpenses,
              fill: colors[index % colors.length],
            }))
            .reverse(); // Ensure chronological order from most recent to past

          setChartData(formattedData);
        }
      })
      .catch((error) => console.error("Error fetching monthly data:", error));
  }, []);

  const chartConfig: ChartConfig = {
    totalExpenses: {
      label: "Total Expenses",
      color: "hsl(var(--chart-1))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Expenses</CardTitle>
        <CardDescription>
          Showing expenses for the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 50, bottom: 20 }}
            barGap={8} // Adjust bar spacing
            barCategoryGap={15} // Adjust space between groups
          >
            <YAxis
              dataKey="month"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
            />
            <XAxis dataKey="totalExpenses" type="number" hide />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="totalExpenses" layout="vertical" radius={5} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Data-Driven Insights <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Bar graphs provide a clear visual representation of spending trends,
          allowing for easy comparison across months. This helps identify
          patterns, track financial progress, and make informed budgeting
          decisions.
        </div>
      </CardFooter>
    </Card>
  );
}
