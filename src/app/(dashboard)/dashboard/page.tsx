import { auth, signOut } from "@/auth";
import AddBalanceButton from "@/components/AddBalanceButton";
import PersonalFinanceCard from "@/components/PersonalFinanceCard";
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
    <div className="flex flex-col ">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-primary">Overview</h1>
        {/* add your balance */}
        <AddBalanceButton
          userBalance={dbUser?.balances[0]}
          userEmail={session?.user.email}
        />
      </div>

      {/* current,balance, income, expenses */}
      <React.Suspense
        fallback={
          <div className="flex justify-center items-center h-96">
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        }
      >
        <section className="mt-6">
          <PersonalFinanceCard userBalance={dbUser?.balances[0]} />
        </section>
      </React.Suspense>
    </div>
  );
};

export default DashboardPage;
