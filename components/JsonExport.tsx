"use client";

import { useState } from "react";
import { OverridesMap, CustomBlock } from "@/lib/types";
import { buildFinalOutput } from "@/lib/utils";

interface JsonExportProps {
  overrides: OverridesMap;
  customBlocks: CustomBlock[];
}

export default function JsonExport({ overrides, customBlocks }: JsonExportProps) {
  const [copied, setCopied] = useState(false);
  const output = buildFinalOutput(
    overrides,
    customBlocks.map((b) => b.json)
  );
  const json = JSON.stringify(output, null, 2);
  const hasContent = Object.keys(overrides).length > 0 || customBlocks.length > 0;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(json);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "sentinelone-policy-override.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!hasContent) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
          Generated JSON
        </h3>
        <div className="flex gap-1">
          <button
            onClick={handleCopy}
            className="px-2 py-1 text-xs bg-gray-800 text-gray-300 hover:text-white rounded hover:bg-gray-700 transition-colors"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleDownload}
            className="px-2 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-500 transition-colors"
          >
            Download
          </button>
        </div>
      </div>
      <pre className="p-3 bg-gray-800/50 rounded-lg text-xs font-mono text-gray-300 overflow-auto max-h-96 border border-gray-700/50">
        {json}
      </pre>
    </div>
  );
}
