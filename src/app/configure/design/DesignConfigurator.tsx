import { AspectRatio } from "@/components/ui/aspect-ratio"; // AspectRatio bileşeni, görüntülerin doğru oranlarda gösterilmesini sağlar
import { cn } from "@/lib/utils"; // Dinamik sınıf isimlerini birleştiren veya oluşturan yardımcı işlev
import NextImage from "next/image"; // Next.js'in optimize edilmiş resim bileşeni

interface DesignConfiguratorProps {
  configId: string; // Konfigürasyon kimliği, genellikle veritabanı kaydı için kullanılır
  imageUrl: string; // Görüntünün URL'si
  imageDimensions: { width: number; height: number }; // Görüntünün boyutları
}

const DesignConfigurator = ({
  configId,
  imageUrl,
  imageDimensions,
}: DesignConfiguratorProps) => {
  return (
    <div className="relative mt-20 grid grid-cols-3 mb-20 pb-20">
      {/* Ana kapsayıcı div, bir ızgara düzeninde görüntüyü ve şablonu düzenler */}
      <div className="relative h-[37.5rem] overflow-hidden col-span-2 w-full max-w-4xl flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
        {/* Şablon görüntüsünü ve stilini tanımlar */}
        <div className="relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]">
          {/* AspectRatio bileşeni, belirli bir en-boy oranında görseli doğru şekilde göstermek için kullanılır */}
          <AspectRatio
            ratio={896 / 1831} // Şablonun en-boy oranı
            className="pointer-events-none relative z-50 aspect-[896/1831] w-full"
          >
            <NextImage
              fill
              alt="phone image"
              src="/phone-template.png" // Şablon resminin kaynağı
              className="pointer-events-none z-50 select-none" // Seçim yapılmasını engeller ve z-index ayarlar
            />
          </AspectRatio>
          <div className="absolute z-40 inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]" />
          {/* Arka planın etrafında gölgeli bir kenarlık */}
          <div
            className={cn(
              "absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[32px]",
              `bg-zinc-950`, // Arka plan rengi
            )}
          />
        </div>

        <div className="relative w-full h-full">
          {/* Kullanıcının yüklediği resmi gösterir */}
          <NextImage
            src={imageUrl} // Kullanıcının yüklediği görüntünün URL'si
            fill
            alt="your image"
            className="pointer-events-none" // Görüntüye tıklama olayını engeller
          />
        </div>
      </div>
    </div>
  );
};

export default DesignConfigurator;
