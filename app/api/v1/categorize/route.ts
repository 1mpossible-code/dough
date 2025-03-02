import { NextResponse } from 'next/server';
import db from '../../../../lib/db';
import { Transaction } from '../../../../types';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic();

export async function POST() {
  try {
    // Get transactions with NULL category for last month
    const stmt = db.prepare(`SELECT id, description FROM transactions WHERE category IS NULL OR category = '' and postingDate >= DATE('now', '-1 month') LIMIT 100`);
    const transactionsToCategorize = stmt.all();

    if (transactionsToCategorize.length === 0) {
      return NextResponse.json({ message: 'No transactions need categorization.' });
    }


    const stringifiedTransactions = JSON.stringify(transactionsToCategorize);


    const msg = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 2048,
        temperature: 1,
        system: "Categorize these transactions into categories like \"Groceries\", \"Rent\", \"Salary\", \"Utilities\", \"Entertainment\", etc.",
        messages: [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": `${
                    transactionsToCategorize.length
                    } transactions need categorization. Here are the descriptions:\n\n${
                        stringifiedTransactions
                }\nReturn a JSON array of categories in the same order with the same id. Your response will be parsed automatically. Please output JSON list and nothing else.`
              }
            ]
          }
        ]
      });
      console.log(msg);

    // Parse AI response
    const categories: string[] = JSON.parse(msg.content[0].text);

    if (!Array.isArray(categories) || categories.length !== transactionsToCategorize.length) {
      throw new Error("Invalid AI response format.");
    }

    console.log(categories)

    // 🔄 Update transactions with new categories
    const updateStmt = db.prepare(`UPDATE transactions SET category = ? WHERE id = ?`);
    const updateMany = db.transaction(() => {
      categories.forEach((category) => {
        updateStmt.run(category.category, category.id);
      });
    });

    updateMany(transactionsToCategorize);

    return NextResponse.json({
      message: 'Categorization completed successfully.',
      categorized: transactionsToCategorize.length,
    });
  } catch (error) {
    console.error('Error categorizing transactions:', error);
    return NextResponse.json({ error: 'Failed to categorize transactions' }, { status: 500 });
  }
}