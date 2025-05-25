import React, { useState } from "react";
import { z } from "zod";
import ProductTable from "~/components/table/product-table";
import ProductDialog from "~/components/dialog/product-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { type Product } from "../../../../api/types/types";
import { productSchema } from "../../../../api/schemas/product.schema";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const emptyForm = {
    sku: "",
    name: "",
    modelId: "",
    description: "",
    price: "",
    discount: "",
    minimumOrderQuantity: "",
    batteryHealth: "",
    display: "",
    processor: "",
    camera: "",
    battery: "",
    os: "",
    connectivity: "",
  };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const productMutation = editingProduct
    ? trpc.product.update.useMutation()
    : trpc.product.create.useMutation();
  const deleteMutation = trpc.product.delete.useMutation();

  const { data, isPending, refetch } = trpc.product.getAll.useQuery();

  const resetForm = () => {
    setEditingProduct(null);
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
      discount: Number(formData.discount),
      minimumOrderQuantity: Number(formData.minimumOrderQuantity),
      batteryHealth: formData.batteryHealth
        ? Number(formData.batteryHealth)
        : null,
    };

    const result = productSchema.safeParse(preparedData);

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

    if (editingProduct) {
      const updatedProduct: Product = {
        ...validated,
        id: editingProduct.id,
      };

      productMutation.mutate(updatedProduct, {
        onSuccess: (data) => {
          setProducts((prev) => prev.map((p) => (p.id === data.id ? data : p)));
          setIsDialogOpen(false);
          resetForm();
          refetch();
          toast.success("Product updated successfully!");
        },
        onError: (error) => {
          toast.error(`Error updating product: ${error.message}`);
        },
      });
    } else {
      const newProduct: Product = {
        ...validated,
        id: "",
        price: String(validated.price),
      };

      productMutation.mutate(newProduct, {
        onSuccess: (data) => {
          setProducts((prev) => [...prev, data]);
          setIsDialogOpen(false);
          resetForm();
          refetch();
          toast.success("Product created successfully!");
        },
        onError: (error) => {
          toast.error(`Error creating product: ${error.message}`);
        },
      });
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      sku: product.sku,
      name: product.name,
      modelId: product.modelId,
      description: product.description,
      price: String(product.price),
      discount: product.discount?.toString() || "",
      minimumOrderQuantity: product.minimumOrderQuantity.toString() || "",
      batteryHealth: product.batteryHealth?.toString() || "",
      display: product.display || "",
      processor: product.processor || "",
      camera: product.camera || "",
      battery: product.battery || "",
      os: product.os || "",
      connectivity: product.connectivity || "",
    });
    setIsDialogOpen(true);
    setErrors({});
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          setProducts((prev) => prev.filter((b) => b.id !== id));
          refetch();
          toast.success("Product deleted successfully!");
        },
        onError: (error) => {
          toast.error(`Error deleting product: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <ProductDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          isEditing={!!editingProduct}
          resetForm={resetForm}
          isLoading={productMutation.isPending}
        />
      </div>
      <Card className="overflow-auto">
        <CardHeader>
          <CardTitle>Product List</CardTitle>
        </CardHeader>
        <CardContent>
          {data && (
            <ProductTable
              products={data.map((item) => ({
                ...item,
                price: item.price != null ? String(item.price) : "0",
              }))}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
