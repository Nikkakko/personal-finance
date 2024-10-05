"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpType, signUpSchema } from "@/lib/validaton";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "./password-input";
import Link from "next/link";
import { signup } from "@/app/(auth)/_actions";

interface SignUpFormProps {}

const SignUpForm: React.FC<SignUpFormProps> = ({}) => {
  const [isPending, startTransition] = React.useTransition();
  // 1. Define your form.
  const form = useForm<SignUpType>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: SignUpType) {
    startTransition(async () => {
      const res = await signup(values);
      if (res?.message === "User already exists") {
        form.setError("email", {
          type: "manual",
          message: "User already exists",
        });
      }

      form.reset();
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex flex-col shadow-md p-8 w-full max-w-[560px] bg-secondary rounded-lg"
      >
        <h1 className="text-3xl font-bold text-left">Sign Up</h1>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput {...field} />
              </FormControl>
              <FormDescription>
                Password must be at least 8 characters long
              </FormDescription>

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="h-11" disabled={isPending}>
          Create Account
        </Button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link href="/auth/sign-in" className="text-primary underline">
            Sign In
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignUpForm;
