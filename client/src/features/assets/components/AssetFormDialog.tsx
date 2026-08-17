import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { assetFormSchema, type AssetFormValues } from "../schemas/asset.schema";
import { useCreateAsset } from "../hooks/useCreateAsset";
import { useUpdateAsset } from "../hooks/useUpdateAsset";

import type { Asset } from "../types/asset.types";

interface AssetFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: Asset | null;
}

export function AssetFormDialog({
  open,
  onOpenChange,
  asset,
}: AssetFormDialogProps) {
  const isEditMode = !!asset;

  const createMutation = useCreateAsset();
  const updateMutation = useUpdateAsset();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AssetFormValues>({
    resolver: zodResolver(assetFormSchema),
    defaultValues: {
      name: "",
      assetTag: "",
      manufacturer: "",
      model: "",
      serialNumber: "",
      purchaseDate: "",
      warrantyUntil: "",
      location: "",
      notes: "",
      status: "ACTIVE",
    },
  });

  // Reset form when dialog opens or asset changes
  useEffect(() => {
    if (open) {
      if (asset) {
        reset({
          name: asset.name,
          assetTag: asset.assetTag,
          manufacturer: asset.manufacturer || "",
          model: asset.model || "",
          serialNumber: asset.serialNumber || "",
          purchaseDate: asset.purchaseDate ? asset.purchaseDate.split('T')[0] : "",
          warrantyUntil: asset.warrantyUntil ? asset.warrantyUntil.split('T')[0] : "",
          location: asset.location || "",
          notes: asset.notes || "",
          status: asset.status,
        });
      } else {
        reset({
          name: "",
          assetTag: "",
          manufacturer: "",
          model: "",
          serialNumber: "",
          purchaseDate: "",
          warrantyUntil: "",
          location: "",
          notes: "",
          status: "ACTIVE",
        });
      }
    }
  }, [open, asset, reset]);

  const onSubmit = async (data: AssetFormValues) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync({
          id: asset.id,
          input: {
            name: data.name,
            assetTag: data.assetTag,
            manufacturer: data.manufacturer || undefined,
            model: data.model || undefined,
            serialNumber: data.serialNumber || undefined,
            purchaseDate: data.purchaseDate || undefined,
            warrantyUntil: data.warrantyUntil || undefined,
            location: data.location || undefined,
            notes: data.notes || undefined,
            status: data.status,
          },
        });
      } else {
        await createMutation.mutateAsync({
          name: data.name,
          assetTag: data.assetTag,
          manufacturer: data.manufacturer || undefined,
          model: data.model || undefined,
          serialNumber: data.serialNumber || undefined,
          purchaseDate: data.purchaseDate || undefined,
          warrantyUntil: data.warrantyUntil || undefined,
          location: data.location || undefined,
          notes: data.notes || undefined,
        });
      }

      // Close dialog and reset form on success
      onOpenChange(false);
      reset();
    } catch (error) {
      // Error is handled by React Query, just log for debugging
      console.error("Failed to save asset:", error);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
      reset();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Edit Asset" : "Create New Asset"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the asset details below."
              : "Add a new asset to track and manage organizational equipment."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name Field */}
          <Field>
            <FieldLabel htmlFor="name">
              Name <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="name"
              placeholder="e.g., MacBook Pro 16"
              aria-invalid={!!errors.name}
              {...register("name")}
            />
            <FieldError errors={[errors.name]} />
          </Field>

          {/* Asset Tag Field */}
          <Field>
            <FieldLabel htmlFor="assetTag">
              Asset Tag <span className="text-destructive">*</span>
            </FieldLabel>
            <Input
              id="assetTag"
              placeholder="e.g., AST-001"
              aria-invalid={!!errors.assetTag}
              {...register("assetTag")}
            />
            <FieldError errors={[errors.assetTag]} />
          </Field>

          {/* Manufacturer Field */}
          <Field>
            <FieldLabel htmlFor="manufacturer">Manufacturer</FieldLabel>
            <Input
              id="manufacturer"
              placeholder="e.g., Apple"
              aria-invalid={!!errors.manufacturer}
              {...register("manufacturer")}
            />
            <FieldError errors={[errors.manufacturer]} />
          </Field>

          {/* Model Field */}
          <Field>
            <FieldLabel htmlFor="model">Model</FieldLabel>
            <Input
              id="model"
              placeholder="e.g., MacBook Pro 16 M3 Max"
              aria-invalid={!!errors.model}
              {...register("model")}
            />
            <FieldError errors={[errors.model]} />
          </Field>

          {/* Serial Number Field */}
          <Field>
            <FieldLabel htmlFor="serialNumber">Serial Number</FieldLabel>
            <Input
              id="serialNumber"
              placeholder="e.g., FVFX..."
              aria-invalid={!!errors.serialNumber}
              {...register("serialNumber")}
            />
            <FieldError errors={[errors.serialNumber]} />
          </Field>

          {/* Purchase Date Field */}
          <Field>
            <FieldLabel htmlFor="purchaseDate">Purchase Date</FieldLabel>
            <Input
              id="purchaseDate"
              type="date"
              aria-invalid={!!errors.purchaseDate}
              {...register("purchaseDate")}
            />
            <FieldError errors={[errors.purchaseDate]} />
          </Field>

          {/* Warranty Until Field */}
          <Field>
            <FieldLabel htmlFor="warrantyUntil">Warranty Until</FieldLabel>
            <Input
              id="warrantyUntil"
              type="date"
              aria-invalid={!!errors.warrantyUntil}
              {...register("warrantyUntil")}
            />
            <FieldError errors={[errors.warrantyUntil]} />
          </Field>

          {/* Location Field */}
          <Field>
            <FieldLabel htmlFor="location">Location</FieldLabel>
            <Input
              id="location"
              placeholder="e.g., Building A, Floor 3, Desk 12"
              aria-invalid={!!errors.location}
              {...register("location")}
            />
            <FieldError errors={[errors.location]} />
          </Field>

          {/* Notes Field */}
          <Field>
            <FieldLabel htmlFor="notes">Notes</FieldLabel>
            <Input
              id="notes"
              placeholder="Additional notes about the asset..."
              aria-invalid={!!errors.notes}
              {...register("notes")}
            />
            <FieldError errors={[errors.notes]} />
          </Field>

          {/* Status Field (only in edit mode) */}
          {isEditMode && (
            <Field>
              <FieldLabel htmlFor="status">Status</FieldLabel>
              <Select
                value={asset?.status || "ACTIVE"}
                onValueChange={(value: "ACTIVE" | "IN_MAINTENANCE" | "RETIRED") => setValue("status", value)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="IN_MAINTENANCE">In Maintenance</SelectItem>
                  <SelectItem value="RETIRED">Retired</SelectItem>
                </SelectContent>
              </Select>
              <FieldError errors={[errors.status]} />
            </Field>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update Asset"
                  : "Create Asset"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
