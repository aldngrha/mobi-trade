import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  ArrowLeft,
  Check,
  CreditCard,
  LoaderCircle,
  Truck,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { useNavigate } from "react-router";
import { type Dispatch, type SetStateAction, useEffect, useState } from "react";
import { type CartItem, useCart } from "~/context/cart-context";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";

type ReviewStepProps = {
  setStep: Dispatch<SetStateAction<Step>>;
  cartItems: CartItem[];
};

type Step = "cart" | "shipping" | "payment" | "review";

type shippingAddress = {
  fullName: string;
  email: string;
  phoneNumber: string;
  addressLine: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

type Items = {
  productId: string;
  name: string;
  quantity: number;
  condition: string;
  storage: string;
};

export default function ReviewStep({ setStep, cartItems }: ReviewStepProps) {
  const { clearCart } = useCart();
  const navigate = useNavigate();
  const [checkoutData, setCheckoutData] = useState<{
    userId: string;
    items: Items[];
    shippingAddress: shippingAddress;
    shippingMethod: string;
    paymentMethod: string;
    orderReference: string;
  } | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("checkout-data");
    if (stored) {
      const parsed = JSON.parse(stored);
      setCheckoutData(parsed);
    }
  }, []);

  const checkoutMutation = trpc.checkout.create.useMutation({
    onSuccess: () => {
      toast.success("Order placed successfully!");
      localStorage.removeItem("checkout-data");
      navigate(`/checkout/success`);
      clearCart();
      localStorage.removeItem("checkout-data");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkoutData) {
      toast.error("Checkout data is missing");
      return;
    }

    checkoutMutation.mutate(checkoutData);
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
              {checkoutData?.shippingAddress ? (
                <div className="text-sm space-y-1">
                  <p>{checkoutData.shippingAddress.fullName}</p>
                  <p>{checkoutData.shippingAddress.addressLine}</p>
                  <p>
                    {checkoutData.shippingAddress.city},{" "}
                    {checkoutData.shippingAddress.state}{" "}
                    {checkoutData.shippingAddress.postalCode}
                  </p>
                  <p>{checkoutData.shippingAddress.country}</p>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm italic">
                  Loading...
                </p>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="font-medium text-lg mb-2">Shipping Method</h3>
              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>
                  {checkoutData?.shippingMethod === "standard"
                    ? "Standard Shipping (5-7 business days)"
                    : checkoutData?.shippingMethod === "express"
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
                  {checkoutData?.paymentMethod === "credit"
                    ? "Credit Card (ending in 3456)"
                    : "Bank Transfer"}
                </span>
              </div>
            </div>

            {checkoutData?.paymentMethod === "bank" && (
              <>
                <Separator />
                <div>
                  <h3 className="font-medium text-lg mb-2">Order Reference</h3>
                  <div className="flex items-center gap-2">
                    <p>{checkoutData.orderReference}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 md:space-y-0 md:space-x-4 md:flex-row justify-between">
          <Button
            variant="outline"
            onClick={() => setStep("payment")}
            className="w-full md:w-1/2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Payment
          </Button>
          <Button
            onClick={handleSubmitOrder}
            disabled={checkoutMutation.isPending}
            className="cursor-pointer w-full md:w-1/2"
          >
            {checkoutMutation.isPending ? (
              <LoaderCircle className="animate-spin" />
            ) : (
              "Place Order"
            )}
            {!checkoutMutation.isPending && <Check className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
