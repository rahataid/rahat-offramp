import * as React from "react"
import { MoonIcon, SunIcon } from "@radix-ui/react-icons"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function Layout({ children }: { children: React.ReactNode }) {
  const { setTheme, theme } = useTheme()

  return (
    <div className="min-h-screen bg-background font-sans antialiased">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <a href="/" className="flex items-center space-x-2">
              <span className="inline-block font-bold">Offramp Platform</span>
            </a>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              >
                <SunIcon className="h-[1.5rem] w-[1.3rem] dark:hidden" />
                <MoonIcon className="hidden h-5 w-5 dark:block" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </nav>
          </div>
        </div>
      </header>
      <main className="container py-10">{children}</main>
    </div>
  )
}

