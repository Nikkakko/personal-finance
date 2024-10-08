import { Category, Theme, TransactionType } from "@prisma/client";
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

export const addBudgetSchema = z.object({
  category: z.nativeEnum(Category, {
    errorMap: (issue, ctx) => ({ message: "Please select a valid category" }),
  }),
  maximum: z.string().min(1, "Maximum is required").regex(/^\d+$/, {
    message: "Maximum must be a number",
  }),
  theme: z.nativeEnum(Theme, {
    errorMap: (issue, ctx) => ({ message: "Please select a valid theme" }),
  }),
});

//export addPots
export const addPotSchema = z.object({
  name: z.string().min(1, "Name is required"),
  target: z.string().min(1, "Target is required").regex(/^\d+$/, {
    message: "Target must be a number",
  }),
  theme: z.nativeEnum(Theme, {
    errorMap: (issue, ctx) => ({ message: "Please select a valid theme" }),
  }),
});

export const potActionSchema = z.object({
  amount: z.string().min(1, "Amount is required").regex(/^\d+$/, {
    message: "Amount must be a number",
  }),
});
