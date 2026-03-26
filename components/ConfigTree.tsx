"use client";

import { ConfigObject, OverridesMap, ConfigValue } from "@/lib/types";
import ConfigNode from "./ConfigNode";

interface ConfigTreeProps {
  config: ConfigObject;
  overrides: OverridesMap;
  searchQuery: string;
  onEditNode: (path: string, value: ConfigValue) => void;
  allowedSet?: Set<string>;
}

export default function ConfigTree({ config, overrides, searchQuery, onEditNode, allowedSet }: ConfigTreeProps) {
  const entries = Object.entries(config).sort(([, a], [, b]) => {
    const aIsObj = a !== null && typeof a === "object" && !Array.isArray(a);
    const bIsObj = b !== null && typeof b === "object" && !Array.isArray(b);
    if (aIsObj && !bIsObj) return 1;
    if (!aIsObj && bIsObj) return -1;
    return 0;
  });

  return (
    <div className="space-y-0.5">
      {entries.map(([key, value]) => (
        <ConfigNode
          key={key}
          name={key}
          path={key}
          value={value}
          overrides={overrides}
          searchQuery={searchQuery}
          onEditNode={onEditNode}
          depth={0}
          allowedSet={allowedSet}
        />
      ))}
    </div>
  );
}
