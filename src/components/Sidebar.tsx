"use client";
import * as React from "react";
import { Icons } from "./Icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

import {
  ArrowLeftFromLine,
  ArrowRightFromLine,
  ArrowUpDownIcon,
  ChartPieIcon,
  FileTextIcon,
  HouseIcon,
  PiggyBankIcon,
} from "lucide-react";
import UserProfile from "./UserProfile";

interface SidebarProps {}

//sidebar items,overview,transactions,budgets,pots,recurring bills
const sidebarItems = [
  {
    id: "1",
    name: "Overview",
    href: "/dashboard",
    icon: HouseIcon,
  },
  {
    id: "2",
    name: "Transactions",
    href: "/dashboard/transactions",
    icon: ArrowUpDownIcon,
  },
  {
    id: "3",
    name: "Budgets",
    href: "/dashboard/budgets",
    icon: ChartPieIcon,
  },
  {
    id: "4",
    name: "Pots",
    href: "/dashboard/pots",
    icon: PiggyBankIcon,
  },
  {
    id: "5",
    name: "Recurring Bills",
    href: "/dashboard/recurring-bills",
    icon: FileTextIcon,
  },
];

const Sidebar: React.FC<SidebarProps> = ({}) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <aside
      className={cn(
        "max-w-[300px] bg-primary  flex-col py-10 transition-all hidden lg:flex w-full",
        isCollapsed ? "w-24" : "w-full"
      )}
    >
      <Link
        href="/"
        className={cn("px-8 py-4 ", isCollapsed && "mx-auto justify-center")}
      >
        {isCollapsed ? <Icons.logoSmall /> : <Icons.logoLarge />}
      </Link>

      <nav className="flex flex-col mt-10">
        {sidebarItems.map(item => {
          const isActive = pathname === item.href;

          return (
            <Link
              href={item.href}
              key={item.id}
              className={cn(
                "flex items-center gap-4 px-8 py-4 max-w-[276px]",
                isActive
                  ? "bg-secondary text-primary rounded-md"
                  : "text-secondary hover:text-secondary/80 hover:rounded-md transition-all",
                isCollapsed && " mx-auto"
              )}
            >
              {
                <item.icon
                  className={cn(
                    "w-6 h-6",
                    isActive ? "text-primary" : "text-secondary"
                  )}
                />
              }
              {!isCollapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* add minimize button */}
      <button
        className="mt-auto py-4 px-8 w-full group transition-all"
        type="button"
        onClick={() => setIsCollapsed(prev => !prev)}
      >
        <div className="flex items-center gap-4">
          {!isCollapsed ? (
            <>
              <ArrowLeftFromLine className="text-secondary group-hover:text-secondary/80" />
              <span className="text-secondary">Minimize Menu</span>
            </>
          ) : (
            <ArrowRightFromLine className="text-secondary group-hover:text-secondary/80" />
          )}
        </div>
      </button>

      <UserProfile isCollapsed={isCollapsed} />
    </aside>
  );
};

export default Sidebar;
