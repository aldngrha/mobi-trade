import type { Route } from "./+types/sign-up";
import SignUpPage from "~/pages/sign-up";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign Up - MobiTrade" },
    { name: "description", content: "Sign up to create your account" },
  ];
}

export default function SignUp() {
  return <SignUpPage />;
}
