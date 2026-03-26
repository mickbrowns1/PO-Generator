"use client";

import { useState } from "react";
import { ConfigValue } from "@/lib/types";
import { getValueType } from "@/lib/utils";

interface OverrideEditorProps {
  path: string;
  originalValue: ConfigValue;
  currentValue: ConfigValue | undefined;
  onSave: (path: string, value: ConfigValue) => void;
  onCancel: () => void;
  onRemove: (path: string) => void;
  isOverridden: boolean;
}

export default function OverrideEditor({
  path,
  originalValue,
  currentValue,
  onSave,
  onCancel,
  onRemove,
  isOverridden,
}: OverrideEditorProps) {
  const valueType = getValueType(originalValue);
  const editValue = currentValue !== undefined ? currentValue : originalValue;
  const [localValue, setLocalValue] = useState<string>(
    valueType === "array" || valueType === "object"
      ? JSON.stringify(editValue, null, 2)
      : String(editValue)
  );
  const [error, setError] = useState<string>("");

  const handleSave = () => {
    setError("");
    let parsed: ConfigValue;

    try {
      switch (valueType) {
        case "boolean":
          if (localValue !== "true" && localValue !== "false") {
            setError("Must be true or false");
            return;
          }
          parsed = localValue === "true";
          break;
        case "number":
          parsed = Number(localValue);
          if (isNaN(parsed as number)) {
            setError("Must be a valid number");
            return;
          }
          break;
        case "string":
          parsed = localValue;
          break;
        case "array":
        case "object":
          parsed = JSON.parse(localValue);
          break;
        default:
          parsed = localValue;
      }
    } catch {
      setError("Invalid JSON");
      return;
    }

    if (JSON.stringify(parsed) === JSON.stringify(originalValue)) {
      onRemove(path);
    } else {
      onSave(path, parsed);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-lg w-full">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-100">Edit Override</h3>
          <p className="text-xs text-gray-400 mt-1 font-mono break-all">{path}</p>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">
              Original Value ({valueType})
            </label>
            <div className="mt-1 p-2 bg-gray-800 rounded text-xs font-mono text-gray-400 max-h-24 overflow-auto">
              {JSON.stringify(originalValue, null, 2)}
            </div>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">
              Override Value
            </label>
            {valueType === "boolean" ? (
              <div className="mt-1 flex gap-2">
                <button
                  onClick={() => setLocalValue("true")}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    localValue === "true"
                      ? "bg-green-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  true
                </button>
                <button
                  onClick={() => setLocalValue("false")}
                  className={`px-4 py-2 rounded text-sm font-medium ${
                    localValue === "false"
                      ? "bg-red-600 text-white"
                      : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                  }`}
                >
                  false
                </button>
              </div>
            ) : valueType === "array" || valueType === "object" ? (
              <textarea
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                rows={8}
                className="mt-1 w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm font-mono text-gray-100 focus:outline-none focus:border-purple-500 resize-y"
              />
            ) : (
              <input
                type={valueType === "number" ? "number" : "text"}
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                className="mt-1 w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm font-mono text-gray-100 focus:outline-none focus:border-purple-500"
              />
            )}
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </div>
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-between">
          <div>
            {isOverridden && (
              <button
                onClick={() => onRemove(path)}
                className="px-3 py-1.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded"
              >
                Remove Override
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="px-4 py-1.5 text-sm text-gray-400 hover:text-gray-200 bg-gray-800 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-1.5 text-sm text-white bg-purple-600 rounded hover:bg-purple-500"
            >
              Save Override
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
