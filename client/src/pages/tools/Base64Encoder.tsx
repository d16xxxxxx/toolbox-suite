import { useState } from "react";
import { Copy, ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  let output = "";

  try {
    if (input) {
      if (mode === "encode") {
        output = btoa(input);
        setError("");
      } else {
        output = atob(input);
        setError("");
      }
    }
  } catch (err) {
    setError((err as Error).message);
    output = "";
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
    toast.success("Copied to clipboard!");
  };

  const swapMode = () => {
    setInput(output);
    setMode(mode === "encode" ? "decode" : "encode");
  };

  return (
    <ToolLayout
      title="Base64 Encoder/Decoder"
      description="Encode text to Base64 or decode Base64 to text"
    >
      <div className="space-y-6">
        {/* Mode Selection */}
        <div className="flex gap-3">
          <button
            onClick={() => setMode("encode")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              mode === "encode"
                ? "bg-primary text-white"
                : "bg-secondary-bg text-foreground hover:bg-border"
            }`}
          >
            Encode
          </button>
          <button
            onClick={() => setMode("decode")}
            className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
              mode === "decode"
                ? "bg-primary text-white"
                : "bg-secondary-bg text-foreground hover:bg-border"
            }`}
          >
            Decode
          </button>
        </div>

        {/* Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
            className="w-full h-32 p-4 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none font-mono text-sm"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-900">
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}

        {/* Output */}
        {input && !error && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              {mode === "encode" ? "Encoded Base64" : "Decoded Text"}
            </label>
            <div className="relative">
              <textarea
                value={output}
                readOnly
                className="w-full h-32 p-4 rounded-lg border border-border bg-secondary-bg text-foreground resize-none font-mono text-sm"
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
            onClick={swapMode}
            disabled={!input || !!error}
            className="btn-secondary flex items-center gap-2"
          >
            <ArrowRightLeft className="w-4 h-4" />
            Swap & Convert
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
            <strong>How it works:</strong> Enter text to encode it to Base64, or paste Base64 to decode it back to text. Use the "Swap & Convert" button to quickly convert the output and switch modes.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
