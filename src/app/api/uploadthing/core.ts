import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { z } from 'zod'
import sharp from 'sharp'
import { db } from '@/db'

// Uploadthing istemcisi oluşturuluyor
const f = createUploadthing()

// Dosya yükleme işlevi tanımlanıyor
export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: '4MB' } })
    .input(z.object({ configId: z.string().optional() })) // İsteğe bağlı configId
    .middleware(async ({ input }) => {
      return { input } // Gelen veriyi middleware'den geçirir
    })
    .onUploadComplete(async ({ metadata, file }) => {
      const { configId } = metadata.input

      // Yüklenen dosyanın URL'sinden dosya verisini al
      const res = await fetch(file.url)
      const buffer = await res.arrayBuffer()

      // Resim metadata'sını al
      const imgMetadata = await sharp(buffer).metadata()
      const { width, height } = imgMetadata

      if (!configId) {
        // Yeni bir configuration kaydı oluştur
        const configuration = await db.configuration.create({
          data: {
            imageUrl: file.url,
            height: height || 500, // Varsayılan yükseklik
            width: width || 500,   // Varsayılan genişlik
          },
        })

        return { configId: configuration.id }
      } else {
        // Mevcut configuration kaydını güncelle
        const updatedConfiguration = await db.configuration.update({
          where: {
            id: configId,
          },
          data: {
            croppedImageUrl: file.url,
          },
        })

        return { configId: updatedConfiguration.id }
      }
    }),
} satisfies FileRouter

// OurFileRouter tipini dışa aktar
export type OurFileRouter = typeof ourFileRouter
