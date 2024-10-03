import React from "react";
import Ilustrantion from "@/assets/images/illustration-authentication.svg";
import Image from "next/image";

export default function AuthLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="container bg-background mx-auto grid grid-cols-1 lg:grid-cols-2 lg:gap-4 p-5 ">
      {/* Include shared UI here e.g. a header or sidebar */}
      <div className="hidden lg:block relative rounded-lg w-full overflow-hidden h-[960px] shadow-md">
        <Image
          src={Ilustrantion}
          alt="Authentication"
          fill
          className="object-cover "
        />
      </div>

      {children}
    </section>
  );
}
