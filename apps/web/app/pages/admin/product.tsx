import React, { useState } from "react";
import { z } from "zod";
import ProductTable from "~/components/table/product-table";
import ProductDialog from "~/components/dialog/product-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Product } from "../../../../api/types/types";
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
    brand: "",
    model: "",
    description: "",
    price: "",
    discount: "",
    condition: "",
    storage: "",
    minimumOrderQuantity: "",
    warrantyMonths: "",
    stockQuantity: "",
    reviewsCount: "",
    batteryHealth: "",
    ram: "",
    display: "",
    processor: "",
    camera: "",
    battery: "",
    os: "",
    connectivity: "",
    color: "",
  };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const productMutation = trpc.product.create.useMutation();

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
      discount: formData.discount ? Number(formData.discount) : null,
      minimumOrderQuantity: formData.minimumOrderQuantity
        ? Number(formData.minimumOrderQuantity)
        : null,
      warrantyMonths: formData.warrantyMonths
        ? Number(formData.warrantyMonths)
        : null,
      stockQuantity: formData.stockQuantity
        ? Number(formData.stockQuantity)
        : null,
      reviewsCount: formData.reviewsCount
        ? Number(formData.reviewsCount)
        : null,
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

      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p)),
      );
      setIsDialogOpen(false);
      resetForm();
    } else {
      const newProduct: Product = {
        ...validated,
        id: "", // backend akan generate ID-nya
      };

      productMutation.mutate(newProduct, {
        onSuccess: (data) => {
          setProducts((prev) => [...prev, data]);
          setIsDialogOpen(false);
          resetForm();
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
      brand: product.brand || "",
      model: product.model,
      description: product.description,
      price: product.price.toString(),
      discount: product.discount?.toString() || "",
      condition: product.condition || "",
      storage: String(product.storage) || "",
      minimumOrderQuantity: product.minimumOrderQuantity.toString(),
      warrantyMonths: product.warrantyMonths?.toString() || "",
      stockQuantity: product.stockQuantity?.toString() || "",
      reviewsCount: product.reviewsCount?.toString() || "",
      batteryHealth: product.batteryHealth?.toString() || "",
      ram: product.ram || "",
      display: product.display || "",
      processor: product.processor || "",
      camera: product.camera || "",
      battery: product.battery || "",
      os: product.os || "",
      connectivity: product.connectivity || "",
      color: product.color || "",
    });
    setIsDialogOpen(true);
    setErrors({});
  };

  const handleDelete = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
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
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
