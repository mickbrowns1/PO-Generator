"use client";

import { ConfigObject } from "@/lib/types";

type Platform = "windows" | "linux" | "macos";

interface CustomOverrideProps {
  onApplyTemplate: (label: string, json: string) => void;
  platform?: Platform;
}

const j = (obj: object) => JSON.stringify(obj, null, 2);

type Template = { label: string; category: string; json: string };

// ─── Windows Templates ───────────────────────────────────────────────
const WINDOWS_TEMPLATES: Template[] = [
  // Special Images
  { label: "Spawners", category: "Special Images", json: j({ specialImages: { spawners: [{ path: "%ProgramFiles%\\\\Example\\\\app.exe", publisher: "Example Corp", description: "Example Application" }] } }) },
  { label: "Add Allowed SymLink", category: "Special Images", json: j({ specialImages: { add: { allowedSymLinkWithSystemPath: ["\\\\Device\\\\HarddiskVolume*\\\\Windows\\\\example.exe"] } } }) },
  { label: "Remove Allowed SymLink", category: "Special Images", json: j({ specialImages: { remove: { allowedSymLinkWithSystemPath: ["\\\\Device\\\\HarddiskVolume*\\\\Windows\\\\example.exe"] } } }) },
  // Deep Visibility
  { label: "Event Log Channels & Providers", category: "Deep Visibility", json: j({ deepVisibility: { eventLog: { channels: { Application: [], Security: [], System: [], Setup: [], "Forwarded Events": [], "Microsoft-Windows-Bits-Client/Operational": [] }, collectAllProviders: false, providers: ["Microsoft-Windows-Bits-Client"], levels: [], sendOriginalXML: true } } }) },
  { label: "WEL Channels & Event IDs", category: "Deep Visibility", json: j({ deepVisibility: { eventLog: { channels: { Security: [4624, 4625, 4648, 4672, 4688], System: [], Application: [], "Microsoft-Windows-PowerShell/Operational": [4103, 4104] } } } }) },
  { label: "WEL Levels", category: "Deep Visibility", json: j({ deepVisibility: { eventLog: { levels: [1, 2, 3] } } }) },
  { label: "Extended XML Collection", category: "Deep Visibility", json: j({ deepVisibility: { eventLog: { sendOriginalXML: true } } }) },
  { label: "Collect All Providers", category: "Deep Visibility", json: j({ deepVisibility: { eventLog: { collectAllProviders: true } } }) },
  { label: "Custom WEL Providers", category: "Deep Visibility", json: j({ deepVisibility: { eventLog: { providers: ["Microsoft-Windows-PowerShell", "Microsoft-Windows-Sysmon"] } } }) },
  { label: "Script Telemetry", category: "Deep Visibility", json: j({ deepVisibility: { scripts: { enabled: true, powershell: true, batch: false, python: false, vbScript: false, vba: false, javaScript: false, maxSizeBytes: 32768 } } }) },
  { label: "DV Proxy URL", category: "Deep Visibility", json: j({ dv_proxy_url: "http://proxy.example.com:8080" }) },
  // Behavioral Logic
  { label: "Logic Verdict Override", category: "Behavioral Logic", json: j({ logicClassifierConfigVector: { logicsClassification: [{ logicName: "EXAMPLE_LOGIC_NAME", verdict: "SUPPRESS" }] } }) },
  // Indicators & Detectors
  { label: "Indicator Override", category: "Indicators & Detectors", json: j({ indicators: { EXAMPLE_INDICATOR_NAME: { enabled: false, verdict: "SUPPRESS" } } }) },
  { label: "Detector Override", category: "Indicators & Detectors", json: j({ detectors: { EXAMPLE_DETECTOR_NAME: { enabled: false, verdict: "SUPPRESS" } } }) },
  // Exclusions
  { label: "OS Event Path Exclusions", category: "Exclusions", json: j({ exclusionConfig: { oseventsExclusions: [{ logicName: "EXAMPLE_LOGIC", imagePaths: ["%ProgramFiles%\\\\Example\\\\app.exe"] }] } }) },
  { label: "Reader Spawn CLI Exclusions", category: "Exclusions", json: j({ exclusionConfig: { macroPatternsList: [{ pattern: "example.exe *", description: "Exclude example process spawned by Office macro" }] } }) },
  { label: "Custom File Extension Monitoring", category: "Exclusions", json: j({ monitorConfig: { customFileExtensionsConfig: { fileExtensions: [".custom", ".myext"] } } }) },
  // Credential Protection
  { label: "LSASS Protection", category: "Credential Protection", json: j({ denyLsassRead: true, detectLsassRead: true, denyLsassReadFromWerFaultSecure: true, denyLsassWriteThirdPartyOnly: true }) },
  { label: "SAM / Syskey / Registry Hive Protection", category: "Credential Protection", json: j({ monitorConfig: { protectSamSave: true, protectSamSaveRemote: true, protectSyskeyQuery: true, protectSyskeyQueryRemote: true, preventRegSaveUserHive: true, preventRemoteRegSaveUserHive: true } }) },
  // Exploit Prevention
  { label: "PrintNightmare Prevention", category: "Exploit Prevention", json: j({ printNightmareConfig: { detection: true, prevention: true } }) },
  { label: "PIC Trap (Cobalt Strike / Meterpreter)", category: "Exploit Prevention", json: j({ PICTrap: true }) },
  { label: "Preemptive Content Block", category: "Exploit Prevention", json: j({ monitorConfig: { preemptionConfig: { enablePreemptiveContentBlock: true, enableRemotePreemptiveContentBlock: true } } }) },
  // Deep Hooking
  { label: "Deep Hooking (IC)", category: "Deep Hooking", json: j({ deepHookingConfig: { deepHooking: true, deepHooking_x86: true, deepHooking_WOW64: true, thirdPartyOnly: false } }) },
  // Detection Extensions
  { label: "Detection Extensions", category: "Detection Extensions", json: j({ detectionExtensionsConfig: { credentialsQuery: true, networkUdpSend: false, serviceModification: false, triggerNetworkInfo: false } }) },
  // Scanning
  { label: "Go Scanner", category: "Scanning", json: j({ enableGoScanner: true }) },
  { label: "Static AI File Size & Types", category: "Scanning", json: j({ staticConfig: { maxFileSize: 31457280, lnkStatus: 2, officeStatus: 2, pdfStatus: 2, peStatus: 2 } }) },
  // Agent UI
  { label: "Agent UI Capabilities", category: "Agent UI", json: j({ uiConfig: { capabilities: { deviceTab: false, supportTab: false, agentDetails: true, quarantineTab: true, threatsHistory: true } } }) },
  // Injection
  { label: "Disable Injection (Interop)", category: "Injection", json: j({ injection: false, nativeWow64Injection: false }) },
  // Named Pipes
  { label: "Named Pipe Relinking + NPFS", category: "Named Pipes", json: j({ monitorConfig: { registerNPFS: true }, relinking: { namedPipes: true } }) },
  // Disk & Diagnostics
  { label: "Disk Space Reservation", category: "Disk & Diagnostics", json: j({ diskSpaceReserver: { enabled: true, sizeInMB: 3072 } }) },
  { label: "Research Dumps (ADT)", category: "Disk & Diagnostics", json: j({ researchDumps: { enabled: true, dumpLimitationPerProcess: 2, maximalAccumulatedSizeInMB: 1024, maximalTimeOnDiskInHours: 72 } }) },
  { label: "Health Telemetry", category: "Disk & Diagnostics", json: j({ healthCollectorConfig: { collectHealthTelemetry: true, healthTelemetryCollectionFrequency: 240 } }) },
  // Communication
  { label: "Keep-Alive Interval & Fail Count", category: "Communication", json: j({ keepAliveInterval: 30, keepAliveFailCount: 8 }) },
  { label: "Proxy Config", category: "Communication", json: j({ communicatorConfig: { forceProxy: true, telemetry: true } }) },
  { label: "DLP Settings (Support-only)", category: "Communication", json: j({ dlp: { enabled: false } }) },
];

