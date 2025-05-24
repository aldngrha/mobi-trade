import type { Route } from "./+types/sign-in";
import SignInPage from "~/pages/sign-in";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sign In - MobiTrade" },
    { name: "description", content: "Sign in to your account" },
  ];
}

export default function SignIn() {
  return <SignInPage />;
}
