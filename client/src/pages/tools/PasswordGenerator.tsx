import { useState } from "react";
import { Copy, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ToolLayout from "@/components/ToolLayout";
import { toast } from "sonner";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = "";
    if (useUppercase) chars += uppercase;
    if (useLowercase) chars += lowercase;
    if (useNumbers) chars += numbers;
    if (useSymbols) chars += symbols;

    if (chars === "") {
      toast.error("Select at least one character type");
      return;
    }

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(newPassword);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    toast.success("Copied to clipboard!");
  };

  const calculateStrength = () => {
    if (!password) return { label: "No password", color: "bg-gray-200" };
    if (password.length < 8) return { label: "Weak", color: "bg-red-200" };
    if (password.length < 12) return { label: "Fair", color: "bg-yellow-200" };
    if (password.length < 16) return { label: "Good", color: "bg-blue-200" };
    return { label: "Strong", color: "bg-green-200" };
  };

  const strength = calculateStrength();

  return (
    <ToolLayout
      title="Password Generator"
      description="Generate secure random passwords"
    >
      <div className="space-y-6">
        {/* Password Display */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Generated Password
          </label>
          <div className="relative">
            <Input
              type="text"
              value={password}
              readOnly
              placeholder="Click generate to create a password"
              className="input-field font-mono text-lg pr-12"
            />
            {password && (
              <button
                onClick={copyToClipboard}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 hover:bg-border rounded transition-colors"
              >
                <Copy className="w-4 h-4 text-foreground" />
              </button>
            )}
          </div>
        </div>

        {/* Password Strength */}
        {password && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-foreground">Strength</label>
              <span className={`text-sm font-semibold px-3 py-1 rounded ${strength.color}`}>
                {strength.label}
              </span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${strength.color}`}
                style={{ width: `${Math.min(100, (password.length / 20) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Length */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-foreground">
              Length: {length}
            </label>
          </div>
          <input
            type="range"
            min="4"
            max="32"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Options */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useUppercase}
              onChange={(e) => setUseUppercase(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-foreground">Uppercase (A-Z)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useLowercase}
              onChange={(e) => setUseLowercase(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-foreground">Lowercase (a-z)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useNumbers}
              onChange={(e) => setUseNumbers(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-foreground">Numbers (0-9)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={useSymbols}
              onChange={(e) => setUseSymbols(e.target.checked)}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-medium text-foreground">Symbols (!@#$%...)</span>
          </label>
        </div>

        {/* Generate Button */}
        <Button
          onClick={generatePassword}
          className="btn-primary flex items-center gap-2 w-full justify-center"
        >
          <RefreshCw className="w-4 h-4" />
          Generate Password
        </Button>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>How it works:</strong> Select your password preferences (length and character types), then click "Generate Password" to create a secure random password. The strength indicator shows how secure your password is.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
