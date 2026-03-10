import { useState } from "react";
import { diff_match_patch } from "diff-match-patch";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/ToolLayout";

const dmp = new diff_match_patch();

export default function TextDiff() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  const diffs = dmp.diff_main(text1, text2);
  dmp.diff_cleanupSemantic(diffs);

  const renderDiff = () => {
    return diffs.map((diff: any, index: number) => {
      const [type, text] = diff;
      if (type === 0) {
        return (
          <span key={index} className="text-foreground">
            {text}
          </span>
        );
      } else if (type === 1) {
        return (
          <span key={index} className="bg-green-200 text-green-900 font-medium">
            {text}
          </span>
        );
      } else {
        return (
          <span key={index} className="bg-red-200 text-red-900 line-through">
            {text}
          </span>
        );
      }
    });
  };

  const similarity = text1.length === 0 && text2.length === 0 ? 100 : Math.round(
    ((text1.length + text2.length - dmp.diff_compute_(text1, text2, false)[0].reduce((sum: number, d: any) => sum + d[1].length, 0)) / (text1.length + text2.length)) * 100
  );

  return (
    <ToolLayout
      title="Text Diff Checker"
      description="Compare two text documents and see the differences"
    >
      <div className="space-y-6">
        {/* Text Inputs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Text 1
            </label>
            <textarea
              value={text1}
              onChange={(e) => setText1(e.target.value)}
              placeholder="Paste first text here..."
              className="w-full h-64 p-4 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Text 2
            </label>
            <textarea
              value={text2}
              onChange={(e) => setText2(e.target.value)}
              placeholder="Paste second text here..."
              className="w-full h-64 p-4 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
            />
          </div>
        </div>

        {/* Similarity Score */}
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-sm text-foreground">
            <strong>Similarity:</strong> {similarity}%
          </p>
        </div>

        {/* Diff Preview */}
        {(text1 || text2) && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Differences
            </label>
            <div className="p-4 rounded-lg border border-border bg-secondary-bg min-h-32 whitespace-pre-wrap break-words">
              {renderDiff()}
            </div>
          </div>
        )}

        {/* Legend */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-200 rounded"></div>
            <span className="text-sm text-foreground">Added (Text 2)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-200 rounded"></div>
            <span className="text-sm text-foreground">Removed (Text 1)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span className="text-sm text-foreground">Unchanged</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={() => {
              setText1("");
              setText2("");
            }}
            disabled={!text1 && !text2}
            className="btn-outline"
          >
            Clear All
          </Button>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>How it works:</strong> Paste two texts to compare them. The tool highlights additions (green), removals (red), and unchanged content. The similarity percentage shows how much of the texts match.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
