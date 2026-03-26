import { ConfigObject } from "./types";

// Default SentinelOne agent configuration
// Only includes settings that can be overridden via policy overrides.
// Custom-block-only settings (specialImages, indicators, detectors, etc.)
// are handled via the "+ Custom Block" modal.
export const defaultConfig: ConfigObject = {
  // --- Credential Protection (LSASS) ---
  "denyLsassRead": true,
  "detectLsassRead": true,
  "denyLsassReadFromWerFaultSecure": true,
  "denyLsassWriteThirdPartyOnly": true,

  // --- PrintNightmare ---
  "printNightmareConfig": {
    "detection": true,
    "prevention": false
  },

  // --- PIC Trap ---
  "PICTrap": true,

  // --- Deep Hooking ---
  "deepHookingConfig": {
    "deepHooking": true,
    "deepHooking_x86": true,
    "deepHooking_WOW64": true,
    "thirdPartyOnly": false,
    "thirdPartyOnlyOnHVCI": true,
    "thirdPartyOnlyOnVBS": false
  },

  // --- Detection Extensions ---
  "detectionExtensionsConfig": {
    "credentialsQuery": true,
    "networkUdpSend": false,
    "serviceModification": false,
    "triggerNetworkInfo": false,
    "networkHttpRequest": false,
    "ldapQuery": false,
    "smbShareAccess": false
  },

  // --- Go Scanner ---
  "enableGoScanner": false,

  // --- Static AI ---
  "staticConfig": {
    "maxFileSize": 31457280,
    "lnkStatus": 2,
    "officeStatus": 2,
    "pdfStatus": 2,
    "peStatus": 2,
    "msiStatus": 2,
    "zipStatus": 2,
    "rarStatus": 2
  },

  // --- Agent UI ---
  "showAgentUI": true,
  "uiConfig": {
    "capabilities": {
      "agentDetails": true,
      "deviceTab": false,
      "functionalProblem": false,
      "networkQuarantine": true,
      "quarantineTab": true,
      "scanHistory": false,
      "supportTab": false,
      "threatsHistory": true
    }
  },

  // --- Injection control ---
  "injection": true,
  "nativeWow64Injection": true,

  // --- Monitor Config ---
  "monitorConfig": {
    "registerNPFS": true,
    "protectSamSave": true,
    "protectSamSaveRemote": false,
    "protectSyskeyQuery": false,
    "protectSyskeyQueryRemote": false,
    "protectSyskeyQueryThirdPartyOnly": false,
    "preventRegSaveUserHive": false,
    "preventRemoteRegSaveUserHive": false,
    "preventRegSaveHKLM": false,
    "preventRemoteRegSaveHKLM": false,
    "preventRegSaveHKLMSecurityHive": false,
    "preventRemoteRegSaveHKLMSecurityHive": false,
    "preventRegSaveLsaSecrets": false,
    "preventRemoteRegSaveLsaSecrets": false,
    "preventRegSaveSysKey": false,
    "preventRemoteRegSaveSysKey": false,
    "preventSamAccess": false,
    "preventSecurityAccess": false,
    "preventSystemAccess": false,
    "preventNtdsAccess": false,
    "preemptionConfig": {
      "enablePreemptiveContentBlock": false,
      "enableRemotePreemptiveContentBlock": false
    }
  },

  // --- Relinking ---
  "relinking": {
    "namedPipes": true,
    "namedPipesTelemetryInterval": 2
  },

  // --- Disk Space Reservation ---
  "diskSpaceReserver": {
    "enabled": false,
    "sizeInMB": 3072
  },

  // --- Research Dumps (ADT) ---
  "researchDumps": {
    "enabled": false,
    "dumpLimitationPerProcess": 2,
    "maximalAccumulatedSizeInMB": 1024,
    "maximalTimeOnDiskInHours": 72,
    "perProcessLimitationWindow": 120
  },

  // --- Health Telemetry ---
  "healthCollectorConfig": {
    "collectHealthTelemetry": true,
    "healthTelemetryCollectionFrequency": 240
  },

  // --- Deep Visibility ---
  "deepVisibility": {
    "eventLog": {
      "collectAllProviders": false,
      "enabled": true,
      "levels": [1, 2],
      "sendOriginalXML": false
    },
    "scripts": {
      "enabled": true,
      "powershell": true,
      "batch": false,
      "python": false,
      "vbScript": false,
      "vba": false,
      "javaScript": false,
      "maxSizeBytes": 32768
    }
  },

  // --- Keep-alive ---
  "keepAliveInterval": 30,
  "keepAliveFailCount": 8,

  // --- Communicator / Proxy ---
  "communicatorConfig": {
    "forceProxy": false,
    "telemetry": true
  }
};
