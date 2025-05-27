import React, { useState } from "react";
import { z } from "zod";
import ProductTable from "~/components/table/product-table";
import ProductDialog from "~/components/dialog/product-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { type Product } from "../../../../api/types/types";
import { productSchema } from "../../../../api/schemas/product.schema";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";
import TransactionTable from "~/components/table/transactions-table";

export default function TransactionsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data } = trpc.checkout.transactions.useQuery();

  const result = data?.transactions2;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Transactions</h1>
      </div>
      <Card className="overflow-auto">
        <CardHeader>
          <CardTitle>Transactions List</CardTitle>
        </CardHeader>
        <CardContent>
          {result && <TransactionTable transactions={result} />}
        </CardContent>
      </Card>
    </div>
  );
}
