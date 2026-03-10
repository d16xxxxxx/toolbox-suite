import { useState } from "react";
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

const filters = [
  { name: "Grayscale", filter: "grayscale(100%)" },
  { name: "Sepia", filter: "sepia(100%)" },
  { name: "Blur", filter: "blur(5px)" },
  { name: "Brightness", filter: "brightness(1.2)" },
  { name: "Contrast", filter: "contrast(1.3)" },
  { name: "Saturate", filter: "saturate(1.5)" },
  { name: "Hue Rotate", filter: "hue-rotate(90deg)" },
  { name: "Invert", filter: "invert(100%)" },
];

export default function ImageFilter() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState("Grayscale");
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

  const applyFilter = async () => {
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

        // Apply filter using canvas filter
        const filterObj = filters.find((f) => f.name === selectedFilter);
        if (filterObj) {
          ctx.filter = filterObj.filter;
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) throw new Error("Could not apply filter");

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `filtered_${file.name}`;
            link.click();
            URL.revokeObjectURL(url);

            toast.success("Filter applied successfully!");
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
      toast.error("Error applying filter");
      console.error(error);
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Image Filter"
      description="Apply artistic filters and effects to images"
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

        {/* Filter Selection */}
        {file && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Select Filter
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {filters.map((f) => (
                  <button
                    key={f.name}
                    onClick={() => setSelectedFilter(f.name)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      selectedFilter === f.name
                        ? "bg-primary text-white"
                        : "bg-secondary-bg text-foreground hover:bg-border"
                    }`}
                  >
                    {f.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={applyFilter}
                disabled={isProcessing}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isProcessing ? "Applying..." : "Apply Filter"}
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
            <strong>How it works:</strong> Upload an image, select a filter effect, and click "Apply Filter" to download the filtered image.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
