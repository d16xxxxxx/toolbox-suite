import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

export default function TextReplace() {
  const [text, setText] = useState("");
  const [findText, setFindText] = useState("");
  const [replaceText, setReplaceText] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [caseInsensitive, setCaseInsensitive] = useState(false);

  let result = text;
  let replacementCount = 0;

  if (findText) {
    try {
      if (useRegex) {
        const flags = caseInsensitive ? "gi" : "g";
        const regex = new RegExp(findText, flags);
        const matches = text.match(regex);
        replacementCount = matches ? matches.length : 0;
        result = text.replace(regex, replaceText);
      } else {
        const searchText = caseInsensitive ? findText.toLowerCase() : findText;
        let tempResult = text;
        let count = 0;

        if (caseInsensitive) {
          const regex = new RegExp(findText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
          const matches = text.match(regex);
          replacementCount = matches ? matches.length : 0;
          result = text.replace(regex, replaceText);
        } else {
          while (tempResult.includes(findText)) {
            tempResult = tempResult.replace(findText, replaceText);
            count++;
          }
          replacementCount = count;
          result = tempResult;
        }
      }
    } catch (error) {
      toast.error("Invalid regex pattern");
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast.success("Copied to clipboard!");
  };

  return (
    <ToolLayout
      title="Find & Replace"
      description="Find and replace text with support for regex"
    >
      <div className="space-y-6">
        {/* Original Text */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Original Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-32 p-4 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Find and Replace Options */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Find
            </label>
            <Input
              type="text"
              value={findText}
              onChange={(e) => setFindText(e.target.value)}
              placeholder="Enter text to find..."
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Replace With
            </label>
            <Input
              type="text"
              value={replaceText}
              onChange={(e) => setReplaceText(e.target.value)}
              placeholder="Enter replacement text..."
              className="input-field"
            />
          </div>

          {/* Options */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={useRegex}
                onChange={(e) => setUseRegex(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-foreground">Use Regex</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={caseInsensitive}
                onChange={(e) => setCaseInsensitive(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <span className="text-sm font-medium text-foreground">Case Insensitive</span>
            </label>
          </div>
        </div>

        {/* Result */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Result ({replacementCount} replacement{replacementCount !== 1 ? "s" : ""})
          </label>
          <div className="relative">
            <textarea
              value={result}
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
            <strong>How it works:</strong> Enter your text, specify what to find and what to replace it with. Enable regex for advanced pattern matching and case insensitive for ignoring letter case.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
