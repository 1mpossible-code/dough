"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from '../../../../types';
import { ArrowUpDown } from "lucide-react";
import {Button} from '@/components/ui/button'


// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "postingDate",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "details",
    header: "Details",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "amount",
    header: "Amount($)",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
];
