import Image from "next/image";

export const Heroes = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center">
        <div className="relative w-[300px] sm:w-[350px] sm:h-[350px] md:h-[400px] md:w-[400px]">
          <Image
            src="/bottle-image.png"
            alt="Perfume bottle"
            fill
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};
