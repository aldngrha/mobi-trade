import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import type { Gallery } from "../../../../api/types/types";
import { trpc } from "~/lib/trpc";
import { toast } from "sonner";
import GalleryTable from "~/components/table/gallery-table";
import GalleryDialog from "~/components/dialog/gallery-dialog";
import { toBase64 } from "~/lib/utils";

export default function GalleryPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const emptyForm = {
    productId: "",
    imageUrl: "",
  };
  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = trpc.gallery.create.useMutation();
  const updateMutation = trpc.gallery.update.useMutation();
  const deleteMutation = trpc.gallery.delete.useMutation();

  const { data, isLoading, refetch } = trpc.gallery.list.useQuery();

  const isPending = editingGallery
    ? updateMutation.isPending
    : createMutation.isPending;

  const resetForm = () => {
    setEditingGallery(null);
    setFormData(emptyForm);
    setErrors({});
    setImageFile(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { id, value } = e.target;
    setFormData((f) => ({ ...f, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.productId) {
      setErrors({ productId: "Product ID is required" });
      return;
    }

    try {
      let fileBase64: string | undefined = undefined;
      let fileName: string | undefined = undefined;

      if (imageFile) {
        fileBase64 = await toBase64(imageFile);
        fileName = imageFile.name;
      }

      type CreatePayload = {
        productId: string;
        file: string;
        fileName: string;
      };

      type UpdatePayload = {
        id: string;
        productId: string;
        file?: string;
        fileName?: string;
        imageUrl: string;
      };

      if (editingGallery) {
        const updatePayload: UpdatePayload = {
          id: editingGallery.id,
          productId: formData.productId,
          imageUrl: editingGallery.imageUrl,
        };

        if (fileBase64 && fileName) {
          updatePayload.file = fileBase64;
          updatePayload.fileName = fileName;
        }

        updateMutation.mutate(updatePayload, {
          onSuccess: () => {
            toast.success(`Gallery updated successfully!`);
            resetForm();
            setIsDialogOpen(false);
            refetch();
          },
          onError: (error) => {
            toast.error(`Error updating gallery: ${error.message}`);
          },
        });
      } else {
        // Create requires file & filename to be present
        if (!fileBase64 || !fileName) {
          toast.error("Please upload an image.");
          return;
        }

        const createPayload: CreatePayload = {
          productId: formData.productId,
          file: fileBase64,
          fileName,
        };

        createMutation.mutate(createPayload, {
          onSuccess: () => {
            toast.success(`Gallery created successfully!`);
            resetForm();
            setIsDialogOpen(false);
            refetch();
          },
          onError: (error) => {
            toast.error(`Error creating gallery: ${error.message}`);
          },
        });
      }
    } catch (err) {
      toast.error("Failed to process image");
    }
  };

  const handleEdit = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setFormData({
      productId: gallery.productId,
      imageUrl: gallery.imageUrl,
    });
    setIsDialogOpen(true);
    setErrors({});
    setImageFile(null);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(
      { id },
      {
        onSuccess: () => {
          refetch();
          toast.success("Gallery deleted successfully!");
        },
        onError: (error) => {
          toast.error(`Error deleting gallery: ${error.message}`);
        },
      },
    );
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Galleries</h1>
        <GalleryDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          formData={formData}
          setImageFile={setImageFile}
          handleChange={handleChange}
          errors={errors}
          isEditing={!!editingGallery}
          resetForm={resetForm}
          imageFile={imageFile}
          isLoading={isPending}
        />
      </div>
      <Card className="overflow-auto">
        <CardHeader>
          <CardTitle>Galleries List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>Loading...</div>
          ) : data ? (
            <GalleryTable
              galleries={data}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ) : (
            <div>No data found.</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
