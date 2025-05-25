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
import { Textarea } from "~/components/ui/textarea";
import { Plus, LoaderCircle } from "lucide-react";
import React from "react";

type ProductDialogProps = {
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

export default function ProductDialog({
  open,
  onOpenChange,
  onSubmit,
  formData,
  handleChange,
  errors,
  isEditing,
  resetForm,
  isLoading,
}: ProductDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button onClick={resetForm} className="cursor-pointer">
          <Plus className="h-4 w-4 mr-2" />
          Add Produk
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-5xl overflow-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          {form.map(({ id, label, type, required, step, min, max }) => (
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
              ) : (
                <Input
                  id={id}
                  type={type}
                  value={formData[id as keyof typeof formData]}
                  onChange={handleChange}
                  step={step}
                  min={min}
                  max={max}
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
          <div className="grid gap-2">
            <Label htmlFor="description mb-3">
              Description
              <span className="text-red-500 ml-1">*</span>
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={handleChange}
            />
            {errors["description"] && (
              <p className="text-sm text-red-500">{errors["description"]}</p>
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

const form = [
  { id: "sku", label: "SKU", type: "text", required: true },
  { id: "name", label: "Name", type: "text", required: true },
  { id: "brand", label: "Brand", type: "text" },
  { id: "model", label: "Model", type: "text", required: true },
  {
    id: "description",
    label: "Description",
    type: "textarea",
    required: true,
  },
  {
    id: "price",
    label: "Price",
    type: "number",
    step: "0.01",
    required: true,
  },
  {
    id: "discount",
    label: "Discount (%)",
    type: "number",
    min: 0,
    max: 100,
  },
  { id: "condition", label: "Condition", type: "text" },
  { id: "storage", label: "Storage", type: "text" },
  {
    id: "minimumOrderQuantity",
    label: "Minimum Order Quantity",
    type: "number",
    min: 1,
    required: true,
  },
  {
    id: "warrantyMonths",
    label: "Warranty (Months)",
    type: "number",
    min: 0,
  },
  {
    id: "stockQuantity",
    label: "Stock Quantity",
    type: "number",
    min: 0,
    required: true,
  },
  {
    id: "reviewsCount",
    label: "Reviews Count",
    type: "number",
    min: 0,
  },
  {
    id: "batteryHealth",
    label: "Battery Health (%)",
    type: "number",
    min: 0,
    max: 100,
  },
  { id: "ram", label: "RAM", type: "text" },
  { id: "display", label: "Display", type: "text" },
  { id: "processor", label: "Processor", type: "text" },
  { id: "camera", label: "Camera", type: "text" },
  { id: "battery", label: "Battery", type: "text" },
  { id: "os", label: "Operating System", type: "text" },
  { id: "connectivity", label: "Connectivity", type: "text" },
  { id: "color", label: "Color", type: "text" },
];
