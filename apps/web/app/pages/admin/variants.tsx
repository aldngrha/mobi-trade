import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Variant } from "../../../../api/types/types";
import { productVariantSchema } from "../../../../api/schemas/variant.schema";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";
import VariantTable from "~/components/table/variant-table";
import VariantDialog from "~/components/dialog/variant-dialog";

export default function VariantPage() {
  const [variants, setVariants] = useState<Variant[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null);

  const emptyForm = {
    productId: "",
    color: "",
    price: "",
    condition: "",
    ram: "",
    stockQuantity: "",
    storage: "",
    warrantyMonths: "",
  };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const variantMutation = editingVariant
    ? trpc.variant.update.useMutation()
    : trpc.variant.create.useMutation();
  const deleteMutation = trpc.variant.delete.useMutation();

  const { data, isLoading, refetch } = trpc.variant.list.useQuery();

  const resetForm = () => {
    setEditingVariant(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((f) => ({ ...f, [id]: value }));
  };

  console.log(formData);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const preparedData = {
      ...formData,
      price: Number(formData.price),
      stockQuantity: Number(formData.stockQuantity),
      warrantyMonths: formData.warrantyMonths
        ? Number(formData.warrantyMonths)
        : undefined,
      ram: formData.ram || undefined,
      storage: formData.storage || undefined,
    };

    const result = productVariantSchema.safeParse(preparedData);

    if (!result.success) {
      const zodErrors: Record<string, string> = {};
      for (const err of result.error.errors) {
        if (err.path[0]) {
          zodErrors[err.path[0] as string] = err.message;
        }
      }
      setErrors(zodErrors);
      return;
    }

    const validated = result.data;

    if (editingVariant) {
      const updatedVariant: Variant = {
        ...validated,
        id: editingVariant.id,
      };

      variantMutation.mutate(updatedVariant, {
        onSuccess: (data) => {
          setVariants((prev) => prev.map((b) => (b.id === data.id ? data : b)));
          setIsDialogOpen(false);
          resetForm();
          refetch();
          toast.success("Variant updated successfully!");
        },
        onError: (error) => {
          toast.error(`Error updating variant: ${error.message}`);
        },
      });
    } else {
      const newVariant: Variant = {
        ...validated,
        id: "",
      };

      variantMutation.mutate(newVariant, {
        onSuccess: (data) => {
          setVariants((prev) => [...prev, data]);
          setIsDialogOpen(false);
          resetForm();
          refetch();
          toast.success("Variant created successfully!");
        },
        onError: (error) => {
          toast.error(`Error creating variant: ${error.message}`);
        },
      });
    }
  };

  const handleEdit = (variant: Variant) => {
    setEditingVariant(variant);
    setFormData({
      productId: editingVariant?.productId || variant.productId,
      color: variant.color || "",
      price: variant.price.toString() || "",
      condition: variant.condition || "",
      ram: variant.ram || "",
      stockQuantity: variant.stockQuantity.toString() || "",
      storage: variant.storage || "",
      warrantyMonths: variant.warrantyMonths?.toString() || "",
    });
    setIsDialogOpen(true);
    setErrors({});
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          setVariants((prev) => prev.filter((b) => b.id !== id));
          refetch();
          toast.success("Variant deleted successfully!");
        },
        onError: (error) => {
          toast.error(`Error deleting variant: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Variant</h1>
        <VariantDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          isEditing={!!editingVariant}
          resetForm={resetForm}
          isLoading={variantMutation.isPending}
        />
      </div>
      <Card className="overflow-auto">
        <CardHeader>
          <CardTitle>Variant List</CardTitle>
        </CardHeader>
        <CardContent>
          {data && (
            <VariantTable
              variants={data}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