// ─── Linux Templates ─────────────────────────────────────────────────
const LINUX_TEMPLATES: Template[] = [
  // Anti-Tamper
  { label: "Anti-Tamper", category: "Anti-Tamper", json: j({ "anti-tamper_enabled": true, "anti_tamper_engine_enabled": true }) },
  { label: "Anti-Tamper Allowed Executables", category: "Anti-Tamper", json: j({ "anti-tamper_executables_allowed_to_modify_files": ["/usr/bin/example"] }) },
  // Deep Visibility
  { label: "Enable Deep Visibility", category: "Deep Visibility", json: j({ "dv_enabled": true, "dv_telemetry": true }) },
  { label: "DV File Events", category: "Deep Visibility", json: j({ "dv_file_creation": true, "dv_file_deletion": true, "dv_file_modification": true, "dv_file_rename": true, "dv_file_malicious": false }) },
  { label: "DV Network Events", category: "Deep Visibility", json: j({ "dv_dns_operation": true, "dv_http_operation": true, "dv_tcp_incoming": true, "dv_tcp_outgoing": true, "dv_tcp_listen": true, "dv_tcp_v6_incoming": false, "dv_tcp_v6_outgoing": false }) },
  { label: "DV Process Events", category: "Deep Visibility", json: j({ "dv_process_creation": true, "dv_process_exit": false, "dv_process_termination": true, "dv_persistency_operation": true }) },
  { label: "DV Script Events", category: "Deep Visibility", json: j({ "dv_scripts": true, "dv_script_event_max_content_size": 16384, "dv_script_event_types": ["python", "sh", "bash", "zsh", "ksh", "perl"] }) },
  { label: "DV Behavioral Indicators", category: "Deep Visibility", json: j({ "dv_behavioral-indicator": true }) },
  { label: "DV Event Optimization", category: "Deep Visibility", json: j({ "dv_events-optimization": true, "dv_events-optimization-dns-aggregation": true, "dv_events-optimization-tcpv4-aggregation": true, "dv_events-optimization-focused-dv": true, "dv_events-optimization-whitelist": true }) },
  { label: "DV Data Masking", category: "Deep Visibility", json: j({ "dv_data-mask_all": true }) },
  // Ransomware
  { label: "Ransomware Engine", category: "Ransomware", json: j({ "ransomware_engine_enabled": true, "ransomware_engine_decision_threshold": 100, "ransomware_engine_fs_activity_activity_mode": "on", "ransomware_engine_fs_activity_sensitivity": "medium" }) },
  { label: "Ransomware K8s", category: "Ransomware", json: j({ "ransomware_engine_k8s_enabled": true, "ransomware_engine_k8s_entropy_calc_enabled": true }) },
  { label: "Decoy Files (Predefined)", category: "Ransomware", json: j({ "decoy_files_predefined_paths_enabled": true, "decoy_files_monitor_interval": 60, "decoy_files_suffixes": [".pdf", ".ini", ".log", ".html"] }) },
  { label: "Decoy Files (Custom Paths)", category: "Ransomware", json: j({ "decoy_files_manual_paths_enabled": true, "decoy_files_manual_paths": ["/opt/mydata", "/srv/important"] }) },
  // Brute Force
  { label: "Local Brute Force Detection", category: "Brute Force", json: j({ "local_brute_force_detection_enabled": true, "local_brute_force_attempts_number": 30, "local_brute_force_time_period": 180, "local_brute_force_timeout": 86400 }) },
  { label: "SSH Brute Force Detection", category: "Brute Force", json: j({ "remote_ssh_brute_force_detection_enabled": true, "remote_ssh_brute_force_attempts_number": 30, "remote_ssh_brute_force_time_period": 180, "remote_ssh_brute_force_timeout": 86400 }) },
  // Mitigation
  { label: "Mitigation Settings", category: "Mitigation", json: j({ "mitigation_enabled": true, "mitigation_kill": true, "mitigation_quarantine": true, "mitigation_mitigate-suspicious": false, "mitigation_network-quarantine": false }) },
  // eBPF
  { label: "eBPF Settings", category: "eBPF", json: j({ "ebpf_enabled": true, "ebpf_exclusions_enabled": true, "ebpf_mount_exclusions_enabled": true }) },
  // Engines
  { label: "Scan Engines", category: "Engines", json: j({ "engines_dfi": true, "engines_dynamic": true, "encryption_utility_heuristic_enabled": true }) },
  { label: "Static Scan Max File Size", category: "Engines", json: j({ "static-scan_max-file-size": 31457280 }) },
  // Events
  { label: "Enable Event: elf_scan", category: "Events", json: j({ "events": { "elf_scan": { "enabled": true } } }) },
  { label: "Kprobe Enable/Disable", category: "Events", json: j({ "kprobes_execve_enabled": true }) },
  { label: "Enable Event: kill", category: "Events", json: j({ "events": { "kill": { "enabled": true, "ebpf": true } } }) },
  { label: "Enable Event: file_chattr", category: "Events", json: j({ "events": { "file_chattr": { "enabled": true, "ebpf": true } } }) },
  { label: "Enable Event: file_chown", category: "Events", json: j({ "events": { "file_chown": { "enabled": true, "ebpf": true } } }) },
  { label: "Enable Event: setuid_root", category: "Events", json: j({ "events": { "setuid_root": { "enabled": true, "ebpf": true } } }) },
  { label: "Enable Event: curl_set_proxy", category: "Events", json: j({ "events": { "curl_set_proxy": { "enabled": true, "ebpf": true } } }) },
  { label: "Enable Event: network_info_query", category: "Events", json: j({ "events": { "network_info_query": { "enabled": true, "ebpf": true } } }) },
  { label: "Enable Event: prctl_process_rename", category: "Events", json: j({ "events": { "prctl_process_rename": { "enabled": true, "ebpf": true } } }) },
  { label: "Enable Event: file_time_change", category: "Events", json: j({ "events": { "file_time_change": { "enabled": true, "ebpf": true } } }) },
  // Firewall
  { label: "Firewall Control", category: "Firewall", json: j({ "fw-control_enabled": true, "fw-control_network-quarantine": false, "fw-control_report-log": true, "fw-control_report-mgmt": true }) },
  // Network
  { label: "Network Control", category: "Network", json: j({ "network_control_enabled": true, "network_control_backend": "iptables", "network_control_stateful": false }) },
  { label: "Network Quarantine", category: "Network", json: j({ "nq-control_enabled": true, "nq-dns_hardening-enabled": true, "nq-dns_hardening-max_consecutive_count": 5 }) },
  // Containers
  { label: "Container Support", category: "Containers", json: j({ "containers_supported": true, "container_native_exclusions_enabled": true, "fetch_metadata_from_container_runtime_service": true }) },
  { label: "Drift Detection", category: "Containers", json: j({ "drift_engine_enabled": true, "immutability_engine_enabled": true }) },
  // Fork Bomb
  { label: "Fork Bomb Prevention", category: "Security", json: j({ "fork_bomb_prevention_enabled": true, "fork_bomb_count_threshold": 1000, "fork_bomb_time_window_ms": 500 }) },
  // Forensics
  { label: "Forensics", category: "Forensics & Diagnostics", json: j({ "forensics_enabled": true, "forensics_maximum-daily-upload": 21474836480, "forensics_maximum-file-size-upload": 10737418240 }) },
  // Log Collector
  { label: "Log Collector", category: "Forensics & Diagnostics", json: j({ "log_collector": { "enabled": true, "batch_send_interval": 60, "batch_max_logs_count": 10000, "scan_interval": 30 } }) },
  { label: "Log Collection Max Line Length", category: "Forensics & Diagnostics", json: j({ "log_collector": { "max_line_length": 65536 } }) },
  { label: "Log File Max Size", category: "Forensics & Diagnostics", json: j({ "log_sentinel_max-size": 10485760 }) },
  { label: "Remote Profiler Max File Size", category: "Forensics & Diagnostics", json: j({ "profiler-max_file_size": 104857600 }) },
  { label: "Auto Dump Collection", category: "Forensics & Diagnostics", json: j({ "auto_dump_collection_enabled": true, "auto_dump_collection_throttle_interval": 240 }) },
  // Health Center
  { label: "Health Center", category: "Forensics & Diagnostics", json: j({ "health_center": { "enabled": true, "connectivity": { "enabled": true, "interval": 1800 }, "disk_metrics": { "enabled": true, "interval": 86400 } } }) },
  // Resource Limits
  { label: "Memory Limits", category: "Resource Limits", json: j({ "resource_memory-limit": 5368709120, "resource_memory-limit-percent": 10, "resource_memory-monitor-mode": "s1-agent" }) },
  { label: "CPU Limit (Solaris)", category: "Resource Limits", json: j({ "resource_cpu-limit": 25 }) },
  { label: "CPU Limit (Irix)", category: "Resource Limits", json: j({ "resource_cpu_limit_irix": 100 }) },
  { label: "Perf Buffer Size", category: "Resource Limits", json: j({ "perf_buffer-size": 4096 }) },
  // File Monitoring
  { label: "File Read Watch List", category: "File Monitoring", json: j({ "file_read_files_watch_list": ["/etc/shadow", "/etc/hosts", "/etc/ssh/ssh_config", "/root/.ssh/id_*", "/home/*/.ssh/id_*"] }) },
  { label: "File Read Extended Watch List", category: "File Monitoring", json: j({ "file_read_extended_monitoring_enabled": true, "file_read_extended_files_watch_list": ["/etc/passwd", "/etc/group", "/etc/sudoers"] }) },
  { label: "File Integrity Monitoring", category: "File Monitoring", json: j({ "file_integrity_enabled": true }) },
  { label: "Mount Type Exclusions", category: "File Monitoring", json: j({ "mounts_excluded-types": ["nfs", "cifs", "tmpfs"] }) },
  // RSO
  { label: "Remote Script Orchestration", category: "Remote Operations", json: j({ "rso_enabled": true, "rso_daily-upload-limit": 524288000, "rso_daily-download-limit": 524288000 }) },
  { label: "Remote Shell", category: "Remote Operations", json: j({ "remote_shell_enabled": true }) },
  // Auto File Upload
  { label: "Auto File Upload", category: "Remote Operations", json: j({ "auto_file_upload_enabled": true, "auto_file_upload_max-file-size": 10737418240, "auto_file_upload_daily-limit": 53687091200 }) },
  // Dynamic Spawners
  { label: "Dynamic Spawners", category: "Security", json: j({ "dynamic_spawners": ["/usr/bin/example_app"] }) },
  // Telemetry
  { label: "Telemetry Performance", category: "Telemetry", json: j({ "telemetry_enabled": true, "telemetry_performance_enabled": true, "telemetry_performance_enabled_agent": true, "telemetry_performance_interval": 1 }) },
  // PAM
  { label: "PAM Service Exclusions", category: "Security", json: j({ "pam_service_exclusions": ["systemd-user", "cron", "custom-service"] }) },
  // Disk Usage
  { label: "Disk Usage Monitoring", category: "Resource Limits", json: j({ "disk_usage_monitor-enabled": true, "disk_usage_upper-limit": 95, "disk_usage_fs-reserved": 3 }) },
  // Scanning
  { label: "Scan On Rename", category: "Engines", json: j({ "scan-on-rename": true }) },
  // Informational Alerts
  { label: "Informational Alerts", category: "Telemetry", json: j({ "informational_alerts_on": true, "informational_alerts_per_day": 4, "informational_alerts_verbosity_level": 2 }) },
  // Indicators & Detectors
  { label: "Detector Override (Lua)", category: "Indicators & Detectors", json: j({ "detectors": { "EXAMPLE_DETECTOR_NAME": { "enabled": true, "verdict": "DETECT" } } }) },
  // Communication
  { label: "Keep-Alive Interval & Fail Count", category: "Communication", json: j({ "keepAliveInterval": 30, "keepAliveFailCount": 8 }) },
  { label: "Proxy Config", category: "Communication", json: j({ "communicatorConfig": { "forceProxy": true, "telemetry": true } }) },
  { label: "DLP Settings (Support-only)", category: "Communication", json: j({ "dlp": { "enabled": false } }) },
];

