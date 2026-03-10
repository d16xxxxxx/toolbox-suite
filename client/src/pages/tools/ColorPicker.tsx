import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

export default function ColorPicker() {
  const [color, setColor] = useState("#3B82F6");

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map((x) => {
      const hex = x.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    }).join("").toUpperCase();
  };

  const hexToHsl = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (!rgb) return null;

    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  };

  const rgb = hexToRgb(color);
  const hsl = hexToHsl(color);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <ToolLayout
      title="Color Picker"
      description="Pick colors and convert between formats"
    >
      <div className="space-y-6">
        {/* Color Picker */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select Color
          </label>
          <div className="flex gap-4 items-center">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-24 h-24 rounded-lg cursor-pointer border border-border"
            />
            <div
              className="w-32 h-32 rounded-lg border-4 border-border shadow-lg"
              style={{ backgroundColor: color }}
            />
          </div>
        </div>

        {/* Color Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            HEX Value
          </label>
          <Input
            type="text"
            value={color.toUpperCase()}
            onChange={(e) => {
              const val = e.target.value;
              if (/^#[0-9A-F]{6}$/i.test(val)) {
                setColor(val);
              }
            }}
            className="input-field font-mono"
          />
        </div>

        {/* Color Formats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* HEX */}
          <div className="p-4 bg-secondary-bg border border-border rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-2">HEX</p>
            <div className="flex items-center justify-between">
              <code className="font-mono text-sm text-foreground">{color.toUpperCase()}</code>
              <button
                onClick={() => copyToClipboard(color.toUpperCase())}
                className="p-2 hover:bg-border rounded transition-colors"
              >
                <Copy className="w-4 h-4 text-foreground" />
              </button>
            </div>
          </div>

          {/* RGB */}
          {rgb && (
            <div className="p-4 bg-secondary-bg border border-border rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-2">RGB</p>
              <div className="flex items-center justify-between">
                <code className="font-mono text-sm text-foreground">
                  rgb({rgb.r}, {rgb.g}, {rgb.b})
                </code>
                <button
                  onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)}
                  className="p-2 hover:bg-border rounded transition-colors"
                >
                  <Copy className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>
          )}

          {/* HSL */}
          {hsl && (
            <div className="p-4 bg-secondary-bg border border-border rounded-lg">
              <p className="text-xs font-medium text-muted-foreground mb-2">HSL</p>
              <div className="flex items-center justify-between">
                <code className="font-mono text-sm text-foreground">
                  hsl({hsl.h}, {hsl.s}%, {hsl.l}%)
                </code>
                <button
                  onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)}
                  className="p-2 hover:bg-border rounded transition-colors"
                >
                  <Copy className="w-4 h-4 text-foreground" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>How it works:</strong> Use the color picker to select a color, or enter a HEX value. The tool automatically converts the color to RGB and HSL formats. Click the copy button to copy any format.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
