import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

// PDF Tools
import PdfMerge from "./pages/tools/PdfMerge";
import PdfSplit from "./pages/tools/PdfSplit";
import PdfCompress from "./pages/tools/PdfCompress";
import PdfRotate from "./pages/tools/PdfRotate";
import ImageToPdf from "./pages/tools/ImageToPdf";

// Image Tools
import ImageCompress from "./pages/tools/ImageCompress";
import ImageResize from "./pages/tools/ImageResize";
import ImageCrop from "./pages/tools/ImageCrop";
import ImageConvert from "./pages/tools/ImageConvert";
import ImageFilter from "./pages/tools/ImageFilter";

// Text Tools
import WordCount from "./pages/tools/WordCount";
import CaseConverter from "./pages/tools/CaseConverter";
import MarkdownEditor from "./pages/tools/MarkdownEditor";
import TextDiff from "./pages/tools/TextDiff";
import TextReplace from "./pages/tools/TextReplace";

// Developer Tools
import JsonFormatter from "./pages/tools/JsonFormatter";
import Base64Encoder from "./pages/tools/Base64Encoder";
import ColorPicker from "./pages/tools/ColorPicker";
import QrCodeGenerator from "./pages/tools/QrCodeGenerator";
import PasswordGenerator from "./pages/tools/PasswordGenerator";
import UnitConverter from "./pages/tools/UnitConverter";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      
      {/* PDF Tools */}
      <Route path={"/pdf-merge"} component={PdfMerge} />
      <Route path={"/pdf-split"} component={PdfSplit} />
      <Route path={"/pdf-compress"} component={PdfCompress} />
      <Route path={"/pdf-rotate"} component={PdfRotate} />
      <Route path={"/image-to-pdf"} component={ImageToPdf} />
      
      {/* Image Tools */}
      <Route path={"/image-compress"} component={ImageCompress} />
      <Route path={"/image-resize"} component={ImageResize} />
      <Route path={"/image-crop"} component={ImageCrop} />
      <Route path={"/image-convert"} component={ImageConvert} />
      <Route path={"/image-filter"} component={ImageFilter} />
      
      {/* Text Tools */}
      <Route path={"/word-count"} component={WordCount} />
      <Route path={"/case-converter"} component={CaseConverter} />
      <Route path={"/markdown-editor"} component={MarkdownEditor} />
      <Route path={"/text-diff"} component={TextDiff} />
      <Route path={"/text-replace"} component={TextReplace} />
      
      {/* Developer Tools */}
      <Route path={"/json-formatter"} component={JsonFormatter} />
      <Route path={"/base64-encoder"} component={Base64Encoder} />
      <Route path={"/color-picker"} component={ColorPicker} />
      <Route path={"/qr-code"} component={QrCodeGenerator} />
      <Route path={"/password-generator"} component={PasswordGenerator} />
      <Route path={"/unit-converter"} component={UnitConverter} />
      
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
