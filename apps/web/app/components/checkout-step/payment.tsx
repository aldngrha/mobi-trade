import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "~/components/ui/button";
import type { Dispatch, SetStateAction } from "react";

type PaymentStepProps = {
  setStep: Dispatch<SetStateAction<Step>>;
  setPaymentMethod: Dispatch<SetStateAction<PaymentMethod>>;
  updatePaymentMethod: (paymentMethod: string) => void;
  orderReference: string;
};

type Step = "cart" | "shipping" | "payment" | "review";

type PaymentMethod = "credit" | "bank";

export default function PaymentStep({
  setStep,
  setPaymentMethod,
  updatePaymentMethod,
  orderReference,
}: PaymentStepProps) {
  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="credit-card" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger
                value="credit-card"
                onClick={() => {
                  setPaymentMethod("credit");
                  updatePaymentMethod("credit");
                }}
              >
                Credit Card
              </TabsTrigger>
              <TabsTrigger
                value="bank-transfer"
                onClick={() => {
                  setPaymentMethod("bank");
                  updatePaymentMethod("bank");
                }}
              >
                Bank Transfer
              </TabsTrigger>
            </TabsList>
            <TabsContent value="credit-card" className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="card-name">Name on Card</Label>
                <Input id="card-name" placeholder="John Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input id="card-number" placeholder="1234 5678 9012 3456" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM/YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC</Label>
                  <Input id="cvc" placeholder="123" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-4">
                <ShieldCheck className="h-4 w-4" />
                Your payment information is secure and encrypted
              </div>
            </TabsContent>
            <TabsContent value="bank-transfer" className="space-y-4 mt-4">
              <div className="p-6 border rounded-md">
                <div className="text-xl font-bold mb-2">
                  Bank Transfer Details
                </div>
                <div className="space-y-2">
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Bank Name:</div>
                    <div>MobiTrade Bank</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Account Name:</div>
                    <div>MobiTrade Inc.</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Account Number:</div>
                    <div>1234567890</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Routing Number:</div>
                    <div>987654321</div>
                  </div>
                  <div className="grid grid-cols-2">
                    <div className="text-muted-foreground">Reference:</div>
                    <div>{orderReference}</div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  Please include your order reference in the payment
                  description. Your order will be processed once payment is
                  confirmed.
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 md:space-y-0 md:space-x-4 md:flex-row justify-between">
          <Button
            variant="outline"
            onClick={() => setStep("shipping")}
            className="w-full md:w-1/2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Shipping
          </Button>
          <Button
            onClick={() => setStep("review")}
            className="cursor-pointer w-full md:w-1/2"
          >
            Review Order
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
