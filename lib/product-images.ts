import { readdir, writeFile, unlink } from "fs/promises";
import { join } from "path";
import Product from "@/models/Product";
import { catalogFromFilename } from "@/lib/product-catalog";
import { getProductImage, DEFAULT_PRODUCT_IMAGE } from "@/lib/image-utils";

export const PRODUCTS_IMAGE_DIR = join(process.cwd(), "public", "products");
export const ALLOWED_IMAGE_EXTENSIONS = new Set([".webp", ".png", ".jpg", ".jpeg"]);
export const DEFAULT_IMAGE_BASENAME = "default.webp";
export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

export type ProductImageInfo = {
  filename: string;
  path: string;
  published: boolean;
  productId: string | null;
  productName: string | null;
};

export type PublishProductsResult = {
  created: number;
  updated: number;
  skipped: number;
  published: number;
  total: number;
  products: Array<Record<string, unknown>>;
};

export type PublishProductsOptions = {
  /** Noms de fichiers à publier. Si vide, toutes les images non publiées. */
  filenames?: string[];
  /** Met à jour les produits existants avec le catalogue (écrase les modifications admin). */
  updateExisting?: boolean;
  /** Marque les produits comme visibles sur le site (published: true). */
  markPublished?: boolean;
};

function fileExtension(filename: string): string {
  const lower = filename.toLowerCase();
  return lower.slice(lower.lastIndexOf("."));
}

export function isAllowedProductImage(filename: string): boolean {
  const lower = filename.toLowerCase();
  if (lower === DEFAULT_IMAGE_BASENAME || lower.startsWith("default.")) {
    return false;
  }
  return ALLOWED_IMAGE_EXTENSIONS.has(fileExtension(lower));
}

export function toProductImagePath(filename: string): string {
  return getProductImage(`/products/${filename.toLowerCase()}`);
}

export function sanitizeUploadFilename(raw: string): string {
  const base = raw
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+/, "")
    .toLowerCase();
  if (!base || base.startsWith("default")) {
    return `product-${Date.now()}.webp`;
  }
  const ext = fileExtension(base);
  if (!ALLOWED_IMAGE_EXTENSIONS.has(ext)) {
    return `${base.replace(/\.[^.]+$/, "")}.webp`;
  }
  return base;
}

export async function listProductImageFiles(): Promise<string[]> {
  try {
    const files = await readdir(PRODUCTS_IMAGE_DIR);
    return files
      .filter(isAllowedProductImage)
      .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
  } catch {
    return [];
  }
}

export async function listProductImagesWithStatus(): Promise<ProductImageInfo[]> {
  const files = await listProductImageFiles();
  const products = await Product.find({}).select("_id name image published").lean();

  const byImage = new Map<string, { _id: string; name: string; published?: boolean }>();
  for (const p of products) {
    const path = getProductImage(p.image as string);
    byImage.set(path, {
      _id: p._id.toString(),
      name: p.name as string,
      published: p.published !== false,
    });
  }

  return files.map((filename) => {
    const path = toProductImagePath(filename);
    const linked = byImage.get(path);
    return {
      filename,
      path,
      published: Boolean(linked?.published),
      productId: linked?._id ?? null,
      productName: linked?.name ?? null,
    };
  });
}

function serializeProduct(p: Record<string, unknown>, index: number) {
  return {
    ...p,
    id: index + 1,
    _id: String(p._id),
    image: getProductImage(p.image as string | undefined),
    published: p.published !== false,
  };
}

/**
 * Publie des produits sur le site à partir des images dans public/products.
 * Par défaut : crée uniquement les produits manquants, sans écraser l'existant.
 */
export async function publishProductsFromImages(
  options: PublishProductsOptions = {},
): Promise<PublishProductsResult> {
  const { updateExisting = false, markPublished = true } = options;
  const allFiles = await listProductImageFiles();

  let targetFiles = allFiles;
  if (options.filenames?.length) {
    const wanted = new Set(options.filenames.map((f) => f.toLowerCase()));
    targetFiles = allFiles.filter((f) => wanted.has(f.toLowerCase()));
  } else if (!updateExisting) {
    const status = await listProductImagesWithStatus();
    const unpublished = new Set(
      status.filter((img) => !img.productId).map((img) => img.filename),
    );
    targetFiles = allFiles.filter((f) => unpublished.has(f));
  }

  let created = 0;
  let updated = 0;
  let skipped = 0;
  let published = 0;

  for (const file of targetFiles) {
    const data = catalogFromFilename(file);
    data.image = toProductImagePath(file);

    const existing = await Product.findOne({ image: data.image });

    if (existing) {
      if (!updateExisting) {
        if (markPublished && existing.published === false) {
          existing.published = true;
          await existing.save();
          published += 1;
        } else {
          skipped += 1;
        }
        continue;
      }

      existing.name = data.name;
      existing.color = data.color;
      existing.price = data.price;
      existing.stock = data.stock;
      existing.description = data.description;
      existing.category = data.category;
      existing.sizes = data.sizes;
      if (markPublished) existing.published = true;
      await existing.save();
      updated += 1;
      if (markPublished) published += 1;
    } else {
      await Product.create({
        ...data,
        published: markPublished,
      });
      created += 1;
      if (markPublished) published += 1;
    }
  }

  const allProducts = await Product.find({}).sort({ _id: 1 }).lean();

  return {
    created,
    updated,
    skipped,
    published,
    total: allProducts.length,
    products: allProducts.map((p, index) =>
      serializeProduct(p as Record<string, unknown>, index),
    ),
  };
}

export async function saveUploadedProductImage(
  filename: string,
  buffer: Buffer,
): Promise<{ filename: string; path: string }> {
  const safeName = sanitizeUploadFilename(filename);
  const dest = join(PRODUCTS_IMAGE_DIR, safeName);
  await writeFile(dest, buffer);
  return { filename: safeName, path: toProductImagePath(safeName) };
}

export async function deleteProductImageFile(filename: string): Promise<boolean> {
  const lower = filename.toLowerCase();
  if (!isAllowedProductImage(lower) && lower !== DEFAULT_IMAGE_BASENAME) {
    return false;
  }
  if (lower.startsWith("default.")) {
    throw new Error("Impossible de supprimer l'image par défaut.");
  }

  const path = toProductImagePath(lower);
  const linked = await Product.findOne({ image: path });
  if (linked) {
    throw new Error(
      "Cette image est liée à un produit. Supprimez ou modifiez le produit d'abord.",
    );
  }

  await unlink(join(PRODUCTS_IMAGE_DIR, lower));
  return true;
}

export function isDefaultImagePath(path: string): boolean {
  return getProductImage(path) === DEFAULT_PRODUCT_IMAGE;
}
