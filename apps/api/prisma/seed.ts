import { PrismaClient } from "../generated/client";
import { generateNanoid, generateUlid } from "../utils";
import * as bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";

const prisma = new PrismaClient();

type PhoneProduct = {
  sku: string;
  name: string;
  brand?: string;
  model?: string;
  description: string;
  price: number;
  discount?: number;
  color?: string;
  condition?: string;
  storage?: string;
  minimumOrderQuantity: number;
  warrantyMonths?: number;
  stockQuantity: number;
  rating?: number;
  reviewsCount?: number;
  batteryHealth?: number;
  ram?: string;
  display?: string;
  processor?: string;
  camera?: string;
  battery?: string;
  os?: string;
  connectivity?: string;
  images: string[]; // add this field
};

async function main() {
  const adminEmail = "admin@mobitrade.com";
  const hashedPassword = await bcrypt.hash("admin123", 10); // bisa ganti sesuai kebutuhan
  await prisma.user.create({
    data: {
      id: generateUlid(),
      email: adminEmail,
      name: "Admin",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const phones: PhoneProduct[] = [
    {
      sku: "PHN001",
      name: "Xiaomi Redmi Note 12",
      brand: "Xiaomi",
      model: "Note 12",
      description: "Affordable smartphone with great battery life.",
      price: 199.99,
      discount: 10,
      color: "Black",
      condition: "Like New",
      storage: "128GB",
      minimumOrderQuantity: 1,
      warrantyMonths: 12,
      stockQuantity: 150,
      rating: 4.5,
      reviewsCount: 230,
      batteryHealth: 100,
      ram: "6GB",
      display: "6.67 inch AMOLED",
      processor: "Snapdragon 685",
      camera: "48MP + 8MP",
      battery: "5000mAh",
      os: "Android 12",
      connectivity: "5G, WiFi, Bluetooth",
      images: [
        "https://s.alicdn.com/@sc04/kf/Hc46a1cbf1be6411982d01113292d1bff7.jpg_720x720q50.jpg",
        "https://s.alicdn.com/@sc04/kf/H3c7800fa2f454864950e460035ee7b83f.jpg_720x720q50.jpg",
        "https://s.alicdn.com/@sc04/kf/Hdf938c53e30d49b0b4b9e57eaca139d8Z.jpg_720x720q50.jpg",
        "https://s.alicdn.com/@sc04/kf/H9f3e1c0254f74ad28afe9b17e6ceac71m.jpg_720x720q50.jpg",
      ],
    },
    {
      sku: "PHN002",
      name: "Samsung Galaxy S25",
      brand: "Samsung",
      model: "Galaxy S25",
      description: "Reliable smartphone with excellent display.",
      price: 249.99,
      discount: 5,
      color: "Black",
      // imageUrl:
      //   "https://s.alicdn.com/@sc04/kf/Ha1f5a1093ea0460480703a7e4967b3e2s.jpg_720x720q50.jpg",
      condition: "Like New",
      storage: "128GB",
      minimumOrderQuantity: 1,
      warrantyMonths: 12,
      stockQuantity: 120,
      rating: 4.3,
      reviewsCount: 190,
      batteryHealth: 100,
      ram: "4GB",
      display: "6.6 inch PLS LCD",
      processor: "Exynos 1330",
      camera: "50MP + 2MP",
      battery: "5000mAh",
      os: "Android 13",
      connectivity: "5G, WiFi, Bluetooth",
      images: [
        "https://s.alicdn.com/@sc04/kf/H87d11133d8534a2c9a81abb9b9dba3724.jpg_720x720q50.jpg",
        "https://s.alicdn.com/@sc04/kf/H8c43111c2d5e40e2b0a95f65181d8148W.jpg_720x720q50.jpg",
        "https://s.alicdn.com/@sc04/kf/Haf2732f357914858b25c6f1ad7107ecbw.jpg_720x720q50.jpg",
        "https://s.alicdn.com/@sc04/kf/H7a26e6b1ee6a48e1b036e4d9903db3aeB.jpg_720x720q50.jpg",
      ],
    },
  ];

  for (const phone of phones) {
    const slug =
      phone.name.toLowerCase().replace(/\s+/g, "-") + "-" + generateNanoid();

    const createdProduct = await prisma.product.upsert({
      where: { sku: phone.sku },
      update: {},
      create: {
        id: generateUlid(),
        sku: phone.sku,
        slug,
        name: phone.name,
        brand: phone.brand,
        model: phone.model,
        description: phone.description,
        price: phone.price,
        discount: phone.discount,
        condition: phone.condition,
        storage: phone.storage,
        minimumOrderQuantity: phone.minimumOrderQuantity,
        warrantyMonths: phone.warrantyMonths,
        stockQuantity: phone.stockQuantity,
        rating: phone.rating,
        reviewsCount: phone.reviewsCount,
        batteryHealth: phone.batteryHealth,
        ram: phone.ram,
        display: phone.display,
        processor: phone.processor,
        camera: phone.camera,
        battery: phone.battery,
        os: phone.os,
        connectivity: phone.connectivity,
        color: phone.color,
      },
    });

    const galleryData = phone.images.map((imageUrl) => ({
      id: generateUlid(),
      imageUrl,
      productId: createdProduct.id,
    }));

    await prisma.gallery.createMany({ data: galleryData });
  }

  console.log("Seed data inserted");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
