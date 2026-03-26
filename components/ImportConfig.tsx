"use client";

import { useState } from "react";
import { ConfigObject } from "@/lib/types";

interface ImportConfigProps {
  onImport: (config: ConfigObject) => void;
  onClose: () => void;
}

export default function ImportConfig({ onImport, onClose }: ImportConfigProps) {
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");

  const handleImport = () => {
    setError("");
    try {
      const parsed = JSON.parse(jsonText);
      if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
        setError("JSON must be an object");
        return;
      }
      onImport(parsed as ConfigObject);
    } catch {
      setError("Invalid JSON");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setJsonText(text);
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-100">Import Baseline Configuration</h3>
          <p className="text-xs text-gray-400 mt-1">
            Paste or upload a SentinelOne agent configuration JSON to use as the baseline.
          </p>
        </div>

        <div className="p-4 space-y-3">
          <div>
            <label className="inline-block px-3 py-1.5 text-xs bg-gray-800 text-gray-300 rounded cursor-pointer hover:bg-gray-700">
              Upload JSON File
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
          <textarea
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            placeholder="Paste your agent configuration JSON here..."
            rows={16}
            className="w-full p-3 bg-gray-800 border border-gray-600 rounded-lg text-xs font-mono text-gray-100 placeholder-gray-600 focus:outline-none focus:border-purple-500 resize-y"
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>

        <div className="p-4 border-t border-gray-700 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-sm text-gray-400 hover:text-gray-200 bg-gray-800 rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!jsonText.trim()}
            className="px-4 py-1.5 text-sm text-white bg-purple-600 rounded hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}
