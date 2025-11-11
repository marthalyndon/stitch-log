"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <h1 className="text-2xl font-extrabold text-primary">
              StitchLog
            </h1>
          </Link>
          
          <nav className="flex items-center gap-3">
            <Link href="/needles">
              <Button variant="ghost" className="font-medium">
                My Needles
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

