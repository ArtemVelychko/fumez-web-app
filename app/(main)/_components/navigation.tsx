"use client";

import { cn } from "@/lib/utils";
import {
  ChevronsLeft,
  MenuIcon,
  Leaf,
  Search,
  Settings,
  Trash,
} from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { useParams, usePathname } from "next/navigation";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import { UserItem } from "./user-item";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Item } from "./Item";
import { TrashBox } from "./trash-box";
import { useSearch } from "@/hooks/use-search";
import { useSettings } from "@/hooks/use-settings";
import { Navbar } from "./navbar";
import { Separator } from "@/components/ui/separator";
import { MaterialNavbar } from "./materialNavbar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LeafyGreen, Sprout, FlaskRound } from "lucide-react";

export const Navigation = () => {
  const params = useParams();
  const settings = useSettings();
  const search = useSearch();
  const pathname = usePathname();
  const isMobile = useMediaQuery("(max-width: 768px)");

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
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
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
        `calc(100% - ${newWidth}px)`
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
        isMobile ? "0" : "calc(100% - 240px)"
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
          "group/sidebar h-full bg-secondary overflow-y-auto relative flex w-60 flex-col z-[99999] border-b",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "w-0"
        )}
      >
        <div className="flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="#">
            <Leaf className="h-6 w-6" />
            <span>My dashboard</span>
          </Link>
          <Button
            onClick={collapse}
            role="button"
            size="icon"
            variant="outline"
            className={cn(
              "ml-auto h-8 w-8 text-muted-foreground transition-transform transform hover:scale-110 hover:rounded-md hover:bg-gray-100/40 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50",
              isMobile && "opacity-100"
            )}
          >
            <ChevronsLeft className="h-6 w-6" />
          </Button>
        </div>
        <div className="mt-4">
          <Item label="Search" icon={Search} isSearch onClick={search.onOpen} />
          <Item label="Settings" icon={Settings} onClick={settings.onOpen} />
          <Separator className="mt-4" />
        </div>

        <div>
          <div className="grid items-start px-3 my-4 text-sm font-medium gap-2">
            <Link
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-gray-500 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-50",
                {
                  "bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-gray-50":
                    pathname.startsWith("/materials"),
                }
              )}
              href="/materials"
            >
              <LeafyGreen className="size-4 mr-2"/>
              Materials
            </Link>

            <Link
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-gray-500 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-50",
                {
                  "bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-gray-50":
                    pathname.startsWith("/accords"),
                }
              )}
              href="/accords"
            >
              <Sprout className="size-4 mr-2" />
              Accords | Bases
            </Link>

            <Link
              className={cn(
                "flex items-center rounded-lg px-3 py-2 text-gray-500 transition-all hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-50",
                {
                  "bg-gray-300 text-gray-900 dark:bg-gray-600 dark:text-gray-50":
                    pathname.startsWith("/formulas"),
                }
              )}
              href="/formulas"
            >
              <FlaskRound className="size-4 mr-2" />
              Formulas
            </Link>
          </div>
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
          className="group-hover/sidebar:opacity-100 transition cursor-ew-resize absolute h-full w-0.5 bg-primary/10 right-0 top-0"
        />
      </aside>
      <div
        ref={navBarRef}
        className={cn(
          "absolute h-[60px] top-0 z-[99999] left-60 w-[calc(100%-240px)] border-b bg-background flex justify-end items-center",
          isResetting && "transition-all ease-in-out duration-300",
          isMobile && "left-0 w-full",
          isCollapsed && "justify-between"
        )}
      >
        {isCollapsed && (
          <MenuIcon
            role="button"
            onClick={resetWidth}
            size="icon"
            className="ml-5 h-6 w-6 text-muted-foreground transition-transform transform hover:scale-110 hover:rounded-md hover:bg-gray-100/40 hover:text-gray-900 dark:hover:bg-gray-800 dark:hover:text-gray-50"
          />
        )}
        {((isMobile && isCollapsed) || !isMobile) && <UserItem />}
      </div>
    </>
  );
};
