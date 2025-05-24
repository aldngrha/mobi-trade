"use client";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Eye, EyeOff, LoaderCircle, Lock, Mail, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Separator } from "~/components/ui/separator";
import Footer from "~/components/shared/footer";
import Navbar from "~/components/shared/navbar";
import { z } from "zod";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Email not valid"),
    password: z.string().min(6, "Password minimal 6 characters"),
    confirmPassword: z.string().min(6, "Confirm password minimal 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type RegisterData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof RegisterData, string>>
  >({});

  const registerMutation = trpc.auth.register.useMutation({
    onSuccess: () => {
      toast.success("Registration success! Please login.");
      navigate("/sign-in");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validation = registerSchema.safeParse(formData);
    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof RegisterData, string>> = {};
      validation.error.errors.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof RegisterData] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    registerMutation.mutate(formData);
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar onlyLogo />
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">
              Create an account
            </CardTitle>
            <CardDescription>Fill in the details to register</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    className="pl-10"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={!!errors.name}
                    aria-describedby="name-error"
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="text-sm text-red-600 mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={!!errors.email}
                    aria-describedby="email-error"
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-sm text-red-600 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    aria-invalid={!!errors.password}
                    aria-describedby="password-error"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-sm text-red-600 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-10 pr-10"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby="confirmPassword-error"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span className="sr-only">
                      {showConfirmPassword ? "Hide password" : "Show password"}
                    </span>
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p
                    id="confirmPassword-error"
                    className="text-sm text-red-600 mt-1"
                  >
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={registerMutation.isPending}
              >
                {registerMutation.isPending ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  "Register"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col">
            <div className="text-center text-sm text-muted-foreground mt-2">
              Already have an account?{" "}
              <Link
                to="/sign-in"
                className="font-medium text-primary hover:underline underline-offset-4"
              >
                Sign in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
