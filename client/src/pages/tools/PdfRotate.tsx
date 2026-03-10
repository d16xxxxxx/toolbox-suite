import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

export default function PdfRotate() {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(90);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.currentTarget.files?.[0];
    if (!uploadedFile || uploadedFile.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    setFile(uploadedFile);
    toast.success("PDF loaded successfully");
  };

  const rotatePdf = async () => {
    if (!file) {
      toast.error("Please upload a PDF file");
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);

      const pages = pdf.getPages();
      pages.forEach((page) => {
        const currentRotation = page.getRotation().angle || 0;
        const newRotation = ((currentRotation + rotation) % 360) as any;
        page.setRotation(newRotation);
      });

      const pdfBytes = await pdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "rotated.pdf";
      link.click();
      URL.revokeObjectURL(url);

      toast.success("PDF rotated successfully!");
      setFile(null);
    } catch (error) {
      toast.error("Error rotating PDF");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Rotate PDF"
      description="Rotate all pages in a PDF document"
    >
      <div className="space-y-6">
        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select PDF File
          </label>
          <label className="file-upload-area">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              disabled={isProcessing}
            />
            <Upload className="w-12 h-12 text-primary mx-auto mb-3" />
            <p className="text-foreground font-medium mb-1">
              Click to upload or drag and drop
            </p>
            <p className="text-sm text-muted-foreground">
              PDF file only (up to 100MB)
            </p>
          </label>
        </div>

        {/* Rotation Selection */}
        {file && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Rotation Angle
              </label>
              <div className="flex gap-3 flex-wrap">
                {[90, 180, 270].map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setRotation(angle)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                      rotation === angle
                        ? "bg-primary text-white"
                        : "bg-secondary-bg text-foreground hover:bg-border"
                    }`}
                  >
                    {angle}°
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={rotatePdf}
                disabled={isProcessing}
                className="btn-primary flex items-center gap-2"
              >
                <RotateCw className="w-4 h-4" />
                {isProcessing ? "Rotating..." : "Rotate PDF"}
              </Button>
              <Button
                onClick={() => setFile(null)}
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
            <strong>How it works:</strong> Upload a PDF file, select the rotation angle (90°, 180°, or 270°), and click "Rotate PDF" to rotate all pages in the document.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
