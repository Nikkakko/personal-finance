import { Metadata } from "next";

import * as React from "react";

import SignUpForm from "@/components/forms/SignUpForm";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Sign up for a new account",
};

interface SignUpPageProps {}

const SignUpPage: React.FC<SignUpPageProps> = ({}) => {
  return (
    <main className="flex flex-col justify-center items-center">
      <SignUpForm />
    </main>
  );
};

export default SignUpPage;
