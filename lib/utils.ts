import { ConfigValue, ConfigObject, OverridesMap } from "./types";

export function getValueAtPath(obj: ConfigObject, path: string): ConfigValue {
  const keys = path.split(".");
  let current: ConfigValue = obj;
  for (const key of keys) {
    if (current === null || typeof current !== "object" || Array.isArray(current)) {
      return undefined as unknown as ConfigValue;
    }
    current = (current as ConfigObject)[key];
  }
  return current;
}

export function setValueAtPath(obj: ConfigObject, path: string, value: ConfigValue): ConfigObject {
  const result = JSON.parse(JSON.stringify(obj));
  const keys = path.split(".");
  let current = result;
  for (let i = 0; i < keys.length - 1; i++) {
    if (!(keys[i] in current)) {
      current[keys[i]] = {};
    }
    current = current[keys[i]];
  }
  current[keys[keys.length - 1]] = value;
  return result;
}

export function buildNestedOverrides(overrides: OverridesMap): ConfigObject {
  const result: ConfigObject = {};
  for (const [path, value] of Object.entries(overrides)) {
    const keys = path.split(".");
    let current: Record<string, ConfigValue> = result;
    for (let i = 0; i < keys.length - 1; i++) {
      if (!(keys[i] in current) || typeof current[keys[i]] !== "object" || current[keys[i]] === null || Array.isArray(current[keys[i]])) {
        current[keys[i]] = {};
      }
      current = current[keys[i]] as Record<string, ConfigValue>;
    }
    current[keys[keys.length - 1]] = value;
  }
  return result;
}

export function getValueType(value: ConfigValue): string {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value;
}

export function isLeafValue(value: ConfigValue): boolean {
  if (value === null) return true;
  if (Array.isArray(value)) return true;
  if (typeof value === "object") return false;
  return true;
}

export function flattenKeys(obj: ConfigObject, prefix = ""): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullPath = prefix ? `${prefix}.${key}` : key;
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      keys.push(...flattenKeys(value as ConfigObject, fullPath));
    } else {
      keys.push(fullPath);
    }
  }
  return keys;
}

export function countOverridesInSubtree(
  obj: ConfigValue,
  path: string,
  overrides: OverridesMap
): number {
  if (obj === null || typeof obj !== "object" || Array.isArray(obj)) {
    return path in overrides ? 1 : 0;
  }
  let count = 0;
  for (const key of Object.keys(obj as ConfigObject)) {
    const childPath = path ? `${path}.${key}` : key;
    count += countOverridesInSubtree((obj as ConfigObject)[key], childPath, overrides);
  }
  return count;
}

export function deepMerge(target: ConfigObject, source: ConfigObject): ConfigObject {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      key in result &&
      result[key] !== null &&
      typeof result[key] === "object" &&
      !Array.isArray(result[key]) &&
      source[key] !== null &&
      typeof source[key] === "object" &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(
        result[key] as ConfigObject,
        source[key] as ConfigObject
      );
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

export function buildFinalOutput(
  overrides: OverridesMap,
  customBlocks: ConfigObject[]
): ConfigObject {
  let result = buildNestedOverrides(overrides);
  for (const block of customBlocks) {
    result = deepMerge(result, block);
  }
  return result;
}

export function formatPath(path: string): string {
  const parts = path.split(".");
  return parts[parts.length - 1];
}

export function formatValue(value: ConfigValue): string {
  if (value === null) return "null";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return String(value);
  if (typeof value === "string") return value.length > 50 ? value.slice(0, 50) + "..." : value;
  if (Array.isArray(value)) return `[${value.length} items]`;
  if (typeof value === "object") return `{${Object.keys(value).length} keys}`;
  return String(value);
}
