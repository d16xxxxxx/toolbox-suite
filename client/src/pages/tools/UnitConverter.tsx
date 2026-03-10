import { useState } from "react";
import { Input } from "@/components/ui/input";
import ToolLayout from "@/components/ToolLayout";

const conversions = {
  length: {
    name: "Length",
    units: {
      mm: 1,
      cm: 10,
      m: 1000,
      km: 1000000,
      inch: 25.4,
      foot: 304.8,
      yard: 914.4,
      mile: 1609344,
    },
  },
  weight: {
    name: "Weight",
    units: {
      mg: 1,
      g: 1000,
      kg: 1000000,
      oz: 28349.5,
      lb: 453592,
      ton: 1000000000,
    },
  },
  temperature: {
    name: "Temperature",
    units: {
      celsius: "C",
      fahrenheit: "F",
      kelvin: "K",
    },
  },
  volume: {
    name: "Volume",
    units: {
      ml: 1,
      l: 1000,
      gallon: 3785.41,
      pint: 473.176,
      cup: 236.588,
    },
  },
};

export default function UnitConverter() {
  const [category, setCategory] = useState("length");
  const [inputValue, setInputValue] = useState(1);
  const [fromUnit, setFromUnit] = useState("m");
  const [toUnit, setToUnit] = useState("km");

  const currentCategory = conversions[category as keyof typeof conversions];
  const units = currentCategory.units;

  let result = inputValue;

  if (category === "temperature") {
    const from = fromUnit as string;
    const to = toUnit as string;

    if (from === "celsius" && to === "fahrenheit") {
      result = (inputValue * 9) / 5 + 32;
    } else if (from === "fahrenheit" && to === "celsius") {
      result = ((inputValue - 32) * 5) / 9;
    } else if (from === "celsius" && to === "kelvin") {
      result = inputValue + 273.15;
    } else if (from === "kelvin" && to === "celsius") {
      result = inputValue - 273.15;
    } else if (from === "fahrenheit" && to === "kelvin") {
      result = ((inputValue - 32) * 5) / 9 + 273.15;
    } else if (from === "kelvin" && to === "fahrenheit") {
      result = ((inputValue - 273.15) * 9) / 5 + 32;
    } else {
      result = inputValue;
    }
  } else {
    const fromValue = units[fromUnit as keyof typeof units] as number;
    const toValue = units[toUnit as keyof typeof units] as number;
    result = (inputValue * fromValue) / toValue;
  }

  return (
    <ToolLayout
      title="Unit Converter"
      description="Convert between different units of measurement"
    >
      <div className="space-y-6">
        {/* Category Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">
            Category
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {Object.entries(conversions).map(([key, value]) => (
              <button
                key={key}
                onClick={() => {
                  setCategory(key);
                  const unitKeys = Object.keys(value.units);
                  setFromUnit(unitKeys[0]);
                  setToUnit(unitKeys[1] || unitKeys[0]);
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  category === key
                    ? "bg-primary text-white"
                    : "bg-secondary-bg text-foreground hover:bg-border"
                }`}
              >
                {value.name}
              </button>
            ))}
          </div>
        </div>

        {/* Conversion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* From */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              From
            </label>
            <Input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(parseFloat(e.target.value) || 0)}
              className="input-field"
            />
            <select
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Object.keys(units).map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>

          {/* To */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-foreground">
              To
            </label>
            <Input
              type="number"
              value={result.toFixed(6)}
              readOnly
              className="input-field bg-secondary-bg"
            />
            <select
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              {Object.keys(units).map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Result */}
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-sm text-foreground">
            <strong>{inputValue}</strong> {fromUnit} = <strong>{result.toFixed(6)}</strong> {toUnit}
          </p>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <strong>How it works:</strong> Select a category (length, weight, temperature, or volume), enter a value, choose the units to convert between, and the result will be calculated instantly.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
