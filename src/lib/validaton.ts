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
export const addBalanceSchema = z.object({
  current: z.string().min(1, "Current balance is required"),
  income: z.string().min(1, "Income is required"),
});
