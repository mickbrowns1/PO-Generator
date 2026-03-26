"use client";

import { useState } from "react";
import { ConfigValue } from "@/lib/types";

interface CustomOverrideProps {
  onSave: (path: string, value: ConfigValue) => void;
  onClose: () => void;
}

const SPAWNER_TEMPLATE = JSON.stringify(
  [
    {
      path: "%ProgramFiles%\\\\Example\\\\app.exe",
      publisher: "Example Corp",
      description: "Example Application",
    },
  ],
  null,
  2
);

const TEMPLATES = [
  {
    label: "Spawners",
    category: "Special Images",
    path: "specialImages.spawners",
    value: SPAWNER_TEMPLATE,
  },
  {
    label: "Add Allowed SymLink",
    category: "Special Images",
    path: "specialImages.add.allowedSymLinkWithSystemPath",
    value: '[\n  "\\\\Device\\\\HarddiskVolume*\\\\Windows\\\\example.exe"\n]',
  },
  {
    label: "Remove Allowed SymLink",
    category: "Special Images",
    path: "specialImages.remove.allowedSymLinkWithSystemPath",
    value: '[\n  "\\\\Device\\\\HarddiskVolume*\\\\Windows\\\\example.exe"\n]',
  },
  {
    label: "Custom Path (blank)",
    category: "Other",
    path: "",
    value: "",
  },
];

const TEMPLATE_CATEGORIES = [...new Set(TEMPLATES.map((t) => t.category))];

export default function CustomOverride({ onSave, onClose }: CustomOverrideProps) {
  const [path, setPath] = useState("");
  const [valueText, setValueText] = useState("");
  const [error, setError] = useState("");

  const applyTemplate = (template: (typeof TEMPLATES)[number]) => {
    setPath(template.path);
    setValueText(template.value);
    setError("");
  };

  const handleSave = () => {
    setError("");
    if (!path.trim()) {
      setError("Path is required (e.g. specialImages.spawners)");
      return;
    }

    const trimmed = valueText.trim();
    if (!trimmed) {
      setError("Value is required");
      return;
    }

    let parsed: ConfigValue;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      if (trimmed === "true") parsed = true;
      else if (trimmed === "false") parsed = false;
      else if (!isNaN(Number(trimmed)) && trimmed !== "") parsed = Number(trimmed);
      else parsed = trimmed;
    }

    onSave(path.trim(), parsed);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-100">Add Custom Override</h3>
          <p className="text-xs text-gray-400 mt-1">
            Add an override for settings not in the baseline config (e.g. specialImages, exclusion lists).
          </p>
        </div>

        <div className="p-4 space-y-3 overflow-y-auto flex-1">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Templates</label>
            {TEMPLATE_CATEGORIES.map((category) => (
              <div key={category} className="mt-2">
                <span className="text-[10px] text-gray-600 uppercase tracking-wider">{category}</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {TEMPLATES.filter((t) => t.category === category).map((t) => (
                    <button
                      key={t.label}
                      onClick={() => applyTemplate(t)}
                      className="px-2 py-1 text-xs bg-gray-800 text-gray-300 rounded hover:bg-gray-700 border border-gray-700"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">
              Path (dot-notation)
            </label>
            <input
              type="text"
              value={path}
              onChange={(e) => setPath(e.target.value)}
              placeholder="e.g. specialImages.spawners"
              className="mt-1 w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm font-mono text-gray-100 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
            <p className="text-[10px] text-gray-600 mt-1">
              Multiple overrides under the same parent (e.g. specialImages.spawners + specialImages.add.allowedSymLinkWithSystemPath) will be merged in the JSON output.
            </p>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">
              Value (JSON or primitive)
            </label>
            <textarea
              value={valueText}
              onChange={(e) => setValueText(e.target.value)}
              placeholder={'e.g. true, 42, "hello", or [\n  { "path": "...", "publisher": "..." }\n]'}
              rows={10}
              className="mt-1 w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm font-mono text-gray-100 placeholder-gray-600 focus:outline-none focus:border-purple-500 resize-y"
            />
          </div>

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
            onClick={handleSave}
            className="px-4 py-1.5 text-sm text-white bg-purple-600 rounded hover:bg-purple-500"
          >
            Add Override
          </button>
        </div>
      </div>
    </div>
  );
}
