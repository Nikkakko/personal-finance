import { auth, signOut } from "@/auth";
import AddBalanceButton from "@/components/AddTransaction";
import Budgets from "@/components/Budgets";
import PageTitle from "@/components/PageTitle";
import PersonalFinanceCard from "@/components/PersonalFinanceCard";
import Pots from "@/components/Pots";
import RecurringBills from "@/components/RecurringBills";
import Transactions from "@/components/Transactions";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserFromDb } from "@/lib/db/queries";

import * as React from "react";

interface DashboardPageProps {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

const DashboardPage: React.FC<DashboardPageProps> = async ({
  params,
  searchParams,
}) => {
  const session = await auth();

  //get userBalance
  const dbUser = await getUserFromDb(session?.user.email);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between">
        <PageTitle title="Overview" />
        {/* add your balance */}
        <AddBalanceButton />
      </div>

      <React.Suspense
        fallback={
          <div className="flex items-center gap-6 mt-6 ">
            <Skeleton className="w-full h-40" />
            <Skeleton className="w-full h-40" />
            <Skeleton className="w-full h-40" />
          </div>
        }
      >
        <section className="mt-6">
          <PersonalFinanceCard userBalance={dbUser?.balance} />
        </section>
      </React.Suspense>

      <section className="grid grid-cols-5 grid-rows-7 gap-4 mt-8">
        <Pots className="col-span-3 row-span-2" />
        <Transactions className="col-span-3 row-span-5 col-start-1 row-start-3" />
        <Budgets className="col-span-2 row-span-4 col-start-4 row-start-1" />
        <RecurringBills className="col-span-2 row-span-3 col-start-4 row-start-5" />
      </section>
    </div>
  );
};

export default DashboardPage;
