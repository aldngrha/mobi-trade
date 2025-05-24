import { ArrowLeft, Check, Package } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Link } from "react-router";
import Navbar from "~/components/shared/navbar";
import Footer from "~/components/shared/footer";
import { ProtectedRoute } from "~/components/shared/protected-route";

export default function OrderSuccessPage() {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar onlyLogo />
        <main className="flex-1 flex items-center justify-center ">
          <div className="container max-w-md mx-auto px-4">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
                  <Check className="h-16 w-16 text-primary" />
                </div>
                <CardTitle className="text-2xl">Order Successful!</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    Thank you for your purchase. Your order has been received
                    and is being processed.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link to="/">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Return to Home
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
