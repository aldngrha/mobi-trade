import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Plus, LoaderCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import React from "react";
import { trpc } from "~/lib/trpc";

type GalleryDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: Record<string, string>;
  imageFile: File | null;
  setImageFile: React.Dispatch<React.SetStateAction<File | null>>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  errors: Record<string, string>;
  isEditing: boolean;
  resetForm: () => void;
  isLoading: boolean;
};

export default function GalleryDialog({
  open,
  onOpenChange,
  onSubmit,
  formData,
  handleChange,
  errors,
  isEditing,
  resetForm,
  isLoading,
  setImageFile,
}: GalleryDialogProps) {
  const { data } = trpc.product.getAll.useQuery();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={resetForm} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add Model
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-5xl overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          <div className="flex flex-col">
            <Label htmlFor="name" className="mb-3 font-semibold">
              Model Name
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Select
              value={formData["productId"]}
              onValueChange={(value) =>
                handleChange({
                  target: {
                    id: "productId",
                    value,
                  },
                } as React.ChangeEvent<HTMLInputElement>)
              }
            >
              <SelectTrigger
                id="productId"
                className={`border w-full rounded-md ${
                  errors["name"] ? "border-red-500" : "border-gray-300"
                } rounded px-2 py-1`}
              >
                <SelectValue placeholder="Choose product" />
              </SelectTrigger>
              <SelectContent>
                {data?.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors["productId"] && (
              <p className="text-red-600 text-sm mt-1">{errors["productId"]}</p>
            )}
          </div>
          <div className="flex flex-col">
            <Label htmlFor="product" className="mb-3 font-semibold">
              Image
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0] ?? null;
                setImageFile(file);
              }}
            />
            {errors["image"] && (
              <p className="text-red-600 text-sm mt-1">{errors["image"]}</p>
            )}
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : isEditing ? (
                "Update"
              ) : (
                "Create"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
