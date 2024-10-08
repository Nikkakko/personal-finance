import AddBudgetsButton from "@/components/AddBudgetsButton";
import BudgetCard from "@/components/BudgetCard";
import BudgetSummary from "@/components/BudgetSummary";
import PageTitle from "@/components/PageTitle";
import { getUserBudgets } from "@/lib/db/queries";
import { BudgetWithUser } from "@/types";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import * as React from "react";

interface BudgetsPageProps {}
export const metadata: Metadata = {
  title: "Manage your budgets",
  description: "Create and manage your budgets",
};

const BudgetsPage: React.FC<BudgetsPageProps> = async ({}) => {
  const budgets = (await getUserBudgets()) as BudgetWithUser[];

  if (!budgets) return notFound();

  return (
    <div className="flex flex-col ">
      <div className="flex items-center justify-between">
        <PageTitle title="Budgets" />
        <AddBudgetsButton />
      </div>

      {budgets.length === 0 ? (
        <div className="text-center mt-10">
          <h1 className="text-2xl font-bold">No budgets yet</h1>
          <p className="text-gray-500 mt-2">
            You can create a budget by clicking the button above
          </p>
        </div>
      ) : (
        <section className="mt-10 flex  flex-col lg:flex-row gap-6">
          <BudgetSummary budgets={budgets} />
          {/* <BudgetCard /> */}
          <div className="flex flex-col gap-6 w-full">
            {budgets?.map(budget => (
              <React.Suspense fallback={<div>Loading...</div>} key={budget.id}>
                <BudgetCard budget={budget} />
              </React.Suspense>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default BudgetsPage;
