import React, { useState, useEffect } from 'react';
import { 
  Bot, BookOpen, Terminal, Award, Settings as SettingsIcon, FileText, 
  Flame, Menu, X, ShieldAlert, Cpu, Inbox, ClipboardList, Server, Sparkles 
} from 'lucide-react';
import AIChat from './components/AIChat';
import KnowledgeBase from './components/KnowledgeBase';
import PowerShellLibrary from './components/PowerShellLibrary';
import InterviewPrep from './components/InterviewPrep';
import CourseRoadmap from './components/CourseRoadmap';
import DocGenerator from './components/DocGenerator';
import DailyChallenge from './components/DailyChallenge';
import Settings from './components/Settings';
import TicketSimulator from './components/TicketSimulator';
import ExamPractice from './components/ExamPractice';
import LabGuides from './components/LabGuides';

const STARTER_SCRIPTS = [
  {
    id: "1",
    title: "Get All AD Users with Last Logon",
    description: "Export all active users along with logon details to local CSV reports.",
    category: "active_directory",
    script: `Import-Module ActiveDirectory
Get-ADUser -Filter * -Properties LastLogonDate, Department, Title |
  Select-Object Name, SamAccountName, LastLogonDate, Department, Title |
  Sort-Object LastLogonDate -Descending |
  Export-Csv -Path "C:\\Reports\\AD_Users_LastLogon.csv" -NoTypeInformation
Write-Host "Report saved to C:\\Reports\\AD_Users_LastLogon.csv" -ForegroundColor Green`
  },
  {
    id: "2",
    title: "Reset AD User Password and Unlock Account",
    description: "Resets account passwords and clears lockout status.",
    category: "active_directory",
    script: `param([string]$Username)
Import-Module ActiveDirectory
try {
  $NewPassword = ConvertTo-SecureString "TempPass@123" -AsPlainText -Force
  Set-ADAccountPassword -Identity $Username -NewPassword $NewPassword -Reset
  Set-ADUser -Identity $Username -ChangePasswordAtLogon $true
  Unlock-ADAccount -Identity $Username
  Write-Host "Password reset and account unlocked for: $Username" -ForegroundColor Green
} catch {
  Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}`
  },
  {
    id: "3",
    title: "Check DNS Resolution from DC",
    description: "Verify Domain Name Server health and zone resolutions.",
    category: "dns",
    script: `$DomainName = (Get-ADDomain).DNSRoot
Write-Host "Testing DNS for domain: $DomainName" -ForegroundColor Cyan
Resolve-DnsName $DomainName -Type A
Resolve-DnsName $DomainName -Type SOA
Get-DnsServerZone | Select-Object ZoneName, ZoneType, IsAutoCreated`
  },
  {
    id: "4",
    title: "Get DHCP Scope Utilization",
    description: "Fetch dynamic IP allocations status across Server pools.",
    category: "dhcp",
    script: `$DHCPServer = $env:COMPUTERNAME
Get-DhcpServerv4Scope -ComputerName $DHCPServer | ForEach-Object {
  $stats = Get-DhcpServerv4ScopeStatistics -ComputerName $DHCPServer -ScopeId $_.ScopeId
  [PSCustomObject]@{
    ScopeId    = $_.ScopeId
    Name       = $_.Name
    InUse      = $stats.InUse
    Free       = $stats.Free
    Total      = $stats.Total
    "Used (%)" = [math]::Round(($stats.InUse / $stats.Total) * 100, 2)
  }
} | Format-Table -AutoSize`
  },
  {
    id: "5",
    title: "Force GPO Update on Remote Computer",
    description: "Triggers Group Policy Updates remotely via winrm/cmd parameters.",
    category: "group_policy",
    script: `param([string]$ComputerName)
try {
  Invoke-GPUpdate -Computer $ComputerName -Force -RandomDelayInMinutes 0
  Write-Host "GPO update triggered on $ComputerName" -ForegroundColor Green
} catch {
  Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}`
  },
  {
    id: "6",
    title: "Get M365 User License Info",
    description: "List Microsoft 365 licensing assignments across users.",
    category: "m365",
    script: `# Requires: Connect-MgGraph -Scopes "User.Read.All", "Directory.Read.All"
Import-Module Microsoft.Graph.Users
Connect-MgGraph -Scopes "User.Read.All", "Directory.Read.All"
Get-MgUser -All -Property DisplayName, UserPrincipalName, AssignedLicenses |
  Select-Object DisplayName, UserPrincipalName, 
    @{N="Licenses";E={$_.AssignedLicenses.Count}} |
  Export-Csv -Path "C:\\Reports\\M365_Licenses.csv" -NoTypeInformation
Write-Host "Report saved." -ForegroundColor Green`
  },
  {
    id: "7",
    title: "Disable Inactive AD Users (90 Days)",
    description: "Identify and disable inactive domain user credentials.",
    category: "active_directory",
    script: `Import-Module ActiveDirectory
$CutoffDate = (Get-Date).AddDays(-90)
$InactiveUsers = Get-ADUser -Filter {LastLogonDate -lt $CutoffDate -and Enabled -eq $true} \`
  -Properties LastLogonDate, Department |
  Where-Object { $_.LastLogonDate -ne $null }

Write-Host "Found $($InactiveUsers.Count) inactive users" -ForegroundColor Yellow

# ⚠️ WARNING: Remove the -WhatIf to actually disable
$InactiveUsers | ForEach-Object {
  Disable-ADAccount -Identity $_.SamAccountName -WhatIf
  Write-Host "Would disable: $($_.Name)" -ForegroundColor Red
}`
  },
  {
    id: "8",
    title: "Check Replication Status Between DCs",
    description: "View domain failures and sync status via repadmin utility commands.",
    category: "active_directory",
    script: `repadmin /replsummary
repadmin /showrepl
Get-ADReplicationFailure -Target (Get-ADDomain).DNSRoot -Scope Domain`
  },
  {
    id: "9",
    title: "Get All Shared Mailboxes in Exchange Online",
    description: "Retrieve list of active shared mailboxes and sizes from Exchange Online.",
    category: "exchange_online",
    script: `# Connect-ExchangeOnline first
Get-Mailbox -RecipientTypeDetails SharedMailbox -ResultSize Unlimited |
  Select-Object DisplayName, Alias, PrimarySmtpAddress,
    @{N="Size";E={(Get-MailboxStatistics $_.Identity).TotalItemSize}} |
  Export-Csv -Path "C:\\Reports\\SharedMailboxes.csv" -NoTypeInformation
Write-Host "Done." -ForegroundColor Green`
  },
  {
    id: "10",
    title: "Find Computers Not Seen in 30 Days (AD)",
    description: "Lists domain servers and desktop computer objects inactive for 30+ days.",
    category: "active_directory",
    script: `Import-Module ActiveDirectory
$cutoff = (Get-Date).AddDays(-30)
Get-ADComputer -Filter {LastLogonDate -lt $cutoff -and Enabled -eq $true} \`
  -Properties LastLogonDate, OperatingSystem |
  Select-Object Name, LastLogonDate, OperatingSystem |
  Sort-Object LastLogonDate |
  Format-Table -AutoSize`
  },
  {
    id: "11",
    title: "Azure VM Status Check (All VMs)",
    description: "Checks provisioned state and running power-states for all Azure Virtual Machines.",
    category: "azure",
    script: `# Connect-AzAccount first
Get-AzVM -Status | 
  Select-Object Name, ResourceGroupName, 
    @{N="PowerState";E={$_.PowerState}},
    @{N="ProvisioningState";E={$_.ProvisioningState}} |
  Format-Table -AutoSize`
  },
  {
    id: "12",
    title: "Get Intune Device Compliance Report",
    description: "Query compliance states of Intune devices.",
    category: "intune",
    script: `# Requires Microsoft.Graph module
Connect-MgGraph -Scopes "DeviceManagementManagedDevices.Read.All"
Get-MgDeviceManagementManagedDevice -All |
  Select-Object DeviceName, OperatingSystem, ComplianceState, 
    LastSyncDateTime, UserPrincipalName |
  Export-Csv -Path "C:\\Reports\\Intune_Compliance.csv" -NoTypeInformation
Write-Host "Intune compliance report exported." -ForegroundColor Green`
  },
  {
    id: "13",
    title: "Check Windows Event Log for Errors (Last 24h)",
    description: "Query Local Event Viewer System and Application logs for errors.",
    category: "windows",
    script: `param([string]$ComputerName = $env:COMPUTERNAME)
$since = (Get-Date).AddHours(-24)
Get-WinEvent -ComputerName $ComputerName -FilterHashtable @{
  LogName   = 'System', 'Application'
  Level     = 1, 2  # 1=Critical, 2=Error
  StartTime = $since
} -ErrorAction SilentlyContinue |
  Select-Object TimeCreated, LogName, Id, Message |
  Sort-Object TimeCreated -Descending |
  Format-Table -Wrap -AutoSize`
  },
  {
    id: "14",
    title: "MFA Status for All M365 Users",
    description: "Audits authentication methods configured for Entra ID users.",
    category: "m365",
    script: `Connect-MgGraph -Scopes "UserAuthenticationMethod.Read.All", "User.Read.All"
$users = Get-MgUser -All -Property DisplayName, UserPrincipalName
$results = foreach ($user in $users) {
  $methods = Get-MgUserAuthenticationMethod -UserId $user.Id
  [PSCustomObject]@{
    DisplayName       = $user.DisplayName
    UPN               = $user.UserPrincipalName
    AuthMethodCount   = $methods.Count
    MFAEnabled        = ($methods.Count -gt 1)
  }
}
$results | Export-Csv "C:\\Reports\\MFA_Status.csv" -NoTypeInformation
Write-Host "MFA report saved." -ForegroundColor Green`
  },
  {
    id: "15",
    title: "Get FSMO Role Holders",
    description: "View schema and domain-level Flexible Single Master Operations role configurations.",
    category: "active_directory",
    script: `Import-Module ActiveDirectory
$forest = Get-ADForest
$domain = Get-ADDomain
Write-Host "\`nForest-Level FSMO Roles:" -ForegroundColor Cyan
Write-Host "Schema Master:          $($forest.SchemaMaster)"
Write-Host "Domain Naming Master:   $($forest.DomainNamingMaster)"
Write-Host "\`nDomain-Level FSMO Roles:" -ForegroundColor Cyan
Write-Host "PDC Emulator:           $($domain.PDCEmulator)"
Write-Host "RID Master:             $($domain.RIDMaster)"
Write-Host "Infrastructure Master:  $($domain.InfrastructureMaster)"`
  },
  {
    id: "16",
    title: "Bulk Create AD Users from CSV",
    description: "Reads user settings from CSV sheet and provisions AD accounts.",
    category: "active_directory",
    script: `# CSV format: FirstName,LastName,Username,Department,OU
Import-Module ActiveDirectory
$users = Import-Csv -Path "C:\\Users_to_create.csv"
foreach ($user in $users) {
  try {
    $params = @{
      Name              = "$($user.FirstName) $($user.LastName)"
      GivenName         = $user.FirstName
      Surname           = $user.LastName
      SamAccountName    = $user.Username
      UserPrincipalName = "$($user.Username)@yourdomain.com"
      Path              = $user.OU
      Department        = $user.Department
      AccountPassword   = (ConvertTo-SecureString "Welcome@123" -AsPlainText -Force)
      Enabled           = $true
      ChangePasswordAtLogon = $true
    }
    New-ADUser @params
    Write-Host "Created: $($user.Username)" -ForegroundColor Green
  } catch {
    Write-Host "Failed: $($user.Username) — $($_.Exception.Message)" -ForegroundColor Red
  }
}`
  },
  {
    id: "17",
    title: "Check Disk Space on Remote Servers",
    description: "Query Server disks for utilization details.",
    category: "windows",
    script: `param([string[]]$Servers = @("Server01", "Server02", "Server03"))
foreach ($server in $Servers) {
  try {
    Get-PSDrive -PSProvider FileSystem -Name C -ErrorAction Stop |
      Select-Object @{N="Server";E={$server}}, 
        @{N="UsedGB";E={[math]::Round(($_.Used/1GB),2)}},
        @{N="FreeGB";E={[math]::Round(($_.Free/1GB),2)}},
        @{N="TotalGB";E={[math]::Round((($_.Used+$_.Free)/1GB),2)}}
  } catch {
    Write-Host "$server - Cannot connect: $($_.Exception.Message)" -ForegroundColor Red
  }
}`
  },
  {
    id: "18",
    title: "Sync Entra Connect (Hybrid AD)",
    description: "Trigger delta sync sequences on local Entra active directories.",
    category: "m365",
    script: `# ⚠️ Run on the Entra Connect server
Import-Module ADSync
# Delta sync (changes only — recommended)
Start-ADSyncSyncCycle -PolicyType Delta
Write-Host "Delta sync started." -ForegroundColor Green

# Full sync (only if needed)
# Start-ADSyncSyncCycle -PolicyType Initial

# Check sync status
Get-ADSyncScheduler | Select-Object SyncCycleInProgress, NextSyncCyclePolicyType, NextSyncCycleStartTimeInUTC`
  },
  {
    id: "19",
    title: "Get Teams User Policies",
    description: "List calling, meeting, and messaging policies assigned to user.",
    category: "m365",
    script: `# Connect-MicrosoftTeams first
param([string]$UPN)
Get-CsOnlineUser -Identity $UPN | 
  Select-Object DisplayName, UserPrincipalName,
    TeamsCallingPolicy, TeamsMeetingPolicy, 
    TeamsMessagingPolicy, TeamsAppPermissionPolicy |
  Format-List`
  },
  {
    id: "20",
    title: "BitLocker Recovery Key Export",
    description: "Retrieve device BitLocker recovery keys from Active Directory.",
    category: "windows",
    script: `# Gets BitLocker recovery keys from AD for all computers
Import-Module ActiveDirectory
Get-ADComputer -Filter * -SearchBase "DC=yourdomain,DC=com" |
  ForEach-Object {
    $keys = Get-ADObject -Filter {objectClass -eq 'msFVE-RecoveryInformation'} \`
      -SearchBase $_.DistinguishedName -Properties msFVE-RecoveryPassword
    foreach ($key in $keys) {
      [PSCustomObject]@{
        Computer        = $_.Name
        RecoveryKeyId   = $key.Name
        RecoveryPassword = $key.'msFVE-RecoveryPassword'
      }
    }
  } | Export-Csv "C:\\Reports\\BitLocker_Keys.csv" -NoTypeInformation
Write-Host "BitLocker keys exported." -ForegroundColor Green`
  },
  {
    id: "21",
    title: "Flush DNS & Renew DHCP IP",
    description: "Resets local IP socket status, flushes dns caches, and requests new network address leases.",
    category: "dns",
    script: `@echo off
echo Flashing DNS cache...
ipconfig /flushdns
echo Releasing current IP address...
ipconfig /release
echo Renewing IP lease from DHCP server...
ipconfig /renew
echo Network stack reset complete.
pause`,
    type: "cmd"
  },
  {
    id: "22",
    title: "SFC & DISM Local Component Store Repair",
    description: "Launches local system file integrity checker and online DISM deployment image repair tools.",
    category: "windows",
    script: `@echo off
echo Checking system file integrity...
sfc /scannow
echo.
echo Checking Windows component store health...
dism /online /cleanup-image /scanhealth
echo.
echo Repairing Windows component store image...
dism /online /cleanup-image /restorehealth
echo Complete. Please reboot if issues persist.
pause`,
    type: "cmd"
  },
  {
    id: "23",
    title: "Clear Windows Temp & Update Caches",
    description: "Halts Windows Update services, purges SoftwareDistribution downloads and temp file nodes, then resumes services.",
    category: "windows",
    script: `@echo off
echo Stopping Windows Update service...
net stop wuauserv
echo Purging SoftwareDistribution cache...
del /f /s /q %windir%\\SoftwareDistribution\\Download\\*.*
echo Purging Local User Temp files...
del /f /s /q %temp%\\*.*
echo Starting Windows Update service...
net start wuauserv
echo System temp cache clean complete.
pause`,
    type: "cmd"
  },
  {
    id: "24",
    title: "List Active Listening TCP/UDP Socket Ports",
    description: "Performs netstat queries to list active network connections currently in LISTENING state with matching PIDs.",
    category: "windows",
    script: `@echo off
echo Listing active network socket listening ports...
netstat -ano | findstr LISTENING
pause`,
    type: "cmd"
  }
];

