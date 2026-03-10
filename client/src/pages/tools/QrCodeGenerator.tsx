import { useState, useEffect } from "react";
import QRCode from "qrcode";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

export default function QrCodeGenerator() {
  const [text, setText] = useState("https://example.com");
  const [qrCode, setQrCode] = useState<string>("");
  const [size, setSize] = useState(300);
  const [errorCorrection, setErrorCorrection] = useState("M");

  useEffect(() => {
    generateQrCode();
  }, [text, size, errorCorrection]);

  const generateQrCode = async () => {
    if (!text) return;

    try {
      const url = await QRCode.toDataURL(text, {
        width: size,
        margin: 1,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
        errorCorrectionLevel: errorCorrection as "L" | "M" | "Q" | "H",
      });
      setQrCode(url);
    } catch (error) {
      toast.error("Error generating QR code");
      console.error(error);
    }
  };

  const downloadQrCode = () => {
    if (!qrCode) return;

    const link = document.createElement("a");
    link.href = qrCode;
    link.download = "qrcode.png";
    link.click();
    toast.success("Downloaded!");
  };

  return (
    <ToolLayout
      title="QR Code Generator"
      description="Generate QR codes from text or URLs"
    >
      <div className="space-y-6">
        {/* Text Input */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Text or URL
          </label>
          <Input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or URL..."
            className="input-field"
          />
        </div>

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Size: {size}px
            </label>
            <input
              type="range"
              min="100"
              max="500"
              step="50"
              value={size}
              onChange={(e) => setSize(parseInt(e.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Error Correction
            </label>
            <select
              value={errorCorrection}
              onChange={(e) => setErrorCorrection(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>
        </div>

        {/* QR Code Preview */}
        {qrCode && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              QR Code Preview
            </label>
            <div className="p-4 bg-secondary-bg border border-border rounded-lg flex justify-center">
              <img src={qrCode} alt="QR Code" className="max-w-full" />
            </div>
          </div>
        )}

        {/* Download Button */}
        {qrCode && (
          <Button
            onClick={downloadQrCode}
            className="btn-primary flex items-center gap-2 w-full justify-center"
          >
            <Download className="w-4 h-4" />
            Download QR Code
          </Button>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>How it works:</strong> Enter text or a URL to generate a QR code. Adjust the size and error correction level as needed, then download the QR code as an image.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
