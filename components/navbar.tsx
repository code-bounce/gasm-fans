"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useHeader } from "@/lib/header-context";
import { useTheme } from "@/lib/theme-context";
import { HiOutlineBell, HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";

export function Navbar() {
  const { title } = useHeader();
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="flex items-center justify-between h-16 border-b border-border bg-background px-4 gap-4">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <h2 className="text-xl font-semibold hidden md:block">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 text-muted-foreground hover:text-foreground transition"
          aria-label="Toggle theme"
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? (
            <HiOutlineMoon className="size-5" />
          ) : (
            <HiOutlineSun className="size-5" />
          )}
        </button>
        <button
          className="relative p-2 text-muted-foreground hover:text-foreground transition"
          aria-label="Notifications"
          title="Notifications"
        >
          <HiOutlineBell className="size-5" />
          <span className="absolute top-1 right-1 size-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </nav>
  );
}
