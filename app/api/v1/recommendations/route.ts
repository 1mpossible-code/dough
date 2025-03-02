import { NextResponse } from "next/server";
import db from "../../../../lib/db";
import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic();

export async function GET() {
  try {
    const incomeStmt = db.prepare(`
      SELECT SUM(amount) as totalIncome 
      FROM transactions 
      WHERE details = 'Credit' AND postingDate >= DATE('now', '-3 months')
    `);
    const incomeResult = incomeStmt.get();

    const expenseStmt = db.prepare(`
      SELECT SUM(amount) as totalExpenses 
      FROM transactions 
      WHERE details = 'Debit' AND postingDate >= DATE('now', '-3 months')
    `);
    const expenseResult = expenseStmt.get();

    const totalIncome = incomeResult?.totalIncome || 0;
    const totalExpenses = expenseResult?.totalExpenses || 0;
    const netSavings = totalIncome - totalExpenses;
    const savingsRate = totalIncome ? ((netSavings / totalIncome) * 100).toFixed(2) + "%" : "0%";

    const categoryStmt = db.prepare(`
      SELECT category, SUM(amount) as totalSpent
      FROM transactions
      WHERE details = 'Debit' AND postingDate >= DATE('now', '-3 months')
      GROUP BY category
      ORDER BY totalSpent DESC
      LIMIT 3
    `);
    const topCategories = categoryStmt.all();

    const userMetrics = {
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      topSpendingCategories: topCategories.map((cat) => ({
        category: cat.category,
        totalSpent: cat.totalSpent,
      })),
    };

    const promptText = `
      Based on the following financial data, generate **personalized financial recommendations** to help the user improve their financial health:
      
      - **Total Income:** $${totalIncome.toLocaleString()}
      - **Total Expenses:** $${totalExpenses.toLocaleString()}
      - **Net Savings:** $${netSavings.toLocaleString()} (${savingsRate})
      - **Top Spending Categories:** ${topCategories.map((cat) => `${cat.category} ($${cat.totalSpent.toLocaleString()})`).join(", ")}

      Provide **actionable insights** that the user can apply immediately to improve their savings, budgeting, and financial well-being.
      
      Format your response as a JSON list with this structure:
      \`\`\`json
      [
        {
          "title": "Recommendation Title",
          "description": "Short explanation of the recommendation."
        }
      ]
      \`\`\`
      Return **only** the JSON output and nothing else.
    `;

    const aiResponse = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 2048,
      temperature: 1,
      system: "You are a financial expert providing personalized financial advice.",
      messages: [
        {
          role: "user",
          content: [{ type: "text", text: promptText }],
        },
      ],
    });

    const aiGeneratedRecommendations = JSON.parse(aiResponse.content[0].text);

    return NextResponse.json({
      totalIncome,
      totalExpenses,
      netSavings,
      savingsRate,
      recommendations: aiGeneratedRecommendations,
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 });
  }
}