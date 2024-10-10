import AddRecurringBillButton from "@/components/AddRecurringBillButton";
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
import { cn, formatCurrency } from "@/lib/utils";
import { FileTextIcon } from "lucide-react";
import { notFound } from "next/navigation";
import * as React from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";

interface RecurringBillsProps {}

const RecurringBills: React.FC<RecurringBillsProps> = async ({}) => {
  const bills = await getRecurringBills();

  if (!bills) return notFound();

  const totalBills = bills.reduce((acc, bill) => acc + bill.amount, 0);

  // paid bills length + total, total upcomming length + total, due soon length + total
  const paidBills = bills.filter(bill => bill.isPaid);
  const totalPaidBills = paidBills.reduce((acc, bill) => acc + bill.amount, 0);

  const upcomingBills = bills.filter(bill => !bill.isPaid);
  const totalUpcommingBills = upcomingBills.reduce(
    (acc, bill) => acc + bill.amount,
    0
  );

  // Calculate the time range for due soon bills (1-2 days from now)
  const now = Date.now();
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const startDueSoon = now;
  const endDueSoon = now + 2 * oneDayInMs;

  const dueSoonBills = upcomingBills.filter(bill => {
    const dueDate = new Date(bill.dueDate).getTime();
    return dueDate >= startDueSoon && dueDate <= endDueSoon;
  });
  const totalDueSoonBills = dueSoonBills.reduce(
    (acc, bill) => acc + bill.amount,
    0
  );

  const summeryList = [
    {
      id: "1",
      title: "Paid Bills",
      count: paidBills.length,
      total: totalPaidBills,
    },
    {
      id: "2",
      title: "Total Upcoming ",
      count: upcomingBills.length,
      total: totalUpcommingBills,
    },
    {
      id: "3",
      title: "Due Soon",
      count: dueSoonBills.length,
      total: totalDueSoonBills,
    },
  ];

  return (
    <div className="flex flex-col ">
      <div className="flex items-center justify-between w-full">
        <PageTitle title="Recurring Bills" />
        <AddRecurringBillButton />
      </div>

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
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
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
                {summeryList.map(({ title, count, total, id }) => (
                  <div key={title} className="flex justify-between">
                    <CardDescription
                      className={cn(id === "3" && "text-destructive")}
                    >
                      {title}
                    </CardDescription>
                    <CardDescription
                      className={cn(
                        "font-bold",
                        id === "3" && "text-destructive"
                      )}
                    >
                      {count} (
                      {formatCurrency(total, {
                        currency: "USD",
                        style: "currency",
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
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
        {/* bill title, due date, amount */}
        <section className="bg-white shadow-sm p-5 rounded-lg w-full">
          <DataTable columns={columns} data={bills} />
        </section>
      </section>
    </div>
  );
};

export default RecurringBills;
