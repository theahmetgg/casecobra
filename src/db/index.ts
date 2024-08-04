import { PrismaClient } from "@prisma/client";

// Global olarak PrismaClient örneğini tanımlar
declare global {
    var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;

// Ortama göre PrismaClient örneğini oluşturur
if (process.env.NODE_ENV === "production") {
    // Üretim ortamında her istek için yeni bir PrismaClient oluşturur
    prisma = new PrismaClient();
} else {
    // Geliştirme ortamında global önbellekte mevcut bir PrismaClient örneğini kullanır veya yeni bir örnek oluşturur
    if (!global.cachedPrisma) {
        globalThis.cachedPrisma = new PrismaClient();
    }
    prisma = global.cachedPrisma;
}

// PrismaClient örneğini dışarıya aktarır
export const db = prisma;
