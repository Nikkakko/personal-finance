import { auth, signOut } from "@/auth";

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
  console.log(params, searchParams);

  return (
    <div className="flex flex-col ">
      <h1 className="text-3xl font-semibold text-primary">Overview</h1>

      {/* current,balance, income, expenses */}
    </div>
  );
};

export default DashboardPage;
