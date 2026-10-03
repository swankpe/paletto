"use client";

import { ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { LISTING_IMAGES_BUCKET, MAX_IMAGES } from "@/lib/constants";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/client";

type Item = {
  key: string;
  path?: string;
  url: string;
  status: "uploading" | "done" | "error";
  isNew: boolean;
};

const MAX_DIMENSION = 1600;
const MAX_INPUT_BYTES = 20 * 1024 * 1024;

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      // Repli sur l'élément <img> ci-dessous.
    }
  }
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Image illisible"));
    img.src = URL.createObjectURL(file);
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number) {
  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Redimensionne et compresse la photo dans le navigateur avant l'envoi. */
async function compressImage(file: File): Promise<{ blob: Blob; extension: string }> {
  const source = await loadBitmap(file);
  const width = "naturalWidth" in source ? source.naturalWidth : source.width;
  const height = "naturalHeight" in source ? source.naturalHeight : source.height;
  const scale = Math.min(1, MAX_DIMENSION / Math.max(width, height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas indisponible");
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
  if ("close" in source) source.close();

  const webp = await canvasToBlob(canvas, "image/webp", 0.82);
  if (webp && webp.type === "image/webp") return { blob: webp, extension: "webp" };
  const jpeg = await canvasToBlob(canvas, "image/jpeg", 0.85);
  if (jpeg) return { blob: jpeg, extension: "jpg" };
  throw new Error("Compression impossible");
}

export function ImageUploader({
  userId,
  initialImages,
  onUploadingChange,
}: {
  userId: string;
  initialImages: { path: string; url: string }[];
  onUploadingChange?: (uploading: boolean) => void;
}) {
  const [items, setItems] = useState<Item[]>(() =>
    initialImages.map((img) => ({ key: img.path, path: img.path, url: img.url, status: "done", isNew: false })),
  );
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploading = items.some((item) => item.status === "uploading");

  useEffect(() => {
    onUploadingChange?.(uploading);
  }, [uploading, onUploadingChange]);

  const donePaths = items.filter((item) => item.status === "done" && item.path).map((item) => item.path as string);

  async function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    setError(null);
    const remaining = MAX_IMAGES - items.filter((i) => i.status !== "error").length;
    const files = Array.from(fileList).slice(0, Math.max(0, remaining));
    if (fileList.length > remaining) {
      setError(`Vous pouvez ajouter ${MAX_IMAGES} photos au maximum.`);
    }

    const supabase = createClient();

    await Promise.all(
      files.map(async (file) => {
        const key = crypto.randomUUID();
        if (!file.type.startsWith("image/")) {
          setError("Seules les images sont acceptées (JPEG, PNG, WebP).");
          return;
        }
        if (file.size > MAX_INPUT_BYTES) {
          setError("Une photo dépasse 20 Mo. Choisissez une image plus légère.");
          return;
        }
        const previewUrl = URL.createObjectURL(file);
        setItems((prev) => [...prev, { key, url: previewUrl, status: "uploading", isNew: true }]);

        try {
          const { blob, extension } = await compressImage(file);
          const path = `${userId}/${crypto.randomUUID()}.${extension}`;
          const { error: uploadError } = await supabase.storage
            .from(LISTING_IMAGES_BUCKET)
            .upload(path, blob, { contentType: blob.type, cacheControl: "31536000", upsert: false });
          if (uploadError) throw uploadError;
          setItems((prev) => prev.map((item) => (item.key === key ? { ...item, path, status: "done" } : item)));
        } catch {
          setItems((prev) => prev.filter((item) => item.key !== key));
          setError("L'envoi d'une photo a échoué. Vérifiez votre connexion et réessayez.");
        }
      }),
    );
    if (inputRef.current) inputRef.current.value = "";
  }

  async function remove(item: Item) {
    setItems((prev) => prev.filter((i) => i.key !== item.key));
    // Les nouvelles photos sont supprimées tout de suite ; les anciennes à l'enregistrement.
    if (item.isNew && item.path) {
      await createClient().storage.from(LISTING_IMAGES_BUCKET).remove([item.path]);
    }
  }

  function makeCover(item: Item) {
    setItems((prev) => [item, ...prev.filter((i) => i.key !== item.key)]);
  }

  const canAdd = items.length < MAX_IMAGES;

  return (
    <div>
      <input type="hidden" name="images" value={JSON.stringify(donePaths)} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((item, index) => (
          <div key={item.key} className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-stone-200 bg-stone-100">
            {/* eslint-disable-next-line @next/next/no-img-element -- aperçu local (blob:) */}
            <img src={item.url} alt={`Photo ${index + 1}`} className="absolute inset-0 size-full object-cover" />
            {item.status === "uploading" ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <Loader2 className="size-6 animate-spin text-brand-600" aria-label="Envoi en cours" />
              </div>
            ) : null}
            {index === 0 && item.status === "done" ? (
              <span className="absolute left-2 top-2 rounded-full bg-brand-500 px-2 py-0.5 text-xs font-bold text-white">
                Photo principale
              </span>
            ) : null}
            {item.status === "done" ? (
              <div className="absolute inset-x-2 bottom-2 flex justify-end gap-1.5">
                {index > 0 ? (
                  <button
                    type="button"
                    onClick={() => makeCover(item)}
                    className="flex size-8 items-center justify-center rounded-full bg-white/95 text-stone-700 shadow-sm hover:text-brand-600"
                    aria-label="Définir comme photo principale"
                    title="Définir comme photo principale"
                  >
                    <Star className="size-4" aria-hidden />
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => remove(item)}
                  className="flex size-8 items-center justify-center rounded-full bg-white/95 text-stone-700 shadow-sm hover:text-red-600"
                  aria-label="Supprimer la photo"
                  title="Supprimer la photo"
                >
                  <Trash2 className="size-4" aria-hidden />
                </button>
              </div>
            ) : null}
          </div>
        ))}

        {canAdd ? (
          <label
            className={cn(
              "flex aspect-[4/3] cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-white text-center text-sm font-semibold text-stone-600 transition hover:border-brand-400 hover:bg-brand-50 hover:text-brand-700",
            )}
          >
            <ImagePlus className="size-7" aria-hidden />
            <span>
              Ajouter des photos
              <span className="block text-xs font-normal text-stone-500">
                {items.length}/{MAX_IMAGES}
              </span>
            </span>
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
              multiple
              className="sr-only"
              onChange={(event) => handleFiles(event.target.files)}
            />
          </label>
        ) : null}
      </div>
      {error ? <p className="mt-2 text-sm font-medium text-red-600">{error}</p> : null}
      <p className="mt-2 text-sm text-stone-500">
        Les annonces avec photos sont bien plus consultées. Montrez l&apos;état du bois, les marquages (EPAL…) et le lot entier.
      </p>
    </div>
  );
}