// ─── macOS Templates ─────────────────────────────────────────────────
const MACOS_TEMPLATES: Template[] = [
  // Deep Visibility
  { label: "Enable Deep Visibility", category: "Deep Visibility", json: j({ DeepVisibility: { Enabled: true, FilterEvents: true } }) },
  { label: "DV Collection — File Events", category: "Deep Visibility", json: j({ DeepVisibility: { CollectFileCreation: 1, CollectFileDeletion: 1, CollectFileModification: 1, CollectFileRename: 1, CollectFileContent: 1 } }) },
  { label: "DV Collection — Process Events", category: "Deep Visibility", json: j({ DeepVisibility: { CollectProcessCreation: 1, CollectProcessExit: 1, CollectProcessTermination: 1, CollectProcessInjection: 1, CollectModuleLoad: 1 } }) },
  { label: "DV Collection — Network Events", category: "Deep Visibility", json: j({ DeepVisibility: { CollectDNS: 1, CollectHttp: 1, CollectTCPv4Incoming: 1, CollectTCPv4Outgoing: 1, CollectTCPv4Listen: 1, CollectTCPv6Incoming: 1, CollectTCPv6Outgoing: 1, CollectTCPv6Listen: 1 } }) },
  { label: "DV Collection — User Events", category: "Deep Visibility", json: j({ DeepVisibility: { CollectUserLogin: 1, CollectUserLogout: 1, CollectSu: 1, CollectSudo: 1 } }) },
  { label: "DV Collection — Directory Services", category: "Deep Visibility", json: j({ DeepVisibility: { CollectDirectoryServiceUserCreate: 1, CollectDirectoryServiceUserDelete: 1, CollectDirectoryServiceGroupCreate: 1, CollectDirectoryServiceGroupDelete: 1, CollectDirectoryServicePasswordModify: 1 } }) },
  { label: "DV Collection — macOS-specific", category: "Deep Visibility", json: j({ DeepVisibility: { CollectApplicationInstall: 1, CollectApplicationUninstall: 1, CollectBackgroundTaskManagement: 1, CollectGatekeeperUserOverride: 1, CollectProfileAdd: 1, CollectProfileRemove: 1, CollectTCCModify: 1, CollectVolumeMount: 1, CollectVolumeUnmount: 1, CollectXPCConnect: 1 } }) },
  { label: "DV DNS Monitoring", category: "Deep Visibility", json: j({ DeepVisibility: { EnableDNSMonitoring: true, DNSMonitoringSource: 2 } }) },
  { label: "DV Aggregation Settings", category: "Deep Visibility", json: j({ DeepVisibility: { AggregateBehavioralIndicatorsEvents: true, AggregateDNSEvents: true, AggregateFileCreationEvents: true, AggregateFileDeletionEvents: true, AggregateFileModificationEvents: true, AggregateHTTPEvents: true, AggregateTCPv4Events: true, AggregateTCPv6Events: true } }) },
  { label: "DV Shell Script Content", category: "Deep Visibility", json: j({ DeepVisibility: { CollectShellScriptFileContent: 1, FileContentMaxSize: 32768 } }) },
  // Detection
  { label: "Static AI Scanning", category: "Detection", json: j({ Detection: { StaticAIScan: true, StaticAIScanMachO: true, StaticAIScanELF: true, StaticAIScanPE: true, StaticAIScanPDF: true, StaticAIScanOffice: true, StaticAIScanArchives: true, StaticAIScanEnhanced: true } }) },
  { label: "Static AI Scan Policies", category: "Detection", json: j({ Detection: { StaticAIMachOScanPolicy: "Validate", StaticAIELFScanPolicy: "Validate", StaticAIPEScanPolicy: "Validate", StaticAIPDFScanPolicy: "Validate", StaticAIOfficeScanPolicy: "Validate", StaticAIArchiveScanPolicy: "Validate" } }) },
  { label: "Script Detection", category: "Detection", json: j({ Detection: { Scripts: { applescript: true, javascript: true, perl: true, python: true, ruby: true, shell: true, vba: true } } }) },
  { label: "Detection Ignore Categories", category: "Detection", json: j({ Detection: { IgnoreDownloaders: false, IgnoreHackTools: false, IgnoreMiners: false, IgnorePackers: false, IgnorePUPs: false, IgnoreSuspiciousTools: false } }) },
  { label: "Informational Alerts", category: "Detection", json: j({ Detection: { InformationalAlertsEnabled: true, InformationalAlertsPerDay: 4, InformationalAlertsVerbosityLevelThreshold: 2 } }) },
  { label: "Preemptive Block", category: "Detection", json: j({ Detection: { StaticAIPreemptiveBlock: true } }) },
  { label: "Scan On Write", category: "Detection", json: j({ Detection: { ScanOnWrite: true } }) },
  { label: "Signatures DB", category: "Detection", json: j({ Detection: { SignaturesDB: true } }) },
  { label: "Threat Logs", category: "Detection", json: j({ Detection: { ThreatLogsEnabled: true, ThreatLogsAggregationTimeInterval: 120, ThreatLogsUploadSizeLimit: 10485760 } }) },
  // Device Control
  { label: "Device Control", category: "Device Control", json: j({ DeviceControl: { Enabled: true, BluetoothControlEnabled: true, BLEControlEnabled: false, NotifyUI: true } }) },
  // Firewall
  { label: "Firewall Settings", category: "Firewall", json: j({ Firewall: { Enabled: true, LocationAware: true, Log: true, Report: true, SupportFQDNRules: true } }) },
  { label: "Allow PF Filtering", category: "Firewall", json: j({ Firewall: { AllowPFFiltering: true } }) },
  { label: "Allow Network Extension Load", category: "Firewall", json: j({ Firewall: { AllowNetworkExtensionLoad: true } }) },
  // Agent UI
  { label: "Agent UI — Show / Hide", category: "Agent UI", json: j({ AgentUI: { ShowUI: true, ShowThreatsNotifications: true, ShowSuspiciousThreats: true, ShowDeviceControlNotifications: true, ShowDeviceControlEvents: false, ShowAutomaticExternalVolumeScans: true } }) },
  { label: "Agent UI Capabilities", category: "Agent UI", json: j({ AgentUI: { Capabilities: { ContactSupport: false, DeviceControl: false, FunctionalProblem: false, QuarantinedFiles: true } } }) },
  { label: "Support Contact Info", category: "Agent UI", json: j({ AgentUI: { SupportContactCompany: "Your Company", SupportContactEmail: "support@example.com", SupportContactPhoneNumber: "+1-555-0100", SupportContactWebsite: "https://support.example.com" } }) },
  // General / Anti-Tamper
  { label: "Anti-Tamper", category: "General", json: j({ General: { AntiTamperDisabled: false, AntiTamperFileEventsEnabled: true } }) },
  { label: "Protection & Subsystems", category: "General", json: j({ General: { Protection: true, DynamicSubsystem: true, StaticSubsystem: true } }) },
  { label: "CPU Usage Monitoring", category: "General", json: j({ General: { CPUUsageMonitoringEnabled: true, CPUConsumptionLimit: 250, CPUUsageSentineldHighWaterMark: 50 } }) },
  { label: "Memory Usage Monitoring", category: "General", json: j({ General: { MemoryUsageMonitoringEnabled: true, MemoryUsageSentineldHighWaterMark: 419430400 } }) },
  // Remediation
  { label: "Automatic Remediation", category: "Remediation", json: j({ Remediation: { AutomaticResponses: ["kill-threat", "quarantine-threat", "remediate-threat"], LookupDisk: false } }) },
  // Network
  { label: "Network Quarantine", category: "Network", json: j({ Network: { Quarantine: true, QuarantineRulesEnabled: true, QuarantineRulesLocationAware: true, QuarantineRulesSupportFQDN: true } }) },
  // Scanner
  { label: "Scanner Auto-Scan", category: "Scanner", json: j({ Scanner: { AutomaticallyScanRemovableMedia: true, AutomaticallyScanExternalVolumes: true, AutomaticallyScanDiskImages: true, AutomaticallyScanNetworkVolumes: false } }) },
  // Remote Operations
  { label: "Remote Shell", category: "Remote Operations", json: j({ RemoteShell: { Enabled: true } }) },
  { label: "Remote Script Orchestration", category: "Remote Operations", json: j({ RemoteScriptOrchestration: { Enabled: true, DailyLimit: 524288000, DailyDownloadLimit: 524288000, MaxFileSize: 262144000 } }) },
  // AddOns / Forensics
  { label: "Forensics", category: "Forensics", json: j({ AddOns: { ForensicsEnabled: true, ForensicsMaximumDailyUpload: 21474836480, ForensicsMaximumFileSizeUpload: 10737418240, ForensicsCPULimit: 30 } }) },
  // Binary Vault
  { label: "Binary Vault", category: "Forensics", json: j({ BinaryVault: { Enabled: true, MaximumFileSize: 262144000, UploadBenignExecutableFiles: false } }) },
  // Log Collection
  { label: "Log Collection", category: "Forensics", json: j({ LogCollection: { Enabled: true, BatchSendInterval: 60, BatchSendMaximumLogMessageCount: 10000, FilesScanInterval: 120 } }) },
  // Health Center
  { label: "Health Center", category: "Forensics", json: j({ HealthCenter: { Enabled: true, ConnectivityUpdateInterval: 1800, StateUpdateInterval: 86400 } }) },
  // Ranger
  { label: "Ranger", category: "Network", json: j({ Ranger: { Enabled: true } }) },
  // Location
  { label: "Location Reporting", category: "Network", json: j({ Location: { Enabled: true, ReportLocations: true } }) },
  // On Demand Scan
  { label: "Right-Click Scan", category: "Scanner", json: j({ OnDemandScan: { RightClickScanEnabled: true } }) },
  // Indicators & Detectors
  { label: "Detector Override (Lua)", category: "Indicators & Detectors", json: j({ detectors: { EXAMPLE_DETECTOR_NAME: { enabled: true, verdict: "DETECT" } } }) },
  // Communication
  { label: "Keep-Alive Interval & Fail Count", category: "Communication", json: j({ keepAliveInterval: 30, keepAliveFailCount: 8 }) },
  { label: "Proxy Config", category: "Communication", json: j({ communicatorConfig: { forceProxy: true, telemetry: true } }) },
  { label: "DLP Settings (Support-only)", category: "Communication", json: j({ dlp: { enabled: false } }) },
];

