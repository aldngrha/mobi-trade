"use client";

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import {
  ArrowLeft,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Truck,
  User,
  Mail,
  Clock,
  CheckCircle,
  XCircle,
  Zap,
  Star,
  DollarSign,
  PackageCheck,
  LoaderCircle,
} from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

import { Separator } from "~/components/ui/separator";
import type { TransactionStatus } from "../../../../api/types/types";
import { trpc } from "~/lib/trpc";
import { cn, formatDateTime } from "~/lib/utils";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  PENDING: "bg-slate-200 text-slate-500",
  PAID: "bg-amber-200 text-amber-500",
  APPROVED: "bg-sky-200 text-sky-500",
  REJECTED: "bg-red-200 text-red-500",
  SHIPPED: "bg-blue-200 text-blue-500",
  DELIVERED: "bg-green-200 text-green-500",
};

const paymentMethods: Record<string, string> = {
  credit: "bg-sky-200 text-sky-500",
  bank: "bg-slate-200 text-slate-500",
};

const shippingMethods: Record<string, string> = {
  standard: "text-amber-500 bg-amber-200",
  express: "text-green-500 bg-green-200",
  priority: "text-blue-500 bg-blue-200",
};

const shippingIcons: Record<string, React.ReactNode> = {
  standard: <Clock className="w-4 h-4 mr-1" />,
  express: <Zap className="w-4 h-4 mr-1" />,
  priority: <Star className="w-4 h-4 mr-1" />,
};

const statusIcons: Record<string, React.ReactNode> = {
  PENDING: <Clock className="w-4 h-4 mr-1" />,
  PAID: <DollarSign className="w-4 h-4 mr-1" />,
  APPROVED: <CheckCircle className="w-4 h-4 mr-1" />,
  REJECTED: <XCircle className="w-4 h-4 mr-1" />,
  SHIPPED: <Truck className="w-4 h-4 mr-1" />,
  DELIVERED: <PackageCheck className="w-4 h-4 mr-1" />,
};

