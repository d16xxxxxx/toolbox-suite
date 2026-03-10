import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [indentSize, setIndentSize] = useState(2);

  let output = "";
  let isValid = false;

  try {
    if (input.trim()) {
      const parsed = JSON.parse(input);
      output = JSON.stringify(parsed, null, indentSize);
      isValid = true;
      setError("");
    }
  } catch (err) {
    setError((err as Error).message);
    isValid = false;
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const minify = () => {
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setInput(minified);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const beautify = () => {
    try {
      const parsed = JSON.parse(input);
      const beautified = JSON.stringify(parsed, null, indentSize);
      setInput(beautified);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <ToolLayout
      title="JSON Formatter"
      description="Format, validate, and minify JSON"
    >
      <div className="space-y-6">
        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            JSON Input
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Paste JSON here... e.g., {"name": "John", "age": 30}'
            className="w-full h-64 p-4 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
          />
        </div>

        {/* Indent Size */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-foreground">Indent Size:</label>
          <select
            value={indentSize}
            onChange={(e) => setIndentSize(parseInt(e.target.value))}
            className="px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value={2}>2 spaces</option>
            <option value={4}>4 spaces</option>
            <option value={8}>8 spaces</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-900">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Validation Status */}
        {input && !error && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-900">
              <strong>Valid JSON!</strong> The JSON is properly formatted.
            </p>
          </div>
        )}

        {/* Output */}
        {isValid && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Formatted Output
            </label>
            <div className="relative">
              <textarea
                value={output}
                readOnly
                className="w-full h-64 p-4 rounded-lg border border-border bg-secondary-bg text-foreground resize-none font-mono text-sm"
              />
              <button
                onClick={copyToClipboard}
                className="absolute top-3 right-3 p-2 hover:bg-border rounded transition-colors"
              >
                <Copy className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={beautify}
            disabled={!input}
            className="btn-primary"
          >
            Beautify
          </Button>
          <Button
            onClick={minify}
            disabled={!input}
            className="btn-secondary"
          >
            Minify
          </Button>
          <Button
            onClick={() => {
              setInput("");
              setError("");
            }}
            disabled={!input}
            className="btn-outline"
          >
            Clear
          </Button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>How it works:</strong> Paste JSON code to validate and format it. Choose your preferred indent size, then beautify or minify the JSON as needed.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
