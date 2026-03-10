import { Link } from "wouter";
import { FileText, Image, Type, Code2, ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

/**
 * Design Philosophy: Modern Utility Minimalism with Productive Energy
 * - Clean, purposeful layout with strategic use of whitespace
 * - Indigo-blue (#3B82F6) primary accent with cyan (#06B6D4) secondary
 * - Tool cards with subtle shadows and hover animations
 * - Responsive grid system for tool categories
 */

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  path: string;
}

const tools: Tool[] = [
  // PDF Tools
  {
    id: "pdf-merge",
    name: "Merge PDF",
    description: "Combine multiple PDF files into one",
    icon: <FileText className="w-8 h-8" />,
    category: "PDF",
    path: "/pdf-merge",
  },
  {
    id: "pdf-split",
    name: "Split PDF",
    description: "Extract pages from PDF files",
    icon: <FileText className="w-8 h-8" />,
    category: "PDF",
    path: "/pdf-split",
  },
  {
    id: "pdf-compress",
    name: "Compress PDF",
    description: "Reduce PDF file size",
    icon: <FileText className="w-8 h-8" />,
    category: "PDF",
    path: "/pdf-compress",
  },
  {
    id: "pdf-rotate",
    name: "Rotate PDF",
    description: "Rotate PDF pages",
    icon: <FileText className="w-8 h-8" />,
    category: "PDF",
    path: "/pdf-rotate",
  },
  {
    id: "image-to-pdf",
    name: "Image to PDF",
    description: "Convert images to PDF",
    icon: <FileText className="w-8 h-8" />,
    category: "PDF",
    path: "/image-to-pdf",
  },

  // Image Tools
  {
    id: "image-compress",
    name: "Compress Image",
    description: "Reduce image file size",
    icon: <Image className="w-8 h-8" />,
    category: "Image",
    path: "/image-compress",
  },
  {
    id: "image-resize",
    name: "Resize Image",
    description: "Change image dimensions",
    icon: <Image className="w-8 h-8" />,
    category: "Image",
    path: "/image-resize",
  },
  {
    id: "image-crop",
    name: "Crop Image",
    description: "Crop and trim images",
    icon: <Image className="w-8 h-8" />,
    category: "Image",
    path: "/image-crop",
  },
  {
    id: "image-convert",
    name: "Convert Image",
    description: "Convert between image formats",
    icon: <Image className="w-8 h-8" />,
    category: "Image",
    path: "/image-convert",
  },
  {
    id: "image-filter",
    name: "Image Filter",
    description: "Apply filters and effects",
    icon: <Image className="w-8 h-8" />,
    category: "Image",
    path: "/image-filter",
  },

  // Text Tools
  {
    id: "word-count",
    name: "Word Counter",
    description: "Count words, characters, and lines",
    icon: <Type className="w-8 h-8" />,
    category: "Text",
    path: "/word-count",
  },
  {
    id: "case-converter",
    name: "Case Converter",
    description: "Convert text case",
    icon: <Type className="w-8 h-8" />,
    category: "Text",
    path: "/case-converter",
  },
  {
    id: "markdown-editor",
    name: "Markdown Editor",
    description: "Write and preview markdown",
    icon: <Type className="w-8 h-8" />,
    category: "Text",
    path: "/markdown-editor",
  },
  {
    id: "text-diff",
    name: "Text Diff Checker",
    description: "Compare two text documents",
    icon: <Type className="w-8 h-8" />,
    category: "Text",
    path: "/text-diff",
  },
  {
    id: "text-replace",
    name: "Find & Replace",
    description: "Find and replace text",
    icon: <Type className="w-8 h-8" />,
    category: "Text",
    path: "/text-replace",
  },

  // Developer Tools
  {
    id: "json-formatter",
    name: "JSON Formatter",
    description: "Format and validate JSON",
    icon: <Code2 className="w-8 h-8" />,
    category: "Developer",
    path: "/json-formatter",
  },
  {
    id: "base64-encoder",
    name: "Base64 Encoder/Decoder",
    description: "Encode and decode Base64",
    icon: <Code2 className="w-8 h-8" />,
    category: "Developer",
    path: "/base64-encoder",
  },
  {
    id: "color-picker",
    name: "Color Picker",
    description: "Pick and convert colors",
    icon: <Code2 className="w-8 h-8" />,
    category: "Developer",
    path: "/color-picker",
  },
  {
    id: "qr-code",
    name: "QR Code Generator",
    description: "Generate QR codes",
    icon: <Code2 className="w-8 h-8" />,
    category: "Developer",
    path: "/qr-code",
  },
  {
    id: "password-generator",
    name: "Password Generator",
    description: "Generate secure passwords",
    icon: <Code2 className="w-8 h-8" />,
    category: "Developer",
    path: "/password-generator",
  },
  {
    id: "unit-converter",
    name: "Unit Converter",
    description: "Convert between units",
    icon: <Code2 className="w-8 h-8" />,
    category: "Developer",
    path: "/unit-converter",
  },
];

