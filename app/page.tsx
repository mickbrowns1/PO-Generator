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
  const [showCustom, setShowCustom] = useState(false);

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
      setShowCustom(false);
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
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-screen-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div>
              <h1 className="text-sm font-semibold text-gray-100">
                SentinelOne Policy Override Generator
              </h1>
              <p className="text-xs text-gray-500">
                Generate policy overrides from templates or custom JSON
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowImport(true)}
              className="px-3 py-1.5 text-xs bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Import Config
            </button>
            <button
              onClick={handleReset}
              className="px-3 py-1.5 text-xs bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Platform Tabs */}
      <div className="border-b border-gray-800 bg-gray-950/60">
        <div className="max-w-screen-2xl mx-auto px-4">
          <div className="flex gap-0">
            {PLATFORMS.map((p) => (
              <button
                key={p.id}
                onClick={() => setPlatform(p.id)}
                className={`px-5 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  platform === p.id
                    ? "border-purple-500 text-purple-300"
                    : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
                }`}
              >
                <span className="inline-flex items-center gap-2">
                  <span className={`w-5 h-5 rounded text-[10px] font-bold flex items-center justify-center ${
                    platform === p.id ? "bg-purple-600 text-white" : "bg-gray-800 text-gray-500"
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

      {/* Main Content — Custom Blocks Only */}
      <div className="flex-1 max-w-screen-2xl mx-auto w-full flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-6 max-w-4xl mx-auto w-full">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                Override Blocks
              </h2>
              <button
                onClick={() => setShowCustom(true)}
                className="px-2.5 py-1 text-xs bg-purple-600/20 text-purple-300 rounded hover:bg-purple-600/30 border border-purple-600/40 transition-colors"
              >
                + Add Block
              </button>
            </div>
            {currentState.customBlocks.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-gray-800 rounded-lg">
                <p className="text-sm text-gray-500">No override blocks yet.</p>
                <p className="text-xs text-gray-600 mt-1">
                  Click &quot;+ Add Block&quot; to select a template or paste custom JSON.
                </p>
              </div>
            ) : (
              <OverridePanel
                overrides={{}}
                customBlocks={currentState.customBlocks}
                config={currentState.config}
                onEditOverride={() => {}}
                onRemoveOverride={() => {}}
                onRemoveCustomBlock={handleRemoveCustomBlock}
                onClearAll={handleClearAll}
              />
            )}
          </div>
          <JsonExport overrides={{}} customBlocks={currentState.customBlocks} />
        </div>
      </div>

      {/* Modals */}
      {showImport && (
        <ImportConfig
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}

      {showCustom && (
        <CustomOverride
          onSave={handleAddCustomBlock}
          onClose={() => setShowCustom(false)}
          platform={platform}
        />
      )}
    </div>
  );
}
