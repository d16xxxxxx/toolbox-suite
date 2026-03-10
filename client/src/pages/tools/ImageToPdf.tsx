import { useState } from "react";
import { PDFDocument, PDFImage } from "pdf-lib";
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

interface UploadedImage {
  id: string;
  file: File;
  name: string;
  preview: string;
}

export default function ImageToPdf() {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.currentTarget.files;
    if (!uploadedFiles) return;

    const newImages: UploadedImage[] = [];
    Array.from(uploadedFiles).forEach((file) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          newImages.push({
            id: Math.random().toString(36).substr(2, 9),
            file,
            name: file.name,
            preview: event.target?.result as string,
          });
          if (newImages.length === Array.from(uploadedFiles).filter(f => f.type.startsWith("image/")).length) {
            setImages([...images, ...newImages]);
            toast.success(`Added ${newImages.length} image(s)`);
          }
        };
        reader.readAsDataURL(file);
      }
    });

    if (newImages.length === 0) {
      toast.error("Please select image files only");
    }
  };

  const removeImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const convertToPdf = async () => {
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsProcessing(true);
    try {
      const pdf = await PDFDocument.create();

      for (const image of images) {
        const arrayBuffer = await image.file.arrayBuffer();
        let pdfImage: PDFImage;

        if (image.file.type === "image/png") {
          pdfImage = await pdf.embedPng(arrayBuffer);
        } else if (image.file.type === "image/jpeg") {
          pdfImage = await pdf.embedJpg(arrayBuffer);
        } else {
          continue;
        }

        const page = pdf.addPage([pdfImage.width, pdfImage.height]);
        page.drawImage(pdfImage, {
          x: 0,
          y: 0,
          width: pdfImage.width,
          height: pdfImage.height,
        });
      }

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "images.pdf";
      link.click();
      URL.revokeObjectURL(url);

      toast.success("PDF created successfully!");
      setImages([]);
    } catch (error) {
      toast.error("Error creating PDF");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Image to PDF"
      description="Convert images to a PDF document"
    >
      <div className="space-y-6">
        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select Images
          </label>
          <label className="file-upload-area">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              disabled={isProcessing}
            />
            <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="text-foreground font-medium mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-muted-foreground">
              PNG, JPEG, and other image formats
            </p>
          </label>
        </div>

        {/* Image Preview Grid */}
        {images.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Uploaded Images ({images.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="relative group rounded-lg overflow-hidden border border-border"
                >
                  <img
                    src={image.preview}
                    alt={image.name}
                    className="w-full h-32 object-cover"
                  />
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                  >
                    <span className="text-white text-sm font-medium">Remove</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={convertToPdf}
            disabled={images.length === 0 || isProcessing}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isProcessing ? "Converting..." : "Convert to PDF"}
          </Button>
          {images.length > 0 && (
            <Button
              onClick={() => setImages([])}
              disabled={isProcessing}
              className="btn-outline"
            >
              Clear All
            </Button>
          )}
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>How it works:</strong> Upload one or more images, arrange them in order, and click "Convert to PDF" to create a PDF document with each image on a separate page.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
