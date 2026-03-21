import { SignIn } from "@clerk/nextjs";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | Clinivise",
};

export default function SignInPage() {
  return <SignIn />;
}
