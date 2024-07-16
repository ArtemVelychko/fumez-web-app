import Image from "next/image";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";

const font = Poppins({ subsets: ["latin"], weight: ["400", "500"] });

export const Logo = () => {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image src="/icon.ico" alt="logo" width="30" height="30" className="dark:hidden"/>

      <Image src="/nose-light.svg" alt="logo" width="30" height="30" className="hidden dark:block"/>
    
      <p className={cn("font-semibold", font.className)}>PureFumez</p>
    </div>
  );
};
