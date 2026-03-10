import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

export default function ImageResize() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.currentTarget.files?.[0];
    if (!uploadedFile || !uploadedFile.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    setFile(uploadedFile);

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setPreview(event.target?.result as string);
        setOriginalDimensions({ width: img.width, height: img.height });
        setWidth(img.width);
        setHeight(img.height);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(uploadedFile);
    toast.success("Image loaded successfully");
  };

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspect && originalDimensions.width > 0) {
      const ratio = originalDimensions.height / originalDimensions.width;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspect && originalDimensions.height > 0) {
      const ratio = originalDimensions.width / originalDimensions.height;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const resizeImage = async () => {
    if (!file) {
      toast.error("Please upload an image");
      return;
    }

    setIsProcessing(true);
    try {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get canvas context");

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) throw new Error("Could not resize image");

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `resized_${file.name}`;
            link.click();
            URL.revokeObjectURL(url);

            toast.success("Image resized successfully!");
            setFile(null);
            setPreview("");
            setIsProcessing(false);
          },
          file.type,
          0.95
        );
      };
      img.src = preview;
    } catch (error) {
      toast.error("Error resizing image");
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Resize Image"
      description="Change image dimensions to your desired size"
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

        {/* Resize Options */}
        {file && (
          <div className="space-y-4">
            {/* Maintain Aspect Ratio */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="maintain-aspect"
                checked={maintainAspect}
                onChange={(e) => setMaintainAspect(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="maintain-aspect" className="text-sm font-medium text-foreground">
                Maintain aspect ratio
              </label>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Width (px)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={width}
                  onChange={(e) => handleWidthChange(parseInt(e.target.value) || 1)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Height (px)
                </label>
                <Input
                  type="number"
                  min="1"
                  value={height}
                  onChange={(e) => handleHeightChange(parseInt(e.target.value) || 1)}
                  className="input-field"
                />
              </div>
            </div>

            {/* Original Dimensions */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Original:</strong> {originalDimensions.width} × {originalDimensions.height} px
              </p>
              <p className="text-sm text-blue-900">
                <strong>New:</strong> {width} × {height} px
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={resizeImage}
                disabled={isProcessing}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isProcessing ? "Resizing..." : "Resize Image"}
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
            <strong>How it works:</strong> Upload an image, set the desired width and height, and click "Resize Image" to download the resized version.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
