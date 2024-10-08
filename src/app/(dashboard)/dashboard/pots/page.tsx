import AddPotsButton from "@/components/AddPotsButton";
import PageTitle from "@/components/PageTitle";
import PotCard from "@/components/PotCard";
import { getUserPots } from "@/lib/db/queries";
import * as React from "react";

interface PotsPageProps {}

const PotsPage: React.FC<PotsPageProps> = async ({}) => {
  const pots = await getUserPots();
  return (
    <div className="flex flex-col ">
      <div className="flex items-center justify-between">
        <PageTitle title="Budgets" />
        <AddPotsButton />
      </div>

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pots?.map(pot => (
          <PotCard pot={pot} key={pot.id} />
        ))}
      </section>
    </div>
  );
};

export default PotsPage;
