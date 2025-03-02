import { NextResponse } from 'next/server';
// import db from '../../../../lib/db';
import db from '../../../../lib/db';
import { Details } from '../../../../types';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let dateFilter = '';
    const params: string[] = [];
    if (startDate) {
      dateFilter += ' AND postingDate >= DATE(?)';
      params.push(new Date(startDate).toISOString());
    }
    if (endDate) {
      dateFilter += ' AND postingDate <= DATE(?)';
      params.push(new Date(endDate).toISOString());
    }

    // Total income (Credits)
    const incomeStmt = db.prepare(`
      SELECT SUM(amount) as totalIncome 
      FROM transactions 
      WHERE details = ? ${dateFilter} and details = 'Credit'
    `);
    const incomeResult = incomeStmt.get(Details.Credit, ...params);

    // Total expenses (Debits)
    const expenseStmt = db.prepare(`
      SELECT SUM(amount) as totalExpenses 
      FROM transactions 
      WHERE details = ? ${dateFilter} and details = 'Debit'
    `);
    const expenseResult = expenseStmt.get(Details.Debit, ...params);

    const totalIncome = incomeResult?.totalIncome || 0;
    const totalExpenses = expenseResult?.totalExpenses || 0;
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome ? (netSavings / totalIncome) * 100 : 0;

    return NextResponse.json({
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate: savingsRate.toFixed(2) + "%",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch metrics' }, { status: 500 });
  }
}