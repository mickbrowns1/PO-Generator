"use client";

import { useState, useEffect } from "react";
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
  onResolveConflict?: (key: string, winningBlockId: string) => void;
}

const previewValue = (val: unknown): string => {
  const str = JSON.stringify(val, null, 2);
  const lines = str.split("\n");
  if (lines.length <= 8) return str;
  return lines.slice(0, 8).join("\n") + `\n… (${lines.length - 8} more lines)`;
};

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
  onResolveConflict,
}: OverridePanelProps) {
  const overrideEntries = Object.entries(overrides);
  const totalCount = overrideEntries.length + customBlocks.length;

  // Conflict detection
  const keyCounts: Record<string, number> = {};
  for (const block of customBlocks) {
    for (const key of Object.keys(block.json)) {
      keyCounts[key] = (keyCounts[key] || 0) + 1;
    }
  }
  const conflictKeys = new Set(
    Object.entries(keyCounts).filter(([, c]) => c > 1).map(([k]) => k)
  );
  const blockConflicts = (block: CustomBlock) =>
    Object.keys(block.json).filter((k) => conflictKeys.has(k));

  // Modal state
  const [conflictModal, setConflictModal] = useState<{
    key: string;
    candidates: Array<{ block: CustomBlock; value: unknown }>;
  } | null>(null);

  // Recently resolved keys (show green badge briefly)
  const [recentlyResolved, setRecentlyResolved] = useState<Set<string>>(new Set());

  // Clear resolved keys when blocks change (new conflict possible)
  useEffect(() => {
    setRecentlyResolved(new Set());
  }, [customBlocks.length]);

  const openConflictModal = (key: string) => {
    const candidates = customBlocks
      .filter((b) => key in b.json)
      .map((b) => ({ block: b, value: b.json[key] }));
    setConflictModal({ key, candidates });
  };

  const handleResolve = (key: string, winningBlockId: string) => {
    onResolveConflict?.(key, winningBlockId);
    setRecentlyResolved((prev) => new Set([...prev, key]));
    setTimeout(() => {
      setRecentlyResolved((prev) => {
        const next = new Set(prev);
        next.delete(key);
        return next;
      });
    }, 4000);
    setConflictModal(null);
  };

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
    <>
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-s1-text-muted">
            {totalCount} item{totalCount !== 1 ? "s" : ""}
          </span>
          <button onClick={onClearAll} className="text-xs text-red-500 hover:text-red-400">
            Clear All
          </button>
        </div>

        {/* Conflict banner */}
        {conflictKeys.size > 0 && (
          <div className="mb-3 flex items-start gap-2 px-3 py-2 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <svg className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-amber-400 font-medium">Key conflict — click a key to resolve</p>
              <div className="flex flex-wrap gap-1 mt-1.5">
                {[...conflictKeys].map((key) =>
                  recentlyResolved.has(key) ? (
                    <span key={key} className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-mono">
                      ✓ {key}
                    </span>
                  ) : (
                    <button
                      key={key}
                      onClick={() => openConflictModal(key)}
                      className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded font-mono hover:bg-amber-500/30 transition-colors"
                    >
                      {key}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        )}

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
                <button onClick={() => onEditOverride(path, originalValue)} className="flex-1 text-left min-w-0">
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
                        <span className="text-xs text-s1-text-muted line-through">{formatValue(originalValue)}</span>
                        <svg className="w-3 h-3 text-s1-text-muted flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                    <span className="text-xs text-s1-purple font-medium">{formatValue(newValue)}</span>
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
          {customBlocks.map((block, idx) => {
            const conflicts = blockConflicts(block);
            const resolved = conflicts.filter((k) => recentlyResolved.has(k));
            const unresolved = conflicts.filter((k) => !recentlyResolved.has(k));
            return (
              <div
                key={block.id}
                className="group flex items-center gap-1.5 px-3 py-2 bg-s1-purple-dim border border-s1-purple/20 rounded-lg hover:bg-s1-purple/20 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-medium text-s1-text">{block.label}</span>
                    <span className="text-[10px] bg-s1-purple/20 text-s1-purple px-1.5 py-0.5 rounded flex-shrink-0">
                      block
                    </span>
                    {resolved.map((k) => (
                      <span key={k} className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded flex-shrink-0">
                        ✓ resolved
                      </span>
                    ))}
                    {unresolved.length > 0 && (
                      <button
                        onClick={() => openConflictModal(unresolved[0])}
                        className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded flex-shrink-0 hover:bg-amber-500/30 transition-colors"
                        title={`Click to resolve: ${unresolved.join(", ")}`}
                      >
                        ⚠ conflict{unresolved.length > 1 ? ` (${unresolved.length})` : ""}
                      </button>
                    )}
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
            );
          })}
        </div>
      </div>

      {/* Conflict resolution modal */}
      {conflictModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setConflictModal(null)}
        >
          <div
            className="bg-s1-surface border border-s1-border-light rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-s1-border flex-shrink-0">
              <div>
                <h2 className="text-sm font-semibold text-s1-text">Resolve Key Conflict</h2>
                <p className="text-xs text-s1-text-muted mt-0.5">
                  Choose which block&apos;s value to keep for{" "}
                  <span className="font-mono text-amber-400">{conflictModal.key}</span>
                  {" "}— the others will have this key removed.
                </p>
              </div>
              <button
                onClick={() => setConflictModal(null)}
                className="p-1.5 text-s1-text-muted hover:text-s1-text transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Candidates */}
            <div className="overflow-y-auto flex-1 p-5 space-y-3">
              {conflictModal.candidates.map(({ block, value }) => (
                <div
                  key={block.id}
                  className="border border-s1-border rounded-lg overflow-hidden"
                >
                  <div className="flex items-center justify-between px-4 py-2.5 bg-s1-bg border-b border-s1-border">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-s1-text">{block.label}</span>
                      <span className="text-[10px] bg-s1-purple/20 text-s1-purple px-1.5 py-0.5 rounded">block</span>
                    </div>
                    <button
                      onClick={() => handleResolve(conflictModal.key, block.id)}
                      className="px-3 py-1.5 text-xs font-medium text-white bg-s1-purple rounded-lg hover:bg-s1-purple-hover transition-all shadow-sm shadow-s1-purple-glow"
                    >
                      Use this value
                    </button>
                  </div>
                  <pre className="px-4 py-3 text-[11px] font-mono text-s1-text-secondary bg-s1-black/40 overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
                    {previewValue(value)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
