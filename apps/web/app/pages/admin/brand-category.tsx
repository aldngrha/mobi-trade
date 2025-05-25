import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Brand } from "../../../../api/types/types";
import { brandSchema } from "../../../../api/schemas/brand.schema";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";
import BrandDialog from "~/components/dialog/brand-dialog";
import BrandTable from "~/components/table/brand-table";

export default function BrandCategoryPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);

  const emptyForm = {
    name: "",
  };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const brandMutation = editingBrand
    ? trpc.brand.update.useMutation()
    : trpc.brand.create.useMutation();
  const deleteMutation = trpc.brand.delete.useMutation();

  const { data, isLoading, refetch } = trpc.brand.brandCategories.useQuery();

  const resetForm = () => {
    setEditingBrand(null);
    setFormData(emptyForm);
    setErrors({});
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((f) => ({ ...f, [id]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const preparedData = {
      ...formData,
    };

    const result = brandSchema.safeParse(preparedData);

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

    if (editingBrand) {
      const updatedBrand: Brand = {
        ...validated,
        id: editingBrand.id,
      };

      brandMutation.mutate(updatedBrand, {
        onSuccess: (data) => {
          setBrands((prev) => prev.map((b) => (b.id === data.id ? data : b)));
          setIsDialogOpen(false);
          resetForm();
          refetch();
          toast.success("Brand updated successfully!");
        },
        onError: (error) => {
          toast.error(`Error updating brand: ${error.message}`);
        },
      });
    } else {
      const newBrand: Brand = {
        ...validated,
        id: "", // backend akan generate ID-nya
      };

      brandMutation.mutate(newBrand, {
        onSuccess: (data) => {
          setBrands((prev) => [...prev, data]);
          setIsDialogOpen(false);
          resetForm();
          refetch();
          toast.success("Brand created successfully!");
        },
        onError: (error) => {
          toast.error(`Error creating brand: ${error.message}`);
        },
      });
    }
  };

  const handleEdit = (product: Brand) => {
    setEditingBrand(product);
    setFormData({
      name: product.name,
    });
    setIsDialogOpen(true);
    setErrors({});
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          setBrands((prev) => prev.filter((b) => b.id !== id));
          refetch();
          toast.success("Brand deleted successfully!");
        },
        onError: (error) => {
          toast.error(`Error deleting brand: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Brand Categories</h1>
        <BrandDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          isEditing={!!editingBrand}
          resetForm={resetForm}
          isLoading={brandMutation.isPending}
        />
      </div>
      <Card className="overflow-auto">
        <CardHeader>
          <CardTitle>Brand Categories List</CardTitle>
        </CardHeader>
        <CardContent>
          {data && (
            <BrandTable
              brands={data}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
