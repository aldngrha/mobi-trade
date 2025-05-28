import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Link } from "react-router";
import type { Model, Variant } from "../../../../api/types/types";

export type Product = {
  id: string;
  sku: string;
  slug?: string;
  name: string;
  modelId: string;
  model?: Model;
  description: string;
  discount?: number | null;
  minimumOrderQuantity: number;
  batteryHealth?: number | null;
  display?: string | null;
  processor?: string | null;
  camera?: string | null;
  battery?: string | null;
  os?: string | null;
  connectivity?: string | null;
  variants: Variant[];
  galleries: Gallery[];
};

type Gallery = {
  id: string | number;
  imageUrl: string;
};

type CardProductProps = {
  product: Product;
};

export default function CardProduct({ product }: CardProductProps) {
  return (
    <Link to={`/product/${product.slug}`} key={product.id}>
      <Card className="h-full overflow-hidden transition-all hover:shadow-lg pt-0">
        <div className="aspect-square relative overflow-hidden ">
          <img
            src={product.galleries[0].imageUrl || "/placeholder.svg"}
            alt={product.name}
            className="object-cover transition-transform hover:scale-105 w-full h-full"
          />
          {product.variants[0]?.condition === "Like New" && (
            <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
              Like New
            </Badge>
          )}
          {(product.discount ?? 0) > 0 && (
            <Badge variant="destructive" className="absolute top-2 left-2">
              {product.discount}% OFF
            </Badge>
          )}
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline">{product.variants[0].storage}</Badge>
            <Badge variant="outline">{product.variants[0].condition}</Badge>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {product.description.substring(0, 100)}...
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div className="font-bold text-lg">
            ${Number(product.variants[0].price).toFixed(2)}
            {(product.discount ?? 0) > 0 && (
              <span className="text-sm text-muted-foreground line-through ml-2">
                $
                {(
                  product.variants[0].price *
                  (1 + (product.discount ?? 0) / 100)
                ).toFixed(2)}
              </span>
            )}
          </div>
          <Badge variant="secondary">{product.model?.brand?.name}</Badge>
        </CardFooter>
      </Card>
    </Link>
  );
}
