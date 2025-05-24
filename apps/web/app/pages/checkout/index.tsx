"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CreditCard,
  ShieldCheck,
  Truck,
  X,
} from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { products } from "~/lib/data";
import { Link, useNavigate } from "react-router";
import Navbar from "~/components/shared/navbar";
import Footer from "~/components/shared/footer";
import { ProtectedRoute } from "~/components/shared/protected-route";
import { useCart } from "~/context/cart-context";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<"cart" | "shipping" | "payment" | "review">(
    "cart",
  );
  const [shippingMethod, setShippingMethod] = useState<
    "standard" | "express" | "priority"
  >("standard");
  const [paymentMethod, setPaymentMethod] = useState<
    "credit" | "paypal" | "bank"
  >("credit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { cartItems, clearCart } = useCart();

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

  const handleSubmitOrder = () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      navigate("/checkout/success");
    }, 1500);
  };

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
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <p>Your Cart ({cartItems.length} items)</p>
                          <Button
                            variant="ghost"
                            className="cursor-pointer"
                            onClick={clearCart}
                          >
                            <X className="text-red-500r" />
                          </Button>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {cartItems.map((item) => (
                            <div
                              key={item?.id}
                              className="flex gap-4 py-2 border-b last:border-0"
                            >
                              <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                                <img
                                  src={
                                    item?.image?.imageUrl || "/placeholder.svg"
                                  }
                                  alt={item?.name || "Product"}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="flex-1">
                                <h3 className="font-medium">{item?.name}</h3>
                                <div className="text-sm text-muted-foreground">
                                  {item?.storage} • {item?.condition}
                                </div>
                                <div className="mt-1 text-sm">
                                  Quantity: {item?.quantity}
                                </div>
                              </div>
                              <div className="font-medium">
                                ${Number(item?.price)?.toFixed(2)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => navigate("/")}>
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Shopping
                        </Button>
                        <Button onClick={() => setStep("shipping")}>
                          Continue to Shipping
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}

                {step === "shipping" && (
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Shipping Information</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                          <div className="space-y-2">
                            <Label htmlFor="first-name">First Name</Label>
                            <Input id="first-name" placeholder="John" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="last-name">Last Name</Label>
                            <Input id="last-name" placeholder="Doe" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="john.doe@example.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" placeholder="123 Main St" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" placeholder="New York" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="state">State</Label>
                            <Input id="state" placeholder="NY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input id="zip" placeholder="10001" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="country">Country</Label>
                            <Input id="country" placeholder="United States" />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <Label>Shipping Method</Label>
                          <RadioGroup
                            defaultValue="standard"
                            value={shippingMethod}
                            onValueChange={(value) =>
                              setShippingMethod(value as any)
                            }
                          >
                            <div className="flex items-center space-x-2 border rounded-md p-4">
                              <RadioGroupItem value="standard" id="standard" />
                              <Label
                                htmlFor="standard"
                                className="flex-1 cursor-pointer"
                              >
                                <div className="font-medium">
                                  Standard Shipping (Free)
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Delivery in 5-7 business days
                                </div>
                              </Label>
                              <Truck className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex items-center space-x-2 border rounded-md p-4">
                              <RadioGroupItem value="express" id="express" />
                              <Label
                                htmlFor="express"
                                className="flex-1 cursor-pointer"
                              >
                                <div className="font-medium">
                                  Express Shipping ($15.00)
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Delivery in 2-3 business days
                                </div>
                              </Label>
                              <Truck className="h-5 w-5 text-muted-foreground" />
                            </div>
                            <div className="flex items-center space-x-2 border rounded-md p-4">
                              <RadioGroupItem value="priority" id="priority" />
                              <Label
                                htmlFor="priority"
                                className="flex-1 cursor-pointer"
                              >
                                <div className="font-medium">
                                  Priority Shipping ($30.00)
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  Delivery in 1-2 business days
                                </div>
                              </Label>
                              <Truck className="h-5 w-5 text-muted-foreground" />
                            </div>
                          </RadioGroup>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setStep("cart")}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Cart
                        </Button>
                        <Button onClick={() => setStep("payment")}>
                          Continue to Payment
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}

                {step === "payment" && (
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Payment Method</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Tabs defaultValue="credit-card" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                            <TabsTrigger
                              value="credit-card"
                              onClick={() => setPaymentMethod("credit")}
                            >
                              Credit Card
                            </TabsTrigger>
                            <TabsTrigger
                              value="paypal"
                              onClick={() => setPaymentMethod("paypal")}
                            >
                              PayPal
                            </TabsTrigger>
                            <TabsTrigger
                              value="bank-transfer"
                              onClick={() => setPaymentMethod("bank")}
                            >
                              Bank Transfer
                            </TabsTrigger>
                          </TabsList>
                          <TabsContent
                            value="credit-card"
                            className="space-y-4 mt-4"
                          >
                            <div className="space-y-2">
                              <Label htmlFor="card-name">Name on Card</Label>
                              <Input id="card-name" placeholder="John Doe" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="card-number">Card Number</Label>
                              <Input
                                id="card-number"
                                placeholder="1234 5678 9012 3456"
                              />
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
                          <TabsContent
                            value="paypal"
                            className="space-y-4 mt-4"
                          >
                            <div className="p-6 text-center border rounded-md">
                              <div className="text-xl font-bold mb-2">
                                PayPal
                              </div>
                              <p className="text-muted-foreground mb-4">
                                You will be redirected to PayPal to complete
                                your payment.
                              </p>
                              <Button className="w-full">
                                Continue with PayPal
                              </Button>
                            </div>
                          </TabsContent>
                          <TabsContent
                            value="bank-transfer"
                            className="space-y-4 mt-4"
                          >
                            <div className="p-6 border rounded-md">
                              <div className="text-xl font-bold mb-2">
                                Bank Transfer Details
                              </div>
                              <div className="space-y-2">
                                <div className="grid grid-cols-2">
                                  <div className="text-muted-foreground">
                                    Bank Name:
                                  </div>
                                  <div>MobiTrade Bank</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div className="text-muted-foreground">
                                    Account Name:
                                  </div>
                                  <div>MobiTrade Inc.</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div className="text-muted-foreground">
                                    Account Number:
                                  </div>
                                  <div>1234567890</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div className="text-muted-foreground">
                                    Routing Number:
                                  </div>
                                  <div>987654321</div>
                                </div>
                                <div className="grid grid-cols-2">
                                  <div className="text-muted-foreground">
                                    Reference:
                                  </div>
                                  <div>
                                    ORDER-{Math.floor(Math.random() * 1000000)}
                                  </div>
                                </div>
                              </div>
                              <div className="mt-4 text-sm text-muted-foreground">
                                Please include your order reference in the
                                payment description. Your order will be
                                processed once payment is confirmed.
                              </div>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button
                          variant="outline"
                          onClick={() => setStep("shipping")}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Shipping
                        </Button>
                        <Button onClick={() => setStep("review")}>
                          Review Order
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                )}

                {step === "review" && (
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
                              {cartProducts.map((item) => (
                                <div key={item?.id} className="flex gap-4">
                                  <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                                    <img
                                      src={item?.image || "/placeholder.svg"}
                                      alt={item?.name || "Product"}
                                      className="object-cover"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-medium">
                                      {item?.name}
                                    </h4>
                                    <div className="text-sm text-muted-foreground">
                                      {item?.storage} • {item?.condition}
                                    </div>
                                  </div>
                                  <div>
                                    <div className="font-medium">
                                      ${item?.price?.toFixed(2)}
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
                            <h3 className="font-medium text-lg mb-2">
                              Shipping Address
                            </h3>
                            <div className="text-sm">
                              <p>John Doe</p>
                              <p>123 Main St</p>
                              <p>New York, NY 10001</p>
                              <p>United States</p>
                            </div>
                          </div>

                          <Separator />

                          <div>
                            <h3 className="font-medium text-lg mb-2">
                              Shipping Method
                            </h3>
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
                            <h3 className="font-medium text-lg mb-2">
                              Payment Method
                            </h3>
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
                        <Button
                          variant="outline"
                          onClick={() => setStep("payment")}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back to Payment
                        </Button>
                        <Button
                          onClick={handleSubmitOrder}
                          disabled={isSubmitting}
                        >
                          {isSubmitting ? "Processing..." : "Place Order"}
                          {!isSubmitting && <Check className="ml-2 h-4 w-4" />}
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
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