const categories = ["All", "PDF", "Image", "Text", "Developer"];

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
    } catch (_error) {
      // Ignore ad-blocker/runtime errors so UI stays functional.
    }
  }, []);

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-border shadow-sm">
        <div className="container py-4 flex items-center justify-between">
          <Link href="/">
            <a className="flex items-center gap-2 text-2xl font-bold">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
                T
              </div>
              <span className="text-foreground">ToolBox Suite</span>
            </a>
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#tools" className="text-muted-foreground hover:text-foreground transition-colors">Tools</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
            <a href="#contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 py-16 md:py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container relative z-10">
          <div className="max-w-3xl mx-auto text-center animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              All Your Tools in One Place
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Free, fast, and secure online tools for PDF, images, text, and development. No sign-up required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="btn-primary text-base">
                Get Started
              </Button>
              <Button className="btn-outline text-base">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="container py-12">
        <div className="max-w-2xl mx-auto">
          <div className="relative mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Search tools..."
              className="input-field pl-12 py-3 text-base"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-primary text-white shadow-md"
                    : "bg-secondary-bg text-foreground hover:bg-border"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool, index) => (
            <Link key={tool.id} href={tool.path}>
              <a
                className="tool-card group"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary group-hover:bg-primary group-hover:text-white transition-all duration-200">
                    {tool.icon}
                  </div>
                  <span className="badge text-xs">{tool.category}</span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {tool.description}
                </p>
                <div className="flex items-center text-primary font-medium text-sm group-hover:gap-2 transition-all duration-200">
                  Use Tool
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </a>
            </Link>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No tools found matching your search.</p>
          </div>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-secondary-bg py-16 md:py-24 mt-12">
        <div className="container">
          <h2 className="section-title text-center">Why Choose ToolBox Suite?</h2>
          <p className="section-subtitle text-center">
            Powerful features designed for your productivity
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "100% Free",
                description: "All tools are completely free. No hidden charges or premium features.",
              },
              {
                title: "No Sign-up",
                description: "Start using tools immediately without creating an account.",
              },
              {
                title: "Secure & Private",
                description: "All processing happens in your browser. Your files never leave your device.",
              },
              {
                title: "Fast Processing",
                description: "Optimized algorithms for quick and efficient file processing.",
              },
              {
                title: "Multiple Formats",
                description: "Support for various file formats and conversion options.",
              },
              {
                title: "Always Available",
                description: "Access tools anytime, anywhere, on any device.",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-primary rounded-full"></div>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-12">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="font-semibold mb-4">ToolBox Suite</h4>
              <p className="text-gray-300 text-sm">
                Free online tools for productivity and development.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Tools</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">PDF Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Image Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Text Tools</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Developer Tools</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-300">
            <p>&copy; 2026 ToolBox Suite. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Google AdSense */}
      <div className="container py-8 text-center text-muted-foreground text-sm">
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-2476363543205510"
          data-ad-format="auto"
          data-full-width-responsive="true"></ins>
      </div>
    </div>
  );
}
