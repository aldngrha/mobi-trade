import { Link } from "react-router";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
// import { products } from "~/lib/data";
import Navbar from "~/components/shared/navbar";
import Footer from "~/components/shared/footer";
import CardProduct from "~/components/shared/card-product";
import { ProtectedRoute } from "~/components/shared/protected-route";
import { trpc } from "~/lib/trpc";

export default function LandingPage() {
  const { data: products, isLoading, error } = trpc.product.getAll.useQuery();

  const scrollToFeatured = () => {
    const element = document.getElementById("featured-products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col">
        <Navbar onlyLogo={false} />
        <main className="flex-1">
          <section className="w-full py-12 md:py-32 lg:py-56 bg-[url('https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?q=80&w=3540&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')] bg-cover bg-center bg-no-repeat">
            <div className="container mx-auto px-4 md:px-6">
              <div className="flex flex-col items-center justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter text-slate-50 sm:text-5xl">
                    Quality Used Phones at Wholesale Prices
                  </h1>
                  <p className="max-w-[900px] text-slate-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Browse our selection of certified pre-owned mobile devices
                    from trusted suppliers worldwide.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button
                    size="lg"
                    className="bg-slate-50 text-slate-700 transition hover:bg-slate-200 hover:text-slate-800"
                    onClick={scrollToFeatured}
                  >
                    Browse Catalog
                  </Button>
                </div>
              </div>
            </div>
          </section>
          <section className="w-full py-12 md:py-24 " id="featured-products">
            <div className="container px-4 md:px-6 mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                  <h2 className="text-3xl font-bold tracking-tighter">
                    Featured Products
                  </h2>
                  <p className="text-muted-foreground">
                    Browse our selection of quality used mobile phones
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sort by:</span>
                    <Select defaultValue="newest">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Filter:</span>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="samsung">Samsung</SelectItem>
                        <SelectItem value="google">Google</SelectItem>
                        <SelectItem value="xiaomi">Xiaomi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Tabs defaultValue="all" className="mb-8">
                <TabsList>
                  <TabsTrigger value="all">All Phones</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                  <TabsTrigger value="mid-range">Mid-Range</TabsTrigger>
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                </TabsList>
                <TabsContent value="all" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products?.map((product) => (
                      <CardProduct key={product.id} product={product} />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="premium" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products
                      ?.filter((product) => Number(product.price) > 500)
                      .map((product) => (
                        <CardProduct key={product.id} product={product} />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="mid-range" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products
                      ?.filter(
                        (product) =>
                          Number(product.price) >= 300 &&
                          Number(product.price) <= 500,
                      )
                      .map((product) => (
                        <CardProduct key={product.id} product={product} />
                      ))}
                  </div>
                </TabsContent>
                <TabsContent value="budget" className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products
                      ?.filter((product) => Number(product.price) < 300)
                      .map((product) => (
                        <CardProduct key={product.id} product={product} />
                      ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </section>
          <Footer />
        </main>
      </div>
    </ProtectedRoute>
  );
}
