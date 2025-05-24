import type { Route } from "./+types/home";
import LandingPage from "~/pages/landing-page";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "MobiTrade" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <LandingPage />;
}
