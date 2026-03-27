"use client";

import { useState, useCallback } from "react";
import { ConfigObject, CustomBlock } from "@/lib/types";
import { defaultConfig } from "@/lib/configSchema";
import { linuxDefaultConfig } from "@/lib/linuxConfigSchema";
import { macosDefaultConfig } from "@/lib/macosConfigSchema";
import OverridePanel from "@/components/OverridePanel";
import JsonExport from "@/components/JsonExport";
import ImportConfig from "@/components/ImportConfig";
import CustomOverride from "@/components/CustomOverride";

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

  const [showImport, setShowImport] = useState(false);

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

  const handleImport = useCallback(
    (newConfig: ConfigObject) => {
      updatePlatformState(() => ({
        config: newConfig,
        customBlocks: [],
      }));
      setShowImport(false);
    },
    [updatePlatformState]
  );

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

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-s1-border bg-s1-black/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-s1-purple flex items-center justify-center shadow-lg shadow-s1-purple-glow">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-semibold text-white tracking-tight">
                Policy Override Generator
              </h1>
              <p className="text-xs text-s1-text-muted mt-0.5">
                SentinelOne agent configuration overrides
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowImport(true)}
              className="px-4 py-2 text-sm bg-s1-surface text-s1-text-secondary rounded-lg hover:bg-s1-surface-hover hover:text-s1-text transition-all border border-s1-border"
            >
              Import
            </button>
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

      {/* Two-pane content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left pane — template picker */}
        <div className="w-[360px] flex-shrink-0 border-r border-s1-border flex flex-col overflow-hidden bg-s1-bg">
          <div className="px-5 py-3 border-b border-s1-border flex-shrink-0">
            <h2 className="text-xs text-s1-text-secondary uppercase tracking-wider font-semibold">Add Block</h2>
          </div>
          <CustomOverride
            onSave={handleAddCustomBlock}
            platform={platform}
          />
        </div>

        {/* Right pane — blocks & output */}
        <div className="flex-1 flex flex-col overflow-hidden">
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
              <div className="text-center py-20 border border-dashed border-s1-border rounded-lg bg-s1-bg">
                <div className="w-12 h-12 rounded-full bg-s1-surface border border-s1-border flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-s1-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-sm text-s1-text-secondary">No override blocks yet</p>
                <p className="text-xs text-s1-text-muted mt-1.5">
                  Select a template or paste JSON on the left to get started
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
                />
                <JsonExport overrides={{}} customBlocks={currentState.customBlocks} />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showImport && (
        <ImportConfig
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}
    </div>
  );
}
