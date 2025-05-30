import { PrismaClient } from "../generated/client";
import { generateNanoid, generateUlid } from "../utils";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // await prisma.gallery.deleteMany();
  // await prisma.productVariant.deleteMany();
  // await prisma.product.deleteMany();
  // await prisma.model.deleteMany();
  // await prisma.brand.deleteMany();
  // await prisma.user.deleteMany();

  // const adminEmail = "admin@mobitrade.com";
  // const hashedPassword = await bcrypt.hash("admin123", 10);
  // await prisma.user.create({
  //   data: {
  //     id: generateUlid(),
  //     email: adminEmail,
  //     name: "Admin",
  //     password: hashedPassword,
  //     role: "ADMIN",
  //   },
  // });

  // const brandNames = ["Apple", "Samsung", "Xiaomi", "Oppo", "Vivo"];
  // const brands = await Promise.all(
  //   brandNames.map((name) =>
  //     prisma.brand.create({
  //       data: { id: generateUlid(), name },
  //     }),
  //   ),
  // );
  //
  // const generateModelName = (brandName: string) => {
  //   const suffixes = ["Pro", "Max", "Lite", "Mini", "Ultra", "SE", "+"];
  //   const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  //   const randomNumber = Math.floor(Math.random() * 10) + 1;
  //   return `${brandName} ${randomSuffix} ${randomNumber}`;
  // };
  //
  // const models = await Promise.all(
  //   brands.flatMap((brand) => {
  //     const modelCount = Math.floor(Math.random() * 3) + 1; // 1–3 model per brand
  //     return Array.from({ length: modelCount }).map(() =>
  //       prisma.model.create({
  //         data: {
  //           id: generateUlid(),
  //           name: generateModelName(brand.name),
  //           brandId: brand.id,
  //         },
  //       }),
  //     );
  //   }),
  // );
  //
  // const discountedIndexes = new Set<number>();
  // while (discountedIndexes.size < 8) {
  //   discountedIndexes.add(Math.floor(Math.random() * 15));
  // }
  //
  // const products = await Promise.all(
  //   Array.from({ length: 15 }).map((_, i) => {
  //     const model = models[i % models.length];
  //     const baseName = `${model.name} Pro`;
  //     const sku = `SKU-${(i + 1).toString().padStart(4, "0")}`;
  //     const slug =
  //       baseName.toLowerCase().replace(/\s+/g, "-") + "-" + generateNanoid();
  //
  //     const hasDiscount = discountedIndexes.has(i);
  //     const discountPercentage = hasDiscount
  //       ? Math.floor(Math.random() * 30) + 10
  //       : null; // 10%–40%
  //
  //     return prisma.product.create({
  //       data: {
  //         id: generateUlid(),
  //         modelId: model.id,
  //         sku,
  //         slug,
  //         name: baseName,
  //         description: `${baseName} adalah produk unggulan.`,
  //         minimumOrderQuantity: 1,
  //         batteryHealth: 95,
  //         display: "OLED 6.1 inch",
  //         processor: "A15 Bionic",
  //         camera: "12MP Wide",
  //         battery: "3000mAh",
  //         os: "iOS 15",
  //         connectivity: "5G",
  //         discount: discountPercentage,
  //       },
  //     });
  //   }),
  // );
  //
  // await Promise.all(
  //   products.flatMap((product) =>
  //     Array.from({ length: 4 }).map((_, i) =>
  //       prisma.gallery.create({
  //         data: {
  //           id: generateUlid(),
  //           imageUrl: `/assets/images/product-${product.id}-${i + 1}.jpg`,
  //           productId: product.id,
  //         },
  //       }),
  //     ),
  //   ),
  // );
  //
  // const storages = ["64GB", "128GB", "256GB"];
  // const rams = ["4GB", "6GB", "8GB"];
  // const colors = ["Black", "White", "Blue", "Red", "Green"];
  // const conditions = ["Like New", "Very Good", "Good", "Fair"];
  //
  // await Promise.all(
  //   products.flatMap((product) => {
  //     const variantCount = Math.floor(Math.random() * 2) + 1;
  //     return Array.from({ length: variantCount }).map(() =>
  //       prisma.productVariant.create({
  //         data: {
  //           id: generateUlid(),
  //           productId: product.id,
  //           storage: storages[Math.floor(Math.random() * storages.length)],
  //           ram: rams[Math.floor(Math.random() * rams.length)],
  //           color: colors[Math.floor(Math.random() * colors.length)],
  //           condition:
  //             conditions[Math.floor(Math.random() * conditions.length)],
  //           price:
  //             Math.floor(Math.random() * ((1250 - 190) / 10 + 1)) * 10 + 190,
  //           stockQuantity: Math.floor(Math.random() * 50) + 1,
  //           warrantyMonths: [0, 3, 6, 12][Math.floor(Math.random() * 4)],
  //         },
  //       }),
  //     );
  //   }),
  // );

  console.log("🌱 Seeding done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
