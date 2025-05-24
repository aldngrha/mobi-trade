import { Link } from "react-router";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Search, ShoppingCart, User } from "lucide-react";
import { Badge } from "~/components/ui/badge";
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

interface NavbarProps {
  onlyLogo: boolean;
  isSearch: boolean;
}

export default function Navbar({ onlyLogo, isSearch }: NavbarProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { cartItems } = useCart();
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Trigger animasi saat cartCount > 0 dan berubah
  useEffect(() => {
    if (cartItems > 0) {
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
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="flex h-16 items-center justify-between py-4 mx-auto container">
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
                />
                <Button
                  type="submit"
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
                  className="hidden md:flex cursor-pointer"
                  asChild
                >
                  <Link to="/sign-in">Sign In</Link>
                </Button>
                <Button size="sm" className="hidden md:flex" asChild>
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
