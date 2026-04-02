"use client";

import { useState, useCallback, useEffect } from "react";
import { ConfigObject, CustomBlock } from "@/lib/types";
import { defaultConfig } from "@/lib/configSchema";
import { linuxDefaultConfig } from "@/lib/linuxConfigSchema";
import { macosDefaultConfig } from "@/lib/macosConfigSchema";
import OverridePanel from "@/components/OverridePanel";
import JsonExport from "@/components/JsonExport";
import CustomOverride from "@/components/CustomOverride";

type SavedTemplate = { label: string; json: string };
type SavedTemplatesMap = Record<Platform, SavedTemplate[]>;

type Platform = "windows" | "linux" | "macos";

const PLATFORMS: { id: Platform; label: string; icon: string }[] = [
  { id: "windows", label: "Windows", icon: "W" },
  { id: "linux", label: "Linux", icon: "L" },
  { id: "macos", label: "macOS", icon: "M" },
];

const DEFAULT_CONFIGS: Record<Platform, ConfigObject> = {
  windows: defaultConfig,
  linux: linuxDefaultConfig,
  macos: macosDefaultConfig,
};

type PlatformState = {
  config: ConfigObject;
  customBlocks: CustomBlock[];
};

let blockIdCounter = 0;

export default function Home() {
  const [platform, setPlatform] = useState<Platform>("windows");

  const [platformStates, setPlatformStates] = useState<Record<Platform, PlatformState>>({
    windows: { config: defaultConfig, customBlocks: [] },
    linux: { config: linuxDefaultConfig, customBlocks: [] },
    macos: { config: macosDefaultConfig, customBlocks: [] },
  });

  const [showHelp, setShowHelp] = useState(true);
  const [blockLabel, setBlockLabel] = useState("");
  const [blockJson, setBlockJson] = useState("");
  const [blockError, setBlockError] = useState("");

  const [savedTemplates, setSavedTemplates] = useState<SavedTemplatesMap>({
    windows: [],
    linux: [],
    macos: [],
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("savedTemplates");
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<SavedTemplatesMap>;
        setSavedTemplates((prev) => ({
          windows: parsed.windows ?? prev.windows,
          linux: parsed.linux ?? prev.linux,
          macos: parsed.macos ?? prev.macos,
        }));
      }
    } catch { /* ignore */ }
  }, []);

  const currentState = platformStates[platform];

  const updatePlatformState = useCallback(
    (updater: (prev: PlatformState) => PlatformState) => {
      setPlatformStates((prev) => ({
        ...prev,
        [platform]: updater(prev[platform]),
      }));
    },
    [platform]
  );

  const handleClearAll = useCallback(() => {
    updatePlatformState((prev) => ({
      ...prev,
      customBlocks: [],
    }));
  }, [updatePlatformState]);

  const handleAddCustomBlock = useCallback(
    (label: string, json: ConfigObject) => {
      updatePlatformState((prev) => ({
        ...prev,
        customBlocks: [
          ...prev.customBlocks,
          { id: `block-${++blockIdCounter}`, label, json },
        ],
      }));
    },
    [updatePlatformState]
  );

  const handleApplyTemplate = useCallback((label: string, json: string) => {
    setBlockLabel(label);
    setBlockJson(json);
    setBlockError("");
  }, []);

  const handleSaveBlock = useCallback(() => {
    setBlockError("");
    const trimmed = blockJson.trim();
    if (!trimmed) { setBlockError("JSON is required"); return; }
    let parsed: unknown;
    try { parsed = JSON.parse(trimmed); } catch { setBlockError("Invalid JSON — must be a valid JSON object"); return; }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      setBlockError("JSON must be an object");
      return;
    }
    const autoLabel = blockLabel.trim() || Object.keys(parsed as ConfigObject).join(", ");
    handleAddCustomBlock(autoLabel, parsed as ConfigObject);
    setBlockLabel("");
    setBlockJson("");
  }, [blockJson, blockLabel, handleAddCustomBlock]);

  const handleRemoveCustomBlock = useCallback(
    (id: string) => {
      updatePlatformState((prev) => ({
        ...prev,
        customBlocks: prev.customBlocks.filter((b) => b.id !== id),
      }));
    },
    [updatePlatformState]
  );

  const handleReset = useCallback(() => {
    setPlatformStates((prev) => ({
      ...prev,
      [platform]: { config: DEFAULT_CONFIGS[platform], customBlocks: [] },
    }));
  }, [platform]);

  const handleMoveBlock = useCallback(
    (id: string, direction: "up" | "down") => {
      updatePlatformState((prev) => {
        const blocks = [...prev.customBlocks];
        const idx = blocks.findIndex((b) => b.id === id);
        if (idx === -1) return prev;
        if (direction === "up" && idx === 0) return prev;
        if (direction === "down" && idx === blocks.length - 1) return prev;
        const swap = direction === "up" ? idx - 1 : idx + 1;
        [blocks[idx], blocks[swap]] = [blocks[swap], blocks[idx]];
        return { ...prev, customBlocks: blocks };
      });
    },
    [updatePlatformState]
  );

  const handleSaveAsTemplate = useCallback(
    (id: string) => {
      const block = currentState.customBlocks.find((b) => b.id === id);
      if (!block) return;
      setSavedTemplates((prev) => {
        const existing = prev[platform];
        if (existing.some((t) => t.label === block.label)) return prev;
        const updated = {
          ...prev,
          [platform]: [...existing, { label: block.label, json: JSON.stringify(block.json, null, 2) }],
        };
        try { localStorage.setItem("savedTemplates", JSON.stringify(updated)); } catch { /* ignore */ }
        return updated;
      });
    },
    [currentState.customBlocks, platform]
  );

  const handleResolveConflict = useCallback(
    (key: string, winningBlockId: string) => {
      updatePlatformState((prev) => ({
        ...prev,
        customBlocks: prev.customBlocks.map((b) => {
          if (b.id === winningBlockId || !(key in b.json)) return b;
          const updated = { ...b.json };
          delete updated[key];
          return { ...b, json: updated };
        }),
      }));
    },
    [updatePlatformState]
  );

  const handleDeleteSavedTemplate = useCallback(
    (label: string) => {
      setSavedTemplates((prev) => {
        const updated = {
          ...prev,
          [platform]: prev[platform].filter((t) => t.label !== label),
        };
        try { localStorage.setItem("savedTemplates", JSON.stringify(updated)); } catch { /* ignore */ }
        return updated;
      });
    },
    [platform]
  );

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-s1-border bg-s1-black/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex-1 flex justify-center">
            <img src="/logo.png" alt="Override Ops" className="h-28 w-auto" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm bg-s1-surface text-s1-text-secondary rounded-lg hover:bg-s1-surface-hover hover:text-s1-text transition-all border border-s1-border"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Platform Tabs */}
      <div className="border-b border-s1-border bg-s1-bg">
        <div className="max-w-screen-2xl mx-auto px-6">
          <div className="flex gap-0">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`px-6 py-3 text-sm font-medium border-b-2 transition-all ${
                  platform === p.id
                    ? "border-s1-purple text-white"
                    : "border-transparent text-s1-text-muted hover:text-s1-text-secondary hover:border-s1-border-light"
                }`}
              >
                <span className="inline-flex items-center gap-2.5">
                  <span className={`w-6 h-6 rounded text-[11px] font-bold flex items-center justify-center transition-all ${
                    platform === p.id
                      ? "bg-s1-purple text-white shadow-sm shadow-s1-purple-glow"
                      : "bg-s1-surface text-s1-text-muted border border-s1-border"
                  }`}>
                    {p.icon}
                  </span>
                  {p.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Instructions banner */}
      {showHelp && (
        <div className="border-b border-s1-border bg-s1-surface flex-shrink-0">
          <div className="px-6 py-3 flex items-start gap-6">
            <div className="flex items-center gap-5 flex-1 flex-wrap">
              {[
                { step: "1", text: "Select your platform using the tabs above" },
                { step: "2", text: "Pick a template on the left, or paste custom JSON" },
                { step: "3", text: "Click \u201c+ Add Block\u201d — it appears on the right" },
                { step: "4", text: "Copy or download the merged JSON output" },
              ].map(({ step, text }) => (
                <div key={step} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-s1-purple/20 border border-s1-purple/40 text-[10px] font-bold text-s1-purple flex items-center justify-center flex-shrink-0">
                    {step}
                  </span>
                  <span className="text-xs text-s1-text-muted">{text}</span>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowHelp(false)}
              className="text-s1-text-muted hover:text-s1-text-secondary transition-colors flex-shrink-0 mt-0.5"
              aria-label="Dismiss instructions"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Two-pane content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left pane — template browser */}
        <div className="w-[320px] flex-shrink-0 border-r border-s1-border flex flex-col overflow-hidden bg-s1-bg">
          <div className="px-5 py-3 border-b border-s1-border flex-shrink-0">
            <h2 className="text-xs text-s1-text-secondary uppercase tracking-wider font-semibold">Templates</h2>
          </div>
          <CustomOverride
            onApplyTemplate={handleApplyTemplate}
            platform={platform}
            savedTemplates={savedTemplates[platform]}
            onDeleteSavedTemplate={handleDeleteSavedTemplate}
          />
        </div>

        {/* Right pane — editor + blocks + output */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* JSON editor */}
          <div className="flex-shrink-0 border-b border-s1-border px-6 py-4 space-y-3">
            <div className="flex gap-3">
              <div className="flex-1">
                <label className="text-xs text-s1-text-muted uppercase tracking-wider font-semibold">Label (optional)</label>
                <input
                  type="text"
                  value={blockLabel}
                  onChange={(e) => setBlockLabel(e.target.value)}
                  placeholder="e.g. Custom Override"
                  className="mt-1.5 w-full px-3 py-2 bg-s1-surface border border-s1-border rounded-lg text-sm text-s1-text placeholder-s1-text-muted focus:outline-none focus:border-s1-purple transition-colors"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={handleSaveBlock}
                  className="px-5 py-2 text-sm font-medium text-white bg-s1-purple rounded-lg hover:bg-s1-purple-hover transition-all shadow-sm shadow-s1-purple-glow whitespace-nowrap"
                >
                  + Add Block
                </button>
              </div>
            </div>
            <div>
              <label className="text-xs text-s1-text-muted uppercase tracking-wider font-semibold">JSON Override Block</label>
              <textarea
                value={blockJson}
                onChange={(e) => setBlockJson(e.target.value)}
                placeholder={'{\n  "key": {\n    "setting": true\n  }\n}'}
                rows={7}
                className="mt-1.5 w-full px-3 py-2 bg-s1-surface border border-s1-border rounded-lg text-sm font-mono text-s1-text placeholder-s1-text-muted focus:outline-none focus:border-s1-purple transition-colors resize-y"
              />
            </div>
            {blockError && <p className="text-xs text-red-400">{blockError}</p>}
          </div>

          {/* Blocks list */}
          <div className="px-6 py-3 border-b border-s1-border flex items-center justify-between flex-shrink-0">
            <h2 className="text-xs text-s1-text-secondary uppercase tracking-wider font-semibold">
              Override Blocks
              {currentState.customBlocks.length > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-s1-surface border border-s1-border rounded text-s1-text-muted normal-case tracking-normal">
                  {currentState.customBlocks.length}
                </span>
              )}
            </h2>
            {currentState.customBlocks.length > 0 && (
              <button
                onClick={handleClearAll}
                className="text-xs text-red-500 hover:text-red-400 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {currentState.customBlocks.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-s1-border rounded-lg bg-s1-bg">
                <div className="w-12 h-12 rounded-full bg-s1-surface border border-s1-border flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-s1-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-sm text-s1-text-secondary">No override blocks yet</p>
                <p className="text-xs text-s1-text-muted mt-1.5">
                  Select a template on the left or paste JSON above to get started
                </p>
              </div>
            ) : (
              <>
                <OverridePanel
                  overrides={{}}
                  customBlocks={currentState.customBlocks}
                  config={currentState.config}
                  onEditOverride={() => {}}
                  onRemoveOverride={() => {}}
                  onRemoveCustomBlock={handleRemoveCustomBlock}
                  onClearAll={handleClearAll}
                  onMoveBlock={handleMoveBlock}
                  onSaveAsTemplate={handleSaveAsTemplate}
                  onResolveConflict={handleResolveConflict}
                />
                <JsonExport overrides={{}} customBlocks={currentState.customBlocks} />
              </>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
