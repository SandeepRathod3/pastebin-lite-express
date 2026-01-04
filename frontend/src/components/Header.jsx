import { Code2, Github, Palette } from "lucide-react";
import { Button } from "./ui/button";
import { ThemeToggle } from "./ui/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-purple-600">
            <Code2 className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Pastebin-Lite</h1>
            <p className="text-sm text-muted-foreground">
              Modern paste sharing with style
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Palette className="h-4 w-4" />
          </Button>
          <ThemeToggle />
          <Button variant="outline" size="icon" className="h-9 w-9">
            <Github className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}