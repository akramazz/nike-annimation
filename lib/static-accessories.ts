export interface StaticAccessory {
  _id: string;
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  sizes: string[];
  likes?: number;
  stock: number;
}

export const STATIC_ACCESSORIES: StaticAccessory[] = [
  { _id: "acc-1", id: 1, name: "Casquette Noir", description: "Casquette premium en coton avec logo brodé. Style urbain moderne avec ajustement confortable.", price: 49.99, image: "/products/casquette.webp", category: "Accessoires", sizes: ["S/M", "L/XL"], likes: 12, stock: 50 },
  { _id: "acc-2", id: 2, name: "Casquette Noire", description: "Casquette anatomique avec strap arrière pour un ajustement parfait. Tissu respirant.", price: 39.99, image: "/products/casquettenoire.png", category: "Accessoires", sizes: ["S/M", "L/XL"], likes: 8, stock: 45 },
  { _id: "acc-3", id: 3, name: "Écharpe Rouge", description: "Écharpe en laine premium rouge élégante. Douce et chaude pour l'hiver.", price: 89.99, image: "/products/chalrouge.webp", category: "Accessoires", sizes: ["Unique"], likes: 25, stock: 30 },
  { _id: "acc-4", id: 4, name: "Écharpe Vert", description: "Écharpe douce en cachemire. Confort luxueux pour toutes les saisons.", price: 129.99, image: "/products/chal.webp", category: "Accessoires", sizes: ["Unique"], likes: 18, stock: 25 },
  { _id: "acc-5", id: 5, name: "Ceinture Beige", description: "Ceinture cuir avec boucle argentée. Classique et élégante.", price: 79.99, image: "/products/sinture.webp", category: "Accessoires", sizes: ["S", "M", "L", "XL"], likes: 15, stock: 40 },
  { _id: "acc-6", id: 6, name: "Casque Audio", description: "Casque premium sans fil avec réduction de bruit active. Son haute fidélité.", price: 199.99, image: "/products/cascadia.webp", category: "Accessoires", sizes: ["Unique"], likes: 32, stock: 20 },
  { _id: "acc-7", id: 7, name: "Bob Noir", description: "Bob léger pour l'été. Protection UV et tissu respirant.", price: 29.99, image: "/products/bobnoir.webp", category: "Accessoires", sizes: ["S/M", "L/XL"], likes: 5, stock: 60 },
  { _id: "acc-8", id: 8, name: "Sac Voyage", description: "Sac weekend en toile premium. Spacieux et résistant.", price: 149.99, image: "/products/tavares.webp", category: "Accessoires", sizes: ["Unique"], likes: 22, stock: 15 },
  { _id: "acc-9", id: 9, name: "Lunettes Soleil", description: "Lunettes premium avec Protection UV400. Style et protection.", price: 159.99, image: "/products/facebeage.webp", category: "Accessoires", sizes: ["Unique"], likes: 45, stock: 35 },
  { _id: "acc-10", id: 10, name: "Montre Classic", description: "Montre automatique avec bracelet cuir. Élégance intemporelle.", price: 299.99, image: "/products/vertface.webp", category: "Accessoires", sizes: ["Unique"], likes: 67, stock: 10 },
  { _id: "acc-11", id: 11, name: "Montre Sport", description: "Montre connectée avec GPS. Pour les sportifs exigeants.", price: 399.99, image: "/products/orangeface.webp", category: "Accessoires", sizes: ["Unique"], likes: 89, stock: 8 },
  { _id: "acc-12", id: 12, name: "Bracelet Cuir", description: "Bracelet tressé premium. Style rustique et élégant.", price: 34.99, image: "/products/milangeface.webp", category: "Accessoires", sizes: ["S", "M", "L"], likes: 11, stock: 55 },
];
