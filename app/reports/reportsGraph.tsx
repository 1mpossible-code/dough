"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

export default function ReportsGraph() {
  const [chartData, setChartData] = useState([]);
  const [timeRange, setTimeRange] = useState("yearly");

  useEffect(() => {
    axios
      .get(`http://172.16.130.45:3000/api/v1/reports?period=${timeRange}`)
      .then((response) => {
        if (response.data && response.data.report) {
          setChartData(response.data.report);
        }
      })
      .catch((error) => console.error("Error fetching reports:", error));
  }, [timeRange]);

  const chartConfig = {
    totalIncome: {
      label: "Total Income",
      color: "#22c55e",
    },
    totalExpenses: {
      label: "Total Expenses",
      color: "#ef4444",
    },
    transactionCount: {
      label: "Transaction Count",
      color: "#facc15",
    },
  };

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div>
          <CardTitle>Financial Overview</CardTitle>
          <CardDescription>
            Switch between Monthly and Yearly Data
          </CardDescription>
        </div>
        <Tabs value={timeRange} onValueChange={setTimeRange} className="">
          <TabsList className="flex space-x-2">
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <AreaChart data={chartData} width={600} height={300}>
            <XAxis dataKey={timeRange === "year" ? "year" : "month"} />
            <CartesianGrid vertical={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Area dataKey="totalIncome" fill="green" stroke="green" />
            <Area dataKey="totalExpenses" fill="red" stroke="red" />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
