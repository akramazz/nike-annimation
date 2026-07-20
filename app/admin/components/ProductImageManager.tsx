"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Upload,
  RefreshCw,
  Globe,
  Trash2,
  CheckCircle2,
  Circle,
  ImageIcon,
} from "lucide-react";
import { apiUrl } from "@/lib/api-client";
import { getProductImage } from "@/lib/image-utils";

export type AdminProductImage = {
  filename: string;
  path: string;
  published: boolean;
  productId: string | null;
  productName: string | null;
};

type ProductImageManagerProps = {
  onPublished?: () => void;
  onImagesChange?: (images: AdminProductImage[]) => void;
};

export default function ProductImageManager({
  onPublished,
  onImagesChange,
}: ProductImageManagerProps) {
  const [images, setImages] = useState<AdminProductImage[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(apiUrl("/api/products/images"), {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Impossible de charger les images.");
      }
      const list = data.images as AdminProductImage[];
      setImages(list);
      onImagesChange?.(list);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }, [onImagesChange]);

  useEffect(() => {
    loadImages();
  }, [loadImages]);

  const toggleSelect = (filename: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(filename)) next.delete(filename);
      else next.add(filename);
      return next;
    });
  };

  const selectUnpublished = () => {
    setSelected(
      new Set(images.filter((img) => !img.productId).map((img) => img.filename)),
    );
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError(null);
    setStatusMessage(null);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch(apiUrl("/api/products/images"), {
          method: "POST",
          credentials: "include",
          body: formData,
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || `Échec pour ${file.name}`);
        }
      }
      setStatusMessage(`${files.length} image(s) téléversée(s).`);
      await loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Échec du téléversement.");
    } finally {
      setUploading(false);
    }
  };

  const publishProducts = async (options?: {
    filenames?: string[];
    updateExisting?: boolean;
  }) => {
    setPublishing(true);
    setError(null);
    setStatusMessage(null);

    try {
      const res = await fetch(apiUrl("/api/products/publish"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filenames: options?.filenames,
          updateExisting: options?.updateExisting ?? false,
          markPublished: true,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Échec de la publication.");
      }
      setStatusMessage(data.message || "Produits publiés sur le site.");
      setSelected(new Set());
      await loadImages();
      onPublished?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau.");
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (filename: string) => {
    if (!confirm(`Supprimer l'image « ${filename} » ?`)) return;
    setError(null);
    try {
      const res = await fetch(
        apiUrl(`/api/products/images?filename=${encodeURIComponent(filename)}`),
        { method: "DELETE", credentials: "include" },
      );
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Suppression impossible.");
      }
      await loadImages();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur réseau.");
    }
  };

  const unpublishedCount = images.filter((img) => !img.productId).length;
  const selectedList = Array.from(selected);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Images & publication</h2>
          <p className="text-white/60 text-sm mt-1">
            Téléversez des images, puis publiez-les comme produits visibles sur le site.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={loadImages}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Actualiser
          </button>
          <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-white text-black font-medium cursor-pointer hover:bg-white/90 transition-colors">
            <Upload className="h-4 w-4" />
            {uploading ? "Envoi…" : "Téléverser"}
            <input
              type="file"
              accept=".webp,.png,.jpg,.jpeg,image/webp,image/png,image/jpeg"
              multiple
              className="hidden"
              disabled={uploading}
              onChange={(e) => {
                handleUpload(e.target.files);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          disabled={publishing || unpublishedCount === 0}
          onClick={() => publishProducts()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 hover:bg-green-500/30 transition-colors disabled:opacity-50"
        >
          <Globe className={`h-4 w-4 ${publishing ? "animate-pulse" : ""}`} />
          {publishing
            ? "Publication…"
            : `Publier les nouveaux (${unpublishedCount})`}
        </button>
        <button
          type="button"
          disabled={publishing || selectedList.length === 0}
          onClick={() => publishProducts({ filenames: selectedList })}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 transition-colors disabled:opacity-50"
        >
          <CheckCircle2 className="h-4 w-4" />
          Publier la sélection ({selectedList.length})
        </button>
        <button
          type="button"
          disabled={publishing}
          onClick={() => {
            if (
              confirm(
                "Synchroniser tous les produits avec le catalogue ? Les modifications existantes seront écrasées.",
              )
            ) {
              publishProducts({ updateExisting: true });
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20 hover:bg-orange-500/20 transition-colors disabled:opacity-50"
        >
          <RefreshCw className="h-4 w-4" />
          Sync catalogue complet
        </button>
        <button
          type="button"
          onClick={selectUnpublished}
          className="px-4 py-2.5 rounded-full text-sm text-white/70 hover:text-white hover:bg-white/10 transition-colors"
        >
          Sélectionner non publiés
        </button>
      </div>

      {statusMessage && (
        <p className="text-green-400 text-sm" role="status">
          {statusMessage}
        </p>
      )}
      {error && (
        <p className="text-red-400 text-sm" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-white/50">
          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
          Chargement des images…
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-16 rounded-2xl bg-white/5 border border-white/10">
          <ImageIcon className="h-12 w-12 mx-auto text-white/30 mb-4" />
          <p className="text-white/60">Aucune image. Téléversez votre première image produit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map((img) => {
            const isSelected = selected.has(img.filename);
            return (
              <div
                key={img.filename}
                className={`relative rounded-2xl overflow-hidden border transition-all ${
                  isSelected
                    ? "border-white ring-2 ring-white/30"
                    : "border-white/10 hover:border-white/30"
                } bg-white/5`}
              >
                <button
                  type="button"
                  onClick={() => toggleSelect(img.filename)}
                  className="absolute top-2 left-2 z-10 p-1 rounded-full bg-black/60"
                  aria-label={`Sélectionner ${img.filename}`}
                >
                  {isSelected ? (
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-white/60" />
                  )}
                </button>

                {!img.productId && (
                  <button
                    type="button"
                    onClick={() => handleDelete(img.filename)}
                    className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/60 hover:bg-red-500/80 transition-colors"
                    aria-label={`Supprimer ${img.filename}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}

                <div className="aspect-square bg-white/5">
                  <img
                    src={getProductImage(img.path)}
                    alt={img.productName || img.filename}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-3 space-y-1">
                  <p className="text-xs font-mono truncate text-white/80">{img.filename}</p>
                  {img.productId ? (
                    <p className="text-xs text-green-400 flex items-center gap-1">
                      <Globe className="h-3 w-3" />
                      {img.productName || "Publié sur le site"}
                    </p>
                  ) : (
                    <p className="text-xs text-yellow-400">Non publié</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