const STARTER_COURSES = [
  { id: 1, name: "Computer Hardware & Troubleshooting", icon: "🖥️", totalModules: 9, completedModules: 0, status: "Not Started", hoursRemaining: 8, role: "L1" },
  { id: 2, name: "CCNA 200-301 (Networking)", icon: "🌐", totalModules: 11, completedModules: 0, status: "Not Started", hoursRemaining: 24, role: "L2" },
  { id: 3, name: "MCSA - Windows Server 2022", icon: "🪟", totalModules: 18, completedModules: 0, status: "Not Started", hoursRemaining: 40, role: "L2" },
  { id: 4, name: "RHCSA - Red Hat Linux (EX-200)", icon: "🐧", totalModules: 12, completedModules: 0, status: "Not Started", hoursRemaining: 30, role: "L2" },
  { id: 5, name: "Virtualization (VMware, Hyper-V, VirtualBox)", icon: "⚙️", totalModules: 6, completedModules: 0, status: "Not Started", hoursRemaining: 12, role: "L2" },
  { id: 6, name: "PowerShell Scripting", icon: "💻", totalModules: 8, completedModules: 0, status: "Not Started", hoursRemaining: 15, role: "L2" },
  { id: 7, name: "Microsoft 365 Administrator (MS-102)", icon: "☁️", totalModules: 13, completedModules: 0, status: "Not Started", hoursRemaining: 25, role: "L2-L3" },
  { id: 8, name: "AZ-900 Azure Fundamentals", icon: "🔵", totalModules: 11, completedModules: 0, status: "Not Started", hoursRemaining: 10, role: "L2" },
  { id: 9, name: "AZ-104 Azure Administrator", icon: "🔷", totalModules: 12, completedModules: 0, status: "Not Started", hoursRemaining: 35, role: "L3" },
  { id: 10, name: "Microsoft Intune / MD-102 Endpoint Administrator", icon: "📱", totalModules: 14, completedModules: 0, status: "Not Started", hoursRemaining: 28, role: "L2-L3" },
  { id: 11, name: "SCCM / Microsoft Endpoint Configuration Manager", icon: "🔧", totalModules: 8, completedModules: 0, status: "Not Started", hoursRemaining: 20, role: "L3" },
  { id: 12, name: "AWS Fundamentals (EC2, VPC, S3)", icon: "🟠", totalModules: 6, completedModules: 0, status: "Not Started", hoursRemaining: 15, role: "L3" },
  { id: 13, name: "L2 & L3 IT Admin Multi-Cloud", icon: "🌩️", totalModules: 5, completedModules: 0, status: "Not Started", hoursRemaining: 18, role: "L3" },
  { id: 14, name: "Desktop Support Engineer (L1)", icon: "🎧", totalModules: 5, completedModules: 0, status: "Not Started", hoursRemaining: 5, role: "L1" },
  { id: 15, name: "System Administrator (Ultimate)", icon: "🏆", totalModules: 10, completedModules: 0, status: "Not Started", hoursRemaining: 30, role: "L2" },
  { id: 16, name: "Ticketing Tool (ITSM basics)", icon: "🎫", totalModules: 4, completedModules: 0, status: "Not Started", hoursRemaining: 6, role: "L1" }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Load Settings from LocalStorage
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('engineeros_settings');
    return saved ? JSON.parse(saved) : {
      apiKey: '',
      language: 'Hinglish',
      currentRole: 'Desktop Support L1',
      targetRole: 'Sysadmin L2',
      apiEndpoint: 'https://api.anthropic.com'
    };
  });

  // Load Knowledge base items
  const [knowledgeItems, setKnowledgeItems] = useState(() => {
    const saved = localStorage.getItem('engineeros_knowledge');
    return saved ? JSON.parse(saved) : [];
  });

  // Load PowerShell & CMD scripts
  const [scripts, setScripts] = useState(() => {
    const saved = localStorage.getItem('engineeros_scripts');
    if (!saved) return STARTER_SCRIPTS;
    const parsed = JSON.parse(saved);
    if (!parsed.some(s => s.type === 'cmd')) {
      return STARTER_SCRIPTS;
    }
    return parsed;
  });

  // Load Roadmap courses progress
  const [courses, setCourses] = useState(() => {
    const saved = localStorage.getItem('engineeros_courses');
    return saved ? JSON.parse(saved) : STARTER_COURSES;
  });

  // Load Daily Challenge Streak
  const [streak, setStreak] = useState(() => {
    const saved = localStorage.getItem('engineeros_challenge_streak');
    return saved ? parseInt(saved) : 0;
  });

  // Save states back to local storage on modification
  useEffect(() => {
    localStorage.setItem('engineeros_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('engineeros_knowledge', JSON.stringify(knowledgeItems));
  }, [knowledgeItems]);

  useEffect(() => {
    localStorage.setItem('engineeros_scripts', JSON.stringify(scripts));
  }, [scripts]);

  useEffect(() => {
    localStorage.setItem('engineeros_courses', JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem('engineeros_challenge_streak', streak.toString());
  }, [streak]);

  // Handler functions
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
  };

  const handleSaveKnowledgeItem = (item) => {
    const itemWithDefaults = {
      id: item.id || Date.now().toString(),
      date: item.date || new Date().toLocaleDateString(),
      ...item
    };
    setKnowledgeItems(prev => {
      const idx = prev.findIndex(i => i.id === itemWithDefaults.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = itemWithDefaults;
        return updated;
      }
      return [itemWithDefaults, ...prev];
    });
  };

  const handleDeleteKnowledgeItem = (id) => {
    if (window.confirm("Knowledge base card delete karna hai?")) {
      setKnowledgeItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const handleSaveScript = (scriptItem) => {
    setScripts(prev => {
      const idx = prev.findIndex(s => s.id === scriptItem.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = scriptItem;
        return updated;
      }
      return [scriptItem, ...prev];
    });
  };

  const handleDeleteScript = (id) => {
    if (window.confirm("Script delete karna hai?")) {
      setScripts(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleUpdateCourse = (courseId, updateParams) => {
    setCourses(prev => prev.map(c => c.id === courseId ? { ...c, ...updateParams } : c));
  };

  // Integration saves from Chat Extractor blocks
  const handleChatSaveKnowledge = (extractedData) => {
    const item = {
      id: Date.now().toString(),
      title: extractedData.title || "Troubleshooting Solution",
      problem: extractedData.problem || "Extracted from Copilot Chat",
      solution: extractedData.solution || "",
      category: extractedData.category || "general",
      tags: extractedData.tags || ["extracted"],
      severity: extractedData.severity || "medium",
      date: new Date().toLocaleDateString()
    };
    handleSaveKnowledgeItem(item);
    alert("Saved successfully to Knowledge Base!");
  };

  const handleChatSaveScript = (extractedData) => {
    const item = {
      id: Date.now().toString(),
      title: extractedData.title || "PowerShell Script",
      description: extractedData.description || "Generated PowerShell automation script.",
      category: extractedData.category || "general",
      script: extractedData.script || ""
    };
    handleSaveScript(item);
    alert("Saved successfully to PowerShell Library!");
  };

  const navItems = [
    { id: 'chat', label: 'AI Chat', icon: Bot },
    { id: 'tickets', label: 'Ticket Simulator', icon: Inbox },
    { id: 'quizzes', label: 'Exam Practice', icon: ClipboardList },
    { id: 'labs', label: 'Home Lab Guides', icon: Server },
    { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
    { id: 'powershell', label: 'PowerShell Library', icon: Terminal },
    { id: 'interview', label: 'Interview Prep', icon: Award },
    { id: 'roadmap', label: 'Course Roadmap', icon: Cpu },
    { id: 'docs', label: 'Doc Generator', icon: FileText },
    { id: 'challenge', label: 'Daily Challenge', icon: Flame },
    { id: 'settings', label: 'Settings', icon: SettingsIcon }
  ];

  return (
    <div className="flex h-screen bg-darkBg text-textPrimary overflow-hidden">
      
      {/* Sidebar - Desktop Layout */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebarBg border-r border-gray-800 shrink-0">
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-800">
          <Bot size={24} className="text-primaryAccent" />
          <span className="font-bold text-lg tracking-wide uppercase">EngineerOS AI</span>
        </div>
        
        {/* Nav Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map(item => {
            const Icon = item.icon;
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active 
                    ? 'bg-primaryAccent text-white shadow-lg shadow-indigo-500/10' 
                    : 'text-textMuted hover:text-textPrimary hover:bg-gray-900/50'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
        
        {/* User Badges */}
        <div className="p-4 border-t border-gray-850 bg-black/10">
          <span className="text-[10px] uppercase tracking-wider text-textMuted font-bold block mb-1">Profile Level</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs bg-sidebarBg border border-gray-850 px-2 py-0.5 rounded text-textPrimary font-mono font-bold">
              {settings.currentRole.split(' ')[0]}
            </span>
            <span className="text-xs text-textMuted font-semibold">to</span>
            <span className="text-xs bg-primaryAccent/10 border border-primaryAccent/20 px-2 py-0.5 rounded text-primaryAccent font-mono font-bold">
              {settings.targetRole.split(' ')[0]}
            </span>
          </div>
        </div>
      </aside>

      {/* Mobile Drawer Navigation overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 md:hidden flex">
          <aside className="w-64 bg-sidebarBg flex flex-col h-full border-r border-gray-800 animate-slideRight">
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
              <span className="font-bold uppercase tracking-wide">EngineerOS AI</span>
              <button onClick={() => setSidebarOpen(false)} className="text-textMuted hover:text-textPrimary">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1">
              {navItems.map(item => {
                const Icon = item.icon;
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      active 
                        ? 'bg-primaryAccent text-white' 
                        : 'text-textMuted hover:text-textPrimary hover:bg-gray-900/50'
                    }`}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
          <div className="flex-1" onClick={() => setSidebarOpen(false)} />
        </div>
      )}

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <header className="bg-sidebarBg border-b border-gray-800 h-16 flex items-center justify-between px-4 md:px-6 shrink-0 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(true)} 
              className="md:hidden text-textMuted hover:text-textPrimary p-1.5 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
            <h2 className="text-md font-bold tracking-tight text-textPrimary capitalize">
              {navItems.find(n => n.id === activeTab)?.label}
            </h2>
          </div>
          
          <div className="flex items-center gap-3">
            {/* API Warning if missing */}
            {!settings.apiKey && (
              <div className="hidden md:flex items-center gap-1.5 text-xs text-warningAmber bg-warningAmber/10 border border-warningAmber/20 px-3 py-1.5 rounded-lg font-medium animate-pulse">
                <ShieldAlert size={14} />
                <span>API Key Missing — Settings mein set karo</span>
              </div>
            )}
            {/* Daily Streak Indicator */}
            {streak > 0 && (
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-950/20 border border-amber-900 px-2.5 py-1.5 rounded-lg shrink-0">
                <Flame size={14} className="animate-bounce" />
                <span>{streak} Days</span>
              </div>
            )}
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto bg-darkBg">
          {activeTab === 'chat' && (
            <AIChat 
              settings={settings} 
              onSaveToKnowledge={handleChatSaveKnowledge} 
              onSaveToScripts={handleChatSaveScript} 
            />
          )}
          {activeTab === 'tickets' && (
            <TicketSimulator onSaveToKnowledge={handleSaveKnowledgeItem} />
          )}
          {activeTab === 'quizzes' && (
            <ExamPractice />
          )}
          {activeTab === 'labs' && (
            <LabGuides />
          )}
          {activeTab === 'knowledge' && (
            <KnowledgeBase 
              knowledgeItems={knowledgeItems} 
              onSaveItem={handleSaveKnowledgeItem} 
              onDeleteItem={handleDeleteKnowledgeItem} 
            />
          )}
          {activeTab === 'powershell' && (
            <PowerShellLibrary 
              scripts={scripts} 
              onSaveScript={handleSaveScript} 
              onDeleteScript={handleDeleteScript} 
            />
          )}
          {activeTab === 'interview' && (
            <InterviewPrep settings={settings} />
          )}
          {activeTab === 'roadmap' && (
            <CourseRoadmap courses={courses} onUpdateCourse={handleUpdateCourse} />
          )}
          {activeTab === 'docs' && (
            <DocGenerator settings={settings} onSaveToKnowledge={handleSaveKnowledgeItem} />
          )}
          {activeTab === 'challenge' && (
            <DailyChallenge 
              settings={settings} 
              streak={streak} 
              onIncrementStreak={() => setStreak(prev => prev + 1)} 
              onResetStreak={() => setStreak(0)} 
            />
          )}
          {activeTab === 'settings' && (
            <Settings settings={settings} onSaveSettings={handleSaveSettings} />
          )}
        </main>
      </div>

    </div>
  );
}
