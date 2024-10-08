import AddBudgetsButton from "@/components/AddBudgetsButton";
import BudgetCard from "@/components/BudgetCard";
import BudgetSummary from "@/components/BudgetSummary";
import PageTitle from "@/components/PageTitle";
import { getUserBudgets } from "@/lib/db/queries";
import * as React from "react";

interface BudgetsPageProps {}

const BudgetsPage: React.FC<BudgetsPageProps> = async ({}) => {
  const budgets = await getUserBudgets();

  return (
    <div className="flex flex-col ">
      <div className="flex items-center justify-between">
        <PageTitle title="Budgets" />
        <AddBudgetsButton />
      </div>

      <section className="mt-10 flex flex-row gap-6">
        <BudgetSummary />
        {/* <BudgetCard /> */}
        <div className="flex flex-col gap-6 w-full">
          {budgets?.map(budget => (
            <React.Suspense fallback={<div>Loading...</div>} key={budget.id}>
              <BudgetCard budget={budget} />
            </React.Suspense>
          ))}
        </div>
      </section>
    </div>
  );
};

export default BudgetsPage;
