"use client";

import { ConfigObject, ConfigValue, OverridesMap, CustomBlock } from "@/lib/types";
import { getValueAtPath, formatValue } from "@/lib/utils";

interface OverridePanelProps {
  overrides: OverridesMap;
  customBlocks: CustomBlock[];
  config: ConfigObject;
  onEditOverride: (path: string, value: ConfigValue) => void;
  onRemoveOverride: (path: string) => void;
  onRemoveCustomBlock: (id: string) => void;
  onClearAll: () => void;
  onMoveBlock?: (id: string, direction: "up" | "down") => void;
  onSaveAsTemplate?: (id: string) => void;
}

export default function OverridePanel({
  overrides,
  customBlocks,
  config,
  onEditOverride,
  onRemoveOverride,
  onRemoveCustomBlock,
  onClearAll,
  onMoveBlock,
  onSaveAsTemplate,
}: OverridePanelProps) {
  const overrideEntries = Object.entries(overrides);
  const totalCount = overrideEntries.length + customBlocks.length;

  if (totalCount === 0) {
    return (
      <div className="text-center py-8 text-s1-text-muted">
        <svg className="w-12 h-12 mx-auto mb-3 text-s1-border" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        <p className="text-sm">No overrides yet</p>
        <p className="text-xs mt-1">Click any setting in the tree or add a custom block</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs text-s1-text-muted">
          {totalCount} item{totalCount !== 1 ? "s" : ""}
        </span>
        <button
          onClick={onClearAll}
          className="text-xs text-red-500 hover:text-red-400"
        >
          Clear All
        </button>
      </div>
      <div className="space-y-1">
        {/* Config overrides */}
        {overrideEntries.map(([path, newValue]) => {
          const originalValue = getValueAtPath(config, path);
          const isCustom = originalValue === undefined;
          return (
            <div
              key={path}
              className="group flex items-center gap-2 px-3 py-2 bg-s1-surface rounded-lg hover:bg-s1-surface-hover transition-colors"
            >
              <button
                onClick={() => onEditOverride(path, originalValue)}
                className="flex-1 text-left min-w-0"
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-mono text-s1-purple truncate">{path}</span>
                  {isCustom && (
                    <span className="text-[10px] bg-s1-purple-dim text-s1-purple px-1.5 py-0.5 rounded flex-shrink-0">
                      custom
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  {!isCustom && (
                    <>
                      <span className="text-xs text-s1-text-muted line-through">
                        {formatValue(originalValue)}
                      </span>
                      <svg className="w-3 h-3 text-s1-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </>
                  )}
                  <span className="text-xs text-s1-purple font-medium">
                    {formatValue(newValue)}
                  </span>
                </div>
              </button>
              <button
                onClick={() => onRemoveOverride(path)}
                className="opacity-0 group-hover:opacity-100 p-1 text-s1-text-muted hover:text-red-400 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          );
        })}

        {/* Custom JSON blocks */}
        {customBlocks.map((block, idx) => (
          <div
            key={block.id}
            className="group flex items-center gap-1.5 px-3 py-2 bg-s1-purple-dim border border-s1-purple/20 rounded-lg hover:bg-s1-purple/20 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-medium text-s1-text">{block.label}</span>
                <span className="text-[10px] bg-s1-purple/20 text-s1-purple px-1.5 py-0.5 rounded flex-shrink-0">
                  block
                </span>
              </div>
              <div className="text-[10px] text-s1-text-muted font-mono mt-0.5 truncate">
                {Object.keys(block.json).join(", ")}
              </div>
            </div>
            <div className="flex items-center gap-0 opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
              {onMoveBlock && (
                <>
                  <button
                    onClick={() => onMoveBlock(block.id, "up")}
                    disabled={idx === 0}
                    className="p-1 text-s1-text-muted hover:text-s1-text disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Move up"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => onMoveBlock(block.id, "down")}
                    disabled={idx === customBlocks.length - 1}
                    className="p-1 text-s1-text-muted hover:text-s1-text disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
                    title="Move down"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </>
              )}
              {onSaveAsTemplate && (
                <button
                  onClick={() => onSaveAsTemplate(block.id)}
                  className="p-1 text-s1-text-muted hover:text-s1-cyan transition-colors"
                  title="Save as reusable template"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                </button>
              )}
              <button
                onClick={() => onRemoveCustomBlock(block.id)}
                className="p-1 text-s1-text-muted hover:text-red-400 transition-colors"
                title="Remove block"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
