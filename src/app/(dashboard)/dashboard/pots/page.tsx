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
        <PageTitle title="Pots" />
        <AddPotsButton />
      </div>

      {pots?.length === 0 && (
        <div className="mt-8 text-center">
          <h2 className="text-lg font-bold">No pots found</h2>
          <p className="mt-2">
            Create a new pot to start saving for your goals.
          </p>
        </div>
      )}

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {pots?.map(pot => (
          <PotCard pot={pot} key={pot.id} />
        ))}
      </section>
    </div>
  );
};

export default PotsPage;
