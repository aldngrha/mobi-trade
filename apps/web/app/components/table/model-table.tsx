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
import type { Model } from "../../../../api/types/types";

type ProductTableProps = {
  models: Model[];
  onEdit: (model: Model) => void;
  onDelete: (id: string) => void;
};

export default function ModelTable({
  models,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Brand Name</TableHead>
          <TableHead className="text-end">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {models?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              No products available
            </TableCell>
          </TableRow>
        ) : (
          models?.map((p, i) => (
            <TableRow key={p.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{p.name}</TableCell>
              <TableCell>{p.brand?.name}</TableCell>
              <TableCell className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => onEdit(p)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="destructive" onClick={() => onDelete(p.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
