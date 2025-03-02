import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || 'monthly';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    let dateFilter = '';
    const params: string[] = [];
    if (startDate) {
      dateFilter += ' AND DATE(postingDate) >= DATE(?)';
      params.push(startDate);
    }
    if (endDate) {
      dateFilter += ' AND DATE(postingDate) <= DATE(?)';
      params.push(endDate);
    }

    let report = [];

    if (period === 'monthly') {
      const stmt = db.prepare(`
        SELECT strftime('%Y-%m', postingDate) as month,
               SUM(CASE WHEN details = 'Credit' THEN amount ELSE 0 END) as totalIncome,
               SUM(CASE WHEN details = 'Debit' THEN amount ELSE 0 END) as totalExpenses,
               COUNT(*) as transactionCount
        FROM transactions
        WHERE 1=1 ${dateFilter}
        GROUP BY month
        ORDER BY month DESC
      `);
      report = stmt.all(...params);
    } else if (period === 'yearly') {
      const stmt = db.prepare(`
        SELECT strftime('%Y', postingDate) as year,
               SUM(CASE WHEN details = 'Credit' THEN amount ELSE 0 END) as totalIncome,
               SUM(CASE WHEN details = 'Debit' THEN amount ELSE 0 END) as totalExpenses,
               COUNT(*) as transactionCount
        FROM transactions
        WHERE 1=1 ${dateFilter}
        GROUP BY year
        ORDER BY year DESC
      `);
      report = stmt.all(...params);
    } else {
      return NextResponse.json({ error: 'Invalid period. Use "monthly" or "yearly".' }, { status: 400 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to generate report' }, { status: 500 });
  }
}