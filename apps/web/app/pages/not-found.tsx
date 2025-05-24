import { ArrowLeft } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Link } from "react-router";
import { ProtectedRoute } from "~/components/shared/protected-route";

export default function NotFoundPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-4xl font-bold">404 - Product Not Found</h1>
        <p className="text-muted-foreground">
          The product you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>
    </ProtectedRoute>
  );
}
