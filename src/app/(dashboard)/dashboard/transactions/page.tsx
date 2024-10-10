import PageTitle from "@/components/PageTitle";
import * as React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getUserFromDb } from "@/lib/db/queries";
import { auth } from "@/auth";
import { notFound } from "next/navigation";

interface TransactionsPageProps {
  params: string;
  searchParams: { [key: string]: string | string[] | undefined };
}

const TransactionsPage: React.FC<TransactionsPageProps> = async ({
  params,
  searchParams,
}) => {
  const session = await auth();

  const data = await getUserFromDb(session?.user.email);

  if (!data?.transactions) return notFound();

  return (
    <div className="flex flex-col ">
      <PageTitle title="Transactions" />
      <section className="mt-6 shadow-sm bg-white rounded p-8">
        <React.Suspense fallback={<div>Loading...</div>}>
          <DataTable columns={columns} data={data?.transactions} />
        </React.Suspense>
      </section>
    </div>
  );
};

export default TransactionsPage;
