import { useState } from "react";
import { Upload, Download, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

export default function ImageCompress() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [quality, setQuality] = useState(80);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalSize, setOriginalSize] = useState(0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.currentTarget.files?.[0];
    if (!uploadedFile || !uploadedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setFile(uploadedFile);
    setOriginalSize(uploadedFile.size);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(uploadedFile);
    toast.success("Image loaded successfully");
  };

  const compressImage = async () => {
    if (!file) {
      toast.error("Please upload an image");
      return;
    }

    setIsProcessing(true);
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        ctx.drawImage(img, 0, 0);
        canvas.toBlob(
          (blob) => {
            if (!blob) throw new Error("Could not compress image");

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `compressed_${file.name}`;
            link.click();
            URL.revokeObjectURL(url);

            const reduction = ((1 - blob.size / originalSize) * 100).toFixed(1);
            toast.success(`Image compressed! Size reduced by ${reduction}%`);
            setFile(null);
            setPreview("");
            setIsProcessing(false);
          },
          file.type,
          quality / 100
        );
      };
      img.src = preview;
    } catch (error) {
      toast.error("Error compressing image");
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Compress Image"
      description="Reduce image file size while maintaining quality"
    >
      <div className="space-y-6">
        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select Image
          </label>
          <label className="file-upload-area">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isProcessing}
            />
            <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="text-foreground font-medium mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-muted-foreground">
              PNG, JPEG, WebP, and other image formats
            </p>
          </label>
        </div>

        {/* Image Preview */}
        {preview && (
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Preview
            </label>
            <div className="border border-border rounded-lg p-4 bg-secondary-bg">
              <img
                src={preview}
                alt="Preview"
                className="max-w-full max-h-96 mx-auto rounded"
              />
            </div>
          </div>
        )}

        {/* Quality Slider */}
        {file && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-foreground">
                  Quality
                </label>
                <span className="text-sm font-semibold text-primary">{quality}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                className="w-full"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Lower quality = smaller file size
              </p>
            </div>

            {/* File Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Original Size:</strong> {(originalSize / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={compressImage}
                disabled={isProcessing}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isProcessing ? "Compressing..." : "Compress Image"}
              </Button>
              <Button
                onClick={() => {
                  setFile(null);
                  setPreview("");
                }}
                disabled={isProcessing}
                className="btn-outline"
              >
                Clear
              </Button>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>How it works:</strong> Upload an image, adjust the quality slider to control compression, and click "Compress Image" to download the optimized file.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
