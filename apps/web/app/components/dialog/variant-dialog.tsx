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
import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { trpc } from "~/lib/trpc";
import { Textarea } from "~/components/ui/textarea";

type VariantDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (e: React.FormEvent) => void;
  formData: Record<string, string>;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  errors: Record<string, string>;
  isEditing: boolean;
  resetForm: () => void;
  isLoading: boolean;
};

export default function VariantDialog({
  open,
  onOpenChange,
  onSubmit,
  formData,
  handleChange,
  errors,
  isEditing,
  resetForm,
  isLoading,
}: VariantDialogProps) {
  const { data } = trpc.product.getAll.useQuery();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={resetForm} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add Variant
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-5xl overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          {form.map(({ id, label, type, required, min }) => (
            <div key={id} className="flex flex-col">
              <Label htmlFor={id} className="mb-3 font-semibold">
                {label}
                {required && <span className="text-red-500 ml-1">*</span>}
              </Label>
              {type === "textarea" ? (
                <Textarea
                  id={id}
                  value={formData[id as keyof typeof formData]}
                  onChange={handleChange}
                  className={`border ${
                    errors[id] ? "border-red-500" : "border-gray-300"
                  } rounded px-2 py-1`}
                  rows={3}
                />
              ) : type === "select" ? (
                <Select
                  value={formData[id as keyof typeof formData]}
                  onValueChange={(value) =>
                    handleChange({
                      target: {
                        id: id,
                        value,
                      },
                    } as React.ChangeEvent<HTMLInputElement>)
                  }
                >
                  <SelectTrigger
                    id={id}
                    className={`border w-full rounded-md ${
                      errors[id] ? "border-red-500" : "border-gray-300"
                    } rounded px-2 py-1`}
                  >
                    <SelectValue placeholder="Choose variant" />
                  </SelectTrigger>
                  <SelectContent>
                    {data?.map((variant) => (
                      <SelectItem key={variant.id} value={variant.id}>
                        {variant.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={id}
                  type={type}
                  value={formData[id as keyof typeof formData]}
                  onChange={handleChange}
                  min={min}
                  className={`border ${
                    errors[id] ? "border-red-500" : "border-gray-300"
                  } rounded px-2 py-1`}
                />
              )}
              {errors[id] && (
                <p className="text-red-600 text-sm mt-1">{errors[id]}</p>
              )}
            </div>
          ))}
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

const form = [
  {
    id: "productId",
    label: "Product",
    type: "select",
    required: true,
  },
  {
    id: "storage",
    label: "Storage",
    type: "number",
  },
  {
    id: "ram",
    label: "RAM",
    type: "number",
  },
  {
    id: "color",
    label: "Color",
    type: "text",
  },
  {
    id: "condition",
    label: "Condition",
    type: "text",
  },
  {
    id: "price",
    label: "Price",
    type: "number",
    required: true,
    min: 0,
  },
  {
    id: "stockQuantity",
    label: "Stock Quantity",
    type: "number",
    required: true,
    min: 0,
  },
  {
    id: "warrantyMonths",
    label: "Warranty (Months)",
    type: "number",
    min: 0,
  },
];
