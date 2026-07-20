/**
 * Publie un produit pour chaque fichier dans public/products (sauf default.*).
 * Usage: npx dotenv -e .env.local -- npx tsx scripts/publish-all-images.ts
 */
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import "dotenv/config";
import { readdir } from "fs/promises";
import { join } from "path";
import connectDB from "../utils/mongodb";
import Product from "../models/Product";
import { catalogFromFilename } from "../lib/product-catalog";

async function main() {
  await connectDB();

  const dir = join(process.cwd(), "public", "products");
  const files = await readdir(dir);
  const allowed = new Set([".webp", ".png", ".jpg", ".jpeg"]);

  const images = files.filter((file) => {
    const lower = file.toLowerCase();
    if (lower.startsWith("default.")) return false;
    const ext = lower.slice(lower.lastIndexOf("."));
    return allowed.has(ext);
  });

  let created = 0;
  let updated = 0;

  for (const file of images) {
    const data = catalogFromFilename(file);
    // Chemins normalisés en minuscules (comme getProductImage)
    data.image = `/products/${file.toLowerCase()}`;

    const existing = await Product.findOne({ image: data.image });
    if (existing) {
      existing.name = data.name;
      existing.color = data.color;
      existing.price = data.price;
      existing.stock = data.stock;
      existing.description = data.description;
      existing.category = data.category;
      existing.sizes = data.sizes;
      await existing.save();
      updated += 1;
    } else {
      await Product.create(data);
      created += 1;
    }
    console.log(`✓ ${data.name} -> ${data.image}`);
  }

  const total = await Product.countDocuments();
  console.log(`\nDone: ${created} created, ${updated} updated, ${total} total`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
