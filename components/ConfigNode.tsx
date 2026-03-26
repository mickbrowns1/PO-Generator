"use client";

import { useState, useMemo } from "react";
import { ConfigValue, ConfigObject, OverridesMap } from "@/lib/types";
import { isLeafValue, formatValue, countOverridesInSubtree } from "@/lib/utils";

interface ConfigNodeProps {
  name: string;
  path: string;
  value: ConfigValue;
  overrides: OverridesMap;
  searchQuery: string;
  onEditNode: (path: string, value: ConfigValue) => void;
  depth?: number;
  defaultExpanded?: boolean;
}

function matchesSearch(key: string, path: string, value: ConfigValue, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  if (key.toLowerCase().includes(q)) return true;
  if (path.toLowerCase().includes(q)) return true;
  if (isLeafValue(value) && String(value).toLowerCase().includes(q)) return true;
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value as ConfigObject).some(([k, v]) =>
      matchesSearch(k, `${path}.${k}`, v, query)
    );
  }
  return false;
}

export default function ConfigNode({
  name,
  path,
  value,
  overrides,
  searchQuery,
  onEditNode,
  depth = 0,
  defaultExpanded = false,
}: ConfigNodeProps) {
  const [expanded, setExpanded] = useState(defaultExpanded || (!!searchQuery && matchesSearch(name, path, value, searchQuery)));
  const isLeaf = isLeafValue(value);
  const isOverridden = path in overrides;
  const overrideCount = useMemo(
    () => (isLeaf ? 0 : countOverridesInSubtree(value, path, overrides)),
    [value, path, overrides, isLeaf]
  );

  const shouldShow = !searchQuery || matchesSearch(name, path, value, searchQuery);
  if (!shouldShow) return null;

  const shouldAutoExpand = !!searchQuery && !isLeaf;

  const displayValue = isOverridden ? overrides[path] : value;

  if (isLeaf) {
    return (
      <button
        onClick={() => onEditNode(path, value)}
        className={`w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-800/80 group transition-colors ${
          isOverridden ? "bg-purple-900/20 border-l-2 border-purple-500" : ""
        }`}
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <span className="text-gray-500 w-4 text-center text-xs">
          {typeof value === "boolean" ? (displayValue ? "T" : "F") : "#"}
        </span>
        <span className={`text-sm flex-1 ${isOverridden ? "text-purple-300 font-medium" : "text-gray-300"}`}>
          {name}
        </span>
        <span className={`text-xs font-mono ${isOverridden ? "text-purple-400" : "text-gray-600"}`}>
          {formatValue(displayValue)}
        </span>
        {isOverridden && (
          <span className="w-2 h-2 rounded-full bg-purple-500 flex-shrink-0" />
        )}
      </button>
    );
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-gray-800/80 transition-colors"
        style={{ paddingLeft: `${depth * 16 + 12}px` }}
      >
        <svg
          className={`w-3 h-3 text-gray-500 transition-transform ${expanded || shouldAutoExpand ? "rotate-90" : ""}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M6 4l8 6-8 6V4z" />
        </svg>
        <span className="text-sm text-gray-200 font-medium flex-1">{name}</span>
        {overrideCount > 0 && (
          <span className="text-xs bg-purple-600/30 text-purple-300 px-1.5 py-0.5 rounded-full">
            {overrideCount}
          </span>
        )}
        <span className="text-xs text-gray-600">
          {Object.keys(value as ConfigObject).length}
        </span>
      </button>
      {(expanded || shouldAutoExpand) && (
        <div>
          {Object.entries(value as ConfigObject)
            .sort(([, a], [, b]) => {
              const aIsObj = a !== null && typeof a === "object" && !Array.isArray(a);
              const bIsObj = b !== null && typeof b === "object" && !Array.isArray(b);
              if (aIsObj && !bIsObj) return 1;
              if (!aIsObj && bIsObj) return -1;
              return 0;
            })
            .map(([key, childValue]) => (
              <ConfigNode
                key={key}
                name={key}
                path={path ? `${path}.${key}` : key}
                value={childValue}
                overrides={overrides}
                searchQuery={searchQuery}
                onEditNode={onEditNode}
                depth={depth + 1}
              />
            ))}
        </div>
      )}
    </div>
  );
}
