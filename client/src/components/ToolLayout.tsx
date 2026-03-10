import { Link } from "wouter";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

interface ToolLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

export default function ToolLayout({ title, description, children }: ToolLayoutProps) {
  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (_error) {
      // Ignore ad-blocker/runtime errors so page rendering is unaffected.
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-foreground hover:text-primary transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Tools</span>
            </a>
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold text-sm">
              T
            </div>
            <span className="font-semibold text-foreground hidden sm:inline">ToolBox Suite</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Tool Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              {title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {description}
            </p>
          </div>

          {/* Tool Content */}
          <div className="bg-card rounded-xl border border-border shadow-sm p-6 md:p-8">
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-secondary-bg border-t border-border mt-16 py-8">
        <div className="container text-center text-muted-foreground text-sm space-y-4">
          <p>&copy; 2026 ToolBox Suite. All rights reserved.</p>
          <ins
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client="ca-pub-2476363543205510"
            data-ad-format="auto"
            data-full-width-responsive="true"></ins>
        </div>
      </footer>
    </div>
  );
}
