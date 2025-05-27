import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  CheckCircle,
  Clock,
  CreditCard,
  DollarSign,
  Eye,
  PackageCheck,
  Star,
  Truck,
  XCircle,
  Zap,
} from "lucide-react";
import { cn, formatDateTime } from "~/lib/utils";
import type { Transaction, TransactionItem } from "../../../../api/types/types";
import { Link } from "react-router";

type Transaction2 = Omit<
  Transaction,
  "payments" | "shippingAddress" | "items"
> & {
  items: Array<Omit<TransactionItem, "product" | "transaction">>;
};

type ProductTableProps = {
  transactions: Transaction2[];
};

export default function TransactionsTable({ transactions }: ProductTableProps) {
  const statusColors: Record<string, string> = {
    PENDING: "bg-slate-200 text-slate-500",
    PAID: "bg-amber-200 text-amber-500",
    APPROVED: "bg-sky-200 text-sky-500",
    REJECTED: "bg-red-200 text-red-500",
    SHIPPED: "bg-blue-200 text-blue-500",
    DELIVERED: "bg-green-200 text-green-500",
  };

  const statusIcons: Record<string, React.ReactNode> = {
    PENDING: <Clock className="w-4 h-4 mr-1" />,
    PAID: <DollarSign className="w-4 h-4 mr-1" />,
    APPROVED: <CheckCircle className="w-4 h-4 mr-1" />,
    REJECTED: <XCircle className="w-4 h-4 mr-1" />,
    SHIPPED: <Truck className="w-4 h-4 mr-1" />,
    DELIVERED: <PackageCheck className="w-4 h-4 mr-1" />,
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

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Buyer Name</TableHead>
          <TableHead>Order Reference</TableHead>
          <TableHead>Total Price</TableHead>
          <TableHead>Total Transaction</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Payment Method</TableHead>
          <TableHead>Shipping Method</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions?.map((p, i) => (
          <TableRow key={p.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{p.user.name}</TableCell>
            <TableCell>{p.orderReference}</TableCell>
            <TableCell>{p.totalPrice}</TableCell>
            <TableCell>{p.items.length}</TableCell>
            <TableCell>
              <Badge
                className={cn("flex items-center", statusColors[p.status])}
              >
                {statusIcons[p.status]}
                {p.status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge className={paymentMethods[p.paymentMethod]}>
                <CreditCard />
                {p.paymentMethod === "bank" ? "BANK TRANSFER" : "CREDIT CARD"}
              </Badge>
            </TableCell>
            <TableCell className="text-sm">
              <Badge
                className={cn(
                  "flex items-center",
                  shippingMethods[p.shippingMethod],
                )}
              >
                {shippingIcons[p.shippingMethod]}
                {p.shippingMethod.toUpperCase()}
              </Badge>
            </TableCell>
            <TableCell>{formatDateTime(p.createdAt)}</TableCell>
            <TableCell className="flex gap-2 cursor-pointer">
              <Button variant="outline" asChild>
                <Link to={`/admin/transaction/${p.id}`}>
                  <Eye className="h-4 w-4" />
                </Link>
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {transactions.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              No transactions available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
