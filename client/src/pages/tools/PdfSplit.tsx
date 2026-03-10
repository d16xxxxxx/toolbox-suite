import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [startPage, setStartPage] = useState(1);
  const [endPage, setEndPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.currentTarget.files?.[0];
    if (!uploadedFile || uploadedFile.type !== "application/pdf") {
      toast.error("Please select a PDF file");
      return;
    }

    try {
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      setPageCount(pdf.getPageCount());
      setFile(uploadedFile);
      setStartPage(1);
      setEndPage(pdf.getPageCount());
      toast.success(`PDF loaded: ${pdf.getPageCount()} pages`);
    } catch (error) {
      toast.error("Error loading PDF");
      console.error(error);
    }
  };

  const splitPdf = async () => {
    if (!file) {
      toast.error("Please upload a PDF file");
      return;
    }

    if (startPage < 1 || endPage > pageCount || startPage > endPage) {
      toast.error("Invalid page range");
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();

      const pageIndices = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage - 1 + i);
      const copiedPages = await newPdf.copyPages(pdf, pageIndices);
      copiedPages.forEach((page) => newPdf.addPage(page));

      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `split_${startPage}-${endPage}.pdf`;
      link.click();
      URL.revokeObjectURL(url);

      toast.success("PDF split successfully!");
    } catch (error) {
      toast.error("Error splitting PDF");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Split PDF"
      description="Extract specific pages from a PDF file"
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

        {/* Page Range Selection */}
        {file && pageCount > 0 && (
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-900">
                Total pages in PDF: <strong>{pageCount}</strong>
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Start Page
                </label>
                <Input
                  type="number"
                  min="1"
                  max={pageCount}
                  value={startPage}
                  onChange={(e) => setStartPage(Math.max(1, parseInt(e.target.value) || 1))}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  End Page
                </label>
                <Input
                  type="number"
                  min="1"
                  max={pageCount}
                  value={endPage}
                  onChange={(e) => setEndPage(Math.min(pageCount, parseInt(e.target.value) || pageCount))}
                  className="input-field"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={splitPdf}
                disabled={isProcessing}
                className="btn-primary flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                {isProcessing ? "Splitting..." : "Split PDF"}
              </Button>
              <Button
                onClick={() => {
                  setFile(null);
                  setPageCount(0);
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
            <strong>How it works:</strong> Upload a PDF file, specify the page range you want to extract, and click "Split PDF". The selected pages will be downloaded as a new PDF file.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
