// Veritabanı bağlantısını ve yardımcı fonksiyonları içe aktar
import { db } from "@/db"; // Commit: `Veritabanı bağlantısını içe aktar`
import { notFound } from "next/navigation"; // Commit: `notFound yardımcı fonksiyonunu içe aktar`
import DesignConfigurator from "./DesignConfigurator"; // Commit: `DesignConfigurator bileşenini içe aktar`

// searchParams'in beklenen yapısını tanımlayan arayüz
interface PageProps {
  searchParams: {
    [key: string]: string | string[] | undefined; // Commit: `searchParams için PageProps arayüzünü tanımla`
  };
}

// Ana Page bileşeni
const Page = async ({ searchParams }: PageProps) => {
  const { id } = searchParams; // Commit: `'id' parametresini searchParams'tan al`

  // 'id' eksikse veya string değilse işleme
  if (!id || typeof id !== "string") {
    return notFound(); // Commit: `'id' geçerli değilse 404 yanıtı döndür`
  }

  // 'id' kullanarak veritabanından konfigürasyonu al
  const configuration = await db.configuration.findUnique({
    where: { id }, // Commit: `'id' ile veritabanında konfigürasyon sorgula`
  });

  // Konfigürasyon bulunamazsa işleme
  if (!configuration) {
    return notFound(); // Commit: `Konfigürasyon bulunamazsa 404 yanıtı döndür`
  }
  
  // Konfigürasyondan gerekli özellikleri ayıkla
  const { imageUrl, width, height } = configuration; // Commit: `Konfigürasyon özelliklerini ayıkla`

  // DesignConfigurator bileşenini konfigürasyon verileri ile render et
  return (
    <DesignConfigurator
      configId={configuration.id} // Commit: `DesignConfigurator bileşenine konfigürasyon ID'sini geçir`
      imageDimensions={{
        width, // Commit: `Görüntü genişliğini geçir`
        height, // Commit: `Görüntü yüksekliğini geçir`
      }}
      imageUrl={imageUrl} // Commit: `Görüntü URL'sini geçir`
    />
  );
};

// Page bileşenini varsayılan olarak dışa aktar
export default Page; // Commit: `Page bileşenini varsayılan olarak dışa aktar`