const PLATFORM_TEMPLATES: Record<Platform, Template[]> = {
  windows: WINDOWS_TEMPLATES,
  linux: LINUX_TEMPLATES,
  macos: MACOS_TEMPLATES,
};

export default function CustomOverride({ onApplyTemplate, platform = "windows" }: CustomOverrideProps) {
  const templates = PLATFORM_TEMPLATES[platform];
  const categories = [...new Set(templates.map((t) => t.category))].sort((a, b) => a.localeCompare(b));

  return (
    <div className="flex-1 min-h-0 flex flex-col">
      <div className="px-5 py-4 border-b border-s1-border flex-shrink-0">
        <p className="text-xs text-s1-text-muted">
          Click a template to load it into the editor.
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {categories.map((category) => (
          <div key={category}>
            <span className="text-[10px] text-s1-text-muted uppercase tracking-wider font-semibold">{category}</span>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {templates.filter((t) => t.category === category).sort((a, b) => a.label.localeCompare(b.label)).map((t) => (
                <button
                  key={t.label}
                  onClick={() => onApplyTemplate(t.label, t.json)}
                  className="px-2.5 py-1 text-xs bg-s1-surface text-s1-text-secondary rounded hover:bg-s1-surface-hover hover:text-s1-text border border-s1-border transition-colors"
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
