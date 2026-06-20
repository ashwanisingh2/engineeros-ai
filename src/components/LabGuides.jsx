import React, { useState, useEffect } from 'react';
import { Server, CheckSquare, BookOpen, Layers, Terminal, ChevronDown, ChevronUp } from 'lucide-react';

const LAB_GUIDES = [
  {
    id: "lab_ad_dns",
    title: "Windows Server 2022 AD DS & DNS Lab",
    icon: "🪟",
    duration: "4-6 Hours",
    role: "L2 Sysadmin Track",
    prerequisites: "Oracle VirtualBox, Windows Server 2022 ISO (Evaluation), Windows 10/11 ISO, 16GB Host RAM.",
    objective: "Setup a local Active Directory Domain Services (AD DS) lab. Promote DC01, configure DHCP/DNS servers, configure a Group Policy Object, and join a Windows Client PC to the domain.",
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

  // Completed checklist task trackers saved in localStorage
  const [completedTasks, setCompletedTasks] = useState(() => {
    const saved = localStorage.getItem('engineeros_completed_tasks');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('engineeros_completed_tasks', JSON.stringify(completedTasks));
  }, [completedTasks]);

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

      {/* Lab Details */}
      {activeGuide && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
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
    </div>
  );
}
