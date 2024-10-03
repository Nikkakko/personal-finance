"use server";

import { prisma } from "@/lib/db/prisma";
import { signUpSchema, SignUpType } from "@/lib/db/validaton";
import bcrypt from "bcryptjs";

export async function signup(values: SignUpType) {
  try {
    // Validate form fields
    const validatedFields = signUpSchema.safeParse({
      name: values.name,
      email: values.email,
      password: values.password,
    });

    if (!validatedFields.success) {
      return validatedFields.error;
    }

    // 2. Prepare data for insertion into database
    const { name, email, password } = validatedFields.data;
    // e.g. Hash the user's password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return { message: "User already exists" };
    }

    // 3. Insert the user into the database or call an Auth Library's API
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return {
      user,
      message: "User created successfully",
    };
  } catch (error) {
    console.error(error);
  }
}
