"use client";
import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { themeColorMap } from "@/lib/constants";
import { BudgetWithUser } from "@/types";
import { capitalize, cn, formatCurrency } from "@/lib/utils";
import ColorLine from "./ColorLine";
import Link from "next/link";
import HeadingTitle from "./heading-title";

interface BudgetSummaryProps {
  budgets: BudgetWithUser[] | null | undefined;
  overview?: boolean;
}

interface ChartDataItem {
  category: string;
  limit: number;
  spent: number;
  fill: string | undefined;
}

const BudgetSummary: React.FC<BudgetSummaryProps> = ({ budgets, overview }) => {
  const chartBudgetConfig = React.useMemo<ChartConfig | undefined>(() => {
    return budgets?.reduce<ChartConfig>((acc, budget) => {
      acc[budget.category] = {
        label: budget.category,
        color: themeColorMap[budget.theme],
      };
      return acc;
    }, {});
  }, [budgets]);

  const chartBudgetData = React.useMemo<ChartDataItem[] | undefined>(() => {
    return budgets?.map(budget => {
      const categorySpent = budget.user.transactions.reduce(
        (acc, transaction) => {
          return transaction.category === budget.category &&
            transaction.type === "EXPENSE"
            ? acc + transaction.amount
            : acc;
        },
        0
      );

      return {
        category: budget.category,
        spent: categorySpent,
        limit: budget.maximum,
        fill: chartBudgetConfig
          ? chartBudgetConfig[budget.category].color
          : undefined,
      };
    });
  }, [budgets, chartBudgetConfig]);

  const totalSpent = React.useMemo(() => {
    return chartBudgetData?.reduce((acc, curr) => acc + curr.spent, 0);
  }, [chartBudgetData]);

  const totalLimit = React.useMemo(() => {
    return chartBudgetData?.reduce((acc, curr) => acc + curr.limit, 0);
  }, [chartBudgetData]);

  return (
    <div className="w-full lg:max-w-xl">
      <Card className="flex flex-col">
        <CardContent className={cn("flex-1 p-0", overview && "p-5")}>
          {overview && (
            <HeadingTitle
              title="Budgets"
              href="/dashboard/budgets"
              hrefText="See Details"
            />
          )}
          <div
            className={cn(
              overview &&
                "flex flex-col xl:flex-row items-center justify-center h-full"
            )}
          >
            <ChartContainer
              config={chartBudgetConfig || {}}
              className={cn(
                "aspect-square max-h-[250px]",
                !overview && "mx-auto",
                overview && "items-start min-h-[250px] min-w-[250px]"
              )}
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartBudgetData}
                  dataKey="spent"
                  nameKey="category"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {formatCurrency(totalSpent, {
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0,
                                currency: "USD",
                                style: "currency",
                              })}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total Spent
                            </tspan>
                          </text>
                        );
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
            {overview && (
              <div className="grid grid-cols-2 lg:grid-cols-2 xl:grid-cols-1">
                {chartBudgetData
                  ?.map((item, index) => (
                    <div className="flex items-start  gap-2" key={index}>
                      <ColorLine color={item.fill} />
                      <div className="flex flex-col">
                        <p className="text-sm text-muted-foreground">
                          {capitalize(item.category)}
                        </p>
                        <p className="text-sm font-bold">
                          {formatCurrency(item.spent, {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                            currency: "USD",
                            style: "currency",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                  .slice(0, 4)}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex-col gap-2 text-sm"></CardFooter>
      </Card>

      {/* spending summary */}
      {!overview && (
        <Card className="flex flex-col mt-4">
          <CardHeader className="items-center pb-0">
            <CardTitle>Spending Summary</CardTitle>
            <CardDescription>Breakdown of your spending</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <div className="flex flex-col gap-4 py-6">
              {chartBudgetData?.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-2 items-center justify-between w-full "
                >
                  <div className="flex gap-1 items-center">
                    <ColorLine color={item.fill} />
                    <div className="flex flex-col">
                      <p className="text-sm text-muted-foreground">
                        {capitalize(item.category)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold">
                      {formatCurrency(item.spent, {
                        minimumFractionDigits: 0,
                        maximumFractionDigits: 0,
                        currency: "USD",
                        style: "currency",
                      })}
                    </p>
                    <p className="text-muted-foreground">/</p>
                    {formatCurrency(item.limit, {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                      currency: "USD",
                      style: "currency",
                    })}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2 text-sm">
            <div className="flex items-center gap-1">
              <div className="flex gap-2">
                <TrendingUp size={16} />
                <p className="text-muted-foreground">
                  {formatCurrency(totalLimit, {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                    currency: "USD",
                    style: "currency",
                  })}
                </p>
              </div>
              {""}

              <p className="text-muted-foreground">Total Limit</p>
            </div>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default BudgetSummary;
