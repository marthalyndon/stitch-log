"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-primary">
              Stitch Log
            </h1>
          </Link>
          
          <nav className="flex items-center gap-4">
            <Link href="/">
              <Button 
                variant={pathname === "/" ? "default" : "ghost"}
                className="font-medium"
              >
                Projects
              </Button>
            </Link>
            <Link href="/board">
              <Button 
                variant={pathname === "/board" ? "default" : "ghost"}
                className="font-medium"
              >
                Board
              </Button>
            </Link>
            <Link href="/projects/new">
              <Button className="font-medium">
                + New Project
              </Button>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

