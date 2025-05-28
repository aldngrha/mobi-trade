import { Link } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search, ShoppingCart, User } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import { useCart } from "~/context/cart-context";
import { useAuth } from "~/context/auth-context";
import { trpc } from "~/lib/trpc";

interface NavbarProps {
  onlyLogo: boolean;
  isSearch?: boolean;
}

export default function Navbar({ onlyLogo, isSearch }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartItems, clearCart } = useCart();
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { data: products } = trpc.product.productLandingPage.useQuery();
  const { signOut } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<typeof products>([]);

  useEffect(() => {
    if (products && searchTerm.trim() !== "") {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts([]);
    }
  }, [searchTerm, products]);

  // Trigger animasi saat cartCount > 0 dan berubah
  useEffect(() => {
    if (cartItems.length > 0) {
      setShouldAnimate(true);
      const timer = setTimeout(() => setShouldAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [cartItems]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("authToken");
      setIsLoggedIn(!!token);
    }
  }, [isLoggedIn]);

  const logout = () => {
    signOut();
    setIsLoggedIn(false);
    clearCart();
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-16 items-center justify-between py-4 mx-auto p-4 md:p-0 container">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-2xl text-primary"
          >
            MobiTrade
          </Link>
          {!onlyLogo && (
            <nav className="hidden md:flex gap-6">
              <Link
                to="/"
                className="text-sm font-medium hover:underline underline-offset-4"
              >
                Home
              </Link>
            </nav>
          )}
        </div>
        {!onlyLogo && (
          <div className="flex items-center gap-4">
            {!isSearch && (
              <form className="hidden md:flex relative w-full max-w-sm items-center">
                <Input
                  type="search"
                  placeholder="Search phones..."
                  className="pr-12"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <div className="absolute top-full mt-1 w-full bg-white shadow-md border rounded z-50 max-h-60 overflow-auto">
                    {filteredProducts && filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <Link
                          to={`/product/${product.slug}`}
                          key={product.id}
                          className="block px-4 py-2 hover:bg-gray-100 text-sm cursor-pointer"
                          onClick={() => setSearchTerm("")}
                        >
                          {product.name}
                        </Link>
                      ))
                    ) : (
                      <p className="px-4 py-2 text-sm text-gray-500">
                        No product found
                      </p>
                    )}
                  </div>
                )}
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full"
                >
                  <Search className="h-4 w-4" />
                  <span className="sr-only">Search</span>
                </Button>
              </form>
            )}
            {isLoggedIn && (
              <Button
                variant="outline"
                size="icon"
                className="relative"
                asChild
              >
                <Link to="/checkout">
                  <ShoppingCart className="h-4 w-4" />
                  <div
                    className={`absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center ${
                      shouldAnimate ? "animate-bounce" : ""
                    }`}
                  >
                    {cartItems.length}
                  </div>
                </Link>
              </Button>
            )}
            {!isLoggedIn ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="cursor-pointer"
                  asChild
                >
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" className="cursor-pointer" asChild>
                  <Link to="/sign-up">Sign Up</Link>
                </Button>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative rounded-full"
                  >
                    <User className="w-8 h-8" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuItem onClick={logout}>
                    Log out
                    <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
