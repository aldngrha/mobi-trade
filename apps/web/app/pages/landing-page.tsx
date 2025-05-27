import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import Navbar from "~/components/shared/navbar";
import Footer from "~/components/shared/footer";
import CardProduct from "~/components/shared/card-product";
import { ProtectedRoute } from "~/components/shared/protected-route";
import { trpc } from "~/lib/trpc";
import { useMemo, useState, useRef, useEffect } from "react";
import { LoaderCircle } from "lucide-react";

export default function LandingPage() {
  const [sortOption, setSortOption] = useState("newest");
  const [brandFilter, setBrandFilter] = useState("all");
  const [tabFilter, setTabFilter] = useState("all");
  const { data: products } = trpc.product.productLandingPage.useQuery();
  const initialVisibleCount = 8;
  const [visibleCount, setVisibleCount] = useState(
    products && products.length < initialVisibleCount
      ? products.length
      : initialVisibleCount,
  );
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const { data: brands } = trpc.brand.brandCategories.useQuery();

  const scrollToFeatured = () => {
    const element = document.getElementById("featured-products");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products;

    // Filter by brand
    if (brandFilter !== "all") {
      filtered = filtered?.filter(
        (p) => p.model.brand.name.toLowerCase() === brandFilter.toLowerCase(),
      );
    }

    // Filter by tab category (price)
    filtered = filtered?.filter((product) => {
      const price = Number(product.variants[0].price);
      switch (tabFilter) {
        case "premium":
          return price > 500;
        case "mid-range":
          return price >= 300 && price <= 500;
        case "budget":
          return price < 300;
        default:
          return true;
      }
    });

    // Sort by option
    filtered?.sort((a, b) => {
      switch (sortOption) {
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        case "price-low":
          return Number(a.variants[0].price) - Number(b.variants[0].price);
        case "price-high":
          return Number(b.variants[0].price) - Number(a.variants[0].price);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, brandFilter, tabFilter, sortOption]);

  useEffect(() => {
    if (visibleCount >= (filteredAndSortedProducts?.length || 0)) return;

    let timer: NodeJS.Timeout;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting) {
          timer = setTimeout(() => {
            setVisibleCount((prev) =>
              Math.min(prev + 8, filteredAndSortedProducts?.length || 0),
            );
          }, 1200);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
      if (timer) clearTimeout(timer);
    };
  }, [visibleCount, filteredAndSortedProducts]);

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
                    <Select defaultValue="newest" onValueChange={setSortOption}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="oldest">Oldest First</SelectItem>
                        <SelectItem value="price-low">
                          Price: Low to High
                        </SelectItem>
                        <SelectItem value="price-high">
                          Price: High to Low
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Filter:</span>
                    <Select defaultValue="all" onValueChange={setBrandFilter}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Brands</SelectItem>
                        {brands?.map((brand) => (
                          <SelectItem
                            key={brand.id}
                            value={brand.name.toLowerCase()}
                          >
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Tabs
                defaultValue="all"
                className="mb-8"
                onValueChange={setTabFilter}
              >
                <TabsList>
                  <TabsTrigger value="all">All Phones</TabsTrigger>
                  <TabsTrigger value="premium">Premium</TabsTrigger>
                  <TabsTrigger value="mid-range">Mid-Range</TabsTrigger>
                  <TabsTrigger value="budget">Budget</TabsTrigger>
                </TabsList>

                <TabsContent value={tabFilter} className="mt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredAndSortedProducts
                      ?.slice(0, visibleCount)
                      .map((product) => (
                        <CardProduct key={product.id} product={product} />
                      ))}
                  </div>
                  <div
                    ref={loaderRef}
                    className="h-10 mt-4 flex justify-center items-center"
                  >
                    {filteredAndSortedProducts &&
                      visibleCount < filteredAndSortedProducts?.length && (
                        <LoaderCircle className="animate-spin text-slate-400" />
                      )}
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
