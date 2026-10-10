import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { Smoke } from "@/components/prologue/Smoke";

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="relative isolate min-h-screen flex flex-col overflow-x-clip">
      <Smoke />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
