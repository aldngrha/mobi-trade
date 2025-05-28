import { ArrowLeft, Check, ShoppingCart, Star, Truck } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Link, useNavigate, useParams } from "react-router";
import Footer from "~/components/shared/footer";
import Navbar from "~/components/shared/navbar";
import { useEffect, useState } from "react";
import { trpc } from "~/lib/trpc";
import { useCart } from "~/context/cart-context";

export default function ProductPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    }
  }, [isLoggedIn]);

  const { productSlug } = useParams() as { productSlug: string };

  const {
    data: product,
    isLoading,
    error,
  } = trpc.product.getBySlug.useQuery({
    slug: productSlug,
  });
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedVariant, setSelectedVariant] = useState(
    product?.variants?.[0] || null,
  );

  console.log(product);

  useEffect(() => {
    if (product?.variants?.length) {
      setSelectedVariant(product.variants[0]);
    }
  }, [product?.variants]);

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

    addToCart({
      id: product.id,
      name: product.name,
      image: {
        id: product.galleries[0]?.id || "placeholder",
        imageUrl: product.galleries[0]?.imageUrl || "/placeholder.svg",
      },
      price: Number(selectedVariant.price) || 0,
      quantity: 1,
      storage: selectedVariant?.storage || "",
      condition: selectedVariant?.condition || "",
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/checkout");
  };

  // Set default saat komponen pertama kali render
  useEffect(() => {
    if (product?.galleries?.length) {
      setSelectedImage(product?.galleries[0].imageUrl);
    }
  }, [product?.galleries]);

  if (isLoading) {
    return <h1>Loading ...</h1>;
  }

  const price = Number(selectedVariant?.price);

  // Calculate original price if there's a discount
  const originalPrice =
    (product.discount ?? 0) > 0
      ? (price * (1 + product.discount! / 100)).toFixed(2)
      : null;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onlyLogo={false} isSearch />
      <main className="flex-1">
        <div className="container mx-auto py-8 p-4 md:p-0">
          <div className="mb-8">
            <Link
              to="/"
              className="flex items-center text-sm text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to products
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-6">
              <div className="relative aspect-square overflow-hidden rounded-lg border">
                <img
                  src={selectedImage || "/placeholder.svg"}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
                {selectedVariant?.condition === "Like New" && (
                  <Badge className="absolute top-4 right-4 bg-green-500 hover:bg-green-600">
                    Like New
                  </Badge>
                )}
                {(product.discount ?? 0) > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute top-4 left-4"
                  >
                    {product.discount}% OFF
                  </Badge>
                )}
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.galleries?.map((v) => (
                  <div
                    key={v.id}
                    onClick={() =>
                      setSelectedImage(v.imageUrl || "/placeholder.svg")
                    }
                    className={`relative aspect-square overflow-hidden rounded-md border cursor-pointer ${
                      selectedImage === v.imageUrl
                        ? "ring-2 ring-primary"
                        : "hover:ring-2 hover:ring-slate-400 transition duration-200 ease-in-out"
                    }`}
                  >
                    <img
                      src={v.imageUrl || "/placeholder.svg"}
                      alt={`${v.id}`}
                      className="object-cover w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="mt-2 flex items-center gap-4">
                  <Badge variant="outline">{product.model.brand.name}</Badge>
                </div>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold">
                  ${Number(selectedVariant?.price).toFixed(2)}
                </span>
                {originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">
                    ${originalPrice}
                  </span>
                )}
                {(product.discount ?? 0) > 0 && (
                  <Badge variant="destructive">{product.discount}% OFF</Badge>
                )}
              </div>
              <Separator />
              {product.variants?.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Choose Variant</h3>
                  <div className="flex gap-4 flex-wrap">
                    {product.variants.map((variant) => {
                      const isSelected = selectedVariant?.id === variant.id;
                      return (
                        <div
                          key={variant.id}
                          onClick={() => setSelectedVariant(variant)}
                          className={`cursor-pointer w-fit transition-all ease-in-out duration-300 rounded-lg border p-2 text-xs ${
                            isSelected
                              ? " bg-slate-200 border-slate-700"
                              : "hover:border-muted-foreground/40"
                          }`}
                        >
                          <p>
                            {variant.ram} / {variant.storage} -{" "}
                            <span className="text-muted-foreground">
                              {variant.color}
                            </span>
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Condition
                    </span>
                    <div className="font-medium">
                      {selectedVariant?.condition}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Storage
                    </span>
                    <div className="font-medium">
                      {selectedVariant?.storage}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Color
                    </span>
                    <div className="font-medium">{selectedVariant?.color}</div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-muted-foreground">
                      Warranty
                    </span>
                    <div className="font-medium">
                      {selectedVariant?.warrantyMonths}
                    </div>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-sm font-medium text-muted-foreground">
                    Availability
                  </span>
                  <div className="flex items-center gap-2 font-medium">
                    <Check className="h-4 w-4 text-green-500" />
                    In Stock ({selectedVariant?.stockQuantity} available)
                  </div>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Truck className="h-4 w-4" />
                  Free shipping on orders over $500
                </div>
              </div>
              {isLoggedIn ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1 cursor-pointer"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1 cursor-pointer"
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </div>
              ) : (
                <Button size="lg" className="w-full" asChild>
                  <Link to="/sign-in">Sign in to process your checkout</Link>
                </Button>
              )}
              <Separator />
              <Tabs defaultValue="description">
                <TabsList className="w-full">
                  <TabsTrigger value="description" className="flex-1">
                    Description
                  </TabsTrigger>
                  <TabsTrigger value="specifications" className="flex-1">
                    Specifications
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="description" className="mt-4 text-sm">
                  <p>{product.description}</p>
                  <ul className="mt-4 space-y-2 list-disc pl-5">
                    <li>Fully functional with no hardware issues</li>
                    <li>Battery health at {product.batteryHealth}%</li>
                    <li>Includes original charger and cable</li>
                    <li>Factory reset and ready to use</li>
                    <li>Thoroughly tested and inspected by our technicians</li>
                  </ul>
                </TabsContent>
                <TabsContent value="specifications" className="mt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-1">
                        <span className="font-medium">Brand</span>
                        <span>{product.model.brand.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="font-medium">Model</span>
                        <span>{product.model.name}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="font-medium">Storage</span>
                        <span>{selectedVariant?.storage}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="font-medium">RAM</span>
                        <span>{selectedVariant?.ram}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="font-medium">Display</span>
                        <span>{product.display}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-1">
                        <span className="font-medium">Processor</span>
                        <span>{product.processor}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="font-medium">Camera</span>
                        <span>{product.camera}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="font-medium">Battery</span>
                        <span>{product.battery}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="font-medium">OS</span>
                        <span>{product.os}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-1">
                        <span className="font-medium">Connectivity</span>
                        <span>{product.connectivity}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
