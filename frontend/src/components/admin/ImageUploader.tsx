"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { uploadImages, ApiError } from "@/lib/api";

export default function ImageUploader({
  images,
  onChange,
  multiple = true,
  max = 8,
}: {
  images: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
  max?: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || !fileList.length) return;
    setError("");

    const remaining = max - images.length;
    if (remaining <= 0) {
      setError(`You can only add up to ${max} images.`);
      return;
    }

    const files = Array.from(fileList).slice(0, remaining);
    setUploading(true);
    try {
      const urls = await uploadImages(files);
      onChange(multiple ? [...images, ...urls] : urls);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to upload images");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (url: string) => {
    onChange(images.filter((i) => i !== url));
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {images.map((url) => (
          <div key={url} className="relative h-24 w-20 overflow-hidden border border-navy-900/15">
            <Image src={url} alt="" fill className="object-cover" />
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute end-0.5 top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-navy-950/80 text-xs text-white hover:bg-red-600"
              aria-label="Remove image"
            >
              &times;
            </button>
          </div>
        ))}

        {(multiple || images.length === 0) && images.length < max && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="flex h-24 w-20 flex-col items-center justify-center gap-1 border border-dashed border-navy-900/30 text-navy-900/60 hover:border-gold-500 hover:text-gold-600 disabled:opacity-50"
          >
            <span className="text-xl leading-none">+</span>
            <span className="text-[10px]">{uploading ? "Uploading..." : "Upload"}</span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple={multiple}
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
