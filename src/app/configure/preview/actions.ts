"use server";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { db } from "@/db";
import { stripe } from "@/lib/stripe";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Order } from "@prisma/client";

export const createCheckoutSession = async ({
  configId,
}: {
  configId: string;
}) => {
  // Configuration'ı bul
  const configuration = await db.configuration.findUnique({
    where: { id: configId },
  });

  if (!configuration) {
    throw new Error("No such configuration found");
  }

  // Kinde oturumunu al ve kullanıcıyı kontrol et
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  console.log("User from Kinde:", user);
  console.log("User ID:", user?.id);

  if (!user) {
    throw new Error("You need to be logged in");
  }

  // Kullanıcının veritabanında mevcut olduğundan emin ol
  const existingUser = await db.user.findUnique({
    where: { id: user.id },
  });

  if (!existingUser) {
    throw new Error("User not found");
  }

  // Fiyatı hesapla
  const { finish, material } = configuration;
  let price = BASE_PRICE;
  if (finish === "textured") price += PRODUCT_PRICES.finish.textured;
  if (material === "polycarbonate")
    price += PRODUCT_PRICES.material.polycarbonate;

  let order: Order | undefined = undefined;

  // Mevcut siparişi kontrol et
  const existingOrder = await db.order.findFirst({
    where: {
      userId: user.id,
      configurationId: configuration.id,
    },
  });

  console.log("User ID:", user.id);
  console.log("Configuration ID:", configuration.id);

  // Eğer mevcut sipariş varsa, onu kullan
  if (existingOrder) {
    order = existingOrder;
  } else {
    // Yeni sipariş oluştur
    order = await db.order.create({
      data: {
        amount: price / 100,
        userId: user.id,
        configurationId: configuration.id,
      },
    });
  }

  // Stripe'da yeni bir ürün oluştur
  const product = await stripe.products.create({
    name: "Custom iPhone Case",
    images: [configuration.imageUrl],
    default_price_data: {
      currency: "USD",
      unit_amount: price,
    },
  });

  // Stripe Checkout oturumu oluştur
  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    payment_method_types: ["card", "paypal"],
    mode: "payment",
    shipping_address_collection: { allowed_countries: ["DE", "US"] },
    metadata: {
      userId: user.id,
      orderId: order.id,
    },
    line_items: [{ price: product.default_price as string, quantity: 1 }],
  });

  return { url: stripeSession.url };
};
