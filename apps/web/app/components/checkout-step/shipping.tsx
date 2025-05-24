import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { ArrowLeft, ArrowRight, Truck } from "lucide-react";
import { Button } from "~/components/ui/button";
import { type Dispatch, type SetStateAction, useState } from "react";

type ShippingStepProps = {
  setStep: Dispatch<SetStateAction<Step>>;
  shippingMethod?: string;
  setShippingMethod: Dispatch<SetStateAction<ShippingMethod>>;
};

type Step = "cart" | "shipping" | "payment" | "review";

type ShippingMethod = "standard" | "express" | "priority";

export default function ShippingStep({
  setStep,
  setShippingMethod,
  shippingMethod,
}: ShippingStepProps) {
  return (
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
              <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
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
              onValueChange={(value) => setShippingMethod(value as any)}
            >
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="standard" id="standard" />
                <Label htmlFor="standard" className="flex-1 cursor-pointer">
                  <div className="font-medium">Standard Shipping (Free)</div>
                  <div className="text-sm text-muted-foreground">
                    Delivery in 5-7 business days
                  </div>
                </Label>
                <Truck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="express" id="express" />
                <Label htmlFor="express" className="flex-1 cursor-pointer">
                  <div className="font-medium">Express Shipping ($15.00)</div>
                  <div className="text-sm text-muted-foreground">
                    Delivery in 2-3 business days
                  </div>
                </Label>
                <Truck className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex items-center space-x-2 border rounded-md p-4">
                <RadioGroupItem value="priority" id="priority" />
                <Label htmlFor="priority" className="flex-1 cursor-pointer">
                  <div className="font-medium">Priority Shipping ($30.00)</div>
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
          <Button variant="outline" onClick={() => setStep("cart")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
          <Button onClick={() => setStep("payment")} className="cursor-pointer">
            Continue to Payment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
