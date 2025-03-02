"use client";
import { CardStack } from "@/components/ui/card-stack";
import { cn } from "@/lib/utils";

export default function Recommendations() {
  return (
    <>
    <div className="h-[40rem] flex items-center justify-center w-full">
      <CardStack items={CARDS} />
    </div>
    </>
  );
}

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-700/[0.2] dark:text-emerald-500 px-1 py-0.5",
        className
      )}
    >
      {children}
    </span>
  );
};

const CARDS = [
  {
    id: 0,
    name: "Smart Budgeting",
    designation: "Expense Optimization",
    content: (
      <p>
        Your total expenses are <Highlight>higher than your income</Highlight>,
        leading to negative savings. Consider using the{" "}
        <Highlight>50/30/20 budgeting rule</Highlight>—50% needs, 30% wants, and
        20% savings—to stabilize your finances.
      </p>
    ),
  },
  {
    id: 1,
    name: "Cut Unnecessary Spending",
    designation: "Expense Reduction Strategy",
    content: (
      <p>
        Your <Highlight>savings rate is negative (-1.07%)</Highlight>. Identify
        areas where you can cut costs, such as <Highlight>subscriptions, dining
        out, or impulse purchases</Highlight>. Redirect these funds toward an
        emergency fund or investments.
      </p>
    ),
  },
  {
    id: 2,
    name: "Increase Your Income",
    designation: "Income Growth Strategy",
    content: (
      <p>
        With <Highlight>total income of $132,719</Highlight> and expenses
        exceeding that, boosting income is crucial. Consider{" "}
        <Highlight>negotiating a raise, freelancing, or passive income</Highlight>{" "}
        streams to balance your cash flow.
      </p>
    ),
  },
  {
    id: 3,
    name: "Build an Emergency Fund",
    designation: "Financial Safety Net",
    content: (
      <p>
        Since you're currently <Highlight>spending more than you earn</Highlight>,
        building an emergency fund is vital. Start with{" "}
        <Highlight>3-6 months' worth of expenses</Highlight> in a high-yield
        savings account to avoid future financial stress.
      </p>
    ),
  },
  {
    id: 4,
    name: "Investment Planning",
    designation: "Long-term Wealth Building",
    content: (
      <p>
        Once you stabilize your budget, consider <Highlight>low-cost index
        funds, real estate, or high-yield savings</Highlight> to grow your wealth.
        Even small investments today can <Highlight>compound over time</Highlight>.
      </p>
    ),
  },
];