"use client";

import { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import axiosInstance from "@/utils/axiosInstance";
import { LampContainer } from "@/components/ui/lamp";
import { motion } from "framer-motion";

export default function PredictionsPage() {
  const [data, setData] = useState<{ month: string; actual: number | null; predicted: number | null }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [latestActual, setLatestActual] = useState<number | null>(null);
  const [percentageChange, setPercentageChange] = useState<number | null>(null);

  useEffect(() => {
    axiosInstance
      .get("/api/v1/predictions")
      .then((response) => {
        if (!response.data.actual || !response.data.predicted) {
          throw new Error("Invalid response format");
        }

        const actualData = response.data.actual.map((item: any) => ({
          month: item.month,
          actual: item.totalExpenses,
          predicted: null, // Placeholder for merging later
        }));

        const predictedData = response.data.predicted.map((item: any) => ({
          month: item.month,
          actual: null, // Placeholder since it's predicted
          predicted: item.predictedExpenses,
        }));

        // Merge actual and predicted data into one array
        const mergedData: { month: string; actual: number | null; predicted: number | null }[] = [];
        const allMonths = new Set([...actualData.map((d) => d.month), ...predictedData.map((d) => d.month)]);

        allMonths.forEach((month) => {
          const actualEntry = actualData.find((d) => d.month === month);
          const predictedEntry = predictedData.find((d) => d.month === month);

          mergedData.push({
            // slice first 5 symbols
            month: month.slice(2, 7),
            actual: actualEntry ? actualEntry.actual : null,
            predicted: predictedEntry ? Math.round(predictedEntry.predicted) : null,
          });
        });

        // Sort by month to ensure proper order in the graph
        mergedData.sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());

        setData(mergedData);

        // **Extract Last Two Actual Values for Calculation**
        const actualOnly = actualData.map((d) => d.actual).filter((v) => v !== null);

        if (actualOnly.length >= 2) {
          const latest = actualOnly[actualOnly.length - 1]; // Most recent actual
          const previous = actualOnly[actualOnly.length - 2]; // Second most recent actual
          setLatestActual(latest);

          const change = ((latest - previous) / previous) * 100;
          setPercentageChange(change);
        } else {
          setLatestActual(actualOnly.length > 0 ? actualOnly[0] : null);
          setPercentageChange(null);
        }
      })
      .catch((error) => {
        console.error("Error fetching predictions:", error);
        setError("Failed to load predictions. Please try again later.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <>
    <h1 className="mt-40 mb-5 text-5xl sm:text-6xl md:text-7xl font-extrabold text-white text-center leading-tight">This is your current and predicted expenses</h1>
    <Card className="bg-black text-white p-6 rounded-lg shadow-md mx-auto min-w-4xl max-w-6xl">
      <CardContent className="space-y-2">
        <p className="text-sm text-gray-400">Total Expenses</p>

        {loading ? (
          <Skeleton className="h-8 w-32 bg-gray-800" />
        ) : error ? (
          <Alert className="bg-red-500 text-white">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <h2 className="text-3xl font-bold">
            ${latestActual !== null ? latestActual.toLocaleString() : "0.00"}
          </h2>
        )}

        <p className="text-sm text-gray-500">
          {percentageChange !== null
            ? `${percentageChange.toFixed(1)}% from last month`
            : "No previous data available"}
        </p>

        <div className="w-full h-[150px]">
          {loading ? (
            <Skeleton className="h-full w-full bg-gray-800 rounded-lg" />
          ) : error ? (
            <Alert className="bg-red-500 text-white">
              <AlertDescription>Unable to display graph.</AlertDescription>
            </Alert>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <XAxis dataKey="month" stroke="gray" tick={{ fill: "white", fontSize: 12 }} />
                <YAxis hide />
                <Tooltip contentStyle={{ backgroundColor: "black", border: "none", color: "white" }} />
                {data.some((d) => d.actual !== null) && (
                  <Line type="monotone" dataKey="actual" stroke="white" strokeWidth={2} dot={{ fill: "white", r: 4 }} />
                )}
                {data.some((d) => d.predicted !== null) && (
                  <Line
                    type="monotone"
                    dataKey="predicted"
                    stroke="cyan"
                    strokeWidth={2}
                    strokeDasharray="4 4"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
    </>
  );
}