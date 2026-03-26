// Only these config paths are shown in the tree browser.
// Custom-block-only settings (specialImages, indicators, detectors, etc.)
// are handled via the "+ Custom Block" modal and don't appear here.

export const ALLOWED_PATHS: string[] = [
  // Credential Protection (LSASS)
  "denyLsassRead",
  "detectLsassRead",
  "denyLsassReadFromWerFaultSecure",
  "denyLsassWriteThirdPartyOnly",

  // SAM / Syskey / Registry Hive Protection
  "monitorConfig.protectSamSave",
  "monitorConfig.protectSamSaveRemote",
  "monitorConfig.protectSyskeyQuery",
  "monitorConfig.protectSyskeyQueryRemote",
  "monitorConfig.protectSyskeyQueryThirdPartyOnly",
  "monitorConfig.preventRegSaveUserHive",
  "monitorConfig.preventRemoteRegSaveUserHive",
  "monitorConfig.preventRegSaveHKLM",
  "monitorConfig.preventRemoteRegSaveHKLM",
  "monitorConfig.preventRegSaveHKLMSecurityHive",
  "monitorConfig.preventRemoteRegSaveHKLMSecurityHive",
  "monitorConfig.preventRegSaveLsaSecrets",
  "monitorConfig.preventRemoteRegSaveLsaSecrets",
  "monitorConfig.preventRegSaveSysKey",
  "monitorConfig.preventRemoteRegSaveSysKey",
  "monitorConfig.preventSamAccess",
  "monitorConfig.preventSecurityAccess",
  "monitorConfig.preventSystemAccess",
  "monitorConfig.preventNtdsAccess",

  // PrintNightmare
  "printNightmareConfig.detection",
  "printNightmareConfig.prevention",

  // PIC Trap
  "PICTrap",

  // Deep Hooking
  "deepHookingConfig.deepHooking",
  "deepHookingConfig.deepHooking_x86",
  "deepHookingConfig.deepHooking_WOW64",
  "deepHookingConfig.thirdPartyOnly",
  "deepHookingConfig.thirdPartyOnlyOnHVCI",
  "deepHookingConfig.thirdPartyOnlyOnVBS",

  // Named Pipe Relinking + NPFS
  "monitorConfig.registerNPFS",
  "relinking.namedPipes",
  "relinking.namedPipesTelemetryInterval",

  // Preemptive Content Block
  "monitorConfig.preemptionConfig.enablePreemptiveContentBlock",
  "monitorConfig.preemptionConfig.enableRemotePreemptiveContentBlock",

  // Detection Extensions
  "detectionExtensionsConfig.credentialsQuery",
  "detectionExtensionsConfig.networkUdpSend",
  "detectionExtensionsConfig.serviceModification",
  "detectionExtensionsConfig.triggerNetworkInfo",
  "detectionExtensionsConfig.networkHttpRequest",
  "detectionExtensionsConfig.ldapQuery",
  "detectionExtensionsConfig.smbShareAccess",

  // Go Scanner
  "enableGoScanner",

  // Static AI file size & types
  "staticConfig.maxFileSize",
  "staticConfig.lnkStatus",
  "staticConfig.officeStatus",
  "staticConfig.pdfStatus",
  "staticConfig.peStatus",
  "staticConfig.msiStatus",
  "staticConfig.zipStatus",
  "staticConfig.rarStatus",

  // Agent UI
  "uiConfig.capabilities.deviceTab",
  "uiConfig.capabilities.supportTab",
  "uiConfig.capabilities.agentDetails",
  "uiConfig.capabilities.quarantineTab",
  "uiConfig.capabilities.threatsHistory",
  "uiConfig.capabilities.functionalProblem",
  "uiConfig.capabilities.scanHistory",
  "uiConfig.capabilities.networkQuarantine",
  "showAgentUI",

  // Injection control
  "injection",
  "nativeWow64Injection",

  // Disk Space Reservation
  "diskSpaceReserver.enabled",
  "diskSpaceReserver.sizeInMB",

  // Research Dumps (ADT)
  "researchDumps.enabled",
  "researchDumps.dumpLimitationPerProcess",
  "researchDumps.maximalAccumulatedSizeInMB",
  "researchDumps.maximalTimeOnDiskInHours",
  "researchDumps.perProcessLimitationWindow",

  // Health Telemetry
  "healthCollectorConfig.collectHealthTelemetry",
  "healthCollectorConfig.healthTelemetryCollectionFrequency",

  // Deep Visibility - Event Log
  "deepVisibility.eventLog.collectAllProviders",
  "deepVisibility.eventLog.sendOriginalXML",
  "deepVisibility.eventLog.levels",
  "deepVisibility.eventLog.enabled",

  // Deep Visibility - Scripts
  "deepVisibility.scripts.enabled",
  "deepVisibility.scripts.powershell",
  "deepVisibility.scripts.batch",
  "deepVisibility.scripts.python",
  "deepVisibility.scripts.vbScript",
  "deepVisibility.scripts.vba",
  "deepVisibility.scripts.javaScript",
  "deepVisibility.scripts.maxSizeBytes",

  // Keep-alive
  "keepAliveInterval",
  "keepAliveFailCount",

  // Communicator / Proxy
  "communicatorConfig.forceProxy",
  "communicatorConfig.telemetry",
];

// Build a set of all path prefixes for efficient tree pruning.
// e.g. "monitorConfig.protectSamSave" produces:
//   "monitorConfig", "monitorConfig.protectSamSave"
export function buildAllowedSet(paths: string[]): Set<string> {
  const set = new Set<string>();
  for (const path of paths) {
    const parts = path.split(".");
    let current = "";
    for (const part of parts) {
      current = current ? `${current}.${part}` : part;
      set.add(current);
    }
  }
  return set;
}

export const ALLOWED_SET = buildAllowedSet(ALLOWED_PATHS);
