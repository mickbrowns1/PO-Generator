export type ConfigValue =
  | string
  | number
  | boolean
  | null
  | ConfigValue[]
  | { [key: string]: ConfigValue };

export type ConfigObject = { [key: string]: ConfigValue };

export type Override = {
  path: string;
  originalValue: ConfigValue;
  newValue: ConfigValue;
};

export type OverridesMap = Record<string, ConfigValue>;
