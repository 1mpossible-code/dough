import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

function predictExpenses(expenses: { month: string; totalExpenses: number }[]) {
  const futureMonths = 6;
  const predictions: { month: string; predictedExpenses: number }[] = [];

  if (expenses.length < 2) {
    return predictions;
  }

  const x = expenses.map((_, index) => index);
  const y = expenses.map((data) => data.totalExpenses);

  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0);
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  for (let i = 1; i <= futureMonths; i++) {
    const nextMonthIndex = x.length + i;
    const predictedValue = slope * nextMonthIndex + intercept;
    
    const futureDate = new Date();
    futureDate.setMonth(futureDate.getMonth() + i);
    const formattedMonth = futureDate.toISOString().slice(0, 7); // YYYY-MM format

    predictions.push({ month: formattedMonth, predictedExpenses: predictedValue });
  }

  return predictions;
}

export async function GET() {
  try {
    const stmt = db.prepare(`
      SELECT strftime('%Y-%m', postingDate) as month, 
             ABS(SUM(CASE WHEN details = 'Debit' THEN amount ELSE 0 END)) as totalExpenses
      FROM transactions
      GROUP BY month
      ORDER BY month ASC
    `);
    const expenses = stmt.all();

    const predictions = predictExpenses(expenses);

    return NextResponse.json({ actual: expenses, predicted: predictions });
  } catch (error) {
    console.error('Error fetching predictions:', error);
    return NextResponse.json({ error: 'Failed to fetch predictions' }, { status: 500 });
  }
}