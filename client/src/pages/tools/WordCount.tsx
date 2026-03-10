import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/ToolLayout";

export default function WordCount() {
  const [text, setText] = useState("");

  const stats = {
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    lines: text ? text.split("\n").length : 0,
    paragraphs: text.trim() ? text.trim().split(/\n\n+/).length : 0,
    sentences: text.split(/[.!?]+/).filter((s) => s.trim()).length,
    readingTime: Math.ceil((text.trim().split(/\s+/).length || 0) / 200),
  };

  return (
    <ToolLayout
      title="Word Counter"
      description="Count words, characters, lines, and more in your text"
    >
      <div className="space-y-6">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Enter or Paste Text
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your text here..."
            className="w-full h-64 p-4 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
          />
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs font-medium text-blue-600 mb-1">Characters</p>
            <p className="text-2xl font-bold text-blue-900">{stats.characters}</p>
          </div>
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-xs font-medium text-green-600 mb-1">Characters (No Spaces)</p>
            <p className="text-2xl font-bold text-green-900">{stats.charactersNoSpaces}</p>
          </div>
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <p className="text-xs font-medium text-purple-600 mb-1">Words</p>
            <p className="text-2xl font-bold text-purple-900">{stats.words}</p>
          </div>
          <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-xs font-medium text-orange-600 mb-1">Lines</p>
            <p className="text-2xl font-bold text-orange-900">{stats.lines}</p>
          </div>
          <div className="p-4 bg-pink-50 border border-pink-200 rounded-lg">
            <p className="text-xs font-medium text-pink-600 mb-1">Paragraphs</p>
            <p className="text-2xl font-bold text-pink-900">{stats.paragraphs}</p>
          </div>
          <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-lg">
            <p className="text-xs font-medium text-indigo-600 mb-1">Sentences</p>
            <p className="text-2xl font-bold text-indigo-900">{stats.sentences}</p>
          </div>
        </div>

        {/* Reading Time */}
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-sm text-foreground">
            <strong>Estimated Reading Time:</strong> {stats.readingTime} minute{stats.readingTime !== 1 ? "s" : ""} (at 200 words per minute)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => setText("")}
            disabled={text.length === 0}
            className="btn-outline"
          >
            Clear Text
          </Button>
          <Button
            onClick={() => {
              navigator.clipboard.writeText(text);
            }}
            disabled={text.length === 0}
            className="btn-secondary"
          >
            Copy Text
          </Button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>How it works:</strong> Paste or type your text to see detailed statistics including character count, word count, line count, and estimated reading time.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