export default function TransactionDetailPage() {
  const { transactionId } = useParams() as { transactionId: string };

  const { data, refetch } = trpc.checkout.transaction.useQuery({
    id: transactionId,
  });

  const result = data?.transaction2;

  const transactionMutation = trpc.checkout.updateStatus.useMutation();

  const handleApprove = () => {
    const newStatus: TransactionStatus = "APPROVED";

    const payload = {
      transactionId,
      status: newStatus,
    };

    transactionMutation.mutate(payload, {
      onSuccess: (result) => {
        refetch();
        toast.success(result.message);
      },
      onError: () => {
        toast.error("Failed to update transaction status");
      },
    });
  };

  const handleReject = () => {
    const newStatus: TransactionStatus = "REJECTED";

    const payload = {
      transactionId,
      status: newStatus,
    };

    transactionMutation.mutate(payload, {
      onSuccess: (result) => {
        refetch();
        toast.success(result.message);
      },
      onError: () => {
        toast.error("Failed to update transaction status");
      },
    });
  };

  const handleShip = () => {
    const newStatus: TransactionStatus = "SHIPPED";

    const payload = {
      transactionId,
      status: newStatus,
    };

    transactionMutation.mutate(payload, {
      onSuccess: (result) => {
        refetch();
        toast.success(result.message);
      },
      onError: () => {
        toast.error("Failed to update transaction status");
      },
    });
  };

  if (!result) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-4 text-center">
        <h1 className="text-4xl font-bold">404 - Transaction Not Found</h1>
        <p className="text-muted-foreground">
          The transaction you're looking for doesn't exist.
        </p>
        <Button asChild>
          <Link to="/admin/transactions">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transactions
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Link
            to="/admin/transactions"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Transactions
          </Link>
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Transaction Details</h1>
            <p className="text-muted-foreground">
              Order #{result?.orderReference}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Transaction Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Order Items ({result?.items.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {result?.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          {item.storage && (
                            <Badge variant="outline">{item.storage}</Badge>
                          )}
                          {item.condition && (
                            <Badge variant="outline">{item.condition}</Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground mt-1">
                          Quantity: {item.quantity} × ${item.price.toString()}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          $
                          {(
                            Number.parseFloat(item.price.toString()) *
                            item.quantity
                          ).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Separator className="my-4" />
                <div className="flex justify-between items-center font-medium text-lg">
                  <span>Total</span>
                  <span>${result?.totalPrice?.toString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Shipping Address */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Shipping Address
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result?.shippingAddress ? (
                  <div className="space-y-2">
                    <div className="font-medium">
                      {result?.shippingAddress.fullName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result?.shippingAddress.addressLine}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result?.shippingAddress.city},{" "}
                      {result?.shippingAddress.state}{" "}
                      {result?.shippingAddress.postalCode}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {result?.shippingAddress.country}
                    </div>
                    <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4" />
                        {result?.shippingAddress.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4" />
                        {result?.shippingAddress.phoneNumber}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">
                    No shipping address provided
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Payment Information */}
            {/*<Card>*/}
            {/*  <CardHeader>*/}
            {/*    <CardTitle className="flex items-center gap-2">*/}
            {/*      <CreditCard className="h-5 w-5" />*/}
            {/*      Payment Information*/}
            {/*    </CardTitle>*/}
            {/*  </CardHeader>*/}
            {/*  <CardContent>*/}
            {/*    <div className="space-y-4">*/}
            {/*      {result?.payments.map((payment) => (*/}
            {/*        <div*/}
            {/*          key={payment.id}*/}
            {/*          className="flex justify-between items-center p-4 border rounded-lg"*/}
            {/*        >*/}
            {/*          <div>*/}
            {/*            <div className="font-medium">*/}
            {/*              {payment.paymentMethod}*/}
            {/*            </div>*/}
            {/*            <div className="text-sm text-muted-foreground">*/}
            {/*              Reference: {payment.paymentReference || "N/A"}*/}
            {/*            </div>*/}
            {/*            {payment.paidAt && (*/}
            {/*              <div className="text-sm text-muted-foreground">*/}
            {/*                Paid: {new Date(payment.paidAt).toLocaleString()}*/}
            {/*              </div>*/}
            {/*            )}*/}
            {/*          </div>*/}
            {/*          <Badge*/}
            {/*            className={`${paymentStatusColors[payment.paymentStatus]} border`}*/}
            {/*          >*/}
            {/*            {payment.paymentStatus}*/}
            {/*          </Badge>*/}
            {/*        </div>*/}
            {/*      ))}*/}
            {/*    </div>*/}
            {/*  </CardContent>*/}
            {/*</Card>*/}
          </div>

          <div className="space-y-6">
            {/* Transaction Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Transaction Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-mono text-sm">{result?.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Order Reference</span>
                  <span className="font-mono text-sm">
                    {result?.orderReference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge
                    className={cn(
                      "flex items-center",
                      statusColors[result?.status],
                    )}
                  >
                    {statusIcons[result?.status]}
                    {result?.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Amount</span>
                  <span className="font-medium">
                    ${result?.totalPrice?.toString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping Method</span>
                  <Badge
                    className={cn(
                      "flex items-center",
                      result && shippingMethods[result?.shippingMethod],
                    )}
                  >
                    {result && shippingIcons[result?.shippingMethod]}
                    {result?.shippingMethod.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Method</span>
                  <Badge
                    className={cn(
                      result && paymentMethods[result?.paymentMethod],
                    )}
                  >
                    <CreditCard />
                    {result?.paymentMethod === "bank"
                      ? "BANK TRANSFER"
                      : "CREDIT CARD"}
                  </Badge>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span className="text-sm">
                    {result && formatDateTime(result?.createdAt)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span className="text-sm">
                    {result && formatDateTime(result?.updatedAt)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Customer ID</span>
                  <span className="font-mono text-sm">{result?.user.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span>{result?.user.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span>{result?.user.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Member Since</span>
                  <span className="text-sm">
                    {result && formatDateTime(result?.user?.createdAt)}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            {!(
              result?.status === "DELIVERED" ||
              result?.status === "PENDING" ||
              result?.status === "SHIPPED" ||
              result?.status === "REJECTED"
            ) && (
              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 flex justify-between space-x-2">
                  {result?.status === "PAID" ? (
                    <>
                      <Button
                        onClick={handleApprove}
                        disabled={transactionMutation.isPending}
                        className="w-1/2 bg-sky-200 hover:bg-sky-300 text-sky-500 cursor-pointer"
                      >
                        {transactionMutation.isPending ? (
                          <LoaderCircle className="animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            APPROVE
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleReject}
                        disabled={transactionMutation.isPending}
                        className="w-1/2 bg-red-200 hover:bg-red-300 text-red-500 cursor-pointer"
                      >
                        {transactionMutation.isPending ? (
                          <LoaderCircle className="animate-spin" />
                        ) : (
                          <>
                            <XCircle className="h-4 w-4" />
                            REJECT
                          </>
                        )}
                      </Button>
                    </>
                  ) : result?.status === "APPROVED" ? (
                    <Button
                      onClick={handleShip}
                      disabled={transactionMutation.isPending}
                      className="w-full bg-blue-200 cursor-pointer hover:bg-blue-300 text-blue-500"
                    >
                      {transactionMutation.isPending ? (
                        <LoaderCircle className="animate-spin" />
                      ) : (
                        <>
                          <Truck className="h-4 w-4" />
                          SHIP
                        </>
                      )}
                    </Button>
                  ) : (
                    ""
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
