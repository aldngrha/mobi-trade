import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { ArrowLeft, Check, CreditCard, Truck } from "lucide-react";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import { type Dispatch, type SetStateAction, useState } from "react";
import type { CartItem } from "~/context/cart-context";

type ReviewStepProps = {
  setStep: Dispatch<SetStateAction<Step>>;
  cartItems: CartItem[];
  shippingMethod: "standard" | "express" | "priority";
  paymentMethod: "credit" | "paypal" | "bank";
};

type Step = "cart" | "shipping" | "payment" | "review";

export default function ReviewStep({
  setStep,
  cartItems,
  shippingMethod,
  paymentMethod,
}: ReviewStepProps) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitOrder = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/checkout/success");
    }, 1500);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Review Your Order</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-lg mb-2">Items</h3>
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item?.id} className="flex gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                      <img
                        src={item?.image?.imageUrl || "/placeholder.svg"}
                        alt={item?.name || "Product"}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">{item?.name}</h4>
                      <div className="text-sm text-muted-foreground">
                        {item?.storage} • {item?.condition}
                      </div>
                    </div>
                    <div>
                      <div className="font-medium">
                        ${Number(item?.price)?.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Qty: {item?.quantity}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-lg mb-2">Shipping Address</h3>
              <div className="text-sm">
                <p>John Doe</p>
                <p>123 Main St</p>
                <p>New York, NY 10001</p>
                <p>United States</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-lg mb-2">Shipping Method</h3>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>
                  {shippingMethod === "standard"
                    ? "Standard Shipping (5-7 business days)"
                    : shippingMethod === "express"
                      ? "Express Shipping (2-3 business days)"
                      : "Priority Shipping (1-2 business days)"}
                </span>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-lg mb-2">Payment Method</h3>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>
                  {paymentMethod === "credit"
                    ? "Credit Card (ending in 3456)"
                    : paymentMethod === "paypal"
                      ? "PayPal"
                      : "Bank Transfer"}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setStep("payment")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payment
          </Button>
          <Button onClick={handleSubmitOrder} disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Place Order"}
            {!isSubmitting && <Check className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
