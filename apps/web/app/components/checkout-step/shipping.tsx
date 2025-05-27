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
import { Textarea } from "~/components/ui/textarea";
import { z } from "zod";
import type { ShippingAddressInput } from "../../../../api/services/transaction.service";

type ShippingStepProps = {
  setStep: Dispatch<SetStateAction<Step>>;
  shippingMethod?: string;
  setShippingMethod: Dispatch<SetStateAction<ShippingMethod>>;
  updateShippingAddress: (data: ShippingAddressInput) => void;
  updateShippingMethod: (data: ShippingMethod) => void;
};

type Step = "cart" | "shipping" | "payment" | "review";
type ShippingMethod = "standard" | "express" | "priority";

const shippingSchema = z.object({
  fullName: z.string().min(1, "Required"),
  email: z.string().email("Invalid email"),
  phoneNumber: z.string().min(8, "Invalid phone"),
  addressLine: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  postalCode: z.string().min(4, "Invalid ZIP"),
  country: z.string().min(1, "Required"),
});

export default function ShippingStep({
  setStep,
  setShippingMethod,
  shippingMethod,
  updateShippingAddress,
  updateShippingMethod,
}: ShippingStepProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    addressLine: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id.replace("-", "")]: value,
    }));
  };

  const handleContinue = () => {
    const parsed = shippingSchema.safeParse(formData);

    if (!parsed.success) {
      const zodErrors = parsed.error.flatten().fieldErrors;
      const formattedErrors: Record<string, string> = {};

      const keys = Object.keys(zodErrors) as (keyof typeof zodErrors)[];
      for (const key of keys) {
        if (zodErrors[key]) {
          formattedErrors[key] = zodErrors[key]?.[0] ?? "";
        }
      }

      setErrors(formattedErrors);
      return;
    }

    setErrors({});
    updateShippingAddress(formData);
    updateShippingMethod(shippingMethod as ShippingMethod);
    setStep("payment");
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { id: "fullName", label: "Full Name" },
              { id: "email", label: "Email", type: "email" },
              { id: "phoneNumber", label: "Phone", type: "tel" },
              { id: "addressLine", label: "Address", textarea: true },
              { id: "city", label: "City" },
              { id: "state", label: "State" },
              { id: "postalCode", label: "ZIP Code" },
              { id: "country", label: "Country" },
            ].map(({ id, label, type = "text", textarea }) => (
              <div key={id} className="space-y-2">
                <Label htmlFor={id}>{label}</Label>
                {textarea ? (
                  <Textarea
                    id={id}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    className="w-full"
                    onChange={handleChange}
                  />
                ) : (
                  <Input
                    id={id}
                    type={type}
                    placeholder={`Enter your ${label.toLowerCase()}`}
                    className="w-full"
                    onChange={handleChange}
                  />
                )}
                {errors[id.replace("-", "")] && (
                  <p className="text-red-500 text-sm">
                    {errors[id.replace("-", "")]}
                  </p>
                )}
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <Label>Shipping Method</Label>
            <RadioGroup
              defaultValue="standard"
              value={shippingMethod}
              onValueChange={(value) =>
                setShippingMethod(value as ShippingMethod)
              }
            >
              {[
                {
                  value: "standard",
                  label: "Standard Shipping (Free)",
                  desc: "Delivery in 5-7 business days",
                },
                {
                  value: "express",
                  label: "Express Shipping ($15.00)",
                  desc: "Delivery in 2-3 business days",
                },
                {
                  value: "priority",
                  label: "Priority Shipping ($30.00)",
                  desc: "Delivery in 1-2 business days",
                },
              ].map((option) => (
                <div
                  key={option.value}
                  className="flex items-center space-x-2 border rounded-md p-4"
                >
                  <RadioGroupItem value={option.value} id={option.value} />
                  <Label
                    htmlFor={option.value}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="font-medium">{option.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {option.desc}
                    </div>
                  </Label>
                  <Truck className="h-5 w-5 text-muted-foreground" />
                </div>
              ))}
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setStep("cart")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cart
          </Button>
          <Button onClick={handleContinue} className="cursor-pointer">
            Continue to Payment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
