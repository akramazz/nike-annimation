/**
 * Publie les produits sur le site à partir des images dans public/products.
 * Usage: npx dotenv -e .env.local -- npx tsx scripts/publish-all-images.ts
 *
 * Options:
 *   --all        Synchronise aussi les produits existants (écrase le catalogue)
 *   --file=xxx   Publie une image spécifique
 */
import dns from "dns";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

import "dotenv/config";
import connectDB from "../utils/mongodb";
import { publishProductsFromImages } from "../lib/product-images";

async function main() {
  await connectDB();

  const args = process.argv.slice(2);
  const updateExisting = args.includes("--all");
  const fileArg = args.find((a) => a.startsWith("--file="));
  const filenames = fileArg ? [fileArg.split("=")[1]] : undefined;

  const result = await publishProductsFromImages({
    filenames,
    updateExisting,
    markPublished: true,
  });

  console.log(
    `Terminé : ${result.created} créé(s), ${result.updated} mis à jour, ${result.skipped} ignoré(s), ${result.published} visible(s) sur le site (${result.total} total).`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
