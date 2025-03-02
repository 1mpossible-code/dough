"use client";

import React, { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Metrics() {
  const [metrics, setMetrics] = useState<{
    totalIncome: number | null;
    totalExpenses: number | null;
    netSavings: number | null;
    savingsRate: string | null;
  }>({
    totalIncome: null,
    totalExpenses: null,
    netSavings: null,
    savingsRate: null,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 3);
    axiosInstance
      .get("/api/v1/metrics?startDate=" + startDate.toISOString())
      .then((response) => {
        setMetrics(response.data);
      })
      .catch((error) => {
        console.error("Error fetching metrics:", error);
        setError("Failed to load financial data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <CardContainer className="inter-var mt-50">
      <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-pink-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
        <CardItem
          translateZ="50"
          className="text-2xl font-bold text-neutral-600 dark:text-white text-center"
        >
          💰 Your Financial Overview
        </CardItem>

        {error && (
          <Alert className="bg-red-500 text-white mt-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-2 gap-4 mt-4">
          <CardItem translateZ="40" className="text-neutral-500 text-sm dark:text-neutral-300">
            <p className="font-semibold">Total Income</p>
            {loading ? (
              <Skeleton className="h-6 w-24 bg-gray-800" />
            ) : (
              <p className="text-lg font-bold text-green-400">
                ${metrics.totalIncome?.toLocaleString() ?? "0"}
              </p>
            )}
          </CardItem>

          <CardItem translateZ="40" className="text-neutral-500 text-sm dark:text-neutral-300">
            <p className="font-semibold">Total Expenses</p>
            {loading ? (
              <Skeleton className="h-6 w-24 bg-gray-800" />
            ) : (
              <p className="text-lg font-bold text-red-400">
                ${metrics.totalExpenses?.toLocaleString() ?? "0"}
              </p>
            )}
          </CardItem>

          <CardItem translateZ="40" className="text-neutral-500 text-sm dark:text-neutral-300">
            <p className="font-semibold">Net Savings</p>
            {loading ? (
              <Skeleton className="h-6 w-24 bg-gray-800" />
            ) : (
              <p
                className={`text-lg font-bold ${
                  metrics.netSavings && metrics.netSavings >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                ${metrics.netSavings?.toLocaleString() ?? "0"}
              </p>
            )}
          </CardItem>

          <CardItem translateZ="40" className="text-neutral-500 text-sm dark:text-neutral-300">
            <p className="font-semibold">Savings Rate</p>
            {loading ? (
              <Skeleton className="h-6 w-16 bg-gray-800" />
            ) : (
              <p
                className={`text-lg font-bold ${
                  metrics.savingsRate && parseFloat(metrics.savingsRate) >= 0
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                {metrics.savingsRate ?? "0%"}
              </p>
            )}
          </CardItem>
        </div>

        <CardItem translateZ="30" className="mt-6 text-center text-sm text-gray-500 dark:text-neutral-400">
            This is your financial overview for the last 3 months. Keep up the good work!
        </CardItem>
      </CardBody>
    </CardContainer>
  );
}