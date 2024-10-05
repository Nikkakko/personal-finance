import { Balance } from "@prisma/client";
import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

interface PersonalFinanceCardProps {
  userBalance: Balance | undefined;
}

const PersonalFinanceCard: React.FC<PersonalFinanceCardProps> = ({
  userBalance,
}) => {
  const itemCards = [
    { title: "Current Balance", amount: userBalance?.current },
    { title: "Income", amount: userBalance?.income },
    { title: "Expenses", amount: userBalance?.expenses },
  ];

  return (
    <div className="flex items-center gap-6">
      {itemCards.map((item, index) => (
        <Card
          key={index}
          className={cn(
            "w-full",
            index === 0 ? "bg-primary text-secondary" : "bg-secondary"
          )}
        >
          <CardHeader>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription
              className={cn(
                index === 0 ? "text-secondary" : "text-primary",
                "text-2xl font-bold"
              )}
            >
              {formatCurrency(item.amount)}
            </CardDescription>
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PersonalFinanceCard;
