"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { MdEdit } from "react-icons/md";
import type { Model } from "@/lib/types";

interface EditModelSheetProps {
  model: Model;
}

export function EditModelSheet({ model }: EditModelSheetProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: model.name,
    ethnicity: model.ethnicity || "",
    gender: model.gender || "",
    image: model.image || "",
    bio: model.bio || "",
    dateOfBirth: model.dateOfBirth
      ? new Date(model.dateOfBirth).toISOString().split("T")[0]
      : "",
    measurements: model.measurements || "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value: string, field: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/models/${model.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          ethnicity: formData.ethnicity || null,
          gender: formData.gender || null,
          image: formData.image || null,
          bio: formData.bio || null,
          dateOfBirth: formData.dateOfBirth
            ? new Date(formData.dateOfBirth)
            : null,
          measurements: formData.measurements || null,
        }),
      });

      if (response.ok) {
        setOpen(false);
        // Invalidate model queries cache
        queryClient.invalidateQueries({ queryKey: ["model", model.id] });
        queryClient.invalidateQueries({ queryKey: ["models"] });
      } else {
        alert("Failed to update model");
      }
    } catch (error) {
      console.error("Error updating model:", error);
      alert("Error updating model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline">
          <MdEdit className="size-4 mr-2" />
          Edit Details
        </Button>
      </SheetTrigger>
      <SheetContent className="max-h-screen overflow-y-auto px-5">
        <SheetHeader className="px-0">
          <SheetTitle>Edit Model Details</SheetTitle>
          <SheetDescription>
            Update the model information below.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Model name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleSelectChange(value, "gender")}
            >
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="NON_BINARY">Non-binary</SelectItem>
                <SelectItem value="PREFER_NOT_TO_SAY">
                  Prefer not to say
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Ethnicity */}
          <div className="space-y-2">
            <Label htmlFor="ethnicity">Ethnicity</Label>
            <Input
              id="ethnicity"
              name="ethnicity"
              placeholder="e.g., Latina, Ebony"
              value={formData.ethnicity}
              onChange={handleInputChange}
            />
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              name="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
            />
          </div>

          {/* Measurements */}
          <div className="space-y-2">
            <Label htmlFor="measurements">Measurements</Label>
            <Input
              id="measurements"
              name="measurements"
              placeholder="e.g., 32B-24-34"
              value={formData.measurements}
              onChange={handleInputChange}
            />
          </div>

          {/* Image URL */}
          <div className="space-y-2">
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={formData.image}
              onChange={handleInputChange}
            />
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Model biography"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-2 pt-4">
            <Button
              type="submit"
              disabled={loading || !formData.name}
              className="flex-1"
            >
              {loading ? "Updating..." : "Update Model"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
