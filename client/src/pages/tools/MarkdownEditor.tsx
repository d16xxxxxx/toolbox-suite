import { useState } from "react";
import { marked } from "marked";
import { Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

export default function MarkdownEditor() {
  const [markdown, setMarkdown] = useState("# Welcome to Markdown Editor\n\nStart typing your markdown here...");

  const html = marked(markdown);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(markdown);
    toast.success("Copied to clipboard!");
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.md";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  const downloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; max-width: 900px; margin: 0 auto; padding: 20px; line-height: 1.6; }
    h1, h2, h3, h4, h5, h6 { margin-top: 24px; margin-bottom: 16px; font-weight: 600; }
    code { background: #f6f8fa; padding: 2px 6px; border-radius: 3px; font-family: monospace; }
    pre { background: #f6f8fa; padding: 16px; border-radius: 6px; overflow-x: auto; }
    blockquote { border-left: 4px solid #ddd; margin: 0; padding-left: 16px; color: #666; }
    table { border-collapse: collapse; width: 100%; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "document.html";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="Markdown Editor"
      description="Write and preview markdown in real-time"
    >
      <div className="space-y-6">
        {/* Editor and Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Markdown Input
            </label>
            <textarea
              value={markdown}
              onChange={(e) => setMarkdown(e.target.value)}
              className="w-full h-96 p-4 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
            />
          </div>

          {/* Preview */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Preview
            </label>
            <div className="w-full h-96 p-4 rounded-lg border border-border bg-secondary-bg overflow-y-auto prose prose-sm max-w-none">
              <div
                className="text-foreground"
                dangerouslySetInnerHTML={{ __html: html as string }}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={copyToClipboard}
            className="btn-secondary flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy Markdown
          </Button>
          <Button
            onClick={downloadMarkdown}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download .md
          </Button>
          <Button
            onClick={downloadHtml}
            className="btn-outline flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download .html
          </Button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 mb-2">
            <strong>How it works:</strong> Write markdown on the left side and see the preview on the right. You can download your content as a markdown file or as HTML.
          </p>
          <p className="text-xs text-blue-800">
            <strong>Markdown Syntax:</strong> Use # for headings, **bold**, *italic*, [links](url), - for lists, and more.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
