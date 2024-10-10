"use client";
import { cn, formatCurrency } from "@/lib/utils";
import { Pot } from "@prisma/client";
import { ChevronRightIcon, DollarSignIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { Icons } from "./Icons";
import ColorLine from "./ColorLine";
import HeadingTitle from "./heading-title";

interface PotsProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Pot[] | undefined;
}

const Pots: React.FC<PotsProps> = ({ data, ...props }) => {
  const totalSaved = data?.reduce((acc, pot) => acc + pot.total, 0);

  return (
    <div
      className={cn(
        props.className,
        "flex flex-col p-5 bg-white rounded shadow-sm"
      )}
    >
      <HeadingTitle
        title="Pots"
        href="/dashboard/pots"
        hrefText="See Details"
      />

      <div className="flex mt-5 gap-5 flex-col xl:flex-row items-start xl:justify-between justify-center">
        <div className="bg-theme-background py-5 px-4 flex items-center gap-2 rounded-lg">
          <Icons.dollar />
          <div className="flex flex-col gap-2">
            <h3 className="text-theme-navy text-base">Total Saved</h3>
            <p className="text-theme-navy text-3xl font-bold">
              {formatCurrency(totalSaved, {
                currency: "USD",
                style: "currency",
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* pot summary */}
        <div className="grid grid-cols-2 lg:grid-cols-2 gap-2">
          {data
            ?.map(
              pot =>
                pot.total > 0 && (
                  <div className="flex items-center gap-2" key={pot.id}>
                    <ColorLine color={pot.theme} className="h-10" />
                    <div className="flex flex-col">
                      <p className="text-sm font-semibold text-muted-foreground capitalize">
                        {pot.name}
                      </p>
                      <p className={cn("text-base font-bold")}>
                        {formatCurrency(pot.total, {
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0,
                          currency: "USD",
                          style: "currency",
                        })}
                      </p>
                    </div>
                  </div>
                )
            )
            .slice(0, 4)}
        </div>
      </div>
    </div>
  );
};

export default Pots;
