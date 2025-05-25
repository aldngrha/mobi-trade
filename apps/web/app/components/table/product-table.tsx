import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Button } from "~/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import type { Product } from "../../../../api/types/types";

type ProductTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>SKU</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products?.map((p) => (
          <TableRow key={p.id}>
            <TableCell>{p.sku}</TableCell>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.brand}</TableCell>
            <TableCell>{p.price}</TableCell>
            <TableCell>{p.stockQuantity}</TableCell>
            <TableCell className="flex gap-2">
              <Button variant="outline" onClick={() => onEdit(p)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" onClick={() => onDelete(p.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {products.length === 0 && (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              No products available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
