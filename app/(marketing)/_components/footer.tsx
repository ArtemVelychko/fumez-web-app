import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import { Ghost } from "lucide-react";

export const Footer = () => {
  return (
    <div className="flex items-center w-full p-6 bg-background z-50">
      <Logo />
      <div className="md:ml-auto w-full justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
        <Button variant="ghost">Private Policy</Button>
        <Button variant="ghost">Terms & Conditions</Button>
      </div>
    </div>
  );
};
