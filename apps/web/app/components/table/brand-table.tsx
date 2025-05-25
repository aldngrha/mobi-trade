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
import type { Brand, Product } from "../../../../api/types/types";

type ProductTableProps = {
  brands: Brand[];
  onEdit: (product: Brand) => void;
  onDelete: (id: string) => void;
};

export default function BrandTable({
  brands,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead className="text-end">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {brands?.map((p, i) => (
          <TableRow key={p.id}>
            <TableCell>{i + 1}</TableCell>
            <TableCell>{p.name}</TableCell>
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
        {brands.length === 0 && (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-4">
              No products available
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
