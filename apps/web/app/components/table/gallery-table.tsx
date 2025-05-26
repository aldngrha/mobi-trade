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
import type { Gallery, Model } from "../../../../api/types/types";

type ProductTableProps = {
  galleries: Gallery[];
  onEdit: (model: Gallery) => void;
  onDelete: (id: string) => void;
};

export default function GalleryTable({
  galleries,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>No</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Image</TableHead>
          <TableHead className="text-end">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {galleries?.length === 0 ? (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              No galleries available
            </TableCell>
          </TableRow>
        ) : (
          galleries?.map((p, i) => (
            <TableRow key={p.id}>
              <TableCell>{i + 1}</TableCell>
              <TableCell>{p.product?.name}</TableCell>
              <TableCell>
                <img
                  src={
                    `http://localhost:5173${p.imageUrl}` || "/placeholder.png"
                  }
                  alt={p.product?.name}
                  className="w-16 h-16 object-cover"
                />
              </TableCell>
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
