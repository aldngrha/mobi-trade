import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Model } from "../../../../api/types/types";
import { modelSchema } from "../../../../api/schemas/model.schema";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";
import ModelTable from "~/components/table/model-table";
import ModelDialog from "~/components/dialog/model-dialog";

export default function ModelsPage() {
  const [models, setModels] = useState<Model[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<Model | null>(null);

  const emptyForm = {
    name: "",
    brandId: "",
  };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const modelMutation = editingModel
    ? trpc.model.update.useMutation()
    : trpc.model.create.useMutation();
  const deleteMutation = trpc.model.delete.useMutation();

  const { data, isLoading, refetch } = trpc.model.models.useQuery();

  console.log(data);

  const resetForm = () => {
    setEditingModel(null);
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

    const result = modelSchema.safeParse(preparedData);

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

    if (editingModel) {
      const updatedModel: Model = {
        ...validated,
        id: editingModel.id,
      };

      modelMutation.mutate(updatedModel, {
        onSuccess: (data) => {
          setModels((prev) => prev.map((b) => (b.id === data.id ? data : b)));
          setIsDialogOpen(false);
          resetForm();
          refetch();
          toast.success("Model updated successfully!");
        },
        onError: (error) => {
          toast.error(`Error updating model: ${error.message}`);
        },
      });
    } else {
      const newModel: Model = {
        ...validated,
        id: "", // backend akan generate ID-nya
      };

      modelMutation.mutate(newModel, {
        onSuccess: (data) => {
          setModels((prev) => [...prev, data]);
          setIsDialogOpen(false);
          resetForm();
          refetch();
          toast.success("Model created successfully!");
        },
        onError: (error) => {
          toast.error(`Error creating model: ${error.message}`);
        },
      });
    }
  };

  const handleEdit = (model: Model) => {
    setEditingModel(model);
    setFormData({
      name: model.name,
      brandId: model.brandId ?? "",
    });
    setIsDialogOpen(true);
    setErrors({});
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          setModels((prev) => prev.filter((b) => b.id !== id));
          refetch();
          toast.success("Model deleted successfully!");
        },
        onError: (error) => {
          toast.error(`Error deleting model: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Models</h1>
        <ModelDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          formData={formData}
          handleChange={handleChange}
          errors={errors}
          isEditing={!!editingModel}
          resetForm={resetForm}
          isLoading={modelMutation.isPending}
        />
      </div>
      <Card className="overflow-auto">
        <CardHeader>
          <CardTitle>Models List</CardTitle>
        </CardHeader>
        <CardContent>
          {data && (
            <ModelTable
              models={data}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
