import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { type CartItem } from "~/context/cart-context";
import { useNavigate } from "react-router";
import type { CheckoutItem } from "../../../../api/services/checkout.service";

type CartStep = {
  cartItems: CartItem[];
  onContinue: (items: CheckoutItem[]) => void; // ✅ new
  clearCart: () => void;
};

export default function CartStep({
  cartItems,
  onContinue,
  clearCart,
}: CartStep) {
  const navigate = useNavigate();

  const handleContinue = () => {
    const items = cartItems.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      condition: item.condition,
      storage: item.storage,
    }));
    onContinue(items);
  };

  return (
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
                    src={item?.image?.imageUrl || "/placeholder.svg"}
                    alt={item?.name || "Product"}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item?.name}</h3>
                  <div className="text-sm text-muted-foreground">
                    {item?.storage} • {item?.condition}
                  </div>
                  <div className="mt-1 text-sm">Quantity: {item?.quantity}</div>
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
          <Button onClick={handleContinue} className="cursor-pointer">
            Continue to Shipping
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
