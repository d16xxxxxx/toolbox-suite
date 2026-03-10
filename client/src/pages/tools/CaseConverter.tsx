import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

const caseOptions = [
  { name: "UPPERCASE", transform: (t: string) => t.toUpperCase() },
  { name: "lowercase", transform: (t: string) => t.toLowerCase() },
  { name: "Capitalize", transform: (t: string) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() },
  { name: "Title Case", transform: (t: string) => t.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(" ") },
  { name: "Sentence case", transform: (t: string) => t.charAt(0).toUpperCase() + t.slice(1).toLowerCase() },
  { name: "camelCase", transform: (t: string) => t.split(/\s+/).map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("") },
  { name: "PascalCase", transform: (t: string) => t.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join("") },
  { name: "snake_case", transform: (t: string) => t.toLowerCase().replace(/\s+/g, "_") },
  { name: "kebab-case", transform: (t: string) => t.toLowerCase().replace(/\s+/g, "-") },
];

export default function CaseConverter() {
  const [text, setText] = useState("");
  const [selectedCase, setSelectedCase] = useState("UPPERCASE");

  const caseOption = caseOptions.find((c) => c.name === selectedCase);
  const convertedText = caseOption ? caseOption.transform(text) : text;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(convertedText);
    toast.success("Copied to clipboard!");
  };

  return (
    <ToolLayout
      title="Case Converter"
      description="Convert text between different case formats"
    >
      <div className="space-y-6">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Enter Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your text here..."
            className="w-full h-32 p-4 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Case Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select Case Format
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {caseOptions.map((option) => (
              <button
                key={option.name}
                onClick={() => setSelectedCase(option.name)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedCase === option.name
                    ? "bg-primary text-white"
                    : "bg-secondary-bg text-foreground hover:bg-border"
                }`}
              >
                {option.name}
              </button>
            ))}
          </div>
        </div>

        {/* Output */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Converted Text
          </label>
          <div className="relative">
            <textarea
              value={convertedText}
              readOnly
              className="w-full h-32 p-4 rounded-lg border border-border bg-secondary-bg text-foreground resize-none"
            />
            <button
              onClick={copyToClipboard}
              className="absolute top-3 right-3 p-2 hover:bg-border rounded transition-colors"
            >
              <Copy className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>How it works:</strong> Enter your text, select the desired case format, and the converted text will appear below. Click the copy button to copy the result.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
