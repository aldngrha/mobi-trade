import { useEffect, useState } from "react";
import { ArrowLeft, ShieldCheck, Truck } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Link } from "react-router";
import Navbar from "~/components/shared/navbar";
import Footer from "~/components/shared/footer";
import { ProtectedRoute } from "~/components/shared/protected-route";
import { useCart } from "~/context/cart-context";
import CartStep from "~/components/checkout-step/cart";
import ShippingStep from "~/components/checkout-step/shipping";
import PaymentStep from "~/components/checkout-step/payment";
import ReviewStep from "~/components/checkout-step/review";
import type {
  CheckoutInput,
  CheckoutItem,
  ShippingAddressInput,
} from "../../../api/services/transaction.service";
import { useCheckout } from "~/hooks/useCheckout";
import { useAuth } from "~/context/auth-context";

export default function CheckoutPage() {
  const { user } = useAuth();
  const defaultCheckoutState: CheckoutInput = {
    userId: "",
    items: [],
    shippingAddress: {
      fullName: "",
      addressLine: "",
      email: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
      phoneNumber: "",
    },
    shippingMethod: "",
    paymentMethod: "",
    orderReference: "",
  };

  useEffect(() => {
    if (user) {
      setCheckoutData((prev) => ({
        ...prev,
        userId: user.id,
      }));
    }
  }, []);

  const [checkoutData, setCheckoutData] = useCheckout<CheckoutInput>(
    "checkout-data",
    defaultCheckoutState,
  );

  const [step, setStep] = useState<"cart" | "shipping" | "payment" | "review">(
    "cart",
  );
  const [paymentMethod, setPaymentMethod] = useState<"credit" | "bank">(
    "credit",
  );

  const { cartItems, clearCart } = useCart();

  const [shippingMethod, setShippingMethod] = useState<
    "standard" | "express" | "priority"
  >("standard");

  // Calculate totals
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item?.price) || 0) * item.quantity,
    0,
  );
  const shippingCost =
    shippingMethod === "standard" ? 0 : shippingMethod === "express" ? 15 : 30;
  const taxRate = 0.08;
  const tax = subtotal * taxRate;
  const total = subtotal + shippingCost + tax;

  const handleItemsContinue = (items: CheckoutItem[]) => {
    setCheckoutData((prev) => ({ ...prev, items }));
    setStep("shipping");
  };

  const updateShippingAddress = (shippingAddress: ShippingAddressInput) => {
    setCheckoutData((prev) => ({ ...prev, shippingAddress }));
  };

  const updateShippingMethod = (shippingMethod: string) => {
    setCheckoutData((prev) => ({ ...prev, shippingMethod }));
  };

  const updatePaymentMethod = (paymentMethod: string) => {
    setCheckoutData((prev) => ({ ...prev, paymentMethod }));
  };

  const updateOrderReference = (orderReference: string) => {
    setCheckoutData((prev) => ({ ...prev, orderReference }));
  };

  useEffect(() => {
    // generate sekali pas mount
    const generatedOrderRef = `ORDER-${Math.floor(Math.random() * 1000000)}`;
    updateOrderReference(generatedOrderRef);
  }, []);

  console.log("Checkout Data:", checkoutData);

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar onlyLogo={true} />
        <main className="flex-1 py-8">
          <div className="container mx-auto">
            <div className="mb-8">
              <Link
                to="/"
                className="flex items-center text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Continue shopping
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold mb-2">Checkout</h1>
                  <p className="text-muted-foreground">
                    Complete your purchase securely
                  </p>
                </div>

                <div className="mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          step === "cart"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        1
                      </div>
                      <span className="font-medium">Cart</span>
                    </div>
                    <Separator className="flex-1 mx-4" />
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          step === "shipping"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        2
                      </div>
                      <span className="font-medium">Shipping</span>
                    </div>
                    <Separator className="flex-1 mx-4" />
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          step === "payment"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        3
                      </div>
                      <span className="font-medium">Payment</span>
                    </div>
                    <Separator className="flex-1 mx-4" />
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full ${
                          step === "review"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        4
                      </div>
                      <span className="font-medium">Review</span>
                    </div>
                  </div>
                </div>

                {step === "cart" && (
                  <CartStep
                    onContinue={handleItemsContinue}
                    cartItems={cartItems}
                    clearCart={clearCart}
                  />
                )}

                {step === "shipping" && (
                  <ShippingStep
                    setStep={setStep}
                    shippingMethod={shippingMethod}
                    updateShippingAddress={updateShippingAddress}
                    setShippingMethod={setShippingMethod}
                    updateShippingMethod={updateShippingMethod}
                  />
                )}

                {step === "payment" && (
                  <PaymentStep
                    setStep={setStep}
                    setPaymentMethod={setPaymentMethod}
                    updatePaymentMethod={updatePaymentMethod}
                    orderReference={checkoutData.orderReference}
                  />
                )}

                {step === "review" && (
                  <ReviewStep setStep={setStep} cartItems={cartItems} />
                )}
              </div>

              <div className="lg:col-span-1">
                <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Shipping</span>
                        <span>
                          {shippingCost === 0
                            ? "Free"
                            : `$${shippingCost.toFixed(2)}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tax</span>
                        <span>${tax.toFixed(2)}</span>
                      </div>
                      <Separator className="my-2" />
                      <div className="flex justify-between font-medium text-lg">
                        <span>Total</span>
                        <span>${total.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4 text-muted-foreground" />
                    <span>Free shipping on orders over $500</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                    <span>Secure checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
