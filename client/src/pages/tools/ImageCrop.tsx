import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

export default function ImageCrop() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [width, setWidth] = useState(400);
  const [height, setHeight] = useState(300);
  const [isProcessing, setIsProcessing] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });

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
        setImageDimensions({ width: img.width, height: img.height });
        setWidth(Math.min(400, img.width));
        setHeight(Math.min(300, img.height));
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(uploadedFile);
    toast.success("Image loaded successfully");
  };

  const cropImage = async () => {
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

        ctx.drawImage(img, x, y, width, height, 0, 0, width, height);
        canvas.toBlob(
          (blob) => {
            if (!blob) throw new Error("Could not crop image");

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `cropped_${file.name}`;
            link.click();
            URL.revokeObjectURL(url);

            toast.success("Image cropped successfully!");
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
      toast.error("Error cropping image");
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Crop Image"
      description="Crop and trim images to your desired size"
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

        {/* Crop Options */}
        {file && imageDimensions.width > 0 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  X Position (px)
                </label>
                <Input
                  type="number"
                  min="0"
                  max={imageDimensions.width}
                  value={x}
                  onChange={(e) => setX(Math.max(0, parseInt(e.target.value) || 0))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Y Position (px)
                </label>
                <Input
                  type="number"
                  min="0"
                  max={imageDimensions.height}
                  value={y}
                  onChange={(e) => setY(Math.max(0, parseInt(e.target.value) || 0))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Width (px)
                </label>
                <Input
                  type="number"
                  min="1"
                  max={imageDimensions.width - x}
                  value={width}
                  onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 1))}
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
                  max={imageDimensions.height - y}
                  value={height}
                  onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 1))}
                  className="input-field"
                />
              </div>
            </div>

            {/* Crop Info */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>Original:</strong> {imageDimensions.width} × {imageDimensions.height} px
              </p>
              <p className="text-sm text-blue-900">
                <strong>Crop Area:</strong> {width} × {height} px (starting at {x}, {y})
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={cropImage}
                disabled={isProcessing}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isProcessing ? "Cropping..." : "Crop Image"}
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
            <strong>How it works:</strong> Upload an image, set the crop position and dimensions, and click "Crop Image" to download the cropped version.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
