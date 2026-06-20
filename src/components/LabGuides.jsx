import React, { useState, useEffect } from 'react';
import { 
  Server, CheckSquare, BookOpen, Layers, Terminal, ChevronDown, 
  ChevronUp, ShieldAlert, Clipboard, Check 
} from 'lucide-react';

const LAB_GUIDES = [
  {
    id: "lab_ad_dns",
    title: "Windows Server 2022 AD DS & DNS Lab",
    icon: "🪟",
    duration: "4-6 Hours",
    role: "L2 Sysadmin Track",
    prerequisites: "Oracle VirtualBox, Windows Server 2022 ISO (Evaluation), Windows 10/11 ISO, 16GB Host RAM.",
    objective: "Setup a local Active Directory Domain Services (AD DS) lab. Promote DC01, configure DHCP/DNS servers, configure a Group Policy Object, and join a Windows Client PC to the domain.",
    definition: "Active Directory Domain Services (AD DS) is Microsoft's directory service that stores information about network objects (users, computers, groups, printers) and manages security/permissions. DNS is the backbone that translates domain names (e.g., corp.local) to IP addresses.",
    purpose: "Centralized identity management, authentication (Kerberos), authorization (NTFS/Share permissions), and policy enforcement via Group Policy Objects (GPOs) across an entire enterprise.",
    architecture: [
      "Domain Controller (DC): Server hosting the AD DS database (NTDS.dit).",
      "Active Directory Schema: Defines object classes and attributes.",
      "SYSVOL Folder: Shared directory containing GPOs and login scripts, replicated across DCs.",
      "Global Catalog (GC): Stores copies of all objects in the forest for faster search.",
      "DNS Zones: Active Directory-Integrated zones that replicate along with AD data."
    ],
    installation: [
      "Assign static IP (e.g. 192.168.10.10) and set Preferred DNS to Loopback (127.0.0.1).",
      "Open Server Manager -> 'Add Roles and Features' -> select 'Active Directory Domain Services'.",
      "Click the yellow flag notification -> 'Promote this server to a Domain Controller'.",
      "Choose 'Add a new forest' -> domain name 'corp.yourname.local' -> configure DSRM password.",
      "Reboot, open DNS Manager, and verify that the forwarders are set up correctly."
    ],
    dailyTasks: [
      "Creating, disabling, and modifying user accounts and security groups (via ADUC or PowerShell).",
      "Unlocking user accounts and resetting expired passwords.",
      "Auditing failed login attempts and managing group memberships.",
      "Creating and linking Group Policy Objects (GPOs) to specific OUs."
    ],
    useCases: [
      {
        title: "Single Sign-On (SSO)",
        desc: "Employees log into their workstation once and access internal file shares, Exchange mailboxes, and intranet services without entering credentials repeatedly."
      },
      {
        title: "Workstation Security Enforcements",
        desc: "Enforcing a corporate policy where all workstation screens lock after 15 minutes of inactivity and set corporate wallpaper using a GPO linked to domain OUs."
      }
    ],
    bestPractices: [
      "Never use the default domain Administrator account for daily tasks; use delegated admin accounts instead.",
      "Implement a clean OU structure reflecting business roles rather than departments.",
      "Regularly backup the NTDS.dit database and the System State.",
      "Use AD-Integrated DNS zones for automated and secure replication."
    ],
    troubleshooting: [
      {
        issue: "SRV Record missing or name resolution failures",
        solution: "Run 'ipconfig /registerdns' on the DC and restart the Netlogon service ('Restart-Service netlogon'). Verify that the client PC is using the DC's IP as its preferred DNS."
      },
      {
        issue: "Active Directory Replication failure between DCs",
        solution: "Run 'repadmin /replsummary' and 'repadmin /showrepl' to identify sync errors. Check the Directory Service logs in Event Viewer for specific metadata conflicts."
      }
    ],
    commands: [
      { cmd: "Get-ADUser -Filter *", desc: "Lists all active directory users in the domain." },
      { cmd: "Unlock-ADAccount -Identity <Username>", desc: "Unlocks a locked domain user account." },
      { cmd: "gpupdate /force", desc: "Forces Group Policy update on a local or remote machine." },
      { cmd: "gpresult /r", desc: "Displays Group Policy results and applied GPOs for active user." },
      { cmd: "repadmin /showrepl", desc: "Shows replication status and sync updates of Domain Controllers." }
    ],
    interviewQuestions: [
      {
        q: "What is the difference between a Workgroup and a Domain?",
        a: "A Workgroup is a decentralized network where each computer manages its own local database of users and security. A Domain is a centralized network managed by a Domain Controller running Active Directory, allowing central authentication and policy enforcement."
      },
      {
        q: "What is SYSVOL and why is it important?",
        a: "SYSVOL is a shared folder that exists on all Domain Controllers. It stores GPO templates, policy files, and startup/logon scripts. It is replicated to all DCs to ensure policy consistency across the domain."
      },
      {
        q: "How do you troubleshoot AD replication issues?",
        a: "Use CLI commands like 'repadmin /showrepl' and 'repadmin /replsummary' to diagnose sync blocks. Inspect the Directory Service event logs, and verify network/DNS connectivity between DCs using ping and nslookup."
      }
    ],
    steps: [
      {
        title: "VM Setup in VirtualBox",
        desc: "Create two virtual machines:\n1. Server VM (DC01): 4GB RAM, 2 vCPUs, Host-Only Network adapter.\n2. Client VM (CL01): 2GB RAM, 1 vCPU, Host-Only Network adapter.\nEnsure both virtual machines are connected to the same VirtualBox host-only adapter."
      },
      {
        title: "IP Addressing Config",
        desc: "On DC01, assign a static IP address:\n- IP: `192.168.10.10`\n- Subnet Mask: `255.255.255.0`\n- Gateway: `192.168.10.1`\n- Preferred DNS: `127.0.0.1` (loopback)"
      },
      {
        title: "Install AD DS & Promote DC",
        desc: "Open Server Manager on DC01:\n1. Click 'Add roles and features'.\n2. Select 'Active Directory Domain Services' and complete the installation.\n3. Click the yellow flag notification -> 'Promote this server to a domain controller'.\n4. Choose 'Add a new forest' and set the domain name: `corp.yourname.local`.\n5. Set a DSRM password and finish. The system will reboot automatically."
      },
      {
        title: "GPO Setup & Client Joining",
        desc: "1. On DC01, open Active Directory Users and Computers (ADUC) and create an OU named 'Sales'.\n2. Open Group Policy Management, create a new GPO named 'ScreenSaverPolicy', link it to the 'Sales' OU, and enable a password-protected screensaver.\n3. Turn on CL01, set its preferred DNS to `192.168.10.10`, open settings, change computer name, and choose 'Join Domain' -> enter `corp.yourname.local`."
      }
    ],
    tasks: [
      "Install VirtualBox and create DC01 and CL01 VMs",
      "Configure static IP addresses on DC01",
      "Install AD DS role on DC01 and promote to Domain Controller",
      "Create domain 'corp.yourdomain.local' and setup DNS zones",
      "Create 'Sales' OU and add test user 'salesuser1'",
      "Create and link screensaver GPO to 'Sales' OU",
      "Configure static DNS on client VM and join to domain",
      "Log in on client with 'salesuser1' and verify domain connectivity"
    ]
  },
  {
    id: "lab_ccna_routing",
    title: "Cisco Routing & Subnetting Lab",
    icon: "🌐",
    duration: "3-5 Hours",
    role: "CCNA Network Track",
    prerequisites: "Cisco Packet Tracer installed on Windows host.",
    objective: "Configure a 3-router subnetted network in Cisco Packet Tracer. Implement VLANs, trunk links, Inter-VLAN routing, and static routes or OSPF routing protocol.",
    definition: "Cisco routing is the process of forwarding IP packets between different networks using Cisco routers. Subnetting is the practice of dividing a single network address range into smaller, efficient sub-networks to reduce IP wastage and partition broadcast domains.",
    purpose: "Connect geographically separated offices, optimize IP address allocation, isolate departments for security, and manage traffic flow using routing protocols (OSPF, RIP, BGP) or static routes.",
    architecture: [
      "Router CLI (IOS): Operating System CLI containing User EXEC, Privileged EXEC, and Global Config modes.",
      "Interfaces: FastEthernet, GigabitEthernet, and Serial ports to connect networks.",
      "Routing Table: A database stored in RAM containing known network paths and metrics.",
      "OSPF (Open Shortest Path First): Link-state routing protocol that finds the shortest path using the Dijkstra algorithm.",
      "VLANs (Virtual LANs): Broadcast domains configured on switches."
    ],
    installation: [
      "Place Cisco 2911 Routers (R1, R2) and switches on the workspace.",
      "Connect devices via proper Ethernet copper straight-through or crossover cables.",
      "Enter CLI mode on Cisco routers and run 'enable' and 'configure terminal'.",
      "Use VLSM to calculate subnets for S1 Lan (50 hosts), S2 Lan (30 hosts), and R1-R2 link (2 hosts).",
      "Assign interfaces IP addresses, run 'no shutdown', and configure OSPF processes."
    ],
    dailyTasks: [
      "Assigning IP addresses to new router interfaces or VLANs.",
      "Modifying access control lists (ACLs) to block or allow traffic.",
      "Monitoring router CPU/RAM load and interface packet drops.",
      "Updating routing tables to accommodate new office networks."
    ],
    useCases: [
      {
        title: "Multi-Department Isolation",
        desc: "Separating HR, Finance, and IT traffic into distinct subnets on the same physical switch using VLANs, and routing between them via a Router-on-a-Stick setup."
      },
      {
        title: "Redundant WAN Links",
        desc: "Setting up OSPF between two office routers so that if the primary leased line fails, traffic automatically reroutes to the backup broadband connection."
      }
    ],
    bestPractices: [
      "Always configure 'service password-encryption' to protect cleartext credentials.",
      "Disable unused interfaces and assign them to a dummy blackhole VLAN.",
      "Use SSH instead of Telnet for secure CLI management.",
      "Document network topology and maintain updated IP tables."
    ],
    troubleshooting: [
      {
        issue: "No Carrier / Line Protocol Down",
        solution: "Verify physical cabling connection, check if correct ports are used, and ensure that the interface is enabled with the 'no shutdown' command."
      },
      {
        issue: "OSPF Adjacency not forming",
        solution: "Check if OSPF Area IDs, Hello/Dead timers, or subnet masks match on both neighboring interfaces. Verify connectivity using ping."
      }
    ],
    commands: [
      { cmd: "show ip interface brief", desc: "Quick status summary of all interface IPs." },
      { cmd: "show ip route", desc: "Displays the active routing table." },
      { cmd: "show ip ospf neighbor", desc: "Verifies OSPF neighbor relationships." },
      { cmd: "copy running-config startup-config", desc: "Saves configured changes to NVRAM." },
      { cmd: "ping <IP_Address>", desc: "Tests network layer reachability." }
    ],
    interviewQuestions: [
      {
        q: "What is the difference between a Layer 2 switch, Layer 3 switch, and a Router?",
        a: "A L2 switch forwards frames using MAC addresses within the same subnet. A L3 switch forwards packets using IP addresses and supports basic routing. A Router connects different networks and WAN paths, offering advanced QoS and security."
      },
      {
        q: "What is VLSM?",
        a: "Variable Length Subnet Masking (VLSM) allows network administrators to partition an IP space into subnets of different sizes, reducing IP wastage by tailoring mask lengths to specific host requirements."
      },
      {
        q: "Explain OSPF Router Adjacency states.",
        a: "Neighbors transition through states: Down -> Attempt -> Init -> 2-Way (Bi-directional communication) -> ExStart -> Exchange (DBD routing info swapped) -> Loading -> Full (Database fully synchronized)."
      }
    ],
    steps: [
      {
        title: "Topology Setup",
        desc: "Place 2 Cisco 2911 Routers (R1, R2) and 2 Switches (S1, S2) on the Packet Tracer workspace.\nConnect R1 to R2 using a GigabitEthernet cross cable. Connect R1 to S1, and R2 to S2."
      },
      {
        title: "Subnet IP Allocation Plan",
        desc: "We have network pool: `192.168.1.0/24`. Subnet it for:\n- Subnet A (S1 Lan): needs 50 hosts -> `192.168.1.0/26` (Subnet mask: `255.255.255.192`)\n- Subnet B (S2 Lan): needs 30 hosts -> `192.168.1.64/27` (Subnet mask: `255.255.255.224`)\n- Subnet C (R1-R2 link): needs 2 hosts -> `192.168.1.96/30` (Subnet mask: `255.255.255.252`)"
      },
      {
        title: "Router CLI Configurations",
        desc: "Double-click R1 -> CLI tab. Configure interfaces:\n```ios\nRouter> enable\nRouter# configure terminal\nRouter(config)# interface gig0/0\nRouter(config-if)# ip address 192.168.1.1 255.255.255.192\nRouter(config-if)# no shutdown\n\nRouter(config-if)# interface gig0/1\nRouter(config-if)# ip address 192.168.1.97 255.255.255.252\nRouter(config-if)# no shutdown\n```\nRepeat similar configs on R2 (gig0/0 to `192.168.1.65`, gig0/1 to `192.168.1.98`)."
      },
      {
        title: "OSPF Routing Enable",
        desc: "Enable OSPF dynamic routing on R1:\n```ios\nRouter(config)# router ospf 1\nRouter(config-router)# network 192.168.1.0 0.0.0.63 area 0\nRouter(config-router)# network 192.168.1.96 0.0.0.3 area 0\n```\nConfigure R2 with its network pools under OSPF area 0. Test ping from PC1 (S1) to PC2 (S2)."
      }
    ],
    tasks: [
      "Open Packet Tracer and build the topology with switches and routers",
      "Calculate subnet ranges for 50 hosts, 30 hosts, and WAN link",
      "Configure GigabitEthernet interface IPs on Router 1",
      "Configure GigabitEthernet interface IPs on Router 2",
      "Configure static gateway IPs on Switch LAN computers",
      "Configure OSPF routing process 1 on Router 1",
      "Configure OSPF routing process 1 on Router 2",
      "Run ping tests between subnets and verify neighbor adjacencies"
    ]
  },
  {
    id: "lab_rhcsa_linux",
    title: "RHCSA Red Hat Linux Local Sandbox Setup",
    icon: "🐧",
    duration: "4 Hours",
    role: "RHCSA Linux Track",
    prerequisites: "VMware Workstation Player, Red Hat Enterprise Linux 9 ISO (Developer Account).",
    objective: "Configure a local Red Hat Linux virtual machine. Practice user accounts provisioning, file permissions configurations (SUID/SGID), LVM logic storage setup, and systemd services management.",
    definition: "Red Hat Enterprise Linux (RHEL) is an enterprise-class Linux operating system. RHCSA (Red Hat Certified System Administrator) validates core skills in configuring local storage, managing security settings (SELinux, firewalls, permissions), and automating tasks.",
    purpose: "Provide a secure, reliable, and open-source platform for hosting mission-critical enterprise applications, database servers, and cloud workloads.",
    architecture: [
      "Kernel & Shell: Core operating system and command interpreter (Bash) coordinating system processes.",
      "LVM (Logical Volume Manager): Flexible storage abstraction layer consisting of PV, VG, and LV.",
      "Systemd: The init system and service manager controlling daemons and services.",
      "SELinux (Security-Enhanced Linux): Kernel security module that enforces Mandatory Access Control (MAC)."
    ],
    installation: [
      "Allocate 2GB RAM, 20GB disk space for a VM in VMware or VirtualBox.",
      "Mount RHEL 9 ISO, complete boot, select English interface, and configure partition defaults.",
      "Set Root password, create primary administrator account, and install.",
      "Run 'subscription-manager register' to enable package repositories.",
      "Verify network settings and SSH server status."
    ],
    dailyTasks: [
      "Managing user accounts, resetting passwords, and adjusting group assignments.",
      "Expanding logical volumes when log directories or partitions run low on disk space.",
      "Installing and updating software packages via dnf.",
      "Checking system logs using journalctl to diagnose daemon crashes."
    ],
    useCases: [
      {
        title: "Dynamic Storage Scaling",
        desc: "Automatically resizing database partitions (e.g. /var/lib/mysql) on-the-fly without downtime by adding virtual disks and extending the Logical Volume."
      },
      {
        title: "Shared Team Workspace",
        desc: "Setting up a directory (/projects/billing) where members of the billing group can read/write files, and ensuring new files automatically inherit the billing group ownership using the SGID bit."
      }
    ],
    bestPractices: [
      "Never log in directly as root; use sudo for administrative privileges.",
      "Keep SELinux in Enforcing mode in production.",
      "Configure automatic security updates via DNF automatic.",
      "Set up key-based SSH authentication and disable password auth."
    ],
    troubleshooting: [
      {
        issue: "LVM Full error",
        solution: "Use 'lvextend -r -L +2G /dev/vg/lv' to dynamically resize the logical volume and resize the filesystem in a single step. Verify size with 'df -h'."
      },
      {
        issue: "SELinux Permission Denied",
        solution: "Temporarily test in Permissive mode using 'setenforce 0'. Update context rules permanently using 'chcon' or 'semanage fcontext' to match directory policies."
      }
    ],
    commands: [
      { cmd: "pvcreate /dev/sdb", desc: "Initializes a physical disk for LVM use." },
      { cmd: "vgcreate myvg /dev/sdb", desc: "Groups physical volumes into a Volume Group." },
      { cmd: "lvcreate -n mylv -L 5G myvg", desc: "Creates a 5GB Logical Volume." },
      { cmd: "systemctl status httpd", desc: "Checks status of the Apache Web Server." },
      { cmd: "journalctl -u sshd -n 20", desc: "Shows the last 20 log entries for the SSH service." }
    ],
    interviewQuestions: [
      {
        q: "What is the difference between SUID, SGID, and the Sticky Bit?",
        a: "SUID (Set Owner User ID) runs a file with the permissions of the file owner. SGID (Set Group ID) runs a file with group owner permissions, or in a directory, causes new files to inherit the group ownership. Sticky Bit prevents users from deleting files owned by others in a shared directory."
      },
      {
        q: "How does LVM work?",
        a: "LVM abstracts physical hard drives into a flexible pool. Physical Volumes (PVs) are physical partitions/disks. They are grouped into Volume Groups (VGs). From VGs, we carve out Logical Volumes (LVs), which are formatted with filesystems and mounted like normal partitions."
      },
      {
        q: "What is SELinux and what are its modes?",
        a: "SELinux is a Linux kernel security module that provides access control policies. It has three modes: Enforcing (blocks and logs policy violations), Permissive (does not block, only logs violations), and Disabled (completely turned off)."
      }
    ],
    steps: [
      {
        title: "Install RHEL 9",
        desc: "Open VMware Workstation and create a new virtual machine. Select RHEL 9 ISO.\n- Allocate 2GB RAM, 20GB disk space.\n- Finish OS installation, set a Root password, and create a user account."
      },
      {
        title: "User & Permissions Management",
        desc: "Log in and open the Terminal:\n1. Create groups: `sudo groupadd sysadmins`\n2. Add user: `sudo useradd -g sysadmins ryan`\n3. Create directory: `sudo mkdir /data/shared`\n4. Configure SGID to inherit group ownership:\n```bash\nsudo chown :sysadmins /data/shared\nsudo chmod 2770 /data/shared\n```"
      },
      {
        title: "Configure Local LVM Storage",
        desc: "Add a secondary 10GB Virtual disk to the VM. Scan new storage block:\n```bash\nlsblk\n# Create PV\nsudo pvcreate /dev/sdb\n# Create VG\nsudo vgcreate datavg /dev/sdb\n# Create LV\nsudo lvcreate -n datalv -L 5G datavg\n# Format File system\nsudo mkfs.xfs /dev/datavg/datalv\n# Mount permanently in fstab\nsudo mount /dev/datavg/datalv /mnt\n```"
      }
    ],
    tasks: [
      "Install RHEL 9 in VMware with root and user privileges",
      "Configure local group 'sysadmins' and add user 'ryan'",
      "Create shared directory and set SGID permission bit",
      "Add secondary virtual disk and confirm partition name",
      "Create Physical Volume and Volume Group named 'datavg'",
      "Allocate 5GB Logical Volume named 'datalv'",
      "Format LV with XFS file system and mount to '/mnt'",
      "Add mount entry to '/etc/fstab' and test with 'mount -a'"
    ]
  }
];

