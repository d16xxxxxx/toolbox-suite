import { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

interface UploadedFile {
  id: string;
  file: File;
  name: string;
}

export default function PdfMerge() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.currentTarget.files;
    if (!uploadedFiles) return;

    const newFiles: UploadedFile[] = Array.from(uploadedFiles)
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        file,
        name: file.name,
      }));

    if (newFiles.length === 0) {
      toast.error("Please select PDF files only");
      return;
    }

    setFiles([...files, ...newFiles]);
    toast.success(`Added ${newFiles.length} PDF file(s)`);
  };

  const removeFile = (id: string) => {
    setFiles(files.filter((f) => f.id !== id));
  };

  const mergePdfs = async () => {
    if (files.length < 2) {
      toast.error("Please upload at least 2 PDF files");
      return;
    }

    setIsProcessing(true);
    try {
      const mergedPdf = await PDFDocument.create();

      for (const uploadedFile of files) {
        const arrayBuffer = await uploadedFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach((page) => mergedPdf.addPage(page));
      }

      const pdfBytes = await mergedPdf.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "merged.pdf";
      link.click();
      URL.revokeObjectURL(url);

      toast.success("PDFs merged successfully!");
      setFiles([]);
    } catch (error) {
      toast.error("Error merging PDFs. Please try again.");
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ToolLayout
      title="Merge PDF"
      description="Combine multiple PDF files into a single document"
    >
      <div className="space-y-6">
        {/* File Upload Area */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Select PDF Files
          </label>
          <label className="file-upload-area">
            <input
              type="file"
              multiple
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
              PDF files only (up to 100MB each)
            </p>
          </label>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-foreground mb-3">
              Uploaded Files ({files.length})
            </h3>
            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 bg-secondary-bg rounded-lg border border-border"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded flex items-center justify-center text-red-600 font-semibold text-xs">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {file.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file.file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(file.id)}
                    className="flex-shrink-0 p-2 hover:bg-red-100 rounded transition-colors text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={mergePdfs}
            disabled={files.length < 2 || isProcessing}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            {isProcessing ? "Merging..." : "Merge PDFs"}
          </Button>
          {files.length > 0 && (
            <Button
              onClick={() => setFiles([])}
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
            <strong>How it works:</strong> Upload multiple PDF files, arrange them in order, and click "Merge PDFs" to combine them into a single document. All processing happens in your browser.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
