"use client";

import { useState } from "react";
import { ConfigObject } from "@/lib/types";

interface CustomOverrideProps {
  onSave: (label: string, json: ConfigObject) => void;
  onClose: () => void;
}

const TEMPLATES: { label: string; category: string; json: string }[] = [
  {
    label: "Spawners",
    category: "Special Images",
    json: JSON.stringify(
      {
        specialImages: {
          spawners: [
            {
              path: "%ProgramFiles%\\\\Example\\\\app.exe",
              publisher: "Example Corp",
              description: "Example Application",
            },
          ],
        },
      },
      null,
      2
    ),
  },
  {
    label: "Add Allowed SymLink",
    category: "Special Images",
    json: JSON.stringify(
      {
        specialImages: {
          add: {
            allowedSymLinkWithSystemPath: [
              "\\\\Device\\\\HarddiskVolume*\\\\Windows\\\\example.exe",
            ],
          },
        },
      },
      null,
      2
    ),
  },
  {
    label: "Remove Allowed SymLink",
    category: "Special Images",
    json: JSON.stringify(
      {
        specialImages: {
          remove: {
            allowedSymLinkWithSystemPath: [
              "\\\\Device\\\\HarddiskVolume*\\\\Windows\\\\example.exe",
            ],
          },
        },
      },
      null,
      2
    ),
  },
  {
    label: "Event Log Channels & Providers",
    category: "Deep Visibility",
    json: JSON.stringify(
      {
        deepVisibility: {
          eventLog: {
            channels: {
              Application: [],
              Security: [],
              System: [],
              Setup: [],
              "Forwarded Events": [],
              "Microsoft-Windows-Bits-Client/Operational": [],
            },
            collectAllProviders: false,
            providers: ["Microsoft-Windows-Bits-Client"],
            levels: [],
            sendOriginalXML: true,
          },
        },
      },
      null,
      2
    ),
  },
];

const TEMPLATE_CATEGORIES = [...new Set(TEMPLATES.map((t) => t.category))];

export default function CustomOverride({ onSave, onClose }: CustomOverrideProps) {
  const [label, setLabel] = useState("");
  const [jsonText, setJsonText] = useState("");
  const [error, setError] = useState("");

  const applyTemplate = (template: (typeof TEMPLATES)[number]) => {
    setLabel(template.label);
    setJsonText(template.json);
    setError("");
  };

  const handleSave = () => {
    setError("");

    const trimmed = jsonText.trim();
    if (!trimmed) {
      setError("JSON is required");
      return;
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(trimmed);
    } catch {
      setError("Invalid JSON — must be a valid JSON object");
      return;
    }

    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      setError("JSON must be an object (e.g. { \"specialImages\": { ... } })");
      return;
    }

    const autoLabel = label.trim() || Object.keys(parsed as ConfigObject).join(", ");
    onSave(autoLabel, parsed as ConfigObject);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h3 className="text-sm font-semibold text-gray-100">Add Custom Override Block</h3>
          <p className="text-xs text-gray-400 mt-1">
            Paste a full JSON override block. It will be deep-merged into the final output.
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
              Label (optional)
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Cymulate Spawners"
              className="mt-1 w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">
              JSON Override Block
            </label>
            <textarea
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder={'{\n  "specialImages": {\n    "spawners": [\n      {\n        "path": "...",\n        "publisher": "...",\n        "description": "..."\n      }\n    ]\n  }\n}'}
              rows={14}
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
            Add Block
          </button>
        </div>
      </div>
    </div>
  );
}
