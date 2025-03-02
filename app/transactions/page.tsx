"use client";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { useEffect, useState } from "react";
import axiosInstance from "@/utils/axiosInstance";


export default function Transactions() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("/api/v1/transactions")
      .then((response) => {
        if (response.data && response.data.transactions) {
          setTransactions(response.data.transactions);
        }
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  }, []);

  return (
    <div className="mt-50">
      <DataTable columns={columns} data={transactions} />
    </div>
  );
}