export default function LabGuides() {
  const [activeGuideId, setActiveGuideId] = useState(LAB_GUIDES[0].id);
  const [expandedStep, setExpandedStep] = useState(0);
  const [subTab, setSubTab] = useState('procedure'); // 'procedure', 'theory', 'commands', 'industry', 'troubleshoot', 'interview'
  const [revealedAnswer, setRevealedAnswer] = useState(-1);
  const [copiedIndex, setCopiedIndex] = useState(null);

  // Completed checklist task trackers saved in localStorage
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('engineeros_completed_tasks');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('engineeros_completed_tasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

  // Reset tab values when changing active guide
  useEffect(() => {
    setRevealedAnswer(-1);
    setCopiedIndex(null);
  }, [activeGuideId]);

  const activeGuide = LAB_GUIDES.find(g => g.id === activeGuideId);

  const toggleTask = (taskKey) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskKey]: !prev[taskKey]
    }));
  };

  const resetProgress = (guideId) => {
    if (window.confirm("Are you sure you want to reset all progress for this lab?")) {
      const updated = { ...completedTasks };
      const guide = LAB_GUIDES.find(g => g.id === guideId);
      if (guide) {
        guide.tasks.forEach(task => {
          delete updated[`${guideId}_${task}`];
        });
      }
      setCompletedTasks(updated);
    }
  };

  const calculateProgress = (guide) => {
    if (!guide) return 0;
    const guideTasks = guide.tasks;
    const completedCount = guideTasks.filter(t => completedTasks[`${guide.id}_${t}`]).length;
    return Math.round((completedCount / guideTasks.length) * 100);
  };

  const handleCopyCommand = (cmdText, idx) => {
    navigator.clipboard.writeText(cmdText);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="border-b border-gray-800 pb-6 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-textPrimary flex items-center gap-2">
          ⚙️ Step-by-Step Home Lab Guides
        </h1>
        <p className="text-textMuted mt-1">Guided checklists to set up local virtual network labs on your home computer.</p>
      </div>

      {/* Selectors */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none border-b border-gray-850">
        {LAB_GUIDES.map(guide => {
          const isActive = activeGuideId === guide.id;
          const progressPercent = calculateProgress(guide);

          return (
            <button
              key={guide.id}
              onClick={() => {
                setActiveGuideId(guide.id);
                setExpandedStep(0);
                setSubTab('procedure');
              }}
              className={`text-left p-4 rounded-xl border transition-all shrink-0 w-64 flex flex-col justify-between ${
                isActive
                  ? 'bg-primaryAccent/10 border-primaryAccent text-textPrimary'
                  : 'bg-cardBg border-gray-800 text-textMuted hover:border-gray-700'
              }`}
            >
              <div>
                <span className="text-xl block mb-2">{guide.icon}</span>
                <h4 className="text-xs font-bold text-textPrimary leading-tight mb-1">{guide.title}</h4>
                <span className="text-[10px] text-textMuted uppercase font-semibold">{guide.role}</span>
              </div>

              {/* Progress bar */}
              <div className="w-full mt-4">
                <div className="flex items-center justify-between text-[9px] font-mono mb-1">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full bg-sidebarBg h-1 rounded-full overflow-hidden">
                  <div
                    className="bg-primaryAccent h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Lab details nested tabs */}
      {activeGuide && (
        <div className="space-y-6">
          {/* Sub-tab selection */}
          <div className="flex border-b border-gray-800 gap-4 overflow-x-auto pb-1.5 scrollbar-none">
            {[
              { id: 'procedure', label: '📁 Lab Procedure' },
              { id: 'theory', label: '📖 Core Theory' },
              { id: 'commands', label: '💻 Cheat Sheet' },
              { id: 'industry', label: '🏢 Industry Practice' },
              { id: 'troubleshoot', label: '🛠️ Troubleshooting' },
              { id: 'interview', label: '🎯 Interview Prep' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setSubTab(tab.id);
                  setExpandedStep(0);
                }}
                className={`text-xs font-bold pb-2 border-b-2 transition-all px-1 shrink-0 ${
                  subTab === tab.id
                    ? 'border-primaryAccent text-primaryAccent'
                    : 'border-transparent text-textMuted hover:text-textPrimary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Sub-tab Views */}
          {subTab === 'procedure' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
              {/* Steps & Topology (Left) */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-850 pb-2">
                    <span className="text-xs font-bold text-primaryAccent uppercase tracking-wide">Lab Objectives</span>
                    <span className="text-[10px] text-textMuted font-mono">Estimated: {activeGuide.duration}</span>
                  </div>
                  <p className="text-xs leading-relaxed text-textSecondary">{activeGuide.objective}</p>
                  
                  <div className="p-3 bg-darkBg/60 border border-gray-850 rounded-lg text-xs leading-relaxed">
                    <span className="block text-[10px] font-bold text-textMuted uppercase tracking-wider mb-1">Prerequisites & Software</span>
                    {activeGuide.prerequisites}
                  </div>
                </div>

                {/* Steps Accordion */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-textMuted uppercase tracking-wide px-1">Lab Execution Steps</h3>
                  
                  {activeGuide.steps.map((step, idx) => {
                    const isExpanded = expandedStep === idx;
                    
                    return (
                      <div key={idx} className="bg-cardBg border border-gray-800 rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedStep(isExpanded ? -1 : idx)}
                          className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-sidebarBg/50 transition-colors"
                        >
                          <h4 className="text-xs font-bold text-textPrimary flex items-center gap-2">
                            <span className="bg-primaryAccent/10 text-primaryAccent border border-primaryAccent/20 px-2 py-0.5 rounded font-mono">Step {idx + 1}</span>
                            {step.title}
                          </h4>
                          {isExpanded ? <ChevronUp size={16} className="text-textMuted" /> : <ChevronDown size={16} className="text-textMuted" />}
                        </button>

                        {isExpanded && (
                          <div className="px-5 pb-5 pt-2 border-t border-gray-850 bg-black/10 animate-fadeIn">
                            <pre className="text-xs text-textSecondary whitespace-pre-wrap font-sans leading-relaxed">
                              {step.desc}
                            </pre>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Verification Checklist (Right) */}
              <div className="space-y-6">
                <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-850 pb-2">
                    <span className="text-xs font-bold text-successGreen uppercase tracking-wide">Tasks Checklist</span>
                    <button
                      onClick={() => resetProgress(activeGuide.id)}
                      className="text-[10px] text-textMuted hover:text-red-400 font-bold"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                    {activeGuide.tasks.map((task, index) => {
                      const taskKey = `${activeGuide.id}_${task}`;
                      const isChecked = !!completedTasks[taskKey];

                      return (
                        <label
                          key={index}
                          className={`flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer select-none transition-all text-xs font-medium ${
                            isChecked
                              ? 'border-successGreen/30 bg-successGreen/5 text-successGreen'
                              : 'border-gray-850 bg-sidebarBg/20 text-textSecondary hover:border-gray-800'
                          }`}
                          onClick={() => toggleTask(taskKey)}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => {}}
                            className="accent-successGreen mt-0.5 cursor-pointer"
                          />
                          <span className={isChecked ? 'line-through text-successGreen/75' : ''}>{task}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {subTab === 'theory' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-primaryAccent flex items-center gap-1.5 border-b border-gray-850 pb-2">
                  <BookOpen size={16} /> Definition
                </h3>
                <p className="text-xs leading-relaxed text-textSecondary">{activeGuide.definition}</p>
              </div>
              <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-successGreen flex items-center gap-1.5 border-b border-gray-850 pb-2">
                  <Layers size={16} /> Purpose & Goal
                </h3>
                <p className="text-xs leading-relaxed text-textSecondary">{activeGuide.purpose}</p>
              </div>
              <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-amber-400 flex items-center gap-1.5 border-b border-gray-850 pb-2">
                  <Server size={16} /> Architecture & Components
                </h3>
                <ul className="space-y-2 text-xs text-textSecondary">
                  {activeGuide.architecture.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {subTab === 'commands' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 animate-fadeIn">
              <div className="lg:col-span-2 bg-cardBg border border-gray-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-textPrimary flex items-center gap-1.5 border-b border-gray-850 pb-2">
                  ⚙️ Installation & Configuration
                </h3>
                <ul className="space-y-3 text-xs text-textSecondary">
                  {activeGuide.installation.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <span className="bg-gray-800 text-textPrimary font-mono px-2 py-0.5 rounded text-[10px]">{idx + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="lg:col-span-3 bg-cardBg border border-gray-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-textPrimary flex items-center gap-1.5 border-b border-gray-850 pb-2">
                  💻 CLI Commands Cheat Sheet
                </h3>
                <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                  {activeGuide.commands.map((cmdItem, idx) => (
                    <div key={idx} className="bg-darkBg/60 border border-gray-850 rounded-lg p-3 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                      <div className="space-y-1">
                        <code className="text-primaryAccent font-mono font-bold block">{cmdItem.cmd}</code>
                        <span className="text-textMuted text-[10px]">{cmdItem.desc}</span>
                      </div>
                      <button
                        onClick={() => handleCopyCommand(cmdItem.cmd, idx)}
                        className="bg-sidebarBg hover:bg-gray-800 text-textMuted hover:text-textPrimary px-2.5 py-1 rounded text-[10px] font-bold border border-gray-850 transition-colors shrink-0 self-end md:self-center"
                      >
                        {copiedIndex === idx ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {subTab === 'industry' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
              <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-blue-400 flex items-center gap-1.5 border-b border-gray-850 pb-2">
                  📅 Daily Admin Tasks
                </h3>
                <ul className="space-y-2 text-xs text-textSecondary">
                  {activeGuide.dailyTasks.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-400 font-bold">•</span>
                      <span>{task}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-purple-400 flex items-center gap-1.5 border-b border-gray-850 pb-2">
                  🏢 Real Industry Use Cases
                </h3>
                <ul className="space-y-3 text-xs text-textSecondary">
                  {activeGuide.useCases.map((uc, idx) => (
                    <li key={idx} className="space-y-1">
                      <span className="font-bold text-textPrimary text-[11px] block">{uc.title}</span>
                      <p className="text-textMuted leading-relaxed">{uc.desc}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-cardBg border border-gray-800 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold text-successGreen flex items-center gap-1.5 border-b border-gray-850 pb-2">
                  🛡️ Production Best Practices
                </h3>
                <ul className="space-y-2 text-xs text-textSecondary">
                  {activeGuide.bestPractices.map((bp, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-successGreen font-bold">•</span>
                      <span>{bp}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {subTab === 'troubleshoot' && (
            <div className="bg-cardBg border border-gray-800 rounded-xl p-6 space-y-4 animate-fadeIn">
              <h3 className="text-sm font-bold text-textPrimary flex items-center gap-1.5 border-b border-gray-850 pb-2">
                🛠️ Troubleshooting & Diagnostics Guide
              </h3>
              <div className="space-y-4">
                {activeGuide.troubleshooting.map((item, idx) => (
                  <div key={idx} className="bg-darkBg/60 border border-gray-850 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-red-400 font-bold text-xs">
                      <ShieldAlert size={14} />
                      <span>Error/Issue: {item.issue}</span>
                    </div>
                    <div className="text-xs leading-relaxed text-textSecondary">
                      <span className="font-semibold text-successGreen block mb-0.5">Resolution Workflow:</span>
                      {item.solution}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {subTab === 'interview' && (
            <div className="space-y-4 max-w-3xl mx-auto animate-fadeIn">
              <div className="border-b border-gray-800 pb-2 mb-4">
                <h3 className="text-sm font-bold text-textPrimary">🎯 Certification & Job Interview Practice</h3>
                <p className="text-[10px] text-textMuted">Click on any question to toggle and reveal the professional detailed answer.</p>
              </div>
              
              {activeGuide.interviewQuestions.map((qaItem, idx) => {
                const isRevealed = revealedAnswer === idx;
                return (
                  <div key={idx} className="bg-cardBg border border-gray-800 rounded-xl overflow-hidden">
                    <button
                      onClick={() => setRevealedAnswer(isRevealed ? -1 : idx)}
                      className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-sidebarBg/50 transition-colors"
                    >
                      <h4 className="text-xs font-bold text-textPrimary flex items-start gap-3">
                        <span className="text-primaryAccent">Q{idx + 1}:</span>
                        <span>{qaItem.q}</span>
                      </h4>
                      <span className="text-[10px] text-primaryAccent font-bold shrink-0 ml-4">
                        {isRevealed ? 'Hide Answer' : 'Show Answer'}
                      </span>
                    </button>
                    {isRevealed && (
                      <div className="px-5 pb-5 pt-3 border-t border-gray-850 bg-black/10 animate-fadeIn text-xs leading-relaxed text-textSecondary font-medium">
                        <span className="block font-bold text-successGreen mb-1">Answer / Explanation:</span>
                        {qaItem.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
