"use client";

import { useState, useCallback } from "react";
import { ConfigObject, ConfigValue, OverridesMap } from "@/lib/types";
import { defaultConfig } from "@/lib/configSchema";
import { getValueAtPath } from "@/lib/utils";
import SearchBar from "@/components/SearchBar";
import ConfigTree from "@/components/ConfigTree";
import OverrideEditor from "@/components/OverrideEditor";
import OverridePanel from "@/components/OverridePanel";
import JsonExport from "@/components/JsonExport";
import ImportConfig from "@/components/ImportConfig";
import CustomOverride from "@/components/CustomOverride";

export default function Home() {
  const [config, setConfig] = useState<ConfigObject>(defaultConfig);
  const [overrides, setOverrides] = useState<OverridesMap>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [showImport, setShowImport] = useState(false);
  const [showCustom, setShowCustom] = useState(false);

  const handleEditNode = useCallback((path: string, _value: ConfigValue) => {
    setEditingPath(path);
  }, []);

  const handleSaveOverride = useCallback((path: string, value: ConfigValue) => {
    setOverrides((prev) => ({ ...prev, [path]: value }));
    setEditingPath(null);
  }, []);

  const handleRemoveOverride = useCallback((path: string) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[path];
      return next;
    });
    setEditingPath(null);
  }, []);

  const handleClearAll = useCallback(() => {
    setOverrides({});
  }, []);

  const handleImport = useCallback((newConfig: ConfigObject) => {
    setConfig(newConfig);
    setOverrides({});
    setShowImport(false);
  }, []);

  const handleCustomOverride = useCallback((path: string, value: ConfigValue) => {
    setOverrides((prev) => ({ ...prev, [path]: value }));
    setShowCustom(false);
  }, []);

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
                Browse agent configuration and generate policy overrides
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
              onClick={() => {
                setConfig(defaultConfig);
                setOverrides({});
                setSearchQuery("");
              }}
              className="px-3 py-1.5 text-xs bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors border border-gray-700"
            >
              Reset
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-screen-2xl mx-auto w-full flex">
        {/* Left Panel — Config Tree */}
        <div className="w-1/2 xl:w-3/5 border-r border-gray-800 flex flex-col min-h-0">
          <div className="p-3 border-b border-gray-800">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <ConfigTree
              config={config}
              overrides={overrides}
              searchQuery={searchQuery}
              onEditNode={handleEditNode}
            />
          </div>
        </div>

        {/* Right Panel — Overrides & Export */}
        <div className="w-1/2 xl:w-2/5 flex flex-col min-h-0">
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs text-gray-400 uppercase tracking-wide font-semibold">
                  Active Overrides
                </h2>
                <button
                  onClick={() => setShowCustom(true)}
                  className="px-2.5 py-1 text-xs bg-purple-600/20 text-purple-300 rounded hover:bg-purple-600/30 border border-purple-600/40 transition-colors"
                >
                  + Custom Override
                </button>
              </div>
              <OverridePanel
                overrides={overrides}
                config={config}
                onEditOverride={handleEditNode}
                onRemoveOverride={handleRemoveOverride}
                onClearAll={handleClearAll}
              />
            </div>
            <JsonExport overrides={overrides} />
          </div>
        </div>
      </div>

      {/* Modals */}
      {editingPath && (
        <OverrideEditor
          path={editingPath}
          originalValue={getValueAtPath(config, editingPath)}
          currentValue={overrides[editingPath]}
          onSave={handleSaveOverride}
          onCancel={() => setEditingPath(null)}
          onRemove={handleRemoveOverride}
          isOverridden={editingPath in overrides}
        />
      )}

      {showImport && (
        <ImportConfig
          onImport={handleImport}
          onClose={() => setShowImport(false)}
        />
      )}

      {showCustom && (
        <CustomOverride
          onSave={handleCustomOverride}
          onClose={() => setShowCustom(false)}
        />
      )}
    </div>
  );
}
