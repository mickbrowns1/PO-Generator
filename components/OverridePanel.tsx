"use client";

import { ConfigObject, ConfigValue, OverridesMap } from "@/lib/types";
import { getValueAtPath, formatValue, formatPath } from "@/lib/utils";

interface OverridePanelProps {
  overrides: OverridesMap;
  config: ConfigObject;
  onEditOverride: (path: string, value: ConfigValue) => void;
  onRemoveOverride: (path: string) => void;
  onClearAll: () => void;
}

export default function OverridePanel({
  overrides,
  config,
  onEditOverride,
  onRemoveOverride,
  onClearAll,
}: OverridePanelProps) {
  const overrideEntries = Object.entries(overrides);

  if (overrideEntries.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <svg className="w-12 h-12 mx-auto mb-3 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <p className="text-sm">No overrides yet</p>
        <p className="text-xs mt-1">Click any setting in the tree to create an override</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-gray-400">
          {overrideEntries.length} override{overrideEntries.length !== 1 ? "s" : ""}
        </span>
        <button
          onClick={onClearAll}
          className="text-xs text-red-400 hover:text-red-300"
        >
          Clear All
        </button>
      </div>
      <div className="space-y-1">
        {overrideEntries.map(([path, newValue]) => {
          const originalValue = getValueAtPath(config, path);
          const isCustom = originalValue === undefined;
          return (
            <div
              key={path}
              className="group flex items-center gap-2 px-3 py-2 bg-gray-800/50 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <button
                onClick={() => onEditOverride(path, originalValue)}
                className="flex-1 text-left min-w-0"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-purple-300 truncate">{path}</span>
                  {isCustom && (
                    <span className="text-[10px] bg-blue-600/30 text-blue-300 px-1.5 py-0.5 rounded flex-shrink-0">
                      custom
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {!isCustom && (
                    <>
                      <span className="text-xs text-gray-500 line-through">
                        {formatValue(originalValue)}
                      </span>
                      <svg className="w-3 h-3 text-gray-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                  <span className="text-xs text-purple-400 font-medium">
                    {formatValue(newValue)}
                  </span>
                </div>
              </button>
              <button
                onClick={() => onRemoveOverride(path)}
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-500 hover:text-red-400 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
