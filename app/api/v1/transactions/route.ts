import { NextResponse } from "next/server";
import db from "../../../../lib/db";
import { Transaction } from "../../../../types";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const type = searchParams.get("type"); // DEBIT or CREDIT
    const details = searchParams.get("details"); // Debit or Credit
    const category = searchParams.get("category");
    let query = "SELECT * FROM transactions WHERE 1=1";
    const params: (string | number)[] = [];

    if (startDate) {
      query += " AND DATE(postingDate) >= DATE(?)";
      params.push(startDate);
    }
    if (endDate) {
      query += " AND DATE(postingDate) <= DATE(?)";
      params.push(endDate);
    }
    if (type) {
      query += " AND type = ?";
      params.push(type);
    }
    if (details) {
      query += " AND details = ?";
      params.push(details);
    }
    if (category) {
      query += " AND category = ?";
      params.push(category);
    }

    const stmt = db.prepare(query);
    const transactions: Transaction[] = stmt.all(...params);

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
