"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useParams, usePathname, useRouter } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-item";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./Item";
import { toast } from "sonner";
import { TrashBox } from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Navbar } from "./navbar";
import { Separator } from "@/components/ui/separator";
import { MaterialNavbar } from "./materialNavbar";
import { Button } from "@/components/ui/button";

export const Navigation = () => {
  const router = useRouter();
  const params = useParams();
  const settings = useSettings();
  const search = useSearch();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const createFormula = useMutation(api.documents.create);

  const isResizingRef = useRef(false);
  const sideBarRef = useRef<ElementRef<"aside">>(null);
  const navBarRef = useRef<ElementRef<"div">>(null);
  const [isResetting, setIsResetting] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      collapse();
    } else {
      resetWidth();
    }
  }, [isMobile]);

  useEffect(() => {
    if (isMobile) {
      collapse();
    }
  }, [pathname, isMobile]);

  const handleMouseDown = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
  ) => {
    event.preventDefault();
    event.stopPropagation();

    isResizingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isResizingRef.current) return;

    let newWidth = event.clientX;

    if (newWidth < 240) {
      newWidth = 240;
    }

    if (newWidth > 480) {
      newWidth = 480;
    }

    if (sideBarRef.current && navBarRef.current) {
      sideBarRef.current.style.width = `${newWidth}px`;
      navBarRef.current.style.setProperty("left", `${newWidth}px`);
      navBarRef.current.style.setProperty(
        "width",
        `calc(100% - ${newWidth}px)`,
      );
    }
  };

  const handleMouseUp = () => {
    isResizingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  const resetWidth = () => {
    if (sideBarRef.current && navBarRef.current) {
      setIsResetting(true);
      setIsCollapsed(false);

      sideBarRef.current.style.width = isMobile ? "100%" : "240px";
      navBarRef.current.style.setProperty(
        "width",
        isMobile ? "0" : "calc(100% - 240px)",
      );

      navBarRef.current.style.setProperty("left", isMobile ? "100%" : "240px");
      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const collapse = () => {
    if (sideBarRef.current && navBarRef.current) {
      setIsCollapsed(true);
      setIsResetting(true);

      sideBarRef.current.style.width = "0";
      navBarRef.current.style.setProperty("width", "100%");
      navBarRef.current.style.setProperty("left", "0");

      setTimeout(() => setIsResetting(false), 300);
    }
  };

  const handleCreateFormula = () => {
    const promise = createFormula({ title: "Untitled" });

    toast.promise(promise, {
      loading: "Creating a new formula...",
      success: "Formula created successfully",
      error: "Failed to create formula",
    });
  };

  const navbarPicker = () => {
    switch (true) {
      case !!params.documentId:
        return <Navbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />;
      case !!params.materialId:
        return (
          <MaterialNavbar isCollapsed={isCollapsed} onResetWidth={resetWidth} />
        );
      default:
        return (
          <nav className="bg-transparent px-3 py-2 w-full">
            {isCollapsed && (
              <MenuIcon
                onClick={resetWidth}
                role="button"
                className="h-6 w-6 text-muted-foreground"
              />
            )}
          </nav>
        );
    }
  };

  return (
    <>
      <aside
        ref={sideBarRef}
        className={cn(
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999]",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0",
        )}
      >
        <div
          onClick={collapse}
          role="button"
          className={cn(
            "h-6 w-6 text-muted-foreground rounded-sm hover:bg-neutral-300 dark:hover:bg-neutral-600 absolute top-3 right-2 opacity-0 group-hover/sidebar:opacity-100 transition",
            isMobile && "opacity-100",
          )}
        >
          <ChevronsLeft className="h-6 w-6" />
        </div>
        <div>
          <UserItem />
          <Item label="Search" icon={Search} isSearch onClick={search.onOpen} />
          <Item label="Settings" icon={Settings} onClick={settings.onOpen} />
          <Separator className="mt-4" />
        </div>

        <div>
          <Button
            onClick={() => router.push("/materials")}
            className={cn(
              "group min-h-[27px] text-sm py-1 w-full my-2 hover:bg-primary/5 flex items-center text-muted-foreground font-medium bg-primary/10 rounded-none",
            )}
          >
            My materials
          </Button>
        </div>

        <div>
          <Button
            onClick={() => router.push("/accords")}
            className={cn(
              "group min-h-[27px] text-sm py-1 w-full my-2 hover:bg-primary/5 flex items-center text-muted-foreground font-medium bg-primary/10 rounded-none",
            )}
          >
            My Accords
          </Button>
        </div>

        <div>
          <Button
            onClick={() => router.push("/documents")}
            className={cn(
              "group min-h-[27px] text-sm py-1 w-full my-2 hover:bg-primary/5 flex items-center text-muted-foreground font-medium bg-primary/10 rounded-none",
            )}
          >
            My formulas
          </Button>
        </div>

        <div>
          <Separator />
          <Popover>
            <PopoverTrigger className="w-full mt-4">
              <Item label="Trash" icon={Trash} />
            </PopoverTrigger>
            <PopoverContent
              className="p-0 w-72"
              side={isMobile ? "bottom" : "right"}
            >
              <TrashBox />
            </PopoverContent>
          </Popover>
        </div>

        <div
          onMouseDown={handleMouseDown}
          onClick={resetWidth}
          className="opacity-0 group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-1 bg-primary/10 right-0 top-0 "
        />
      </aside>
      <div
        ref={navBarRef}
        className={cn(
          "absolute h-14 lg:h-[60px] top-0 z-[99999] left-60 w-[calc(100%-240px)]",
          isResetting && "transition-all ease-in-out duration-300 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40",
          isMobile && "left-0 w-full",
        )}
      >
        {navbarPicker()}
      </div>
    </>
  );
};