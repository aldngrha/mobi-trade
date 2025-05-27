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
import type { Brand, Product, Variant } from "../../../../api/types/types";

type VariantTableProps = {
  variants: Variant[];
  onEdit: (variant: Variant) => void;
  onDelete: (id: string) => void;
};

export default function VariantTable({
  variants,
  onEdit,
  onDelete,
}: VariantTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Product Name</TableHead>
          <TableHead>Color</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Condition</TableHead>
          <TableHead>RAM (GB)</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Storage (GB)</TableHead>
          <TableHead>Warranty (Months)</TableHead>
          <TableHead className="text-end">Action</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {variants?.map((p, i) => (
          <TableRow key={p.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{p.product?.name}</TableCell>
            <TableCell>{p.color}</TableCell>
            <TableCell>${p.price}</TableCell>
            <TableCell>{p.condition}</TableCell>
            <TableCell>{p.ram}</TableCell>
            <TableCell>{p.stockQuantity}</TableCell>
            <TableCell>{p.storage}</TableCell>
            <TableCell>{p.warrantyMonths}</TableCell>
            <TableCell className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => onEdit(p)}>
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" onClick={() => onDelete(p.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
        {variants.length === 0 && (
          <TableRow>
            <TableCell colSpan={9} className="text-center py-4">
              No products available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
