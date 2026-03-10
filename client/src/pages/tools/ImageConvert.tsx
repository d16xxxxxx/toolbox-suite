import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

const formats = ["PNG", "JPEG", "WebP", "BMP"];

export default function ImageConvert() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [targetFormat, setTargetFormat] = useState("PNG");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.currentTarget.files?.[0];
    if (!uploadedFile || !uploadedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(uploadedFile);
    toast.success("Image loaded successfully");
  };

  const convertImage = async () => {
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

        const mimeType = `image/${targetFormat.toLowerCase()}`;
        canvas.toBlob(
          (blob) => {
            if (!blob) throw new Error("Could not convert image");

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            const extension = targetFormat.toLowerCase() === "jpeg" ? "jpg" : targetFormat.toLowerCase();
            link.download = `converted.${extension}`;
            link.click();
            URL.revokeObjectURL(url);

            toast.success(`Image converted to ${targetFormat}!`);
            setFile(null);
            setPreview("");
            setIsProcessing(false);
          },
          mimeType,
          0.95
        );
      };
      img.src = preview;
    } catch (error) {
      toast.error("Error converting image");
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Convert Image"
      description="Convert images between different formats"
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

        {/* Format Selection */}
        {file && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Target Format
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {formats.map((format) => (
                  <button
                    key={format}
                    onClick={() => setTargetFormat(format)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      targetFormat === format
                        ? "bg-primary text-white"
                        : "bg-secondary-bg text-foreground hover:bg-border"
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={convertImage}
                disabled={isProcessing}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isProcessing ? "Converting..." : "Convert Image"}
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
            <strong>How it works:</strong> Upload an image, select the target format (PNG, JPEG, WebP, or BMP), and click "Convert Image" to download the converted file.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
