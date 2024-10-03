"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignInType, signInSchema } from "@/lib/db/validaton";
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
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

interface SignInFormFormProps {}

const SignInForm: React.FC<SignInFormFormProps> = ({}) => {
  const [isPending, startTransition] = React.useTransition();
  const { toast } = useToast();
  const router = useRouter();

  // 1. Define your form.
  const form = useForm<SignInType>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: SignInType) {
    startTransition(async () => {
      try {
        const res = await signIn("credentials", {
          email: values.email,
          password: values.password,
          redirect: false,
        });

        if (res && res.error === "CredentialsSignin") {
          toast({
            title: "Invalid credentials",
          });
        } else {
          toast({
            title: "Sign in successful",
          });
        }
      } catch (error) {
        console.error("An unexpected error happened:", error);
      }

      form.reset();
      router.push("/dashboard");
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

              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="h-11" disabled={isPending}>
          Login
        </Button>

        <p className="text-sm text-center">
          Need to create an account?{" "}
          <Link href="/auth/sign-up" className="text-primary underline">
            Sign Up
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default SignInForm;
