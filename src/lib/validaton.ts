import { Category, TransactionType } from "@prisma/client";
import { object, string } from "zod";
import * as z from "zod";

export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export const signUpSchema = object({
  name: string({ required_error: "Name is required" })
    .min(1, "Name is required")
    .max(32, "Name must be less than 32 characters"),
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

//export signUp type
export type SignUpType = z.infer<typeof signUpSchema>;

//export signIn type
export type SignInType = z.infer<typeof signInSchema>;

//add current balance, income, expenses
export const addTransactionSchema = z.object({
  amount: z.string().min(1, "Amount is required"),
  description: z.string().optional(),
  createdAt: z.date().optional(),
  isRecurring: z.boolean().default(false),
  category: z.nativeEnum(Category, {
    errorMap: (issue, ctx) => ({ message: "Please select a valid category" }),
  }),
  type: z.nativeEnum(TransactionType, {
    errorMap: (issue, ctx) => ({
      message: "Please select a valid transaction type",
    }),
  }),
});

export const transactionsSelect = [
  {
    id: "1",
    name: "Income",
    value: TransactionType.INCOME,
  },

  {
    id: "2",
    name: "Expense",
    value: TransactionType.EXPENSE,
  },
];

export const categoriesSelect = [
  {
    id: "1",
    name: "Food",
    value: Category.FOOD,
  },
  {
    id: "2",
    name: "Transport",
    value: Category.TRANSPORT,
  },
  {
    id: "3",
    name: "Entertainment",
    value: Category.ENTERTAINMENT,
  },
  {
    id: "4",
    name: "Health",
    value: Category.HEALTH,
  },
  {
    id: "5",
    name: "Education",
    value: Category.EDUCATION,
  },
  {
    id: "6",
    name: "Shopping",
    value: Category.SHOPPING,
  },
  {
    id: "7",
    name: "Bills",
    value: Category.BILLS,
  },
  {
    id: "8",
    name: "Others",
    value: Category.OTHER,
  },
];
