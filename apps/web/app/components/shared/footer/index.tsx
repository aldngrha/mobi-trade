import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="w-full border-t py-6 md:py-0">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:h-24">
        <p className="text-sm text-muted-foreground">
          © 2025 MobiTrade. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:gap-6">
          <Link
            to="#"
            className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
          >
            Terms
          </Link>
          <Link
            to="#"
            className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
          >
            Privacy
          </Link>
          <Link
            to="#"
            className="text-sm font-medium text-muted-foreground hover:underline underline-offset-4"
          >
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
