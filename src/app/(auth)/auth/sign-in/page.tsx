import SignInForm from "@/components/forms/SignInForm";
import { Metadata } from "next";
import * as React from "react";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

interface SignInPageProps {}

const SignInPage: React.FC<SignInPageProps> = ({}) => {
  return (
    <main className="flex flex-col justify-center items-center">
      <SignInForm />
    </main>
  );
};

export default SignInPage;
