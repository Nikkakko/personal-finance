import { Budget, Transaction, User } from "@prisma/client";

export interface BudgetWithUser extends Budget {
  user: User & {
    transactions: Transaction[];
  };
}
