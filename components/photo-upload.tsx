"use client";

import { useState } from "react";
import { Photo, PhotoType } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Image from "next/image";

interface PhotoUploadProps {
  photos: Photo[];
  onUpload: (file: File, type: PhotoType) => Promise<void>;
  onDelete: (photoId: string) => Promise<void>;
  isUploading?: boolean;
}

export function PhotoUpload({ photos, onUpload, onDelete, isUploading = false }: PhotoUploadProps) {
  const [photoType, setPhotoType] = useState<PhotoType>('progress');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Create preview
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      
      // Upload file
      onUpload(file, photoType).then(() => {
        setPreviewUrl(null);
        e.target.value = ''; // Reset input
      });
    }
  };

  const progressPhotos = photos.filter(p => p.photo_type === 'progress');
  const finalPhotos = photos.filter(p => p.photo_type === 'final');

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-lg font-serif font-semibold">Photos</Label>
        <p className="text-sm text-muted-foreground mt-1">
          Upload progress photos or final project photos
        </p>
      </div>

      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="photo-type">Photo Type</Label>
              <Select value={photoType} onValueChange={(value) => setPhotoType(value as PhotoType)}>
                <SelectTrigger id="photo-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="progress">Progress Photo</SelectItem>
                  <SelectItem value="final">Final Photo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label
                htmlFor="photo-upload"
                className="cursor-pointer"
              >
                <Button type="button" asChild disabled={isUploading}>
                  <span>
                    {isUploading ? 'Uploading...' : 'Choose File'}
                  </span>
                </Button>
              </Label>
              <input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
              />
            </div>
          </div>

          {previewUrl && (
            <div className="relative w-full h-48 rounded-lg overflow-hidden border">
              <Image
                src={previewUrl}
                alt="Preview"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <p className="text-white">Uploading...</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {finalPhotos.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Final Photos</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {finalPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <Image
                    src={photo.storage_path}
                    alt="Final photo"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(photo.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {progressPhotos.length > 0 && (
        <div>
          <h4 className="font-semibold mb-2">Progress Photos</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {progressPhotos.map((photo) => (
              <div key={photo.id} className="relative group">
                <div className="relative w-full h-48 rounded-lg overflow-hidden border">
                  <Image
                    src={photo.storage_path}
                    alt="Progress photo"
                    fill
                    className="object-cover"
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(photo.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  Delete
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

