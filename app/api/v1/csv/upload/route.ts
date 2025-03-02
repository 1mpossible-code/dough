import { NextResponse } from "next/server";
import db from "../../../../../lib/db";
import { parse } from "csv-parse/sync";
import { Details, Record, Transaction } from "../../../../../types";


export async function POST(req: Request) {
  try {
    // Extract the form data from the request.
    const formData = await req.formData();
    const file: FormDataEntryValue | null = formData.get("file");
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Read the CSV file as text.
    const csvData: string = await file.text();

    // Parse CSV data.
    const records: Array<Record> = parse(csvData, {
      columns: true,
      skip_empty_lines: true,
      relax_column_count: true,
      trim: true,
    });

    // console.log(records);

    // Convert records to transactions.
    console.log(records[0]);
    const transactions: Array<Transaction> = records.map((record) => ({
      details:
        record.Details.toLowerCase() == "credit"
          ? Details.Credit
          : Details.Debit,
      postingDate: record["Posting Date"],
      description: record.Description,
      amount: Math.abs(parseInt(record.Amount)),
      type: record.Type,
      balance: parseFloat(record.Balance),
    }));

    // Insert transactions into the database.
    const insertStmt = db.prepare(`
      INSERT OR IGNORE INTO transactions (details, postingDate, description, amount, type, balance)
      VALUES (?, DATE(?), ?, ?, ?, ?)
    `);
    const insertMany = db.transaction((transactions: Transaction[]) => {
      for (const tx of transactions) {
        insertStmt.run(
          tx.details,
          new Date(tx.postingDate).toISOString(),
          tx.description,
          tx.amount,
          tx.type,
          tx.balance
                );
      }
    });
    insertMany(transactions);

    return NextResponse.json({
      message: "CSV file processed successfully",
      count: transactions.length,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to process CSV file" },
      { status: 500 }
    );
  }
}