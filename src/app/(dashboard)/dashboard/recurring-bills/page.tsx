import PageTitle from "@/components/PageTitle";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRecurringBills } from "@/lib/db/queries";
import { formatCurrency } from "@/lib/utils";
import { FileTextIcon } from "lucide-react";
import { notFound } from "next/navigation";
import * as React from "react";

interface RecurringBillsProps {}

const RecurringBills: React.FC<RecurringBillsProps> = async ({}) => {
  const bills = await getRecurringBills();

  if (!bills) return notFound();

  const totalBills = bills.reduce((acc, bill) => acc + bill.amount, 0);

  //dueDate = bill.dat - 1 month

  // paid bills length + total, total upcomming length + total, due soon length + total
  const paidBills = bills.filter(bill => bill.paid);
  const totalPaidBills = paidBills.reduce((acc, bill) => acc + bill.amount, 0);

  const upcommingBills = bills.filter(bill => !bill.paid);
  const totalUpcommingBills = upcommingBills.reduce(
    (acc, bill) => acc + bill.amount,
    0
  );

  const dueSoonBills = upcommingBills.filter(
    bill => new Date(bill.dueDate).getTime() < Date.now()
  );
  const totalDueSoonBills = dueSoonBills.reduce(
    (acc, bill) => acc + bill.amount,
    0
  );

  const summeryList = [
    {
      title: "Paid Bills",
      count: paidBills.length,
      total: totalPaidBills,
    },
    {
      title: "Total Upcomming ",
      count: upcommingBills.length,
      total: totalUpcommingBills,
    },
    {
      title: "Due Soon",
      count: dueSoonBills.length,
      total: totalDueSoonBills,
    },
  ];

  return (
    <div className="flex flex-col ">
      <PageTitle title="Recurring Bills" />

      <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 ">
        <div className="flex flex-col gap-5 w-full max-w-sm">
          <div className="flex flex-col  p-6 bg-primary rounded-lg ">
            <FileTextIcon className="w-10 h-10 text-white" />

            <div className="flex flex-col gap-1 mt-5">
              <h3 className="text-white text-base">Total Bills</h3>
              <p className="text-white text-3xl font-bold">
                {formatCurrency(totalBills, {
                  currency: "USD",
                  style: "currency",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
            </div>
          </div>

          {/* bills summary */}
          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                {summeryList.map(({ title, count, total }) => (
                  <div key={title} className="flex justify-between">
                    <CardDescription>{title}</CardDescription>
                    <CardDescription>
                      {count} (
                      {formatCurrency(total, {
                        currency: "USD",
                        style: "currency",
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                      })}
                      )
                    </CardDescription>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </div>
        <div>table</div>
      </section>
    </div>
  );
};

export default RecurringBills;
