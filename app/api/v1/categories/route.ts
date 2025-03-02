import { NextResponse } from 'next/server';
import db from '../../../../lib/db';

export async function GET(req: Request) {
  try {
    const stmt = db.prepare(`SELECT DISTINCT category FROM transactions WHERE category IS NOT NULL`);
    const categories = stmt.all();

    const categoryList = categories.map((row: { category: string }) => row.category);

    return NextResponse.json({ categories: categoryList });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}