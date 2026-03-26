import { ConfigObject } from "./types";

// Default SentinelOne agent configuration
// This serves as the baseline for generating policy overrides
export const defaultConfig: ConfigObject = {
  "addon": {
    "addon-WinLogCollection": {
      "enabled": false
    }
  },
  "addonsManagerConfig": {
    "uploadFileTimeout": 600000
  },
  "agentDataDirPath": "C:\\ProgramData\\Sentinel\\",
  "agentLogging": true,
  "agentProgramFilesPath": "C:\\Program Files\\SentinelOne\\",
  "agentWorker": {
    "cpuUsageAfterInstallation": 20,
    "cpuUsageRegularStartup": 5,
    "dumpOnTimeout": true,
    "workerTimeout": 180000
  },
  "allowUnprotectByApprovedProcess": false,
  "allowUnsignedAssets": false,
  "amsiConfig": {
    "enableBypassDetection": true,
    "ioavLogOnError": true,
    "maxContentSize": 102400,
    "registerAsAmsiProvider": true,
    "registerAsIoavProvider": true,
    "rpcTimeoutInMs": 60000,
    "threshold": {
      "classifierResult": 3
    }
  },
  "antiTampering": true,
  "antiTamperingConfig": {
    "allowMsconfigToSafeBoot": false,
    "allowSignedKnownAndVerifiedToSafeBoot": false,
    "allowSysprepInOOBEMode": false,
    "alwaysReadElamDriverListFromDisk": false,
    "alwaysScanDrivers": false,
    "antiTamperingForNetworkMonitorEnabled": true,
    "autoRemoveTrustLabelsForWindowsSetup": true,
    "blockDriverIfNoCounterSignatureTimestamp": true,
    "blockDriverIfNoSuperTrustedSignature": true,
    "blockDriversAccordingToConfig": true,
    "blockUnsignedDriverLoad": true,
    "blockUnsignedDriversInTestMode": false,
    "checkCertRevocation": true,
    "driverBlockingSignaturesOverrideJson": "",
    "efiModelQueryExclusion": true,
    "elamDbRegeneration": true,
    "enforceSingleDriverBlockingAsset": true,
    "extendedReadProtectionForData": true,
    "handleOpening": {
      "blockHandleOpeningByIoControlForFiles": false,
      "blockHandleOpeningByIoControlForProcesses": false,
      "blockHandleOpeningByIoControlForRegistry": false,
      "blockHandleOpeningByIoControlFromProtectedProcess": false,
      "checkHandleOpeningByIoControlForFiles": true,
      "checkHandleOpeningByIoControlForProcesses": true,
      "checkHandleOpeningByIoControlForRegistry": true
    },
    "hostsFileComBypassDetection": {
      "maxHostsFileSize": 51200,
      "monitorHostsFile": true,
      "stringsToMonitor": [
        "https://usea1-purple.sentinelone.net",
        "",
        "sentinelone.net"
      ]
    },
    "hostsFileComBypassProtection": {
      "enableAfterDetection": true,
      "enableDnsHooks": true,
      "enableWithoutDetection": false,
      "verboseLogging": false
    },
    "hvciDriverBlockingAutoEnable": true,
    "hvciDriverBlockingEnabled": false,
    "hvciDriverBlockingTelemetry": true,
    "onlineCertRevocation": false,
    "protectAltitudeHijacking": true,
    "protectEfiVolume": false,
    "protectElamPolicyControl": true,
    "protectElamPolicyPolicies": false,
    "protectFilesFromKernelOperations": false,
    "protectInpcRdataSection": true,
    "protectInpcTextSection": true,
    "protectNTdllRdataSection": false,
    "protectProcessesFromKernelOperations": false,
    "protectRegistryFromKernelOperations": false,
    "tolerantDriverBlockingInBoot": true,
    "unprotectByApprovedProcessConfig": {
      "blockOperationByModel": false,
      "queryModel": true
    },
    "updateElamDbOnVerdictChange": true,
    "useBaselineDriverRules": true,
    "useTrustLabelForCommunicationPort": true,
    "useTrustLabelForNetworkMonitorDevice": true,
    "useTrustLabelForProtectedObjects": true,
    "vetoBindLinks": true,
    "wdacPolicyModificationConfig": {
      "blockModifications": false,
      "customerFacingLogEnabled": true,
      "scanModifiedPolicyFiles": true,
      "telemetryEnabled": true
    },
    "wintrustPolicySettings": 146432
  },
  "apcExclusionVerbose": true,
  "apcGetAtomProtected": false,
  "apcProtected": true,
  "apcRelinking": true,
  "apcShellcodeProtected": true,
  "autoDeployVerboseLogging": false,
  "autoFileUpload": {
    "dumpsBatchSize": 1,
    "enabled": false,
    "maxChunkSize": 0,
    "maxFileSize": 0,
    "pesBatchSize": 1
  },
  "autoFileUploadConfig": {
    "allowSigned": false,
    "collectTelemetry": true,
    "dailyLimit": 0,
    "enabled": false,
    "maxCacheRecordsCount": 8192,
    "maxDiskUsage": 0,
    "maxFileSize": 0,
    "maxPendingFiles": 512,
    "uploadAds": true,
    "uploadBenignLoadedDlls": false,
    "uploadBenignSignedNotVerifiedLoadedDlls": false,
    "uploadLoadedDlls": true,
    "uploadMaliciousNonExecutableFiles": false,
    "uploadOnEveryProcessCreation": false,
    "uploadOnWriteExecutableFiles": false,
    "validDays": 30
  },
  "automaticResponses": [
    "mitigation.none"
  ],
  "avoidDumpUpload": false,
  "avoidOplockBreak": true,
  "avoidRenameForApps": 1,
  "avoidTIHooking": true,
  "blacklistOverridesThirdPartySignatureSuppression": true,
  "blockManualHardLinks": false,
  "blockSuspiciousPipes": true,
  "bootTimeDuration": 60,
  "bruteForceConfig": {
    "allowedAuthenticationAttempts": 20,
    "authenticationTimeThreshold": 60,
    "connectionConfig": {
      "allowedAttempts": 10,
      "validationInterval": 10
    },
    "connectionDetectionEnabled": false,
    "detectionEnabled": true,
    "externalAttackerThreshold": 5,
    "isVerbose": false,
    "minAuthenticationAttemptsBetweenEvents": 500,
    "netlogonAuthenticationTimeThreshold": 60,
    "netlogonDetectionEnabled": true,
    "netlogonMaxAuthenticationAttempts": 10,
    "netlogonMaxAuthenticationAttemptsPatched": 250,
    "outgoingConnectionConfig": {
      "allowedAttempts": 10,
      "validationInterval": 10
    },
    "outgoingConnectionDetectionEnabled": false
  },
  "collectDv": true,
  "collectStackTrace": false,
  "deepVisibility": {
    "behavioralIndicators": {
      "operation": 2,
      "squash": {
        "enabled": true
      }
    },
    "crossProcess": {
      "accessCacheMaxSize": 1000,
      "duplicateProcess": { "enabled": true },
      "duplicateThread": { "enabled": true },
      "hashBasedLRU": true,
      "openProcess": {
        "accessDenylist": [4096],
        "enabled": true
      },
      "remoteThread": true
    },
    "dns": {
      "extended": false,
      "operation": true,
      "squash": { "enabled": true }
    },
    "enabled": true,
    "enrichIncompleteProcesses": true,
    "eventLog": {
      "collectAllProviders": false,
      "enabled": true,
      "levels": [1, 2],
      "sendOriginalXML": false,
      "squash": { "enabled": true }
    },
    "exclusions": { "enabled": true },
    "file": {
      "creation": true,
      "deletion": true,
      "malicious": true,
      "modification": true,
      "rename": true,
      "scan": 2
    },
    "http": {
      "operation": true,
      "squash": { "enabled": true }
    },
    "kernel": {
      "driverLoad": true,
      "ioctl": true,
      "openSentinelProcess": false
    },
    "maxEventsInPacket": 1000,
    "maxPacketsInQueue": 15000,
    "namedPipe": {
      "connection": { "local": true, "remote": true },
      "creation": true,
      "squash": { "enabled": true }
    },
    "process": {
      "creation": true,
      "exit": false,
      "injection": 0,
      "modification": true,
      "termination": true
    },
    "registry": {
      "keyCreated": true,
      "keyDelete": true,
      "keyExport": true,
      "keyImport": true,
      "keyRename": true,
      "keySecurityChanged": true,
      "maxDataSizeBytes": 100,
      "squash": { "enabled": true },
      "valueCreated": true,
      "valueDelete": true,
      "valueModified": true
    },
    "scripts": {
      "batch": false,
      "enabled": true,
      "javaScript": false,
      "maxSizeBytes": 32768,
      "powershell": true,
      "python": false,
      "vba": false,
      "vbScript": false
    },
    "sendIntervalSeconds": 180,
    "tcpv4": {
      "incoming": true,
      "listen": true,
      "outgoing": true,
      "squash": { "enabled": true }
    },
    "tcpv6": {
      "incoming": false,
      "listen": false,
      "outgoing": false,
      "squash": { "enabled": true }
    }
  },
  "denyLsassRead": true,
  "denyLsassReadFromWerFaultSecure": true,
  "denyLsassWriteThirdPartyOnly": true,
  "detectAppDomainManagerInjection": true,
  "detectLsassRead": true,
  "detectPseudoConsoleCreation": true,
  "deviceControl": {
    "enabled": false,
    "enablePdoFilter": true,
    "notifyUI": true,
    "report": ["blocked", "connected", "disconnected", "configured-read-only"],
    "reportSuppressionTime": 900
  },
  "disableMode": {
    "allowAutoDisable": true,
    "autoDisableMgmtNotifications": true,
    "crashCount": 10,
    "deadlockCount": 10,
    "enableDeadLockWatchDog": true,
    "fallbackToUnprotectedAllowed": true,
    "protectedAutoDisable": true,
    "recoverFromAutoDisableEnabled": true
  },
  "dllConfig": {
    "edrEnabled": true,
    "hookHeapAllocator": true,
    "ieProtection": true,
    "monitorClipboard": true
  },
  "dnsPoisoningTrap": {
    "enabled": true,
    "hostname": "*-~.local",
    "maxInterval": 90,
    "minInterval": 30,
    "service": "llmnr",
    "timeoutSeconds": 60
  },
  "dotNetProtection": {
    "enabled": true,
    "enableDelayedHooks": true,
    "sendCLRRuntimeHostEvent": true
  },
  "dpi": {
    "enabled": true,
    "verboseLogging": false
  },
  "enablePassthroughEvent": true,
  "enableVerdictsAsset": true,
  "enableYaraMemoryScanner": true,
  "enginesWantedState": {
    "dataFiles": "local",
    "driverBlocking": "local",
    "executables": "local",
    "exploits": "local",
    "fileLess": "local",
    "lateralMovement": "local",
    "penetration": "local",
    "preExecution": "local",
    "preExecutionSuspicious": "local",
    "remoteShell": "local",
    "reputation": "local"
  },
  "exclusionConfig": {
    "enable": true,
    "macroExclusionsEnable": true,
    "macroExclusionsSendTelemetry": true
  },
  "firewallControl": {
    "enabled": true,
    "locationAware": true,
    "notifyUI": false,
    "permitBits": true,
    "supportFqdnRules": true,
    "supportUnifiedRules": true
  },
  "firewallLogging": {
    "aggregationIntervalSeconds": 60,
    "reportLog": false,
    "reportMgmt": false,
    "reportPermittedPacketsToEventLog": false
  },
  "fullDiskScanConfig": {
    "automaticScanExternalDrivesEnabled": false,
    "blacklistScan": true,
    "extendedScan": true,
    "scanContextMenuItem": true,
    "scanningThreadsPercentage": 50,
    "workerCpuLimit": 30
  },
  "hooking": true,
  "idr": {
    "checkIDRExclusions": true,
    "dynamicHooks": true,
    "idrEnabled": false
  },
  "indirectSyscalls": {
    "detectionEnabled": true,
    "monitorFileSystemCallbacks": true,
    "monitorModuleLoadCallback": true,
    "monitorObjectManagerCallbacks": true,
    "monitorProcessCallbacks": true,
    "monitorRegistryCallbacks": true,
    "monitorThreadCallbacks": true
  },
  "injection": true,
  "inlineFileScannerConfig": {
    "mode": 3,
    "shouldInlineScanPEInformation": true,
    "shouldInlineScanPEInformationImageLoad": true
  },
  "inlineScriptScannerConfig": {
    "enabled": true,
    "maxScriptSizeToScanInBytes": 60000,
    "minScriptSizeToScanInBytes": 30
  },
  "javaProtectionConfig": {
    "enableJavaAgent": true,
    "enableLog4ShellExtendedDetection": true,
    "enableSpring4ShellDetection": true,
    "preventLog4ShellJNDI": false,
    "preventLog4ShellRCE": false,
    "preventSpring4Shell": false
  },
  "keepAliveFailCount": 8,
  "keepAliveInterval": 30,
  "lateralMovementConfig": {
    "blockSmbLateralMovement": false
  },
  "locationAwareness": {
    "enabled": true,
    "reportLocations": true
  },
  "logging": {
    "maxFileCount": 50,
    "maxFileSize": 100,
    "maxTotalSize": 1500,
    "mode": "binary",
    "rotate": true,
    "rotationInterval": 60
  },
  "mbrMon": true,
  "mbrProtection": true,
  "mbrProtectionConfig": {
    "allowVirtualDiskServiceWrites": true,
    "protectGPT": false,
    "protectPortableDevices": false,
    "protectRawVolumes": true,
    "protectUnbootablePartitions": false,
    "protectVirtualDisks": false
  },
  "mitigation": {
    "completePendingMitigations": true,
    "forceCleanAllModules": true,
    "killPostMitigation": true,
    "mitigateFilesByFileId": true,
    "quarantineByFileID": true,
    "quarantinePersistence": true,
    "remediateTasks": true,
    "remediateWMI": true,
    "removeMacros": false,
    "restoreHardLinks": true
  },
  "monitorBehavioralEvents": true,
  "networkMonitorConfig": {
    "enabled": true
  },
  "networkQuarantineControl": {
    "locationAware": false,
    "rulesEnabled": false
  },
  "passphrase": {
    "require": true
  },
  "powershellProtection": true,
  "ppl": true,
  "printNightmareConfig": {
    "detection": true,
    "prevention": false
  },
  "rangerConfig": {
    "enabled": true,
    "logLevel": "Info",
    "telemetry": true
  },
  "ransomDecoyFilesConfig": {
    "enabled": true,
    "enableRecoveringDecoysFromRecycleBin": true,
    "enableSendingDecoysToKernel": true,
    "enableSharedFoldersDecoys": false
  },
  "rdpGroupTagging": true,
  "rebootlessConfig": {
    "injection": true,
    "isEnabled": true,
    "recoverCorruptedDatabase": true
  },
  "remoteScriptOrchestration": {
    "dailyDownloadLimit": 524288000,
    "dailyLimit": 524288000,
    "maxFileSize": 262144000,
    "suppressDynamicThreats": true
  },
  "remoteShell": {
    "enabled": true,
    "logTranscript": false,
    "runAsSystem": false
  },
  "safeBootProtection": true,
  "scanModifiedFiles": true,
  "showAgentUI": true,
  "snapshotIntervalMinutes": 240,
  "stackPivotProtection": true,
  "vssConfig": {
    "agentVssWriters": true,
    "vssProtection": true,
    "vssProtectOnlyAgentSnapshots": true
  },
  "vssSnapshots": true,
  "wscRegisterAsAS": true,
  "wscRegisterAsFW": true,
  "wscRegistration": true
};
