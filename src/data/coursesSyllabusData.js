// EngineerOS AI — Course Syllabus & Study Guide Database
// All 16 courses with complete Matt Pocock style lessons, problems, and solutions.
// Follows the structure: Definition, Purpose, Components, Installation/Config, Daily Tasks, Real Use Cases, Troubleshooting, Best Practices, Interview Questions, Commands.

export const COURSES_SYLLABUS_DATA = {
  // 1. Computer Hardware & Troubleshooting (9 modules)
  1: [
    {
      id: "01.01",
      title: "01.01-cpu-architecture-basics",
      name: "CPU Architecture Basics",
      explainer: `✅ **Definition & Purpose**: CPU is the primary processing engine. It executes instructions (Fetch-Decode-Execute).
✅ **Architecture / Components**: Arithmetic Logic Unit (ALU), Control Unit (CU), Registers, L1/L2/L3 Cache levels.
✅ **Daily Tasks**: Monitoring thread usage, checking core temperatures, and identifying CPU throttling.
✅ **Real Industry Use Cases**: Selecting multi-core Xeon/EPYC CPUs for database hosts versus high-frequency CPUs for active directory nodes.
✅ **Troubleshooting**: Thermal paste degradation, bent socket pins, and CPU bottlenecks.
✅ **Best Practices**: Keep airflow clear, apply thermal paste in a cross/dot pattern, and lock CPU settings in BIOS.
✅ **Interview Questions**: What is the difference between hyper-threading and multi-core? (Ans: Cores are physical processors; hyper-threading splits a physical core into two virtual logical cores).
✅ **Commands / Cheat Sheet**: Windows: \`wmic cpu get Name, NumberOfCores\` | Linux: \`lscpu\``,
      problem: "A rack server shuts down automatically within 5 minutes of booting up under active load. Diagnostic logs show no OS errors.",
      solution: "Check the CPU temperature in BIOS or iDRAC/ILO. The thermal paste has likely dried up or the cooling fan header has failed. Reseat the CPU, clean old paste with isopropyl alcohol, re-apply thermal paste, and verify fan operation."
    },
    {
      id: "01.02",
      title: "01.02-ram-slots-and-troubleshooting",
      name: "RAM Slots and Troubleshooting",
      explainer: `✅ **Definition & Purpose**: RAM is volatile primary storage hosting active code and operating system instructions.
✅ **Architecture / Components**: Memory slots, DIMM pins, SPD chips, and dual-channel memory configuration.
✅ **Daily Tasks**: Reseating loose RAM modules, running MemTest86 diagnostic scans, and checking memory speeds.
✅ **Real Industry Use Cases**: Deploying ECC (Error-Correcting Code) RAM on production servers to prevent system crashes from single-bit errors.
✅ **Troubleshooting**: Missing RAM capacity in OS, failure to POST with continuous beep codes, and memory leak BSODs.
✅ **Best Practices**: Install RAM in matching pairs in slots 2 and 4 (A2/B2) for dual-channel speed configurations.
✅ **Interview Questions**: What is ECC RAM and why is it preferred on server motherboards? (Ans: ECC detects and corrects single-bit memory corruption on the fly).
✅ **Commands / Cheat Sheet**: Windows: \`wmic memorychip get capacity, speed\` | Linux: \`free -m\` or \`dmidecode -t memory\``,
      problem: "A desktop PC powers on but displays a blank black screen. The motherboard emits 3 long, repeating beeps.",
      solution: "3 long beeps typically indicate a memory error. Unplug power, open the case, remove RAM modules, clean contact pins with an eraser, blow dust from DIMM slots, and insert one RAM stick into slot A2 to test."
    },
    {
      id: "01.03",
      title: "01.03-motherboard-form-factors",
      name: "Motherboard Form Factors",
      explainer: `✅ **Definition & Purpose**: The main printed circuit board connecting all internal computer components together.
✅ **Architecture / Components**: Chipsets, PCIe expansion slots, VRMs, SATA connectors, and I/O panel.
✅ **Daily Tasks**: Aligning motherboard standoffs, checking capacitor swelling, and updating UEFI BIOS.
✅ **Real Industry Use Cases**: Deploying Mini-ITX boards for retail POS kiosks and ATX boards for administrator workstations.
✅ **Troubleshooting**: Dead CMOS battery causing clock loss, short circuits from misaligned standoffs, and BIOS corruptions.
✅ **Best Practices**: Never power a board without checking standoffs; avoid touching capacitors directly to prevent ESD damage.
✅ **Interview Questions**: What are the differences between ATX, Micro-ATX, and Mini-ITX? (Ans: Layout dimensions: ATX is 12x9.6 inches, Micro-ATX is 9.6x9.6 inches, and Mini-ITX is 6.7x6.7 inches).
✅ **Commands / Cheat Sheet**: Windows: \`wmic baseboard get product, manufacturer\` | Linux: \`dmidecode -t baseboard\``,
      problem: "A computer loses its system date, time, and custom boot configuration settings every time it is unplugged from the wall.",
      solution: "The CR2032 CMOS battery on the motherboard has drained below 3V. Replace the battery, boot to UEFI, reconfigure custom settings (like AHCI/RAID modes), and sync the time with NTP."
    },
    {
      id: "01.04",
      title: "01.04-power-supply-units-psu",
      name: "Power Supply Units (PSU)",
      explainer: `✅ **Definition & Purpose**: Converts AC power from the wall outlet into regulated DC power (3.3V, 5V, 12V) for PC components.
✅ **Architecture / Components**: ATX 24-pin power connector, 8-pin EPS, PCIe power rails, and active/passive cooling.
✅ **Daily Tasks**: Verifying PSU voltage outputs using a multimeter, estimating total system wattage, and cleaning dust.
✅ **Real Industry Use Cases**: Installing dual redundant hot-swappable power supplies in network rack servers.
✅ **Troubleshooting**: No-power systems, sudden resets during gaming or CPU load, and squealing capacitor noise.
✅ **Best Practices**: Choose 80 Plus Gold certified PSUs; calculate wattage with 20% overhead buffer.
✅ **Interview Questions**: What is a redundant power supply configuration? (Ans: Two or more PSUs connected to separate power grids so if one fails, the other takes over instantly).
✅ **Commands / Cheat Sheet**: Test pins: Jump Pin 16 (Green - PS_ON) to Pin 17 (Black - Ground) to test if PSU starts.`,
      problem: "A custom server restarts randomly under high data-processing workloads, but works perfectly fine when idle.",
      solution: "Run a power calculator. The total load under stress likely exceeds the maximum wattage capacity of the PSU, or the 12V power rail is failing. Replace the PSU with a higher wattage 80+ Gold certified unit."
    },
    {
      id: "01.05",
      title: "01.05-storage-drives-hdd-ssd-nvme",
      name: "Storage Types: HDD, SSD, NVMe",
      explainer: `✅ **Definition & Purpose**: Non-volatile storage devices designed to store operational and user data permanently.
✅ **Architecture / Components**: HDD (Platters, Actuator Arm, SATA), SATA SSD (NAND Flash, Controller), NVMe SSD (M.2, PCIe bus).
✅ **Daily Tasks**: Checking drive health via S.M.A.R.T attributes, monitoring IOPS performance, and setting up storage pools.
✅ **Real Industry Use Cases**: Using NVMe SSDs for OS boot volumes and large HDD arrays for cold archive backups.
✅ **Troubleshooting**: Clicking sounds in HDDs, write-protection lockouts on worn SSDs, and M.2 drives not detected in BIOS.
✅ **Best Practices**: Enable AHCI in BIOS for SATA SSDs; keep NVMe drives under 80% capacity to maintain write speeds.
✅ **Interview Questions**: Why is NVMe faster than SATA SSD? (Ans: NVMe uses the direct PCIe lanes and NVMe protocol, whereas SATA is capped by the SATA III bus).
✅ **Commands / Cheat Sheet**: Windows: \`wmic diskdrive get status, model\` | Linux: \`smartctl -a /dev/sda\``,
      problem: "An older office PC takes over 3 minutes to boot to the login screen and files take a long time to open.",
      solution: "Check the disk performance tab. The HDD is likely bottlenecked or failing. Backup the data, replace the mechanical HDD with a 2.5-inch SATA SSD, reinstall the OS, and enable AHCI mode in UEFI."
    },
    {
      id: "01.06",
      title: "01.06-bios-uefi-configuration",
      name: "BIOS vs UEFI Settings",
      explainer: `✅ **Definition & Purpose**: Firmware interface that initializes system hardware components before booting the OS loader.
✅ **Architecture / Components**: CMOS chip, Secure Boot keys, TPM modules, Fast Boot, and Boot Order priorities.
✅ **Daily Tasks**: Configuring boot order, enabling TPM 2.0 for Windows 11 upgrades, and locking BIOS password.
✅ **Real Industry Use Cases**: Enforcing Secure Boot across corporate laptops to block rootkits and unauthorized OS boots.
✅ **Troubleshooting**: System stuck in boot loops, 'No Boot Device Found' errors, and password lockout.
✅ **Best Practices**: Backup BIOS configurations before flashing update files; never shut down power during firmware upgrades.
✅ **Interview Questions**: What is the difference between legacy BIOS and UEFI? (Ans: UEFI supports drives > 2TB, supports mouse navigation, Secure Boot, and handles modern partition tables like GPT).
✅ **Commands / Cheat Sheet**: Windows: Run \`msinfo32\` to inspect BIOS Mode (Legacy or UEFI) and Secure Boot state.`,
      problem: "A technician attempts to install Windows 11 on a machine but the installer warns that the hardware is incompatible.",
      solution: "Enter UEFI settings by pressing Del/F2 at boot. Locate the security settings and enable TPM 2.0 (Intel PTT / AMD fTPM) and switch boot mode from CSM/Legacy to UEFI and enable Secure Boot."
    },
    {
      id: "01.07",
      title: "01.07-cooling-systems-thermal-throttling",
      name: "Cooling and Thermal Throttling",
      explainer: `✅ **Definition & Purpose**: Heat dissipation mechanisms to prevent hardware damage from thermal buildup.
✅ **Architecture / Components**: Heatsinks, heat pipes, thermal paste, case fans, AIO liquid pumps.
✅ **Daily Tasks**: Cleaning dust from radiator fins, replacing fans, and adjusting BIOS fan curves.
✅ **Real Industry Use Cases**: Configuring push-pull cooling systems in datacenters with hot/cold aisle layouts.
✅ **Troubleshooting**: CPU throttling down to 800MHz under load, grinding fan bearings, and pump failure in liquid coolers.
✅ **Best Practices**: Maintain positive pressure (more intake fans than exhaust) to reduce dust accumulation inside.
✅ **Interview Questions**: What is thermal throttling? (Ans: A safety feature where a CPU automatically drops its clock speed to reduce heat output when reaching critical temperature limits).
✅ **Commands / Cheat Sheet**: Windows: Use OpenHardwareMonitor | Linux: \`sensors\` command.`,
      problem: "A laptop runs sluggishly and fan noise is extremely loud. Checking Task Manager shows 10% CPU usage, but clock speed is stuck at 0.79 GHz.",
      solution: "The CPU is thermal throttling. Disassemble the chassis, clean dust clogs from the copper heat exchanger fins, replace the dry thermal paste on the CPU, and ensure the cooling fan rotates freely."
    },
    {
      id: "01.08",
      title: "01.08-pc-post-diagnostic-beeps",
      name: "POST and Beep Codes",
      explainer: `✅ **Definition & Purpose**: Power-On Self-Test (POST) runs preliminary firmware checks on critical hardware (CPU, RAM, GPU, BIOS).
✅ **Architecture / Components**: Motherboard POST speaker, debug LEDs, and 2-digit POST code diagnostic cards.
✅ **Daily Tasks**: Decoding motherboard vendor manuals, using diagnostic POST cards, and resolving core component failures.
✅ **Real Industry Use Cases**: Using IPMI/out-of-band management console logs to diagnose POST failures on remote rack servers.
✅ **Troubleshooting**: Endless POST loops, CPU diagnostic LED lit red, and system turning on but failing to output BIOS screens.
✅ **Best Practices**: Disconnect all non-essential peripherals (printers, USB keys) when troubleshooting a POST failure.
✅ **Interview Questions**: What is a POST card? (Ans: An expansion card plugged into a PCIe/PCI slot that displays hex error codes sent by BIOS during POST).
✅ **Commands / Cheat Sheet**: Consult AMI/Award BIOS beep code maps: 1 short = OK; 1 long, 2 short = Graphics Card failure.`,
      problem: "A server fails to boot up. Fans spin up at max speed, but no video output is shown. The motherboard debug LED is stuck on 'CPU'.",
      solution: "Unplug power. Reseat the CPU EPS 8-pin power connector. If the problem persists, remove the CPU heatsink, inspect the socket pins for damage, and try booting with only a single stick of RAM."
    },
    {
      id: "01.09",
      title: "01.09-peripheral-interfaces-expansion-slots",
      name: "Peripheral Interfaces & Expansion",
      explainer: `✅ **Definition & Purpose**: I/O protocols and physical slots allowing connection of external and internal expansion hardware.
✅ **Architecture / Components**: PCIe lanes (x1, x4, x8, x16), USB 3.2, USB-C Alt Mode, Thunderbolt, and hardware drivers.
✅ **Daily Tasks**: Installing network cards, assigning driver packages, and optimizing PCIe bandwidth allocations.
✅ **Real Industry Use Cases**: Selecting Thunderbolt interfaces for direct high-speed external storage arrays.
✅ **Troubleshooting**: PCIe card not detected in OS, driver code 43 errors in device manager, and bandwidth bottlenecks.
✅ **Best Practices**: Always install graphics/storage cards in the primary PCIe x16 slot closest to the CPU socket.
✅ **Interview Questions**: What is the difference between Thunderbolt and USB-C? (Ans: USB-C is a physical connector shape, while Thunderbolt is a data transfer protocol running over USB-C shape at up to 40Gbps).
✅ **Commands / Cheat Sheet**: Windows: \`devmgmt.msc\` | Linux: \`lspci\` or \`lsusb\``,
      problem: "A new network card installed in a PCIe x4 slot on a server does not show up in the Operating System.",
      solution: "Boot into BIOS settings and check the PCIe slot configuration. The motherboard may have disabled the slot due to sharing lanes with an M.2 NVMe slot. Re-allocate PCIe lanes or move the card to another slot."
    }
  ],

  // 2. CCNA 200-301 (Networking) (11 modules)
  2: [
    {
      id: "02.01",
      title: "02.01-osi-model-layers",
      name: "OSI Model Layers & PDU",
      explainer: `✅ **Definition & Purpose**: Standard reference framework dividing network operations into 7 logical layers for interoperability.
✅ **Architecture / Components**: Layers 1-7: Physical, Data Link, Network, Transport, Session, Presentation, Application.
✅ **Daily Tasks**: Debugging hardware link layers, analyzing packet caps in Wireshark, and configuring router gateways.
✅ **Real Industry Use Cases**: Checking link status lights (Layer 1) before diagnosing routing tables (Layer 3).
✅ **Troubleshooting**: Cable failure (L1), MAC address flapping (L2), bad subnetting (L3), and blocked TCP ports (L4).
✅ **Best Practices**: Use a bottom-up troubleshooting methodology (L1 up to L7) to resolve network tickets.
✅ **Interview Questions**: What is the Protocol Data Unit (PDU) at Layer 2? (Ans: Frame. Layer 3 is Packet, and Layer 4 is Segment).
✅ **Commands / Cheat Sheet**: Windows: \`arp -a\` | Linux: \`ip link show\``,
      problem: "A workstation cannot access the internet, but has an active green link light. Running 'ping 8.8.8.8' returns 'Destination Host Unreachable'.",
      solution: "Verify L3 settings. The gateway IP might be configured incorrectly or missing. Run 'ipconfig' (Windows) or 'ip route' (Linux) to check default gateway configuration and ping the gateway's IP address."
    },
    {
      id: "02.02",
      title: "02.02-ipv4-subnetting-basics",
      name: "IPv4 Subnetting & VLSM",
      explainer: `✅ **Definition & Purpose**: Logical segmentation of IPv4 addresses into subnets to conserve IPs and optimize broadcast domains.
✅ **Architecture / Components**: Netmask, Network ID, Broadcast ID, Host range, CIDR notation (/24, /29, etc.).
✅ **Daily Tasks**: Allocating subnet IP ranges for new office departments and configuring static DHCP reservations.
✅ **Real Industry Use Cases**: Using Variable Length Subnet Masking (VLSM) to allocate small subnets (e.g., /30 or /31) for point-to-point router links.
✅ **Troubleshooting**: Overlapping subnet assignments, incorrect default gateway, and host IP exhaustions.
✅ **Best Practices**: Allocate subnet ranges using IPAM tools; document IP subnets in central repositories.
✅ **Interview Questions**: How many usable IPs are there in a /28 subnet? (Ans: 14. Total IPs = 2^(32-28) = 16. Usable = 16 - 2 = 14).
✅ **Commands / Cheat Sheet**: Host formula: \`2^n - 2\` where n is the number of host bits.`,
      problem: "A system administrator needs to divide the class C network 192.168.10.0/24 into subnets to support 25 hosts per subnet.",
      solution: "To support 25 hosts, we need a subnet mask that offers 2^5 = 32 IPs (30 usable). This leaves 27 bits for the network. Use a /27 subnet mask (255.255.255.224). The first subnet range will be 192.168.10.0/27 (usable hosts: 192.168.10.1 - .30)."
    },
    {
      id: "02.03",
      title: "02.03-vlans-and-routing",
      name: "VLANs & Inter-VLAN Routing",
      explainer: `✅ **Definition & Purpose**: Virtual Local Area Networks segment switch ports into separate logical broadcast domains at Layer 2.
✅ **Architecture / Components**: Access ports, Trunk ports (802.1Q encapsulation), VLAN IDs (1-4094), Subinterfaces.
✅ **Daily Tasks**: Creating VLANs on Cisco switches, assigning access ports, and setting up Trunk links.
✅ **Real Industry Use Cases**: Separating corporate employee traffic (VLAN 10) from guest internet traffic (VLAN 50).
✅ **Troubleshooting**: VLAN mismatch on trunks causing packet loss, missing switchport configurations, and inter-VLAN routing failure.
✅ **Best Practices**: Change the default native VLAN from VLAN 1 to a non-routing VLAN ID for security.
✅ **Interview Questions**: What is a Router-on-a-Stick? (Ans: A configuration where a single physical router interface is split into multiple virtual subinterfaces to route traffic between VLANs).
✅ **Commands / Cheat Sheet**: Cisco Switch: \`vlan 10\` -> \`name Sales\` | \`switchport mode access\` | \`switchport access vlan 10\``,
      problem: "A host on VLAN 10 cannot ping a host on VLAN 20. Both switches are connected via a trunk, and both hosts have correct IP settings.",
      solution: "Check the trunk configuration. Ensure that the trunk interface allows VLAN 10 and 20 (run 'show interfaces trunk'). Ensure a L3 routing device (Router or Layer 3 Switch) is configured with subinterfaces for both VLANs."
    },
    {
      id: "02.04",
      title: "02.04-routing-protocols-ospf",
      name: "OSPF Dynamic Routing",
      explainer: `✅ **Definition & Purpose**: Open Shortest Path First is a Link-State routing protocol that dynamically calculates shortest paths across a network.
✅ **Architecture / Components**: Area 0 (Backbone), LSA packets, Link State Database (LSDB), Dijkstra Shortest Path First algorithm.
✅ **Daily Tasks**: Configuring OSPF areas, adjusting interface costs, and monitoring neighbor relationships.
✅ **Real Industry Use Cases**: Routing traffic across large enterprise networks with multiple redundant path routes.
✅ **Troubleshooting**: Neighbor states stuck in INIT/2-WAY, mismatched subnet masks or OSPF hello timers preventing adjacencies.
✅ **Best Practices**: Always set a static Loopback IP as the OSPF Router ID to prevent neighbor flaps when physical links reset.
✅ **Interview Questions**: What are the neighbor states of OSPF? (Ans: Down, Attempt, Init, 2-Way, ExStart, Exchange, Loading, Full).
✅ **Commands / Cheat Sheet**: Cisco: \`router ospf 1\` | \`network 10.0.0.0 0.255.255.255 area 0\` | \`show ip ospf neighbor\``,
      problem: "Two Cisco routers are connected on a serial interface, but 'show ip ospf neighbor' shows no output.",
      solution: "Verify interface IP status. If up, check that the network statements cover the link interfaces, and check if OSPF Area IDs, Hello/Dead timers, or Authentication keys match on both routers (they must be identical)."
    },
    {
      id: "02.05",
      title: "02.05-switching-concepts-stp",
      name: "Spanning Tree Protocol (STP)",
      explainer: `✅ **Definition & Purpose**: Layer 2 protocol designed to prevent loop storms in networks with redundant switch paths.
✅ **Architecture / Components**: Root Bridge, Root Ports, Designated Ports, Blocking Ports, Bridge Protocol Data Units (BPDUs).
✅ **Daily Tasks**: Configuring primary and secondary root bridges, setting portfast on access ports, and debugging topology changes.
✅ **Real Industry Use Cases**: Designing resilient redundant star topologies with multiple switch stacks.
✅ **Troubleshooting**: Broadcast storms (100% CPU usage on switches), root bridge election issues, and slow convergence.
✅ **Best Practices**: Turn on PortFast on client-facing access ports to bypass listening/learning states instantly.
✅ **Interview Questions**: How is the STP Root Bridge elected? (Ans: The switch with the lowest Bridge Priority wins. If priorities are equal, the switch with the lowest MAC address wins).
✅ **Commands / Cheat Sheet**: Cisco: \`spanning-tree vlan 10 root primary\` | \`show spanning-tree vlan 10\``,
      problem: "A network experiences 100% bandwidth load. Switch link lights flash rapidly, and clients lose connection to the servers.",
      solution: "This is a broadcast loop. A redundant network path has been connected between switches without STP running. Trace and disconnect redundant cables, identify non-STP switches, and enable STP globally."
    },
    {
      id: "02.06",
      title: "02.06-ip-services-dhcp-dns",
      name: "IP Services: DHCP, DNS, NAT",
      explainer: `✅ **Definition & Purpose**: Network services managing dynamic addressing, host naming, and public-private IP translations.
✅ **Architecture / Components**: DHCP (DORA process), DNS (Recursive/Authoritative), NAT (Static, Dynamic, PAT port forwarding).
✅ **Daily Tasks**: Configuring DHCP helper addresses (IP helper-address) on router interfaces, adding DNS records, and setting up NAT pools.
✅ **Real Industry Use Cases**: Using NAT/PAT to allow thousands of internal office users to access the internet using a single public IP.
✅ **Troubleshooting**: DHCP exhaustion, DNS resolution timeouts, and incorrect NAT translations.
✅ **Best Practices**: Put DHCP scope servers on separate server VLANs and use 'ip helper-address' on the gateway interface to forward broadcasts.
✅ **Interview Questions**: What are the four steps of the DHCP process? (Ans: DORA - Discover, Offer, Request, Acknowledge).
✅ **Commands / Cheat Sheet**: Cisco: \`ip helper-address 10.10.10.10\` | \`show ip nat translations\``,
      problem: "Workstations on VLAN 30 fail to get an IP address from the Windows DHCP server located on VLAN 10.",
      solution: "Because routers block broadcasts, the DHCP Discover broadcast on VLAN 30 cannot reach the server on VLAN 10. Configure 'ip helper-address <DHCP_Server_IP>' on the Layer 3 interface/gateway for VLAN 30."
    },
    {
      id: "02.07",
      title: "02.07-access-control-lists-acl",
      name: "Access Control Lists (ACL)",
      explainer: `✅ **Definition & Purpose**: Packet filters used by routers to permit or deny network traffic based on headers.
✅ **Architecture / Components**: Standard ACLs (source IP only), Extended ACLs (source/destination IP, port, and protocol), wildcard masks.
✅ **Daily Tasks**: Implementing security rules, blocking specific subnets, and checking ACL hit counts.
✅ **Real Industry Use Cases**: Blocking direct ssh/rdp traffic to servers from user VLANs while allowing standard web traffic.
✅ **Troubleshooting**: ACL blocking legitimate traffic due to sequence order error (first match logic).
✅ **Best Practices**: Put specific permit/deny rules at the top, and remember there is an implicit 'deny all' at the end of every ACL.
✅ **Interview Questions**: Where should Standard vs Extended ACLs be applied? (Ans: Standard ACLs should be applied closest to the destination. Extended ACLs should be applied closest to the source).
✅ **Commands / Cheat Sheet**: Cisco: \`access-list 101 permit tcp 10.0.0.0 0.255.255.255 any eq 80\` | \`show access-lists\``,
      problem: "A new administrator appends a rule to permit FTP traffic, but users still cannot access the FTP server.",
      solution: "In Cisco IOS, appending a rule adds it to the bottom. If there is a rule denying traffic above it, it will never be matched. Re-sequence the ACL or recreate it placing the permit rule above any blocking rules."
    },
    {
      id: "02.08",
      title: "02.08-cisco-ios-cli-commands",
      name: "Cisco IOS CLI Basics",
      explainer: `✅ **Definition & Purpose**: Command Line Interface to inspect and configure Cisco switches and routers.
✅ **Architecture / Components**: User EXEC mode (\`>\`), Privileged EXEC mode (\`#\`), Global Configuration mode (\`(config)#\`).
✅ **Daily Tasks**: Saving running configs, checking interface statistics, and backing up configurations via TFTP.
✅ **Real Industry Use Cases**: Connecting via serial rollover console cable to configure a brand new switch out of the box.
✅ **Troubleshooting**: Configuration lost on reboot because \`copy running-config startup-config\` was not run.
✅ **Best Practices**: Always verify your configurations using \`show\` commands before writing them to startup-config.
✅ **Interview Questions**: What is the difference between running-config and startup-config? (Ans: Running-config is stored in volatile RAM; startup-config is stored in non-volatile NVRAM and loads on boot).
✅ **Commands / Cheat Sheet**: Save: \`copy run start\` or \`write memory\` | View config: \`show running-config\``,
      problem: "A technician changes the host name of a router, but when the router restarts due to a power outage, the name reverts back.",
      solution: "The technician did not save the changes. Run 'copy running-config startup-config' or 'write memory' to save the RAM configuration to NVRAM so it persists across reboots."
    },
    {
      id: "02.09",
      title: "02.09-wireless-networking-wlan",
      name: "Wireless Networking (WLAN)",
      explainer: `✅ **Definition & Purpose**: Wireless Local Area Networks provide network connectivity using radio frequency signals instead of cables.
✅ **Architecture / Components**: Access Points (APs), Wireless LAN Controllers (WLCs), SSIDs, WPA2/WPA3 security standards.
✅ **Daily Tasks**: Provisioning wireless SSIDs on WLC interfaces, mapping VLANs, and analyzing RF channel interference.
✅ **Real Industry Use Cases**: Deploying thin Access Points controlled by a centralized physical WLC in corporate campuses.
✅ **Troubleshooting**: Client connection drops, channel overlapping causing high packet retries, and WPA3 authentication issues.
✅ **Best Practices**: Use non-overlapping channels (1, 6, 11) in the 2.4 GHz spectrum to prevent co-channel interference.
✅ **Interview Questions**: What is the difference between autonomous APs and lightweight APs? (Ans: Autonomous APs are configured individually; lightweight APs require a WLC for central config and management).
✅ **Commands / Cheat Sheet**: Inspect WLC console for CAPWAP status and active client sessions.`,
      problem: "Users on the 3rd floor report that their laptops connect to the office Wi-Fi but data transfer speeds are extremely slow.",
      solution: "Perform an RF site survey. Channels may be congested or overlapping. Configure the WLC to auto-assign non-overlapping channels or shift users to the 5 GHz band, which has more non-overlapping channels."
    },
    {
      id: "02.10",
      title: "02.10-network-security-basics",
      name: "Network Security: Port Security & DAI",
      explainer: `✅ **Definition & Purpose**: Device-level security configurations protecting switchports and L2 frames from spoofing/flooding.
✅ **Architecture / Components**: Port Security, Dynamic ARP Inspection (DAI), DHCP Snooping, MAC Limiting.
✅ **Daily Tasks**: Configuring sticky MAC addresses, managing err-disabled ports, and enabling DHCP snooping databases.
✅ **Real Industry Use Cases**: Restricting network drop ports in reception desks to only accept authorized company-issued MACs.
✅ **Troubleshooting**: Switch port going into 'err-disabled' state when a user connects a personal router.
✅ **Best Practices**: Enable port security with 'shutdown' violation action; configure trusted interfaces for DHCP snooping.
✅ **Interview Questions**: What is DHCP Snooping? (Ans: A layer 2 security feature that filters untrusted DHCP messages and builds a binding table of valid IP-to-MAC assignments).
✅ **Commands / Cheat Sheet**: Cisco: \`switchport port-security\` | \`switchport port-security mac-address sticky\` | \`show interface status err-disabled\``,
      problem: "A wall jack port in a conference room is working, but shuts down immediately (light turns amber) when a user plugs in a mini-hub.",
      solution: "Port Security is configured on the switchport with a maximum MAC limit of 1. Plugging in the hub exposed multiple MAC addresses, violating the policy and triggering 'err-disabled' state. Run 'shutdown' then 'no shutdown' on the switchport to reset after removing the hub."
    },
    {
      id: "02.11",
      title: "02.11-automation-sdn-architecture",
      name: "SDN & Network Automation",
      explainer: `✅ **Definition & Purpose**: Software-Defined Networking separates the Control Plane from the Data Plane to enable API management.
✅ **Architecture / Components**: Control Plane, Data Plane, southbound APIs (OpenFlow, NETCONF), northbound APIs (REST).
✅ **Daily Tasks**: Running Python scripts using Netmiko/Napalm, querying Cisco DNA Center APIs, and analyzing JSON payloads.
✅ **Real Industry Use Cases**: Pushing configuration templates to 50 remote branch routers simultaneously using Ansible.
✅ **Troubleshooting**: API authentication failures, JSON syntax errors, and connection timeouts on SSH/NETCONF ports.
✅ **Best Practices**: Use version control (Git) to track changes to networking scripts and infrastructure as code configurations.
✅ **Interview Questions**: What is the difference between Control Plane and Data Plane? (Ans: Control Plane makes decisions about routing paths; Data Plane forwards the actual traffic packets based on those decisions).
✅ **Commands / Cheat Sheet**: Python: \`import netmiko\` | REST: \`curl -X GET https://dnac-api/api/v1/network-device -H "X-Auth-Token: <token>"\``,
      problem: "A network engineer wants to automate VLAN creation on 5 switches, but the Python script fails with authentication errors.",
      solution: "Check the API endpoint credentials. Ensure that SSH or HTTPS access is enabled in the switch configuration (e.g., 'ip http server') and local firewall rules permit port 443/22 traffic."
    }
  ],

  // 3. MCSA - Windows Server 2022 (18 modules)
  3: [
    {
      id: "03.01",
      title: "03.01-windows-server-installation",
      name: "Server Installation & Core",
      explainer: `✅ **Definition & Purpose**: Deployment of Windows Server 2022. Server Core is the default headless installation option.
✅ **Architecture / Components**: Server Core (command-line, tiny footprint) and Desktop Experience (GUI-based shell).
✅ **Daily Tasks**: Configuring IP addresses via Sconfig, patching server kernels, and managing features via PowerShell.
✅ **Real Industry Use Cases**: Running Server Core for infrastructural roles like Domain Controllers to reduce attack surface.
✅ **Troubleshooting**: Missing graphical tools on Core installs, disk partition identification issues.
✅ **Best Practices**: Deploy Server Core for all core services; use Windows Admin Center for remote management.
✅ **Interview Questions**: What is the major benefit of Windows Server Core? (Ans: Reduced patch frequency, smaller disk usage, and minimized security attack surface).
✅ **Commands / Cheat Sheet**: Run \`sconfig\` in cmd/PowerShell on Server Core to configure IP, domain, updates, and remote access.`,
      problem: "An administrator installs Windows Server 2022 Core but realizes they need graphical administration tools locally on the console.",
      solution: "In modern Server 2022, you cannot convert Core to GUI post-install (unlike Server 2012). Re-install the server selecting the 'Desktop Experience' version, or configure Windows Admin Center on an administrator machine to manage the Core server remotely."
    },
    {
      id: "03.02",
      title: "03.02-active-directory-forests",
      name: "Active Directory Architecture",
      explainer: `✅ **Definition & Purpose**: Directory service storing data about user accounts, computers, groups, and security permissions.
✅ **Architecture / Components**: Forests (security boundary), Trees, Domains, Organizational Units (OUs), Schema, global catalog.
✅ **Daily Tasks**: Creating OUs, joining servers to domains, and setting up nested AD security groups.
✅ **Real Industry Use Cases**: Constructing a multi-domain forest to separate geographic business entities while retaining single-sign-on trust.
✅ **Troubleshooting**: Account lockout loops, schema mismatch on updates, and trust relationship failures.
✅ **Best Practices**: Use AGDLP nested group strategies: Accounts in Global groups, inside Domain Local groups, which grant Permissions.
✅ **Interview Questions**: What is the difference between a Forest and a Domain? (Ans: A domain is a logical boundary of objects sharing a database; a forest is the ultimate security boundary containing one or more domains).
✅ **Commands / Cheat Sheet**: PowerShell: \`Get-ADDomain\` | \`New-ADUser -Name "John Doe" -SamAccountName "jdoe"\``,
      problem: "A user is added to a security group to access a shared drive, but they still receive 'Access Denied' errors.",
      solution: "Active Directory groups are embedded in the user's Kerberos security token on login. The user must sign out of their workstation and sign back in to refresh their security token with the new group membership."
    },
    {
      id: "03.03",
      title: "03.03-gpo-gpupdate-gpresult",
      name: "Group Policy Management",
      explainer: `✅ **Definition & Purpose**: Engine to centrally configure registry settings across domain computers and user environments.
✅ **Architecture / Components**: Group Policy Objects (GPOs), GPO links, WMI filters, Security Filtering, SYSVOL folder.
✅ **Daily Tasks**: Deploying software, enforcing password complexity, mapping drives, and generating GPO results.
✅ **Real Industry Use Cases**: Enforcing a corporate policy that locks all computer screens after 10 minutes of inactivity.
✅ **Troubleshooting**: Group policies not applying, blocking inheritance issues, and slow boot times caused by too many GPOs.
✅ **Best Practices**: Avoid editing Default Domain Policy; create modular GPOs and apply them at OU levels.
✅ **Interview Questions**: In what order are GPOs applied? (Ans: LSDOU - Local, Site, Domain, Organizational Unit. The last applied GPO wins).
✅ **Commands / Cheat Sheet**: CMD: \`gpupdate /force\` | \`gpresult /h report.html\` | PowerShell: \`Get-GPO -All\``,
      problem: "A new background wallpaper GPO is applied to the 'Marketing' OU, but Marketing workstations still show the old wallpaper.",
      solution: "Run 'gpresult /h report.html' on the client. Check if there is an overriding GPO linked at a lower level, check if 'Block Inheritance' is enabled on the OU, or check if the GPO has 'Enforced' status, which overrides blocks."
    },
    {
      id: "03.04",
      title: "03.04-dns-zone-replication",
      name: "DNS Zone Replication & AD DS",
      explainer: `✅ **Definition & Purpose**: Windows DNS role translates hostnames to IPs. AD-Integrated zones store records directly in AD DS database.
✅ **Architecture / Components**: Forward/Reverse lookup zones, Primary/Secondary zones, Active Directory-Integrated replication.
✅ **Daily Tasks**: Creating host (A) records, alias (CNAME) records, and configuring DNS forwarding pools.
✅ **Real Industry Use Cases**: Storing company DNS zones in AD DS so updates replicate automatically to all domain controllers.
✅ **Troubleshooting**: Stale DNS records causing connection issues, zone transfer failures, and slow internet resolution.
✅ **Best Practices**: Set up DNS scavenging to automatically purge old, stale dynamic IP records.
✅ **Interview Questions**: What is the difference between a forwarder and root hints? (Ans: Forwarders send unresolved queries to a specific external DNS server; root hints query the global root servers if no forwarders are set).
✅ **Commands / Cheat Sheet**: CMD: \`nslookup\` | \`ipconfig /flushdns\` | PowerShell: \`Get-DnsServerZone\``,
      problem: "An administrator removes a decommissioned server, but users still experience connection attempts pointing to the old server IP.",
      solution: "The stale host record remains in the DNS zone. Manually delete the A record in the DNS MMC console, and configure Scavenging on the DNS server properties to clean up dynamic records automatically in the future."
    },
    {
      id: "03.05",
      title: "03.05-dhcp-failover-scopes",
      name: "DHCP Scopes & High Availability",
      explainer: `✅ **Definition & Purpose**: Automatic allocation of network configurations to clients. Failover ensures service continuity.
✅ **Architecture / Components**: DHCP Scopes, Address Leases, Reservations, Load Balance/Hot Standby failover modes.
✅ **Daily Tasks**: Creating scopes, adding dynamic range exclusions, and pairing failover servers.
✅ **Real Industry Use Cases**: Deploying a Hot Standby DHCP failover cluster so clients get IPs even if the primary DHCP server crashes.
✅ **Troubleshooting**: IP address address exhaustion in a scope, conflicting IP assignments (duplicate IPs), and failover synchronization errors.
✅ **Best Practices**: Keep lease times short (e.g., 8 hours) for guest Wi-Fi networks, and long (e.g., 8 days) for desk PCs.
✅ **Interview Questions**: What is the difference between Hot Standby and Load Balance failover? (Ans: Load Balance distributes leases between both servers; Hot Standby has one active server and a backup server).
✅ **Commands / Cheat Sheet**: PowerShell: \`Get-DhcpServerv4Scope\` | \`Sync-DhcpServerv4FailoverRelationship\``,
      problem: "A subnet is expanded, and users report they are unable to connect to the network. DHCP logs show 'Scope Exhausted'.",
      solution: "Open the DHCP console, edit the Scope properties, and expand the IP address range. If restricted, shorten the Lease Duration to free up IPs faster, or create exclusions for static IPs in the range."
    },
    {
      id: "03.06",
      title: "03.06-file-servers-ntfs-share",
      name: "NTFS and Share Permissions",
      explainer: `✅ **Definition & Purpose**: Setting file-level (NTFS) and folder-level (Share) access permissions to secure files on the network.
✅ **Architecture / Components**: NTFS Permissions (Read, Write, Modify, Full Control), Share Permissions, Access-Based Enumeration (ABE).
✅ **Daily Tasks**: Provisioning department file shares, restoring shadow copies, and resolving access blocked tickets.
✅ **Real Industry Use Cases**: Setting up an 'HR' share where HR staff have Modify rights, but general staff cannot see the folder (via ABE).
✅ **Troubleshooting**: Conflicting permissions (Deny overrides Allow), users unable to write to shares despite 'Full Control' share permissions.
✅ **Best Practices**: Grant 'Everyone' Full Control on Share permissions, and handle actual granular security using NTFS permissions.
✅ **Interview Questions**: When combining Share and NTFS permissions, which one takes precedence? (Ans: The most restrictive permission combination wins).
✅ **Commands / Cheat Sheet**: PowerShell: \`Get-Acl -Path "C:\\Shares\\Sales"\` | \`Set-Acl\``,
      problem: "A user has 'Modify' NTFS permissions to a folder, but cannot save files when accessing it via network share \\\\server\\share.",
      solution: "Check the Share permissions on the folder. The Share permission is likely set to 'Read' only. Change the Share permission to 'Change' or 'Full Control', as the combined permission will restrict the user to the most restrictive (Read)."
    },
    {
      id: "03.07",
      title: "03.07-storage-replica-spaces",
      name: "Storage Spaces & Replication",
      explainer: `✅ **Definition & Purpose**: Software-defined storage solution virtualization and block-level replication between servers.
✅ **Architecture / Components**: Storage Pools, Virtual Disks, Storage Spaces Direct (S2D), Synchronous vs Asynchronous replication.
✅ **Daily Tasks**: Adding physical disks to storage pools, monitoring replication sync health, and handling disk failures.
✅ **Real Industry Use Cases**: Replicating critical Hyper-V volume data synchronously between two server racks for disaster recovery.
✅ **Troubleshooting**: Failed disks in pool, slow sync rate on network links, and cluster storage disconnects.
✅ **Best Practices**: Use matching disk sizes and speeds in storage pools; ensure low-latency 10GbE networks for synchronous replication.
✅ **Interview Questions**: What is the difference between synchronous and asynchronous storage replication? (Ans: Synchronous writes to both locations before confirming; asynchronous writes locally first and then replicates, risking data loss).
✅ **Commands / Cheat Sheet**: PowerShell: \`Get-StoragePool\` | \`Get-StorageSubsystem\` | \`Get-SRGroup\``,
      problem: "A physical disk in a RAID 5 storage pool fails, status changes to 'Degraded'. How do you replace it safely?",
      solution: "Insert the new physical disk. In the Storage Spaces console, add the new disk to the storage pool, right-click the failed disk and select 'Remove Disk'. The pool will rebuild parity onto the new disk automatically."
    },
    {
      id: "03.08",
      title: "03.08-hyper-v-virtualization",
      name: "Hyper-V Virtualization",
      explainer: `✅ **Definition & Purpose**: Windows built-in Type-1 hypervisor allowing virtualization of operating systems on physical hardware.
✅ **Architecture / Components**: Hypervisor, Integration Services, Virtual Switches (External, Internal, Private), VHD/VHDX disk formats.
✅ **Daily Tasks**: Creating VMs, configuring virtual networking, provisioning memory, and exporting VM templates.
✅ **Real Industry Use Cases**: Running multiple virtual Windows domain controllers and web servers on a single physical host.
✅ **Troubleshooting**: Virtual machines losing network connectivity, dynamic memory ballooning failures, and integration service errors.
✅ **Best Practices**: Store VM files on fast SSD/NVMe RAID arrays; allocate static memory to critical performance databases.
✅ **Interview Questions**: What is the difference between an External and Internal Virtual Switch in Hyper-V? (Ans: External binds to physical NIC for external/internet access; Internal allows VM-to-VM and VM-to-Host communication).
✅ **Commands / Cheat Sheet**: PowerShell: \`Get-VM\` | \`Start-VM -Name "DC01"\` | \`New-VHD -Path "C:\\VMs\\Disk.vhdx" -SizeBytes 50GB\``,
      problem: "A new Hyper-V VM is created, but cannot reach the internet. The host machine is connected and has full access.",
      solution: "Open Hyper-V Virtual Switch Manager. Ensure you have created an 'External' virtual switch bound to the host's active physical network adapter, and verify the VM's network settings are mapped to this switch."
    },
    {
      id: "03.09",
      title: "03.09-iis-web-servers",
      name: "IIS Web Servers & Certificates",
      explainer: `✅ **Definition & Purpose**: Internet Information Services is the web server engine built into Windows Server.
✅ **Architecture / Components**: Application Pools, Web Sites, Bindings, SSL/TLS configuration, HTTPS certificates.
✅ **Daily Tasks**: Creating web sites, configuring HTTP-to-HTTPS redirect rules, and importing SSL certificates.
✅ **Real Industry Use Cases**: Hosting internal corporate portals and hosting active .NET web applications secure with SSL/TLS.
✅ **Troubleshooting**: 503 Service Unavailable errors (App Pool stopped), invalid certificate warnings in browsers.
✅ **Best Practices**: Keep different web applications in separate Application Pools to prevent one app crash from affecting others.
✅ **Interview Questions**: What causes a '503 Service Unavailable' error in IIS? (Ans: Usually indicates that the IIS Application Pool associated with the website has stopped running or crashed).
✅ **Commands / Cheat Sheet**: CMD: \`iisreset\` | \`appcmd list apppool\` | PowerShell: \`Get-Website\``,
      problem: "An internal web app is returning '503 Service Unavailable' to users. You check IIS and find the app pool keeps crashing.",
      solution: "Check the Windows Event Viewer 'Application' log for crash dumps from 'w3wp.exe'. The crash is likely due to code exceptions, memory limits, or incorrect pool service account credentials (e.g. expired password)."
    },
    {
      id: "03.10",
      title: "03.10-windows-failover-clustering",
      name: "Windows Failover Clustering",
      explainer: `✅ **Definition & Purpose**: Group of independent servers working together to increase availability of applications/services.
✅ **Architecture / Components**: Cluster Nodes, Quorum (witness disk/share), Cluster Shared Volumes (CSV), Heartbeat networks.
✅ **Daily Tasks**: Configuring cluster quorum, running validation tests, and performing node updates using CAU.
✅ **Real Industry Use Cases**: Setting up highly available Hyper-V clusters or SQL Server AlwaysOn availability groups.
✅ **Troubleshooting**: 'Split-Brain' scenario due to quorum loss, cluster communication drops, and failing resource resources.
✅ **Best Practices**: Configure redundant network interfaces for the heartbeat connection to prevent false failover triggers.
✅ **Interview Questions**: What is the purpose of Quorum in a failover cluster? (Ans: It prevents 'split-brain' by requiring a majority of voting nodes/witnesses to be online for the cluster to remain running).
✅ **Commands / Cheat Sheet**: PowerShell: \`Get-Cluster\` | \`Get-ClusterNode\` | \`Test-Cluster\``,
      problem: "A two-node cluster crashes entirely when Node 1 loses network power, even though Node 2 is healthy.",
      solution: "In a 2-node cluster, if you lose 1 node, you lose majority (50% online). The cluster offline protection triggers. Configure a Quorum Witness (a file share or disk witness) to act as a 3rd vote to maintain majority."
    },
    {
      id: "03.11",
      title: "03.11-active-directory-replication",
      name: "Active Directory Replication",
      explainer: `✅ **Definition & Purpose**: Synchronization of AD directory database modifications between all domain controllers in a forest.
✅ **Architecture / Components**: Knowledge Consistency Checker (KCC), Site Links, Subnets, ISTG, RPC over IP transport.
✅ **Daily Tasks**: Monitoring replication health, checking site link costs, and forcing replication loops.
✅ **Real Industry Use Cases**: Synchronizing a password change made in the head office DC to a remote branch office DC.
✅ **Troubleshooting**: Replication blockages, divergent tombstoned databases, and mismatched AD sites.
✅ **Best Practices**: Keep all domain controllers synced with a reliable central NTP clock to prevent Kerberos ticket time-skew errors.
✅ **Interview Questions**: What is the tombstone lifetime in Active Directory? (Ans: The amount of time (typically 180 days) an expired/deleted object is retained before being permanently purged from AD databases).
✅ **Commands / Cheat Sheet**: CMD: \`repadmin /showrepl\` | \`repadmin /replsummary\` | \`repadmin /syncall /AdP\``,
      problem: "A password updated by a user in Chicago is not working when the user attempts to log in from the branch in London 10 minutes later.",
      solution: "The replication cycle is delayed. London and Chicago are in different AD Sites connected by a Site Link with a high replication interval (e.g. 180 mins). Manually trigger sync with 'repadmin /syncall' or reduce the link interval."
    },
    {
      id: "03.12",
      title: "03.12-windows-admin-center",
      name: "Windows Admin Center (WAC)",
      explainer: `✅ **Definition & Purpose**: Modern, browser-based management tool for remote Windows servers, clusters, and hyper-converged infrastructure.
✅ **Architecture / Components**: WAC gateway, web console, PowerShell extension modules, WinRM remote execution.
✅ **Daily Tasks**: Inspecting event logs remotely, managing virtual switches, checking performance graphs, and running terminal shells.
✅ **Real Industry Use Cases**: Providing L2 helpdesk technicians with a secure console to restart services and check disk usage without RDP.
✅ **Troubleshooting**: Gateway connection timeouts, WinRM trust issues, and missing extension modules.
✅ **Best Practices**: Use HTTPS for WAC; enforce Azure AD authentication for gateway access control.
✅ **Interview Questions**: How does Windows Admin Center communicate with remote servers? (Ans: It uses WinRM (Windows Remote Management) and PowerShell Remoting over ports 5985/5986).
✅ **Commands / Cheat Sheet**: Open web browser to gateway URL: \`https://wac-server:443\``,
      problem: "You try to add a new Windows Server 2022 Core machine to WAC, but receive a 'WinRM authorization error'.",
      solution: "Ensure WinRM is enabled on the remote server by running 'Enable-PSRemoting'. If the server is in a workgroup, run 'Set-Item WSMan:\\localhost\\Client\\TrustedHosts -Value <WAC_Gateway_IP> -Force'."
    },
    {
      id: "03.13",
      title: "03.13-wsus-patch-management",
      name: "WSUS Patch Management",
      explainer: `✅ **Definition & Purpose**: Windows Server Update Services allows administrators to centrally download and distribute OS updates.
✅ **Architecture / Components**: WSUS server, update database, update categories/classifications, target groups, GPO configurations.
✅ **Daily Tasks**: Approving security patches, monitoring compliance reports, and cleaning up WSUS storage.
✅ **Real Industry Use Cases**: Testing Microsoft security updates on a pilot test group of workstations before deploying globally.
✅ **Troubleshooting**: Clients not reporting to WSUS console, database performance degradation, and disk storage exhaustion.
✅ **Best Practices**: Run the WSUS Server Cleanup Wizard monthly to remove expired and superseded update files.
✅ **Interview Questions**: How do client machines know to pull updates from a local WSUS server instead of Microsoft Update? (Ans: Via Group Policy, configuring the 'Specify intranet Microsoft update service location' setting).
✅ **Commands / Cheat Sheet**: Client force check: \`wuauclt /detectnow\` or \`wuauclt /reportnow\` | PowerShell: \`Get-WsusServer\``,
      problem: "Clients are not appearing in the WSUS console, although the correct GPO is linked and active on their OU.",
      solution: "Ensure clients can resolve the WSUS server hostname and access the WSUS port (usually 8530/8531). Run 'wuauclt /detectnow' on client, or check 'WindowsUpdate.log' for connection errors."
    },
    {
      id: "03.14",
      title: "03.14-fsmo-roles-seizure",
      name: "FSMO Roles Management",
      explainer: `✅ **Definition & Purpose**: Flexible Single Master Operations are 5 critical single-instance roles responsible for AD consistency.
✅ **Architecture / Components**: Forest-level (Schema Master, Domain Naming Master), Domain-level (PDC Emulator, RID Master, Infrastructure Master).
✅ **Daily Tasks**: Inspecting FSMO role holders, transferring roles during migrations, and seizing roles during domain controller failures.
✅ **Real Industry Use Cases**: Seizing the PDC Emulator role from a physically dead domain controller to restore time sync and password change updates.
✅ **Troubleshooting**: RID pool exhaustion preventing new user creation, time skew errors across the domain.
✅ **Best Practices**: Keep the PDC Emulator synchronized with an external NTP time server pool.
✅ **Interview Questions**: What is the difference between transferring and seizing an FSMO role? (Ans: Transfer is done gracefully when both servers are online; seizure is a forced takeover when the role holder is permanently offline).
✅ **Commands / Cheat Sheet**: CMD: \`netdom query fsmo\` | PowerShell: \`Move-ADDirectoryServerOperationMasterRole -Identity "DC02" -OperationMasterRole 0,1,2,3,4\``,
      problem: "The primary Domain Controller holding all FSMO roles catches fire. A secondary DC is online, but you cannot create new user accounts.",
      solution: "Seize the FSMO roles. Use 'ntdsutil' or PowerShell 'Move-ADDirectoryServerOperationMasterRole' with the '-Force' flag on the surviving domain controller DC02 to claim the FSMO roles."
    },
    {
      id: "03.15",
      title: "03.15-remote-desktop-services-rds",
      name: "Remote Desktop Services (RDS)",
      explainer: `✅ **Definition & Purpose**: Multi-session environment allowing users to run remote desktops and applications hosted on Windows servers.
✅ **Architecture / Components**: RD Session Host, RD Connection Broker, RD Gateway, RD Web Access, RD Licensing.
✅ **Daily Tasks**: Configuring user profiles, mapping TS CAL licenses, logging off disconnected sessions, and checking broker databases.
✅ **Real Industry Use Cases**: Providing remote workers secure, low-latency access to legacy desktop apps via HTTPS (RD Gateway).
✅ **Troubleshooting**: Users unable to log in (license limit reached), disconnect loops, and slow session performance.
✅ **Best Practices**: Use User Profile Disks (UPDs) or FSLogix for profile persistence across multiple session hosts.
✅ **Interview Questions**: What is the function of the RD Connection Broker? (Ans: It manages user logins, redirects users to existing sessions, and balances session loads across session hosts).
✅ **Commands / Cheat Sheet**: PowerShell: \`Get-RDUserSession\` | \`Disconnect-RDUserSession -UnifiedSessionId 2\` | \`Get-RDLicenseConfiguration\``,
      problem: "Users receive the error 'The remote session was disconnected because there are no Remote Desktop License Servers available'.",
      solution: "The grace period of 120 days has expired. Install the RD Licensing role, activate the license server, install your RDS CALs (User or Device), and configure GPO to point session hosts to the license server."
    },
    {
      id: "03.16",
      title: "03.16-server-backup-disaster-recovery",
      name: "Backup & Disaster Recovery",
      explainer: `✅ **Definition & Purpose**: Creating restorable copies of server files, volumes, and Bare Metal Recovery (BMR) states.
✅ **Architecture / Components**: Windows Server Backup (WSB), Volume Shadow Copy Service (VSS), Bare Metal Recovery (system state + boot data).
✅ **Daily Tasks**: Scheduling daily backups, reviewing job success logs, and executing test restoration drills.
✅ **Real Industry Use Cases**: Executing a daily System State backup on domain controllers to protect AD databases from corruption.
✅ **Troubleshooting**: Backups failing due to VSS writer errors, target disk full, and backup service timeouts.
✅ **Best Practices**: Keep backups off-site or in cloud storage; verify recovery points by regularly conducting restores.
✅ **Interview Questions**: What is included in a System State backup? (Ans: Active Directory database (ntds.dit), SYSVOL folder, Registry, Boot files, COM+ class registration database).
✅ **Commands / Cheat Sheet**: CMD: \`wbadmin start backup -backupinterface:D: -allcritical -quiet\` | \`vssadmin list writers\``,
      problem: "A server backup fails with a 'VSS Writer failed' error. Checking vssadmin shows 'System Writer' in a failed state.",
      solution: "Restart the Volume Shadow Copy service and the Cryptographic Services. If the writer is still in a failed state, reboot the server to reset the VSS engine, and check system logs for permission errors."
    },
    {
      id: "03.17",
      title: "03.17-event-viewer-log-forwarding",
      name: "Event Logging & Forwarding",
      explainer: `✅ **Definition & Purpose**: Centrally collecting Event logs (Security, Application, System) from multiple servers onto a single collector.
✅ **Architecture / Components**: Event Viewer, Windows Event Forwarding (WEF), WS-Management (WinRM), Source/Collector initiated subscriptions.
✅ **Daily Tasks**: Setting up event subscriptions, configuring GPO log forwarding targets, and analyzing security events.
✅ **Real Industry Use Cases**: Forwarding all 'Account Lockout' (Event 4740) logs from domain controllers to a central monitoring server.
✅ **Troubleshooting**: Target logs not forwarding, WinRM network blocks, and collector service CPU overload.
✅ **Best Practices**: Filter forwarded events to only collect critical security and system warnings to save bandwidth.
✅ **Interview Questions**: What is the difference between source-initiated and collector-initiated subscriptions? (Ans: Source-initiated has the client push logs to the collector; collector-initiated has the collector pull logs from the client).
✅ **Commands / Cheat Sheet**: CMD: \`wecutil qc\` (config collector) | \`winrm qc\` (config source client) | \`eventvwr.msc\``,
      problem: "You configure a subscription to forward Event ID 4625 (failed logins), but no events are appearing on the collector server.",
      solution: "Verify WinRM is running on both systems. Ensure the 'Network Service' account on the source computer is added to the local 'Event Log Readers' group so it has permission to read and forward the logs."
    },
    {
      id: "03.18",
      title: "03.18-windows-server-hardening",
      name: "Windows Server Hardening",
      explainer: `✅ **Definition & Purpose**: Reducing security exposure risks by disabling unnecessary features and enforcing access controls.
✅ **Architecture / Components**: Local Administrator Password Solution (LAPS), firewall rules, cipher configurations, administrative privileges.
✅ **Daily Tasks**: Enforcing LAPS password policies, turning off SMBv1, and running audit scripts.
✅ **Real Industry Use Cases**: Deploying LAPS to automatically cycle local admin passwords on thousands of domain-joined servers.
✅ **Troubleshooting**: LAPS passwords not updating in AD, old software breaking when SMBv1 is disabled.
✅ **Best Practices**: Disable SMBv1, enforce TLS 1.2/1.3, configure LAPS, and disable unnecessary local accounts.
✅ **Interview Questions**: Why is LAPS important? (Ans: It prevents lateral movement attacks by ensuring every server has a unique, randomly rotated password for the local Administrator account).
✅ **Commands / Cheat Sheet**: PowerShell: \`Get-LapsADPassword -Identity "Server01"\` | Disable SMB1: \`Disable-WindowsOptionalFeature -Online -FeatureName SMB1Protocol\``,
      problem: "A vulnerability scan reports that multiple Windows servers are susceptible to lateral movement attacks using cached local administrator credentials.",
      solution: "Deploy Windows LAPS. Extend the AD schema to support LAPS attributes, configure a GPO to enable LAPS on servers, configure password complexity, and ensure the local Administrator account is managed by the policy."
    }
  ],

  // 4. RHCSA - Red Hat Linux (EX-200) (12 modules)
  4: [
    {
      id: "04.01",
      title: "04.01-linux-permissions-chmod",
      name: "File Permissions & ACLs",
      explainer: `✅ **Definition & Purpose**: Enforces access security on directories and files. ACLs allow granular access control rules.
✅ **Architecture / Components**: Permission bits (Read: 4, Write: 2, Execute: 1), User-Group-Others (UGO), Special permissions (SUID, SGID, Sticky), Access Control Lists (ACLs).
✅ **Daily Tasks**: Correcting file ownerships, adjusting user write permissions, and setting up shared project directories.
✅ **Real Industry Use Cases**: Configuring a shared folder where users can create files, but only the owner can delete them (using Sticky bit).
✅ **Troubleshooting**: Users unable to access directories because parent directories lack the Execute (x) permission.
✅ **Best Practices**: Grant only minimum permissions required; use ACLs instead of setting group permissions to 777.
✅ **Interview Questions**: What does the Sticky Bit do when applied to a directory? (Ans: It prevents users from deleting or renaming files inside that directory unless they are the file owner or root).
✅ **Commands / Cheat Sheet**: \`chmod 755 file.sh\` | \`chown user:group file\` | \`getfacl file\` | \`setfacl -m u:username:rwx file\``,
      problem: "A developer cannot access a file in directory /data/project even though they are a member of the group owning the file.",
      solution: "Verify that the group has read/write permissions on the file. Additionally, verify that the group has execute (x) permissions on the parent directory /data/project, and the grandparent directory /data."
    },
    {
      id: "04.02",
      title: "04.02-logical-volume-manager",
      name: "Logical Volume Management",
      explainer: `✅ **Definition & Purpose**: Flexible disk management solution allowing hot-resizing and volume pooling.
✅ **Architecture / Components**: Physical Volumes (PV), Volume Groups (VG), Logical Volumes (LV), Filesystems (XFS, Ext4).
✅ **Daily Tasks**: Initializing new disks, extending volume groups, expanding filesystems, and creating snapshot volumes.
✅ **Real Industry Use Cases**: Growing a database directory volume dynamically on an online production server without downtime.
✅ **Troubleshooting**: 'No space left on device' when there is free VG space, partition table format mismatches.
✅ **Best Practices**: Use XFS filesystems (default in RHEL) because they can be grown online; remember XFS cannot be shrunk.
✅ **Interview Questions**: What is the process to add space to a Logical Volume? (Ans: Initialize PV -> Extend VG with PV -> Extend LV -> Resize/Extend the filesystem).
✅ **Commands / Cheat Sheet**: \`pvcreate /dev/sdb\` | \`vgextend vg_data /dev/sdb\` | \`lvextend -r -L +10G /dev/vg_data/lv_db\` (extensions automatically grow filesystems with -r flag).`,
      problem: "The application log volume /dev/vg_system/lv_logs is 98% full. A new disk /dev/sdc is added to the system.",
      solution: "1. pvcreate /dev/sdc\n2. vgextend vg_system /dev/sdc\n3. lvextend -r -L +10G /dev/vg_system/lv_logs (resizes filesystem and volume dynamically)."
    },
    {
      id: "04.03",
      title: "04.03-systemd-service-management",
      name: "systemd Service Management",
      explainer: `✅ **Definition & Purpose**: The systemd system and service manager controls startup services and daemons.
✅ **Architecture / Components**: Unit files (.service, .target, .timer), systemctl control utility, journald logging daemon.
✅ **Daily Tasks**: Restarting services, enabling startup daemons, reviewing log outputs using journalctl, and masking problematic services.
✅ **Real Industry Use Cases**: Enabling the Apache web server daemon (httpd) to start automatically after a system reboot.
✅ **Troubleshooting**: Service failed to start on boot (check error logs via systemctl status), and resource locks.
✅ **Best Practices**: Mask services you want to prevent other services from starting; keep unit files in /etc/systemd/system/.
✅ **Interview Questions**: What is the difference between systemctl enable and systemctl start? (Ans: 'start' runs the service immediately; 'enable' configures it to start automatically on boot).
✅ **Commands / Cheat Sheet**: \`systemctl start httpd\` | \`systemctl enable httpd\` | \`systemctl status httpd\` | \`journalctl -u httpd -f\``,
      problem: "A custom backup service fails to start. Status check shows 'failed' with error code status=203/EXEC.",
      solution: "The EXEC status 203 indicates that the executable path specified in the systemd service file is incorrect or does not exist. Check the 'ExecStart=' path in the service file and correct it."
    },
    {
      id: "04.04",
      title: "04.04-linux-boot-troubleshooting",
      name: "Boot Troubleshooting & Root Reset",
      explainer: `✅ **Definition & Purpose**: Diagnosing GRUB2 boot failures and resetting lost root passwords using low-level debug shells.
✅ **Architecture / Components**: UEFI/GRUB2 bootloader, kernel parameters, rd.break RAM disk shell, SELinux autorelabel.
✅ **Daily Tasks**: Modifying kernel command lines, accessing emergency shells, and rebuilding GRUB configurations.
✅ **Real Industry Use Cases**: Recovering server control when an administrator leaves the organization without sharing the root password.
✅ **Troubleshooting**: Boot stuck at emergency shell (check /etc/fstab for mount errors), GRUB configuration corrupted.
✅ **Best Practices**: Always backup /etc/fstab before editing storage UUIDs; ensure SELinux is relabeled after password reset.
✅ **Interview Questions**: Why is the '.autorelabel' file required after resetting the root password in rd.break? (Ans: Relabels security contexts on changed system files (/etc/shadow) so SELinux doesn't block access on reboot).
✅ **Commands / Cheat Sheet**: Reset steps: Edit GRUB menu -> append \`rd.break\` to linux line -> Ctrl+X -> \`mount -o remount,rw /sysroot\` -> \`chroot /sysroot\` -> \`passwd\` -> \`touch /.autorelabel\` -> exit.`,
      problem: "A server is stuck in an emergency boot shell due to a drive mount failure. You need to fix the mount configuration.",
      solution: "Type the root password to enter the emergency shell. Remount root as read-write: 'mount -o remount,rw /'. Edit '/etc/fstab' using vi, comment out the line of the missing disk partition, save, and type 'reboot'."
    },
    {
      id: "04.05",
      title: "04.05-package-management-dnf-yum",
      name: "Package Management & Repos",
      explainer: `✅ **Definition & Purpose**: Installs, updates, and deletes system software using packages and dependency engines.
✅ **Architecture / Components**: RPM packages, DNF/YUM repositories, metadata cache, GPG security signatures.
✅ **Daily Tasks**: Configuring repo files in /etc/yum.repos.d/, installing patches, and removing unused packages.
✅ **Real Industry Use Cases**: Configuring a local server to pull patches from an internal company mirror instead of the internet.
✅ **Troubleshooting**: Broken dependencies errors during software installs, expired repository GPG keys.
✅ **Best Practices**: Always run GPG signature verification checks on external repositories to prevent untrusted software execution.
✅ **Interview Questions**: What is the difference between RPM and DNF? (Ans: RPM installs individual packages but does not resolve dependencies; DNF queries repositories and automatically downloads dependencies).
✅ **Commands / Cheat Sheet**: \`dnf install httpd\` | \`dnf search nginx\` | \`dnf repo-list\` | \`dnf clean all\``,
      problem: "A server is disconnected from the internet, and 'dnf install' commands fail. You need to configure a local installation source.",
      solution: "Create a repo file '/etc/yum.repos.d/local.repo' pointing to the mounted installation ISO directory path: 'baseurl=file:///mnt/disc/BaseOS' and set 'enabled=1'. Clean cache with 'dnf clean all' to apply."
    },
    {
      id: "04.06",
      title: "04.06-cron-jobs-at-scheduling",
      name: "Task Scheduling: cron & at",
      explainer: `✅ **Definition & Purpose**: Automated execution of scripts and commands at specific times or recurring intervals.
✅ **Architecture / Components**: Crontab fields (Min Hour Day Month Weekday), cron.d, systemd timers, 'at' daemon.
✅ **Daily Tasks**: Setting up log rotation schedules, scheduling database backups, and checking cron logs.
✅ **Real Industry Use Cases**: Scheduling a script to prune database session tables every day at 11:30 PM.
✅ **Troubleshooting**: Cron jobs failing silently (check system mail or redirect logs to files), environment path issues.
✅ **Best Practices**: Always use absolute paths in crontabs (e.g. \`/usr/bin/tar\`) because cron shell has restricted paths.
✅ **Interview Questions**: What do the five stars in a crontab entry represent? (Ans: Minute, Hour, Day of Month, Month, Day of Week).
✅ **Commands / Cheat Sheet**: \`crontab -e\` (edit) | \`crontab -l\` (list) | Format: \`30 23 * * * /scripts/backup.sh > /logs/backup.log 2>&1\``,
      problem: "A backup script runs perfectly when executed by root manually in the terminal, but fails to write files when run as a cron job.",
      solution: "The script likely relies on environment variables (like PATH) or relative directory paths. Edit the script to use absolute paths for all commands and outputs (e.g., '/usr/bin/rsync' instead of 'rsync')."
    },
    {
      id: "04.07",
      title: "04.07-linux-firewalld-selinux",
      name: "Security: firewalld & SELinux",
      explainer: `✅ **Definition & Purpose**: Linux firewall rules and Mandatory Access Control (MAC) system protecting kernel objects.
✅ **Architecture / Components**: Firewalld zones, permanent vs runtime rules, SELinux enforcement modes (Enforcing, Permissive, Disabled), contexts (User:Role:Type).
✅ **Daily Tasks**: Opening firewall ports, changing SELinux file contexts, and reviewing AVC denial logs.
✅ **Real Industry Use Cases**: Securing an apache server by opening port 443 in firewalld, and configuring SELinux context on website directories.
✅ **Troubleshooting**: 'Permission Denied' on files with 777 permissions (indicates SELinux block), services unreachable from network.
✅ **Best Practices**: Never disable SELinux in production; use Permissive mode to debug security issues, then set correct contexts.
✅ **Interview Questions**: How do you change a file's SELinux context permanently? (Ans: Use \`semanage fcontext\` to define policy, and then run \`restorecon\` to apply).
✅ **Commands / Cheat Sheet**: \`firewall-cmd --add-port=80/tcp --permanent\` | \`firewall-cmd --reload\` | \`getenforce\` | \`restorecon -R /var/www/html\``,
      problem: "You configure Apache to listen on port 8080. The port is open in firewalld, but service fails to start due to permission block.",
      solution: "SELinux blocks Apache from binding to non-standard HTTP ports. Run 'semanage port -a -t http_port_t -p tcp 8080' to authorize port 8080 in the SELinux database, and restart the service."
    },
    {
      id: "04.08",
      title: "04.08-user-group-management",
      name: "User and Group Management",
      explainer: `✅ **Definition & Purpose**: Creating and securing user identity databases and group permissions on Linux servers.
✅ **Architecture / Components**: /etc/passwd (user attributes), /etc/shadow (hashed passwords), /etc/group (group listings).
✅ **Daily Tasks**: Creating users, configuring password aging limits, adding users to wheel/sudo groups, and locking accounts.
✅ **Real Industry Use Cases**: Setting up SSH user accounts for new developers and restricting their shell environments.
✅ **Troubleshooting**: Users locked out due to expired password policies, sudo command permissions missing.
✅ **Best Practices**: Force users to change passwords on first login; restrict direct root SSH access.
✅ **Interview Questions**: Where are user passwords stored in Linux? (Ans: Hashed passwords are stored in /etc/shadow, which is readable only by the root user).
✅ **Commands / Cheat Sheet**: \`useradd developer\` | \`passwd developer\` | \`usermod -aG wheel developer\` | \`chage -d 0 developer\` (force change)`,
      problem: "A new Linux admin needs to grant a developer root-level access for administrative commands without sharing root password.",
      solution: "Add the developer to the 'wheel' group by running 'usermod -aG wheel developer'. Ensure that the wheel group is uncommented in the '/etc/sudoers' configuration file using 'visudo'."
    },
    {
      id: "04.09",
      title: "04.09-networking-nmcli-nmtui",
      name: "Network Configuration",
      explainer: `✅ **Definition & Purpose**: Managing network interface profiles, static IPs, default gateways, and hostname settings.
✅ **Architecture / Components**: NetworkManager daemon, nmcli CLI tool, nmtui GUI, configuration files (/etc/NetworkManager/).
✅ **Daily Tasks**: Configuring static IP addresses, bringing interfaces up/down, and configuring local hostname resolution.
✅ **Real Industry Use Cases**: Configuring a static IP on a newly provisioned Linux virtual server during datacenter staging.
✅ **Troubleshooting**: Interface not pulling DHCP leases, routing table missing default gateway, DNS server resolution errors.
✅ **Best Practices**: Use nmcli commands instead of editing configuration files manually to prevent syntax errors.
✅ **Interview Questions**: How do you reload network connection profiles using nmcli? (Ans: Run \`nmcli connection reload\` and \`nmcli connection up <interface>\`).
✅ **Commands / Cheat Sheet**: \`nmcli con show\` | \`nmcli con mod eth0 ipv4.addresses 10.0.0.5/24 ipv4.gateway 10.0.0.1 ipv4.method manual\` | \`nmcli con up eth0\``,
      problem: "A server has network connection profile eth0 configured, but after system restart, the interface does not start up automatically.",
      solution: "Configure the interface profile to start on boot. Run 'nmcli connection modify eth0 connection.autoconnect yes' and reload network settings."
    },
    {
      id: "04.10",
      title: "04.10-ssh-key-authentication",
      name: "Secure SSH Configuration",
      explainer: `✅ **Definition & Purpose**: Secure, encrypted remote command line access using SSH key pairs instead of passwords.
✅ **Architecture / Components**: SSH daemon (sshd), public/private key pairs, ~/.ssh/authorized_keys file, config port.
✅ **Daily Tasks**: Generating SSH key pairs, deploying public keys to servers, disabling password logins, and changing ports.
✅ **Real Industry Use Cases**: Securing production cloud servers by blocking password authentication entirely, only allowing SSH keys.
✅ **Troubleshooting**: 'Permission denied (publickey)' errors, incorrect permissions on ~/.ssh folder (must be 700) or authorized_keys (600).
✅ **Best Practices**: Change default SSH port from 22 to a custom high port; set 'PermitRootLogin no' in sshd_config.
✅ **Interview Questions**: What are the correct file permissions for SSH keys on Linux? (Ans: ~/.ssh directory must be 700; authorized_keys must be 600; private key must be 600).
✅ **Commands / Cheat Sheet**: \`ssh-keygen -t rsa -b 4096\` | \`ssh-copy-id -i ~/.ssh/id_rsa.pub user@server\` | Config: \`/etc/ssh/sshd_config\``,
      problem: "You copy a public key manually to a user's ~/.ssh/authorized_keys, but when trying to log in, you are still prompted for password.",
      solution: "Check the directory permissions. If the user's home directory, ~/.ssh folder, or authorized_keys file has group write permissions, sshd will reject the key. Run 'chmod 700 ~/.ssh' and 'chmod 600 ~/.ssh/authorized_keys' to fix."
    },
    {
      id: "04.11",
      title: "04.11-storage-stratis-vdo",
      name: "Stratis Storage & VDO",
      explainer: `✅ **Definition & Purpose**: Modern storage architectures. Stratis is software-managed pools; VDO provides data deduplication/compression.
✅ **Architecture / Components**: Stratis daemon, blockdev pools, Virtual Data Optimizer kernel modules.
✅ **Daily Tasks**: Creating Stratis storage pools, mounting Stratis filesystems, and enabling VDO compression.
✅ **Real Industry Use Cases**: Provisioning storage pools that optimize cloud disk footprint by deduplicating duplicate blocks of VMs.
✅ **Troubleshooting**: Filesystem fails to mount on boot because \`x-systemd.requires=stratisd.service\` is missing in fstab.
✅ **Best Practices**: Use systemd fstab parameters when mounting Stratis to ensure the Stratis service runs before mounting.
✅ **Interview Questions**: What is the key benefit of VDO? (Ans: Deduplication and compression at the block layer, saving physical disk space).
✅ **Commands / Cheat Sheet**: \`stratis pool create mypool /dev/sdb\` | \`stratis fs create mypool myfs\` | \`vdo create --name=vdo1 --device=/dev/sdc\``,
      problem: "A Stratis filesystem fails to mount during reboot, causing the server boot sequence to hang.",
      solution: "Enter emergency shell. Edit '/etc/fstab' and add mount parameters 'defaults,x-systemd.requires=stratisd.service' to the Stratis entry, which delays mounting until the Stratis daemon is initialized."
    },
    {
      id: "04.12",
      title: "04.12-shell-scripting-bash",
      name: "Bash Shell Scripting",
      explainer: `✅ **Definition & Purpose**: Automation of administrative tasks by executing sequential command scripts in the bash interpreter.
✅ **Architecture / Components**: Shebang line (\`#!/bin/bash\`), variables, arguments ($1, $2), exit codes, conditional checks, loops.
✅ **Daily Tasks**: Writing server health check scripts, parsing log files, automating backups, and processing user input.
✅ **Real Industry Use Cases**: Running a cron script that checks disk usage and sends an alert email if usage exceeds 90%.
✅ **Troubleshooting**: Script fails with syntax error (unclosed loops or brackets), file permissions (must make executable with chmod +x).
✅ **Best Practices**: Always set exit codes (\`exit 0\` or \`exit 1\`); use double quotes around variables to prevent word splitting.
✅ **Interview Questions**: What does \`$?\` do in a bash script? (Ans: It stores the exit status of the last executed command; 0 means success, non-zero means failure).
✅ **Commands / Cheat Sheet**: \`chmod +x script.sh\` | Debug: \`bash -x script.sh\` | Check: \`if [ $? -eq 0 ]; then echo "Success"; fi\``,
      problem: "A script is written to clean old files, but running it does nothing, and no error message is displayed.",
      solution: "Run the script in debug mode using 'bash -x script.sh'. This prints each command as it runs, letting you see if conditional checks are routing traffic away from your deletion logic."
    }
  ],

  // 5. Virtualization (VMware, Hyper-V, VirtualBox) (6 modules)
  5: [
    {
      id: "05.01",
      title: "05.01-type1-vs-type2-hypervisors",
      name: "Hypervisor Classification",
      explainer: `✅ **Definition & Purpose**: Virtualization hypervisors abstract physical hardware resources into virtual hardware allocations.
✅ **Architecture / Components**: Type 1 (Bare-Metal, runs directly on hardware), Type 2 (Hosted, runs on host OS).
✅ **Daily Tasks**: Installing virtualization software, sizing hardware allocations, and checking system virtualization settings in BIOS.
✅ **Real Industry Use Cases**: Running VMware ESXi (Type 1) on datacenter blades, and Oracle VirtualBox (Type 2) on developer laptops.
✅ **Troubleshooting**: Hardware virtualization (Intel VT-x / AMD-V) disabled in BIOS preventing hypervisors from running.
✅ **Best Practices**: Deploy Type 1 hypervisors for production enterprise workloads to optimize CPU and RAM performance.
✅ **Interview Questions**: What is the difference between Type 1 and Type 2 hypervisors? (Ans: Type 1 runs directly on hardware for speed/reliability; Type 2 requires a host OS, adding performance overhead).
✅ **Commands / Cheat Sheet**: Verify CPU support: Windows: Task Manager -> Performance -> CPU -> Virtualization: Enabled.`,
      problem: "A technician installs Oracle VirtualBox on a laptop, but virtual machine creation fails with 'VT-x is not available' error.",
      solution: "Restart the laptop, enter BIOS/UEFI settings, locate CPU configurations, enable Virtualization Technology (Intel VT-x or AMD-V), save settings, reboot, and try running the VM again."
    },
    {
      id: "05.02",
      title: "05.02-vmware-esxi-installation",
      name: "VMware ESXi Host Administration",
      explainer: `✅ **Definition & Purpose**: Installation and management of VMware ESXi, the enterprise bare-metal hypervisor.
✅ **Architecture / Components**: VMkernel, Direct Console User Interface (DCUI), Host Client web portal, local datastores.
✅ **Daily Tasks**: Configuring management IP address in DCUI, creating local VMFS datastores, and monitoring server resource pools.
✅ **Real Industry Use Cases**: Provisioning standalone ESXi hypervisors in branch office server racks to run local fileservers.
✅ **Troubleshooting**: Network disconnects (unconfigured management VLAN), storage path drops, host hardware warnings.
✅ **Best Practices**: Assign static management IPs; configure DNS forward/reverse resolution for all ESXi hostnames.
✅ **Interview Questions**: How do you manage an ESXi host if the vCenter Server goes down? (Ans: Connect directly to the ESXi host management IP address using a web browser to access the Host Client).
✅ **Commands / Cheat Sheet**: Press F2 in DCUI to configure Network adapter, IP Address, Gateway, DNS, and restart Management Network.`,
      problem: "You lose connection to the VMware host client web page, but the physical server is online and running virtual machines.",
      solution: "Access the physical server console DCUI, log in as root, go to 'Troubleshooting Options', and select 'Restart Management Agents' (restarts hostd and vpxa services without shutting down running VMs)."
    },
    {
      id: "05.03",
      title: "05.03-vmware-vcenter-clustering",
      name: "vCenter Clustering & vMotion",
      explainer: `✅ **Definition & Purpose**: Centralized administration platform for VMware vSphere environments, enabling HA and load balancing.
✅ **Architecture / Components**: vCenter Server Appliance (VCSA), vMotion (live migration), HA (High Availability), DRS (Distributed Resource Scheduler).
✅ **Daily Tasks**: Adding ESXi hosts to clusters, migrating VMs between hosts, and configuring HA failure rules.
✅ **Real Industry Use Cases**: Live-migrating active production servers to another ESXi host to perform physical server hardware maintenance.
✅ **Troubleshooting**: vMotion fails at 10% (network configuration mismatch), HA fails to trigger (missing shared storage).
✅ **Best Practices**: Use dedicated high-speed network interfaces (minimum 10GbE) for vMotion traffic to prevent packet drops.
✅ **Interview Questions**: What is the difference between VMware HA and Fault Tolerance (FT)? (Ans: HA restarts VMs on another host if a host fails (brief downtime); FT runs a duplicate VM in lockstep on another host (zero downtime)).
✅ **Commands / Cheat Sheet**: Initiate VM migration via vSphere Client API or Web Console GUI.`,
      problem: "vMotion fails when migrating a VM from ESXi-1 to ESXi-2. The network interface switches are identical.",
      solution: "Verify that both ESXi hosts are configured with a VMkernel port enabled for 'vMotion' traffic, they can ping each other's VMkernel IPs, and they have access to the same shared storage datastore."
    },
    {
      id: "05.04",
      title: "05.04-virtualbox-networking",
      name: "VirtualBox Network Modes",
      explainer: `✅ **Definition & Purpose**: Configuration of virtual network adapters in VirtualBox to control VM network boundaries.
✅ **Architecture / Components**: NAT (default, outbound only), Bridged (direct physical access), Host-Only (isolated private host-VM loopback).
✅ **Daily Tasks**: Creating isolated laboratory environments, assigning static IPs, and troubleshooting VM connection drops.
✅ **Real Industry Use Cases**: Setting up a multi-server active directory lab environment on a laptop using Host-Only network adapter.
✅ **Troubleshooting**: VM getting APIPA IP (169.254.x.x) on Bridged adapter (DHCP server down or blocked by host firewall).
✅ **Best Practices**: Use Bridged mode for servers requiring LAN access, and Host-Only for safe malware analysis or testing.
✅ **Interview Questions**: What is the difference between NAT and Bridged networking in VirtualBox? (Ans: NAT isolates the VM behind host IP translation; Bridged places the VM directly on the physical router network as a separate client).
✅ **Commands / Cheat Sheet**: Verify VM interface settings in Oracle VM VirtualBox GUI -> Settings -> Network -> Attached to:`,
      problem: "A VM is configured on a corporate laptop in Bridged mode, but it fails to acquire an IP address from the network.",
      solution: "Corporate wireless access points or switches often block multiple MAC addresses per port (Port Security). Switch the VirtualBox network adapter setting to 'NAT' mode, allowing the VM to share the host's IP address."
    },
    {
      id: "05.05",
      title: "05.05-virtual-disk-types-thick-thin",
      name: "Thick vs Thin Provisioning",
      explainer: `✅ **Definition & Purpose**: Allocation methods for virtual hard disk files (VMDK, VHDX) on host datastores.
✅ **Architecture / Components**: Thin Provisioning (grow on demand), Thick Provisioning Lazy Zeroed, Thick Provisioning Eager Zeroed.
✅ **Daily Tasks**: Monitoring datastore storage space, allocating virtual disks, and converting disk formats.
✅ **Real Industry Use Cases**: Using Thin Provisioning to overcommit storage on datastores, saving hardware acquisition costs.
✅ **Troubleshooting**: Datastore running out of space due to thin provisioning overcommitment, disk performance lags.
✅ **Best Practices**: Use Thick Eager Zeroed disks for heavy database systems requiring maximum write performance.
✅ **Interview Questions**: What is the difference between Lazy Zeroed and Eager Zeroed thick disks? (Ans: Lazy zeroed allocates space but writes zeroes as data is written; Eager zeroed writes zeroes during disk creation, offering better initial write performance).
✅ **Commands / Cheat Sheet**: CLI conversion: \`vmkfstools -i thin-disk.vmdk -d thick-eager-disk.vmdk\``,
      problem: "A VMware datastore holding 10 thin-provisioned VMs runs out of space (0 bytes free), and all VMs lock up/freeze.",
      solution: "Add storage to the datastore volume or migrate some VMs to another datastore using Storage vMotion. In thin provisioning, if physical storage fills up, VMs cannot expand their virtual disks and will freeze."
    },
    {
      id: "05.06",
      title: "05.06-vm-snapshots-backups",
      name: "VM Snapshots & Performance",
      explainer: `✅ **Definition & Purpose**: Capturing the current state, memory, and disk changes of a VM at a specific point in time.
✅ **Architecture / Components**: Delta disk files, snapshot hierarchy trees, snapshot consolidate action.
✅ **Daily Tasks**: Creating snapshots before software upgrades, merging snapshots after verification, and verifying storage health.
✅ **Real Industry Use Cases**: Taking a snapshot of an application server before updating its database software schema.
✅ **Troubleshooting**: Sluggish VM performance due to old snapshots, datastore exhaustion from growing delta files.
✅ **Best Practices**: Never keep snapshots for more than 72 hours; snapshots are not backups.
✅ **Interview Questions**: Why do snapshots degrade VM performance over time? (Ans: The hypervisor must read from the base disk and traverse multiple delta disk files sequentially to retrieve data blocks).
✅ **Commands / Cheat Sheet**: vCenter console: Actions -> Snapshots -> Consolidate / Delete All.`,
      problem: "An administrator notices a VM's disk performance is extremely slow. Checking files, they find 5 old snapshot files (*-000005.vmdk).",
      solution: "Open the VM Snapshot Manager, select 'Delete All' to merge the delta disks back into the parent base disk. If files remain, right-click the VM, go to 'Configure', select 'Consolidate' to clean up orphans."
    }
  ],

  // 6. PowerShell Scripting (8 modules)
  6: [
    {
      id: "06.01",
      title: "06.01-powershell-cmdlets",
      name: "Cmdlets & Pipeline Basics",
      explainer: `✅ **Definition & Purpose**: Command-line shell and scripting language built on the .NET framework to automate administration.
✅ **Architecture / Components**: Verb-Noun cmdlets, objects (properties/methods), pipeline operator (\`|\`), execution policies.
✅ **Daily Tasks**: Interrogating system configurations, exporting reports to CSV, and managing remote systems.
✅ **Real Industry Use Cases**: Piping system process objects to filter out processes using more than 500MB of RAM.
✅ **Troubleshooting**: 'Script cannot be loaded because execution of scripts is disabled on this system' (run Set-ExecutionPolicy).
✅ **Best Practices**: Avoid using short aliases (e.g. \`gci\`, \`select\`) inside saved script files; use full cmdlet names for readability.
✅ **Interview Questions**: What is the key difference between Bash and PowerShell pipelines? (Ans: Bash pipes plain text/strings; PowerShell pipes structured .NET objects retaining properties and methods).
✅ **Commands / Cheat Sheet**: \`Get-Help Get-Service\` | \`Get-Process | Where-Object Handles -gt 1000\` | \`Set-ExecutionPolicy RemoteSigned\``,
      problem: "You try to run a newly written script 'setup.ps1' on a server but get an execution policy error block.",
      solution: "Open PowerShell as Administrator and run 'Set-ExecutionPolicy RemoteSigned' to allow locally written scripts to execute. Alternatively, run the script using 'powershell.exe -ExecutionPolicy Bypass -File .\\setup.ps1'."
    },
    {
      id: "06.02",
      title: "06.02-variables-and-data-types",
      name: "Variables & Data Collections",
      explainer: `✅ **Definition & Purpose**: Storing and manipulating data strings, numbers, arrays, and associative lists in script execution.
✅ **Architecture / Components**: Variables (\`$\`), arrays (\`@()\`), hash tables (\`@{ }\`), custom PowerShell objects (\`[PSCustomObject]\`).
✅ **Daily Tasks**: Collecting user input, forming query loops, and building custom report structures.
✅ **Real Industry Use Cases**: Creating a custom object to combine server hostname, IP address, and disk space into a single report row.
✅ **Troubleshooting**: Array index out of bounds, hash table key collisions, and data type coercion errors.
✅ **Best Practices**: Use PSCustomObject to generate clean, tabular output that can be piped easily to CSV export cmdlets.
✅ **Interview Questions**: How do you create a hash table in PowerShell? (Ans: \`$myHash = @{ Key1 = 'Value1'; Key2 = 'Value2' }\`).
✅ **Commands / Cheat Sheet**: \`$array = @('A','B')\` | \`$customObj = [PSCustomObject]@{Name='Server01'; IP='10.0.0.5'}\``,
      problem: "You need to export a report of active services, but only want to include the 'ServiceName' and 'Status' attributes.",
      solution: "Run 'Get-Service | Select-Object -Property Name, Status | Export-Csv -Path C:\\services.csv -NoTypeInformation'. This filters the objects and exports them clean."
    },
    {
      id: "06.03",
      title: "06.03-conditionals-and-loops",
      name: "Logic Control & Loops",
      explainer: `✅ **Definition & Purpose**: Directing code execution path flow based on conditions and automating repeating tasks.
✅ **Architecture / Components**: Operators (\`-eq\`, \`-ne\`, \`-gt\`, \`-like\`), If/Else, Switch, For, ForEach loops.
✅ **Daily Tasks**: Iterating over lists of user accounts, checking server ping status, and executing logic gates.
✅ **Real Industry Use Cases**: Checking a list of 50 servers and performing a service restart only on those that return 'Stopped'.
✅ **Troubleshooting**: Infinite loops freezing host consoles, logic checks failing because of case-sensitivity (-ceq).
✅ **Best Practices**: Use the \`foreach ($item in $collection)\` loop for better performance over pipeline \`ForEach-Object\`.
✅ **Interview Questions**: What is the difference between \`-eq\` and \`-like\` operators? (Ans: \`-eq\` checks for exact matches; \`-like\` supports wildcards like \`*pattern*\`).
✅ **Commands / Cheat Sheet**: \`foreach ($vm in $vms) { if ($vm.Status -eq 'Running') { Stop-VM $vm } }\``,
      problem: "Write a loop to test ping connectivity to a list of servers stored in an array and print which ones are offline.",
      solution: "Create an array: '$servers = @(\"Srv1\", \"Srv2\")'. Write the loop: 'foreach ($s in $servers) { if (-not (Test-Connection -ComputerName $s -Count 1 -Quiet)) { Write-Host \"$s is OFFLINE\" -ForegroundColor Red } }'."
    },
    {
      id: "06.04",
      title: "06.04-functions-and-modules",
      name: "Functions & Script Modules",
      explainer: `✅ **Definition & Purpose**: Grouping reusable blocks of code into named commands, packaged inside module files (.psm1).
✅ **Architecture / Components**: Function block, parameters (\`param()\`), CmdletBinding validation, manifest files (.psd1).
✅ **Daily Tasks**: Creating custom deployment scripts, validating parameter arguments, and importing helper modules.
✅ **Real Industry Use Cases**: Packaging Active Directory administration scripts into a shared corporate module for the support desk.
✅ **Troubleshooting**: Changes to module code not reflecting in console (must run Import-Module with -Force).
✅ **Best Practices**: Use standard verb-noun naming conventions for functions (e.g. \`Get-UserReport\` instead of \`make-report\`).
✅ **Interview Questions**: What does \`[CmdletBinding()]\` do in a function? (Ans: It elevates the function to an advanced function, enabling features like -Verbose, -WhatIf, and -Confirm).
✅ **Commands / Cheat Sheet**: \`Import-Module C:\\MyModule.psm1 -Force\` | \`function Get-DiskSpace { [CmdletBinding()] param([string]$ComputerName) ... }\``,
      problem: "You edit a function in your custom module file, but when running it in your open session, the old behavior persists.",
      solution: "PowerShell caches modules on import. Force a reload of the modified module by running 'Import-Module -Name <ModuleName> -Force' to overwrite the cache."
    },
    {
      id: "06.05",
      title: "06.05-powershell-remoting-pssession",
      name: "WinRM & PowerShell Remoting",
      explainer: `✅ **Definition & Purpose**: Executing administrative commands on remote servers using WS-Management protocols.
✅ **Architecture / Components**: WinRM service, ports 5985 (HTTP) and 5986 (HTTPS), PSSessions, Invoke-Command.
✅ **Daily Tasks**: Running system updates on multiple remote servers, initiating remote interactive shells, and setting up WinRM.
✅ **Real Industry Use Cases**: Restarting the Print Spooler service on 10 remote print servers simultaneously using a single command.
✅ **Troubleshooting**: 'Connecting to remote server failed' (WinRM service stopped, port blocked, or client not in TrustedHosts).
✅ **Best Practices**: Use Invoke-Command with script blocks to run code in parallel on remote hosts, rather than looping Enter-PSSession.
✅ **Interview Questions**: What is the difference between Enter-PSSession and Invoke-Command? (Ans: Enter-PSSession is interactive for 1-to-1 work; Invoke-Command executes scripts in parallel across multiple systems).
✅ **Commands / Cheat Sheet**: \`Enter-PSSession -ComputerName Server01\` | \`Invoke-Command -ComputerName Srv1,Srv2 -ScriptBlock { Get-Date }\``,
      problem: "An administrator gets a 'WinRM Trust relationship' error when trying to run a remote command on a non-domain workgroup server.",
      solution: "Add the remote server to the TrustedHosts list on the client machine: 'Set-Item WSMan:\\localhost\\Client\\TrustedHosts -Value <Remote_IP> -Force'. Then test using credentials."
    },
    {
      id: "06.06",
      title: "06.06-error-handling-try-catch",
      name: "Error Handling & Debugging",
      explainer: `✅ **Definition & Purpose**: Catching errors and exceptions to prevent scripts from crashing and handling execution failures.
✅ **Architecture / Components**: Try/Catch/Finally blocks, ErrorAction parameters, \`$Error\` automatic variable, throw command.
✅ **Daily Tasks**: Logging script failures, suppressing non-critical warnings, and setting up break points.
✅ **Real Industry Use Cases**: Checking AD directory connections and running a fallback script if the primary domain controller times out.
✅ **Troubleshooting**: Catch block not executing (non-terminating errors like 'File Not Found' do not trigger catch unless -ErrorAction Stop is set).
✅ **Best Practices**: Always append \`-ErrorAction Stop\` to cmdlets inside try blocks to convert silent failures to terminating exceptions.
✅ **Interview Questions**: What is the difference between a terminating and non-terminating error? (Ans: It stores the exit status of the last executed command; 0 means success, non-zero means failure).
✅ **Commands / Cheat Sheet**: \`try { Get-Content C:\\file.txt -ErrorAction Stop } catch { Write-Warning "Failed: $_" }\``,
      problem: "A script is written to check registry keys inside a Try block, but when a key is missing, the Catch block is bypassed.",
      solution: "Get-ItemProperty emits a non-terminating error. Append the parameter '-ErrorAction Stop' to the cmdlet inside the try block to force it to throw a terminating exception, which will trigger the catch block."
    },
    {
      id: "06.07",
      title: "06.07-wmi-cim-querying",
      name: "WMI & CIM System Queries",
      explainer: `✅ **Definition & Purpose**: Interrogating operating system resources and hardware namespaces using CIM/WMI repositories.
✅ **Architecture / Components**: WMI repository, CIM classes (e.g. Win32_LogicalDisk, Win32_OperatingSystem), WQL query language.
✅ **Daily Tasks**: Gathering system serial numbers, checking OS patches, listing network adapters, and querying BIOS version.
✅ **Real Industry Use Cases**: Querying all domain workstations to compile a report of devices with less than 20GB free space on C:.
✅ **Troubleshooting**: 'RPC server is unavailable' (firewall blocks DCOM/WMI traffic on the target machine).
✅ **Best Practices**: Use Get-CimInstance instead of the obsolete Get-WmiObject, as CIM uses WS-Man which is firewall-friendly.
✅ **Interview Questions**: Why is Get-CimInstance preferred over Get-WmiObject? (Ans: Get-WmiObject uses DCOM (port 135/high dynamic ports); Get-CimInstance uses WS-Man (port 5985) which is easier to allow in firewalls).
✅ **Commands / Cheat Sheet**: \`Get-CimInstance -ClassName Win32_OperatingSystem\` | \`Get-CimInstance -ClassName Win32_LogicalDisk -Filter "DeviceID='C:'"\``,
      problem: "You try to query the BIOS serial number of a remote server, but get 'RPC Server is Unavailable' error.",
      solution: "Verify network firewalls permit DCOM (port 135) if using Get-WmiObject. Switch the query to 'Get-CimInstance -ComputerName <Server> -ClassName Win32_Bios' to use WS-Man on port 5985 instead."
    },
    {
      id: "06.08",
      title: "06.08-active-directory-automation",
      name: "Active Directory Automation",
      explainer: `✅ **Definition & Purpose**: Programmatic management of Active Directory users, computers, groups, and permissions.
✅ **Architecture / Components**: ActiveDirectory module, AD Cmdlets, LDAP filter attributes, object properties.
✅ **Daily Tasks**: Bulk user provisioning, auditing user group memberships, and disabling inactive computer accounts.
✅ **Real Industry Use Cases**: Automating the onboarding of new employees by parsing a CSV file sent by HR.
✅ **Troubleshooting**: Missing ActiveDirectory module (RSAT AD tools not installed on the administrator machine).
✅ **Best Practices**: Use filter parameters instead of retrieving all objects and piping to Where-Object (Filter on source).
✅ **Interview Questions**: Which cmdlet is used to modify Active Directory user object properties? (Ans: \`Set-ADUser\` or \`Set-ADObject\`).
✅ **Commands / Cheat Sheet**: \`Import-Module ActiveDirectory\` | \`Get-ADUser -Filter "Enabled -eq '$false'"\` | \`Search-ADAccount -LockedOut\``,
      problem: "An automation script to update the 'Department' attribute of all users in an OU runs without errors, but the attributes are not updated.",
      solution: "Ensure you are piping the user objects correctly. Run 'Get-ADUser -SearchBase \"OU=Users,DC=domain,DC=com\" -Filter * | Set-ADUser -Department \"Finance\"'. Verify the changes in ADUC."
    }
  ],

  // 7. Microsoft 365 Administrator (MS-102) (13 modules)
  7: [
    {
      id: "07.01",
      title: "07.01-tenant-initialization",
      name: "Tenant Setup & DNS",
      explainer: `✅ **Definition & Purpose**: Configuring a new Microsoft 365 tenant boundary and mapping vanity domains.
✅ **Architecture / Components**: M365 Admin Portal, Custom domains, DNS records (MX, TXT, CNAME, SRV).
✅ **Daily Tasks**: Verifying custom domains, setting up MX routing, and configuring SPF/TXT records for security.
✅ **Real Industry Use Cases**: Onboarding a business and updating DNS to route company email to Exchange Online.
✅ **Troubleshooting**: Domain verification fails (TXT record not updated on registrar), and mail delivery failure.
✅ **Best Practices**: Set up custom domain configuration first before bulk provisioning users to avoid bad default UPNs.
✅ **Interview Questions**: What DNS records are required to configure email routing to Microsoft 365? (Ans: MX record pointing to mail.protection.outlook.com, and TXT record for SPF to allow Microsoft servers to send mail).
✅ **Commands / Cheat Sheet**: Add TXT record: \`MS=msXXXXXXXX\` to domain DNS registrar for validation.`,
      problem: "A custom domain is added to M365, but emails sent to it bounce with 'recipient not found' errors.",
      solution: "Check the domain status in the M365 Admin Center. The MX record is likely pointing to the old server, or the domain has not been verified. Add and verify the MX record: '<domain>.mail.protection.outlook.com'."
    },
    {
      id: "07.02",
      title: "07.02-entra-id-identity",
      name: "Entra ID Identity & Groups",
      explainer: `✅ **Definition & Purpose**: Identity and access management cloud database (formerly Azure AD) for M365 services.
✅ **Architecture / Components**: User accounts, Administrative Units (AUs), Security groups, M365 groups, Dynamic groups.
✅ **Daily Tasks**: Provisioning users, configuring group memberships, assigning product licenses, and auditing logins.
✅ **Real Industry Use Cases**: Setting up a dynamic security group that automatically adds users whose department is 'Sales'.
✅ **Troubleshooting**: Dynamic group membership not updating (takes up to 24 hours to sync rule changes).
✅ **Best Practices**: Use group-based licensing instead of assigning licenses to individual users to reduce maintenance.
✅ **Interview Questions**: What is the difference between a Security Group and an M365 Group? (Ans: Security group grants resource access permissions; M365 group provides email distribution lists and a SharePoint site).
✅ **Commands / Cheat Sheet**: Microsoft Graph: \`New-MgUser\` | \`Get-MgUser -Filter "UserPrincipalName eq 'jdoe@domain.com'"\``,
      problem: "A new hire cannot access Exchange Online. The admin dashboard shows the user account exists and is active.",
      solution: "Verify that the user has been assigned an M365/Office 365 license containing the 'Exchange Online' plan. Without a license, no mailbox is created for the account."
    },
    {
      id: "07.03",
      title: "07.03-hybrid-identity-entra-connect",
      name: "Entra Cloud Sync",
      explainer: `✅ **Definition & Purpose**: Synchronizing local Active Directory DS objects to the cloud Entra ID database.
✅ **Architecture / Components**: Entra Connect server, SQL database, Synchronization Service, Password Hash Sync (PHS), Pass-Through Authentication (PTA).
✅ **Daily Tasks**: Monitoring sync engine status, running manual delta synchronizations, and resolving sync conflicts.
✅ **Real Industry Use Cases**: Enabling users to log in to M365 cloud portals using their local AD password (via PHS).
✅ **Troubleshooting**: 'Duplicate UPN' sync error (resolvable by correcting local AD UPNs or cloud attributes).
✅ **Best Practices**: Run IDFix utility on local AD prior to sync to locate and resolve syntax errors in AD attributes.
✅ **Interview Questions**: What is the default synchronization frequency of Entra Connect? (Ans: Every 30 minutes).
✅ **Commands / Cheat Sheet**: Sync server: \`Start-ADSyncSyncCycle -PolicyType Delta\` | Check status: \`Get-ADSyncScheduler\``,
      problem: "A user changed their name in local AD, but their M365 cloud display name still shows the old name after 2 hours.",
      solution: "Check the Entra Connect synchronization console for sync errors. If the sync is working, force a delta synchronization cycle manually on the sync server using 'Start-ADSyncSyncCycle -PolicyType Delta'."
    },
    {
      id: "07.04",
      title: "07.04-multi-factor-authentication",
      name: "MFA & Conditional Access",
      explainer: `✅ **Definition & Purpose**: Enforcing multi-factor authentication requirements based on specific access criteria.
✅ **Architecture / Components**: Entra ID Protection, Conditional Access (CA) policies, Authenticator App, Security Defaults.
✅ **Daily Tasks**: Configuring CA policies, resetting user MFA registration states, and inspecting risky sign-in logs.
✅ **Real Industry Use Cases**: Blocking all login attempts originating from outside the home country, and forcing MFA for admins.
✅ **Troubleshooting**: Users locked out of accounts due to lost phone authenticator keys, CA policy conflicts.
✅ **Best Practices**: Exclude a 'Break Glass' emergency account from all CA policies to prevent complete administrator lockouts.
✅ **Interview Questions**: What are the building blocks of a Conditional Access policy? (Ans: Signals (who/where), Decisions (allow/block/MFA), and Enforcements (force reset/passwords)).
✅ **Commands / Cheat Sheet**: Manage authentication methods under Microsoft Entra Admin Center -> Protection -> Conditional Access.`,
      problem: "An administrator locks themselves out of the Entra portal after configuring a CA policy restricting accesses to a specific IP.",
      solution: "Log in using the designated emergency 'break-glass' account (which must be excluded from CA policies). Locate the CA policy, set it to 'Report-only' or disable it, and correct the IP configurations."
    },
    {
      id: "07.05",
      title: "07.05-exchange-online-administration",
      name: "Exchange Online Admin",
      explainer: `✅ **Definition & Purpose**: Cloud email administration platform hosting mailboxes, mail flows, and anti-spam protocols.
✅ **Architecture / Components**: Exchange Admin Center (EAC), Mailboxes, Shared Mailboxes, Mail Flow Rules, DKIM, DMARC.
✅ **Daily Tasks**: Provisioning shared mailboxes, restoring deleted emails, adjusting size limits, and tracing lost emails.
✅ **Real Industry Use Cases**: Creating a rule that blocks emails containing credit card numbers from being sent outside the company.
✅ **Troubleshooting**: External emails not arriving (check SPF/MX), messages marked as spam (check DKIM configuration).
✅ **Best Practices**: Use Shared Mailboxes for group communications (e.g. sales@company.com) as they do not require user licenses.
✅ **Interview Questions**: What is the difference between a distribution group and a shared mailbox? (Ans: Distribution group forwards mails to members; Shared mailbox hosts its own mailbox database accessible by members).
✅ **Commands / Cheat Sheet**: Exchange PowerShell: \`Get-Mailbox -Identity "user@domain.com"\` | \`New-Mailbox -Shared -Name "Billing"\``,
      problem: "A client reports that emails sent to their domain are bouncing back to senders with SPF verification errors.",
      solution: "The domain's TXT SPF record is incorrect. Edit the domain DNS zone and update the SPF record to include the Microsoft host: 'v=spf1 include:spf.protection.outlook.com -all'."
    },
    {
      id: "07.06",
      title: "07.06-sharepoint-onedrive-sharing",
      name: "SharePoint & OneDrive Sharing",
      explainer: `✅ **Definition & Purpose**: Cloud content storage and collaboration sites. OneDrive is personal files; SharePoint is team directories.
✅ **Architecture / Components**: SharePoint Admin Center, Document Libraries, Site Collections, External Sharing settings.
✅ **Daily Tasks**: Provisioning team sites, setting external link expiration dates, and recovering deleted document trees.
✅ **Real Industry Use Cases**: Blocking external sharing options on a specific high-security SharePoint site containing intellectual property.
✅ **Troubleshooting**: External users unable to open shared document links, sync errors on local OneDrive desktop apps.
✅ **Best Practices**: Enforce site-level sharing restrictions; disable anonymous guest link sharing globally.
✅ **Interview Questions**: How do SharePoint permissions interact with Microsoft 365 Groups? (Ans: Members of the M365 Group are automatically added to the SharePoint site's Members group, granting edit permissions).
✅ **Commands / Cheat Sheet**: PowerShell: \`Get-SPOSite\` | \`Set-SPOSite -Identity "https://site-url" -SharingCapability ExternalUserSharingOnly\``,
      problem: "A user shares a sensitive finance folder externally, violating data compliance rules. You need to block external sharing immediately.",
      solution: "Navigate to SharePoint Admin Center -> Active Sites -> select the site -> Policies -> External Sharing. Change sharing capability to 'Only people in your organization' and save."
    },
    {
      id: "07.07",
      title: "07.07-microsoft-teams-governance",
      name: "Teams Policies & Access",
      explainer: `✅ **Definition & Purpose**: Unified communications platform. Governance manages guest access, messaging, and meeting behavior.
✅ **Architecture / Components**: Teams Admin Center, Messaging Policies, App Permission Policies, Guest Access, External Access (Federation).
✅ **Daily Tasks**: Creating messaging policies, blocking specific app integrations, and configuring external domain federation.
✅ **Real Industry Use Cases**: Enabling external chat only with specific partner organizations while blocking general consumer accounts.
✅ **Troubleshooting**: Guests unable to join Teams meetings, users blocked from sending external chat messages.
✅ **Best Practices**: Use App Permission Policies to block third-party chat integrations that have not been vetted by security.
✅ **Interview Questions**: What is the difference between External Access and Guest Access in Teams? (Ans: External Access lets users chat with external domains; Guest Access invites external users into team channels as members).
✅ **Commands / Cheat Sheet**: Teams PowerShell: \`Get-CsTeamsClientConfiguration\` | \`Set-CsTeamsMessagingPolicy\``,
      problem: "An external vendor needs to collaborate inside a specific Teams channel, but typing their email returns 'User not found'.",
      solution: "Go to Teams Admin Center -> Users -> Guest Access. Ensure 'Allow guest access in Teams' is turned ON. Wait for settings to apply, then invite the guest email address into the team."
    },
    {
      id: "07.08",
      title: "07.08-role-based-access-control",
      name: "RBAC & Privileged Identity",
      explainer: `✅ **Definition & Purpose**: Restricting admin access by assigning specific roles. PIM allows just-in-time role activations.
✅ **Architecture / Components**: Global Administrator, Helpdesk Administrator, Privileged Identity Management (PIM), Activation approvals.
✅ **Daily Tasks**: Creating custom roles, configuring PIM activation rules, and auditing active administrator assignments.
✅ **Real Industry Use Cases**: Enforcing a security rule where Helpdesk staff must submit an approval request to activate Exchange Admin rights.
✅ **Troubleshooting**: Active role not showing up in console (takes up to 10 minutes to activate after PIM approval).
✅ **Best Practices**: Minimize the number of permanent Global Administrators (aim for less than 5 accounts).
✅ **Interview Questions**: What is Privileged Identity Management (PIM)? (Ans: An Entra ID service that allows administrators to activate just-in-time, temporary, audited administrator roles).
✅ **Commands / Cheat Sheet**: Audit roles via Entra Admin Center -> Identity -> Roles & admins -> Privileged Identity Management.`,
      problem: "A support engineer needs Global Administrator rights for 2 hours to perform a migration task, without keeping permanent access.",
      solution: "Configure the engineer as 'Eligible' for the role in PIM. The engineer must log in, request activation, complete MFA verification, write a justification statement, and await manager approval."
    },
    {
      id: "07.09",
      title: "07.09-data-loss-prevention",
      name: "Data Loss Prevention (DLP)",
      explainer: `✅ **Definition & Purpose**: Compliance framework designed to identify, monitor, and protect sensitive data in M365 systems.
✅ **Architecture / Components**: DLP policies, Sensitive Information Types (SIT), policy tips, email encryption actions.
✅ **Daily Tasks**: Creating DLP rules, auditing incident match reports, and adjusting policy sensitivity levels.
✅ **Real Industry Use Cases**: Blocking employees from emailing PDFs containing client credit card numbers or tax identifiers.
✅ **Troubleshooting**: False-positive detections blocking legitimate business communications (must refine detection rules).
✅ **Best Practices**: Run new DLP policies in 'Test Mode' first before enforcing block actions to prevent work disruption.
✅ **Interview Questions**: What is a Policy Tip in M365 DLP? (Ans: A warning banner displayed to users in Outlook or OneDrive when they attempt to share sensitive data, explaining the policy rule).
✅ **Commands / Cheat Sheet**: Manage under Microsoft Purview Compliance Portal -> Data Loss Prevention -> Policies.`,
      problem: "A user is blocked from emailing an internal project document because it triggered a false positive for medical records.",
      solution: "Open Purview Compliance console, edit the DLP policy, adjust the confidence thresholds of the medical sensitive info type, or add a specific exception rule allowing the project files."
    },
    {
      id: "07.10",
      title: "07.10-purview-e-discovery",
      name: "eDiscovery & Retention",
      explainer: `✅ **Definition & Purpose**: Legal search engine and data protection rules to retain files and investigate data content.
✅ **Architecture / Components**: Legal Hold, Content Search, eDiscovery cases, Retention policies, Retention labels.
✅ **Daily Tasks**: Creating retention rules, executing content searches for legal audits, and putting mailboxes on Hold.
✅ **Real Industry Use Cases**: Enforcing a corporate policy that automatically deletes all chat history after 3 years.
✅ **Troubleshooting**: Legal search fails to index newly updated files, mailboxes not releasing space due to active holds.
✅ **Best Practices**: Apply retention labels based on document types; never delete legal holds without written approval.
✅ **Interview Questions**: What does an eDiscovery Hold do to a user's mailbox? (Ans: It preserves all emails, including deleted messages, in a hidden folder (Recoverable Items) so they cannot be permanently purged).
✅ **Commands / Cheat Sheet**: Purview PowerShell: \`New-ComplianceSearch\` | \`Start-ComplianceSearch\` | \`Get-ComplianceSearchAction\``,
      problem: "An employee is suspected of data theft and leaves the company. You must preserve their entire mailbox and OneDrive data.",
      solution: "Create an eDiscovery Case in Microsoft Purview. Add the user's mailbox and OneDrive as data sources, and create an eDiscovery Hold. This locks the content even if the user account is deleted."
    },
    {
      id: "07.11",
      title: "07.11-defender-for-office365",
      name: "Defender for Office 365",
      explainer: `✅ **Definition & Purpose**: Cloud email and collaboration security protecting against malware, phishing, and link exploits.
✅ **Architecture / Components**: Safe Attachments (sandbox detonation), Safe Links (URL rewrite), anti-phishing policies.
✅ **Daily Tasks**: Reviewing quarantined emails, analyzing phishing simulation success rates, and adjusting security levels.
✅ **Real Industry Use Cases**: Rewriting all external URL links in emails so they are scanned for malware each time a user clicks them.
✅ **Troubleshooting**: Legitimate business attachments getting trapped in quarantine, delay in email delivery during attachment scans.
✅ **Best Practices**: Enable Safe Attachments in dynamic delivery mode so emails arrive instantly while attachments scan.
✅ **Interview Questions**: What is Safe Links? (Ans: A security feature that rewrites URLs in incoming emails to route clicks through a Microsoft security filter to check if the site is malicious at click time).
✅ **Commands / Cheat Sheet**: Inspect quarantined items via Defender Portal -> Email & collaboration -> Review -> Quarantine.`,
      problem: "Users report that emails from a key supplier are missing, but checking mail flow logs shows they were accepted by M365.",
      solution: "Check the Defender Quarantine dashboard. The emails likely triggered spam/phishing filters. Review the message headers, release the email to the users, and add the supplier domain to the tenant allowlist."
    },
    {
      id: "07.12",
      title: "07.12-tenant-health-monitoring",
      name: "Monitoring & Audit Logs",
      explainer: `✅ **Definition & Purpose**: Tracking service availability and auditing administrator and user actions across M365.
✅ **Architecture / Components**: Service Health dashboard, Unified Audit Log (UAL), usage reports, active alert systems.
✅ **Daily Tasks**: Reviewing service outage reports, searching audit logs for bulk file downloads, and configuring alerts.
✅ **Real Industry Use Cases**: Auditing logs to identify which administrator deleted a specific user mailbox last night.
✅ **Troubleshooting**: Audit log queries returning no results (audit logging must be enabled globally on the tenant).
✅ **Best Practices**: Export audit logs to an external SIEM database for long-term storage (M365 retention defaults to 90/180 days).
✅ **Interview Questions**: Where do you check if Microsoft is experiencing a global Teams outage? (Ans: M365 Admin Center -> Health -> Service Health).
✅ **Commands / Cheat Sheet**: Exchange PowerShell: \`Search-UnifiedAuditLog -StartDate (Get-Date).AddDays(-1) -Operations "DeleteMailbox"\``,
      problem: "An administrator needs to trace who granted a user access to a restricted SharePoint folder, but search results are empty.",
      solution: "Ensure audit logging is enabled (run 'Set-AdminAuditLogConfig -UnifiedAuditLogIngestionEnabled $true'). Perform a refined Unified Audit Log search filtering by Activity: 'Shared file, folder, or site'."
    },
    {
      id: "07.13",
      title: "07.13-m365-licensing-optimization",
      name: "M365 License Optimization",
      explainer: `✅ **Definition & Purpose**: Management of subscription pools, license allocation audits, and cost reduction tasks.
✅ **Architecture / Components**: Billing portal, billing cycles, license pools (E3, E5, F3, Business Premium).
✅ **Daily Tasks**: Reclaiming unused licenses, resolving assignment conflicts, and auditing guest user footprint.
✅ **Real Industry Use Cases**: Writing a script to find user accounts that have been disabled for 30+ days and reclaiming their licenses.
✅ **Troubleshooting**: 'License conflict' errors (user assigned overlapping plan licenses), subscription limit reached.
✅ **Best Practices**: Create an automated workflow to strip license pools from disabled/terminated employee accounts.
✅ **Interview Questions**: What is group-based licensing? (Ans: A feature in Entra ID allowing you to assign license plans to a security group. Members of the group automatically inherit the licenses).
✅ **Commands / Cheat Sheet**: Graph: \`Set-MgUserLicense -UserId <id> -AddLicenses @{SkuId='sku-id-here'} -RemoveLicenses @()\``,
      problem: "The tenant runs out of available E5 licenses. HR wants to onboard a new manager immediately.",
      solution: "Audit active licenses. Run a query to locate disabled user accounts that still have E5 licenses assigned. Remove licenses from those inactive accounts to return them to the available pool."
    }
  ],

  // 8. AZ-900 Azure Fundamentals (11 modules)
  8: [
    {
      id: "08.01",
      title: "08.01-cloud-computing-benefits",
      name: "Cloud Benefits & Concepts",
      explainer: `✅ **Definition & Purpose**: Introduction to cloud computing paradigm. Benefits define cloud architecture advantages.
✅ **Architecture / Components**: High Availability, Scalability (Vertical/Horizontal), Elasticity, Agility, Disaster Recovery, CapEx vs OpEx.
✅ **Daily Tasks**: Sizing cloud deployments, reviewing infrastructure redundancy, and auditing cost budgets.
✅ **Real Industry Use Cases**: Scaling VM counts automatically during traffic spikes (Elasticity) and paying only for hourly usage (OpEx).
✅ **Troubleshooting**: Scaling failures due to subscription limit caps, high cost overruns (CapEx budget migration errors).
✅ **Best Practices**: Plan systems with High Availability zones; configure auto-scaling rules to shut down resources when idle.
✅ **Interview Questions**: What is the difference between Scalability and Elasticity? (Ans: Scalability is the ability to handle increased load; Elasticity is the ability to auto-grow and auto-shrink based on dynamic demand).
✅ **Commands / Cheat Sheet**: Conceptual knowledge: High Availability (uptime protection), Scalability (growth capacity).`,
      problem: "A company wants to host an application that has high traffic during the daytime, but zero traffic at night. They want to minimize costs.",
      solution: "Deploy the app on Azure App Services or virtual machine scale sets with auto-scaling configured. This provides Elasticity, scaling up during high load and scaling down to zero/minimum instances at night."
    },
    {
      id: "08.02",
      title: "08.02-laas-paas-saas-models",
      name: "Cloud Service Models",
      explainer: `✅ **Definition & Purpose**: Classification of cloud service types defining host control and management boundaries.
✅ **Architecture / Components**: IaaS (Infrastructure as a Service), PaaS (Platform as a Service), SaaS (Software as a Service).
✅ **Daily Tasks**: Creating VMs (IaaS), configuring databases (PaaS), and provisioning user access to Office 365 (SaaS).
✅ **Real Industry Use Cases**: Deploying an Azure SQL database (PaaS) to avoid managing OS patching and backup storage.
✅ **Troubleshooting**: Security patching gaps (admin forgetting to patch IaaS VMs), database lockouts.
✅ **Best Practices**: Choose PaaS by default to reduce management overhead unless direct OS control (IaaS) is required.
✅ **Interview Questions**: In which service model does the customer retain the most control? (Ans: IaaS (Infrastructure as a Service) - customer manages OS, middleware, runtime, and applications).
✅ **Commands / Cheat Sheet**: Shared Responsibility: Customer controls data in all models. Microsoft controls hardware.`,
      problem: "A company wants to deploy a WordPress website, but does not want to handle OS security updates and database backups.",
      solution: "Deploy WordPress on Azure App Services (PaaS). The underlying operating system, server hardware, runtime engine, and backups are managed by Microsoft, leaving only the application code for the customer to manage."
    },
    {
      id: "08.03",
      title: "08.03-azure-architectural-components",
      name: "Azure Physical Infrastructure",
      explainer: `✅ **Definition & Purpose**: The global organization structure of Microsoft Azure physical and logical resources.
✅ **Architecture / Components**: Regions, Availability Zones (redundant datacenters), Resource Groups, Subscriptions, Management Groups.
✅ **Daily Tasks**: Organizing resources into Resource Groups, structuring subscriptions, and assigning regional endpoints.
✅ **Real Industry Use Cases**: Deploying VM replicas across three separate Availability Zones in East US region to ensure 99.99% uptime.
✅ **Troubleshooting**: Resource deployment failures due to region mismatches, unable to delete Resource Group (locks active).
✅ **Best Practices**: Keep related resources in the same Resource Group; deploy workloads in region pairs for disaster recovery.
✅ **Interview Questions**: What is an Azure Availability Zone? (Ans: A physically separate datacenter facility within an Azure Region with independent power, cooling, and networking).
✅ **Commands / Cheat Sheet**: Azure CLI: \`az account list\` | \`az group create --name RG-Prod --location eastus\``,
      problem: "An administrator needs to deploy a system that survives the total power failure of a local datacenter facility in East US.",
      solution: "Deploy resources across multiple Azure Availability Zones (e.g. Zone 1 and Zone 2) within the East US region. Because each zone has independent power and cooling, the system remains online if one facility fails."
    },
    {
      id: "08.04",
      title: "08.04-azure-compute-services",
      name: "Azure Compute Solutions",
      explainer: `✅ **Definition & Purpose**: Cloud computing engines hosting workloads, web apps, and containers on Azure.
✅ **Architecture / Components**: Azure VMs, Virtual Machine Scale Sets (VMSS), Azure App Services, Container Instances (ACI), AKS (Kubernetes).
✅ **Daily Tasks**: Deploying virtual machines, configuring scale sets, deploying web apps, and running containers.
✅ **Real Industry Use Cases**: Running a web site on Azure App Services (PaaS) and database backends on Azure Virtual Machines (IaaS).
✅ **Troubleshooting**: VM connection timeouts (NSG rules blocking port 3389/22), container start loops.
✅ **Best Practices**: Use VM Scale Sets for web servers to automatically adjust instance counts based on CPU utilization.
✅ **Interview Questions**: What is a Virtual Machine Scale Set? (Ans: A service that lets you deploy and manage a set of identical, auto-scaling virtual machines).
✅ **Commands / Cheat Sheet**: CLI: \`az vm create --resource-group RG-Prod --name VM-Web --image Win2022Datacenter --admin-username adminuser\``,
      problem: "A developer needs to run a simple, lightweight containerized task for 10 minutes without deploying a full Kubernetes cluster.",
      solution: "Deploy the task on Azure Container Instances (ACI). ACI is a serverless container hosting solution that starts containers in seconds and charges only for the exact seconds the container runs."
    },
    {
      id: "08.05",
      title: "08.05-azure-networking-basics",
      name: "Azure Networking Fundamentals",
      explainer: `✅ **Definition & Purpose**: Establishing virtual networks in Azure to enable secure communication between resources.
✅ **Architecture / Components**: Virtual Networks (VNet), Subnets, Network Security Groups (NSG), VPN Gateways, ExpressRoute.
✅ **Daily Tasks**: Configuring subnets, creating NSG inbound security rules, and setting up VNet peering links.
✅ **Real Industry Use Cases**: Creating a secure VNet with a public-facing web subnet and a private-facing database subnet.
✅ **Troubleshooting**: VMs unable to communicate across different subnets (NSG rules blocking traffic), routing tables missing.
✅ **Best Practices**: Use VNet Peering to connect virtual networks in the same or different regions over the Microsoft backbone.
✅ **Interview Questions**: What is an NSG? (Ans: Network Security Group - a basic packet filter firewall that controls inbound and outbound traffic to subnets and NICs).
✅ **Commands / Cheat Sheet**: CLI: \`az network vnet create --resource-group RG --name VNet1 --address-prefixes 10.0.0.0/16\``,
      problem: "A web server VM in subnet-A cannot connect to a database server VM in subnet-B. Both subnets are in the same VNet.",
      solution: "Check the Network Security Groups (NSGs) linked to subnet-B or the database VM's NIC. Ensure there is an inbound security rule allowing traffic from subnet-A's IP range on the database port (e.g. 1433)."
    },
    {
      id: "08.06",
      title: "08.06-azure-storage-accounts",
      name: "Azure Storage Accounts",
      explainer: `✅ **Definition & Purpose**: Scalable cloud storage for files, data objects, disk images, and queue logs.
✅ **Architecture / Components**: Blob storage (containers), Azure Files (SMB/NFS shares), Disk storage, Table/Queue storage, LRS/GRS/ZRS.
✅ **Daily Tasks**: Creating storage containers, uploading block blobs, configuring file shares, and generating SAS tokens.
✅ **Real Industry Use Cases**: Creating an SMB Azure File Share mounted by remote Windows servers to share active scripts.
✅ **Troubleshooting**: Storage accounts unreachable (firewall blocks), SAS tokens expired, read latency issues.
✅ **Best Practices**: Enable 'Secure transfer required' and use Shared Access Signatures (SAS) instead of account keys.
✅ **Interview Questions**: What is the difference between LRS and GRS redundancy? (Ans: LRS replicates data 3 times inside a single facility; GRS replicates data to a secondary region hundreds of miles away).
✅ **Commands / Cheat Sheet**: CLI: \`az storage account create --name mystacc --resource-group RG --location eastus --sku Standard_LRS\``,
      problem: "A legacy on-premises server needs to mount a shared folder in the cloud, but the local network has port 445 blocked.",
      solution: "Standard SMB mounts require port 445. If blocked, deploy Azure File Sync, or mount the storage using the Azure Storage Explorer client over standard HTTPS port 443 instead."
    },
    {
      id: "08.07",
      title: "08.07-azure-database-solutions",
      name: "Azure Database Services",
      explainer: `✅ **Definition & Purpose**: Managed database platforms hosting relational and non-relational database structures.
✅ **Architecture / Components**: Azure SQL Database, Azure Cosmos DB (NoSQL), Database for PostgreSQL/MySQL, SQL Managed Instance.
✅ **Daily Tasks**: Configuring database firewall rules, checking replication status, and adjusting performance tiers.
✅ **Real Industry Use Cases**: Hosting global web store databases on Cosmos DB to guarantee single-digit millisecond latency worldwide.
✅ **Troubleshooting**: Database connections failing (client IP not whitelisted in DB firewall), database query bottlenecks.
✅ **Best Practices**: Use Azure SQL Managed Instance if migrating on-premises SQL servers that require SQL Agent or database mail features.
✅ **Interview Questions**: What is Azure Cosmos DB? (Ans: A globally distributed, multi-model NoSQL database service supporting MongoDB, Cassandra, and SQL APIs).
✅ **Commands / Cheat Sheet**: Port: SQL Server default port is 1433.`,
      problem: "An application fails to connect to a newly created Azure SQL Database, returning a 'connection timed out' error.",
      solution: "Open the Azure SQL Server configurations, navigate to 'Networking', and add the application's outbound public IP address to the SQL server firewall whitelist rules."
    },
    {
      id: "08.08",
      title: "08.08-azure-active-directory-entra",
      name: "Azure AD & Entra ID",
      explainer: `✅ **Definition & Purpose**: Cloud identity provider. Manages user accounts, authentication, and cloud directory domains.
✅ **Architecture / Components**: Tenants, Users, Groups, Enterprise Applications, App Registrations, RBAC, Entra ID licenses.
✅ **Daily Tasks**: Provisioning users, setting password reset policies, creating enterprise apps, and managing permissions.
✅ **Real Industry Use Cases**: Setting up Single Sign-On (SSO) for a third-party CRM web app using Entra ID enterprise integrations.
✅ **Troubleshooting**: Sync errors, logins blocked by security policies, and application registration authentication issues.
✅ **Best Practices**: Enforce multi-factor authentication for all user accounts; use RBAC roles to grant least privilege.
✅ **Interview Questions**: What is the difference between Azure RBAC roles and Azure AD/Entra roles? (Ans: Azure RBAC roles manage access to Azure resources (VMs, VNets); Entra roles manage directory objects (Users, Domains, Licenses)).
✅ **Commands / Cheat Sheet**: CLI: \`az ad user list\` | \`az role assignment create --assignee <email> --role "Reader" --scope <resource-id>\``,
      problem: "A user is assigned the 'User Administrator' Entra role, but still cannot restart or delete a virtual machine.",
      solution: "The User Administrator role is an Entra ID directory role, not an Azure resource role. Assign the user the 'Virtual Machine Contributor' Azure RBAC role at the resource group or subscription scope."
    },
    {
      id: "08.09",
      title: "08.09-azure-security-sentinel",
      name: "Security: Sentinel & Defender",
      explainer: `✅ **Definition & Purpose**: Threat protection and security information management solutions on Azure.
✅ **Architecture / Components**: Microsoft Defender for Cloud, Microsoft Sentinel (SIEM/SOAR), Azure Key Vault, Network Security Groups.
✅ **Daily Tasks**: Checking security recommendations, auditing Key Vault access policies, and investigating Sentinel alert chains.
✅ **Real Industry Use Cases**: Storing database passwords and certificates securely in Azure Key Vault so code never hosts plain secrets.
✅ **Troubleshooting**: Applications unable to read Key Vault secrets (missing Access Policy or RBAC assignment).
✅ **Best Practices**: Enable Defender for Cloud globally; ensure Key Vault has soft-delete and purge protection enabled.
✅ **Interview Questions**: What is Microsoft Sentinel? (Ans: A scalable, cloud-native SIEM (Security Information and Event Management) system that analyzes security data across the enterprise).
✅ **Commands / Cheat Sheet**: CLI: \`az keyvault secret show --name dbpassword --vault-name myvault\``,
      problem: "A vulnerability scanner alerts that database connection strings are written in plaintext inside an App Service configuration file.",
      solution: "Create an Azure Key Vault, upload the connection string as a secret, configure the App Service to use a System-Assigned Managed Identity, and grant the identity permission to read secrets from Key Vault."
    },
    {
      id: "08.10",
      title: "08.10-azure-governance-policy",
      name: "Azure Governance & Policy",
      explainer: `✅ **Definition & Purpose**: Enforcing corporate standards and compliance rules across all deployed cloud resources.
✅ **Architecture / Components**: Azure Policy, Resource Locks (CanNotDelete, ReadOnly), Azure Blueprints, Cost Management.
✅ **Daily Tasks**: Deploying compliance policy definitions, configuring resource locks, and tracking monthly spend trends.
✅ **Real Industry Use Cases**: Deploying an Azure Policy that blocks administrators from provisioning virtual machines outside of Europe regions.
✅ **Troubleshooting**: Administrators unable to delete resources (blocked by active CanNotDelete resource locks).
✅ **Best Practices**: Apply 'CanNotDelete' locks to production Resource Groups to prevent accidental deletion of systems.
✅ **Interview Questions**: What happens if a resource is subject to an Azure Policy that evaluates to 'Deny'? (Ans: Azure blocks the creation or update of the resource, returning a policy violation error).
✅ **Commands / Cheat Sheet**: CLI: \`az lock create --name Lock-Prod-RG --lock-type CanNotDelete --resource-group RG-Prod\``,
      problem: "An engineer gets an 'AuthorizationFailed' error when trying to delete an old test VM, despite having Owner permissions.",
      solution: "Check the resource locks on the VM or its parent Resource Group. The resource likely has a 'CanNotDelete' lock applied. Remove the lock first, delete the resource, and reapply the lock if needed."
    },
    {
      id: "08.11",
      title: "08.11-azure-monitoring-advisor",
      name: "Azure Monitor & Advisor",
      explainer: `✅ **Definition & Purpose**: Monitoring cloud infrastructure health, metrics, alerts, and cost optimization recommendations.
✅ **Architecture / Components**: Azure Monitor, Log Analytics Workspaces, Application Insights, Azure Advisor.
✅ **Daily Tasks**: Creating metric alert rules, querying logs using KQL, and implementing Advisor cost recommendations.
✅ **Real Industry Use Cases**: Configuring an alert to email the systems team when server CPU usage exceeds 90% for 5 minutes.
✅ **Troubleshooting**: Alerts not firing (incorrect threshold settings), Log Analytics workspace not receiving VM logs (missing agent).
✅ **Best Practices**: Use Azure Advisor recommendations weekly to identify underutilized VMs and save licensing costs.
✅ **Interview Questions**: What query language is used to analyze logs inside Azure Log Analytics? (Ans: KQL (Kusto Query Language)).
✅ **Commands / Cheat Sheet**: KQL: \`Event | where EventLevelName == "Error" | summarize count() by Source\``,
      problem: "A critical VM crashes, but the systems team is only notified 30 minutes later by angry client calls.",
      solution: "Open Azure Monitor. Create an Alert Rule targeted at the VM's status metric ('VM Availability Metric'). Set the threshold to evaluate when availability drops below 1, and configure an Action Group to send SMS/Email alerts."
    }
  ],

  // 9. AZ-104 Azure Administrator (12 modules)
  9: [
    {
      id: "09.01",
      title: "09.01-azure-identity-governance",
      name: "Identity & Directory Management",
      explainer: `✅ **Definition & Purpose**: Administration of Azure cloud directory services, domain mappings, and account attributes.
✅ **Architecture / Components**: Entra ID Tenants, Custom domains, Self-Service Password Reset (SSPR), Administrative Units.
✅ **Daily Tasks**: Configuring SSPR authentication methods, setting up directory syncs, and delegating permissions using Administrative Units.
✅ **Real Industry Use Cases**: Restricting a helpdesk tech to only manage user accounts within a specific department OU/AU.
✅ **Troubleshooting**: SSPR not working (security questions or contact methods not registered by users), sync delays.
✅ **Best Practices**: Enable SSPR globally for all users to reduce helpdesk password reset ticket volumes.
✅ **Interview Questions**: What is an Administrative Unit? (Ans: An Entra ID container used to group users and devices, allowing scoped administrative delegation (e.g. Helpdesk admin for India AU only)).
✅ **Commands / Cheat Sheet**: CLI: \`az ad domain list\` | \`az ad user update --id user@domain.com --department Finance\``,
      problem: "A company wants to allow users to reset their own passwords but wants to force them to verify via mobile app code.",
      solution: "Go to Entra ID -> Password reset. Enable SSPR for users, select 'Methods available to users', check 'Mobile app code' and 'Mobile app notification', and save the policy configuration."
    },
    {
      id: "09.02",
      title: "09.02-azure-rbac-custom-roles",
      name: "Azure RBAC & Custom Roles",
      explainer: `✅ **Definition & Purpose**: Restricting cloud resource permissions using role assignments at different scopes.
✅ **Architecture / Components**: Role Definitions, Assignments, Scopes (Management Group, Subscription, RG, Resource), Custom Roles.
✅ **Daily Tasks**: Assigning roles to user groups, creating JSON custom roles, and auditing resource permissions.
✅ **Real Industry Use Cases**: Creating a custom role 'Virtual Machine Operator' that can start/stop VMs but cannot edit network connections.
✅ **Troubleshooting**: Users unable to perform actions despite assignment (scope inheritance block or overlapping deny rules).
✅ **Best Practices**: Assign roles to Entra ID groups rather than individual user accounts to ease management.
✅ **Interview Questions**: What are the three core elements of a Role Assignment? (Ans: Security Principal (User/Group), Role Definition (Owner/Reader), and Scope (Subscription/RG)).
✅ **Commands / Cheat Sheet**: JSON structure: \`{ "Name": "VM Operator", "Actions": ["Microsoft.Compute/virtualMachines/start/action"], ... }\` | \`az role definition create --role-definition role.json\``,
      problem: "A developer needs to view the logs of an App Service, but the administrator doesn't want to grant access to delete or change settings.",
      solution: "Assign the developer the 'Website Contributor' or standard 'Reader' role restricted to that specific App Service resource group scope, which prevents configuration changes while allowing resource logs to load."
    },
    {
      id: "09.03",
      title: "09.03-azure-storage-management",
      name: "Secure Storage Management",
      explainer: `✅ **Definition & Purpose**: Securing and managing lifecycle storage access, encryption, and keys in Azure storage.
✅ **Architecture / Components**: Storage keys, Shared Access Signatures (SAS), Storage Firewalls, Lifecycle management policies.
✅ **Daily Tasks**: Rotating access keys, generating scoped SAS tokens, restricting IP access, and setting data archiving policies.
✅ **Real Industry Use Cases**: Automating the migration of blob storage logs to Archive storage tier after 30 days of inactivity.
✅ **Troubleshooting**: Clients blocked from storage account (Storage firewall missing client public IP), SAS token auth failure.
✅ **Best Practices**: Rotate storage access keys every 90 days; use User Delegated SAS tokens backed by Entra ID credentials.
✅ **Interview Questions**: What is a SAS token? (Ans: A URI query parameter that grants restricted access rights and expiration limits to storage resources without exposing account keys).
✅ **Commands / Cheat Sheet**: CLI: \`az storage container policy create\` | \`az storage blob generate-sas --container-name logs --name log1.txt --permissions r --expiry 2026-12-31\``,
      problem: "An external auditor needs to download backup files from a storage account container for the next 24 hours only.",
      solution: "Generate a Shared Access Signature (SAS) token on the storage container. Set permissions to 'Read' only, configure the start and expiration times to span 24 hours, and share the SAS URL with the auditor."
    },
    {
      id: "09.04",
      title: "09.04-azure-vm-deployment-arm",
      name: "VM Deployments & Bicep",
      explainer: `✅ **Definition & Purpose**: Automated provisioning of virtual machines using templates and infrastructure as code models.
✅ **Architecture / Components**: ARM Templates (JSON), Azure Bicep, Custom Script Extensions, Azure Bastion.
✅ **Daily Tasks**: Editing Bicep files, running deployment commands, configuring post-install script extensions, and RDPing via Bastion.
✅ **Real Industry Use Cases**: Deploying a standardized cluster of 10 VMs configured with IIS using Azure Bicep files.
✅ **Troubleshooting**: Bicep deployment fails due to syntax errors, VM boot diagnostic logs show boot failures.
✅ **Best Practices**: Use Azure Bastion to access VMs securely without exposing public RDP/SSH ports (3389/22) to the internet.
✅ **Interview Questions**: What is Azure Bastion? (Ans: A fully managed PaaS service that provides secure, seamless RDP/SSH access to VMs directly over SSL through the Azure portal).
✅ **Commands / Cheat Sheet**: Bicep: \`az deployment group create --resource-group RG-Prod --template-file main.bicep\` | \`resource vm 'Microsoft.Compute/virtualMachines@2021-07-01' = { ... }\``,
      problem: "You need to deploy a Windows VM and run an initial configuration PowerShell script immediately on boot.",
      solution: "Include the 'Custom Script Extension' resource in your ARM/Bicep template, or apply it post-deployment. Configure it to download and execute your '.ps1' script on the target VM."
    },
    {
      id: "09.05",
      title: "09.05-azure-virtual-networking",
      name: "VNet Peering & Security",
      explainer: `✅ **Definition & Purpose**: Establishing network routes between virtual networks and controlling traffic flow using NSGs and routes.
✅ **Architecture / Components**: VNet Peering, User Defined Routes (UDR), Network Security Groups (NSG), Service Endpoints.
✅ **Daily Tasks**: Configuring VNet peering, setting up route tables, creating security rules, and testing inter-VM paths.
✅ **Real Industry Use Cases**: Peering a hub network (containing a virtual firewall) to multiple spoke networks to inspect all outbound traffic.
✅ **Troubleshooting**: Peering state stuck in 'Initiated' (missing bidirectional peering configuration), routing loops.
✅ **Best Practices**: Uncheck 'Use Gateway Transit' on spoke peers unless a VPN gateway is configured in the hub network.
✅ **Interview Questions**: Can you peer two VNets with overlapping IP address ranges? (Ans: No. VNets with overlapping IP address spaces cannot be peered; you must plan non-overlapping CIDR blocks).
✅ **Commands / Cheat Sheet**: CLI: \`az network vnet peering create --name HubToSpoke --resource-group RG --vnet-name VNet-Hub --remote-vnet VNet-Spoke --allow-vnet-access\``,
      problem: "Two peered VNets fail to communicate. You check VNet-A's peering status and it shows 'Connected', but VNet-B shows 'Initiated'.",
      solution: "VNet peering requires two separate link configurations (one from A to B, and one from B to A). Create the peer link from VNet-B pointing to VNet-A to complete the handshake."
    },
    {
      id: "09.06",
      title: "09.06-azure-dns-hybrid",
      name: "Azure Private DNS & Hybrid Name Resolution",
      explainer: `✅ **Definition & Purpose**: Resolving custom domain names inside private virtual networks without exposing records to the internet.
✅ **Architecture / Components**: Azure Private DNS Zones, Virtual Network Links, Auto-registration, DNS Private Resolver.
✅ **Daily Tasks**: Creating private DNS zones, linking zones to VNets, enabling auto-registration, and configuring hybrid DNS resolvers.
✅ **Real Industry Use Cases**: Linking a private DNS zone 'corp.internal' to all development VNets so VMs resolve each other by name.
✅ **Troubleshooting**: VM names not resolving (VNet link missing, or auto-registration unchecked), local DNS queries failing to resolve.
✅ **Best Practices**: Enable auto-registration on private zones only for VNets where VMs are frequently created and destroyed.
✅ **Interview Questions**: What is the purpose of Virtual Network Links in Azure Private DNS? (Ans: They associate a private DNS zone with a VNet, allowing VMs inside that network to resolve records in the zone).
✅ **Commands / Cheat Sheet**: CLI: \`az network private-dns zone create --resource-group RG --name corp.internal\` | \`az network private-dns link vnet create --resource-group RG --zone-name corp.internal --name LinkVnet1 --virtual-network VNet1 --registration-enabled true\``,
      problem: "A new VM is created in VNet-A, but other VMs in VNet-A cannot ping it by its hostname 'db-srv.corp.internal'.",
      solution: "Ensure the private DNS zone 'corp.internal' is linked to VNet-A. Verify that 'Registration Enabled' is checked in the virtual network link properties to allow automatic DNS record creation."
    },
    {
      id: "09.07",
      title: "09.07-azure-load-balancing",
      name: "Load Balancer & App Gateway",
      explainer: `✅ **Definition & Purpose**: Distributing incoming network traffic across a backend pool of virtual machines or endpoints.
✅ **Architecture / Components**: Azure Load Balancer (L4, TCP/UDP), Application Gateway (L7, HTTP/HTTPS, SSL termination, WAF), backend pools, health probes.
✅ **Daily Tasks**: Configuring load balancing rules, setting up health probes, uploading SSL certs to App Gateway, and configuring WAF rules.
✅ **Real Industry Use Cases**: Deploying an Application Gateway to route traffic to /images and /videos to separate VM pools (path routing).
✅ **Troubleshooting**: Backend servers showing unhealthy in load balancer pool (incorrect health probe port or local service stopped).
✅ **Best Practices**: Configure health probes to target a specific health page (e.g. /health.html) rather than the default homepage.
✅ **Interview Questions**: What is the difference between Azure Load Balancer and Application Gateway? (Ans: Load Balancer operates at Layer 4 (IP/Port); Application Gateway operates at Layer 7 (URLs/Headers) and supports SSL termination and WAF).
✅ **Commands / Cheat Sheet**: CLI: \`az network lb create --resource-group RG --name PublicLB --frontend-ip-name FrontEnd --backend-pool-name BackendPool\``,
      problem: "All backend web servers in a load balancer pool are flagged as 'Unhealthy' by the health probe, and site access fails.",
      solution: "Check the local firewall settings on the VMs. Ensure they allow traffic on the health probe port (e.g. port 80). Verify that the IIS/Apache web service is running and hosting the test file queried by the probe."
    },
    {
      id: "09.08",
      title: "09.08-azure-backup-recovery",
      name: "Azure Backup & Site Recovery",
      explainer: `✅ **Definition & Purpose**: Cloud backup and disaster recovery solutions protecting virtual machines, file shares, and database workloads.
✅ **Architecture / Components**: Recovery Services Vault, Backup Policies, Recovery Points, Azure Site Recovery (replication to secondary regions).
✅ **Daily Tasks**: Creating backup policies, monitoring daily job status, performing file-level restores, and running DR replication drills.
✅ **Real Industry Use Cases**: Replicating critical production VMs from East US to West US using Azure Site Recovery for geographic failover.
✅ **Troubleshooting**: Backups failing due to VM agent offline, slow replication rates, restore points not matching.
✅ **Best Practices**: Enable soft-delete on Recovery Services Vaults to protect backup data from malicious deletion attempts.
✅ **Interview Questions**: What is the recovery point objective (RPO)? (Ans: The maximum acceptable amount of data loss measured in time (e.g. 4 hours of data loss) during an outage).
✅ **Commands / Cheat Sheet**: CLI: \`az backup container show\` | \`az backup item show\` | \`az backup protection enable-for-vm\``,
      problem: "A user accidentally deletes a critical file from a VM. You need to restore only that single file from last night's backup.",
      solution: "Go to Recovery Services Vault -> Backup Items -> select the VM -> click 'File Recovery'. Download the file recovery script, execute it on the target VM to mount the backup volume, copy the file, and unmount the volume."
    },
    {
      id: "09.09",
      title: "09.09-azure-monitor-alerts",
      name: "Log Analytics & Alerts",
      explainer: `✅ **Definition & Purpose**: Monitoring cloud infrastructure health, metrics, alerts, and cost optimization recommendations.
✅ **Architecture / Components**: Azure Monitor, Log Analytics Workspaces, Application Insights, Azure Advisor.
✅ **Daily Tasks**: Creating metric alert rules, querying logs using KQL, and implementing Advisor cost recommendations.
✅ **Real Industry Use Cases**: Configuring an alert to email the systems team when server CPU usage exceeds 90% for 5 minutes.
✅ **Troubleshooting**: Alerts not firing (incorrect threshold settings), Log Analytics workspace not receiving VM logs (missing agent).
✅ **Best Practices**: Use Azure Advisor recommendations weekly to identify underutilized VMs and save licensing costs.
✅ **Interview Questions**: What query language is used to analyze logs inside Azure Log Analytics? (Ans: KQL (Kusto Query Language)).
✅ **Commands / Cheat Sheet**: KQL: \`Event | where EventLevelName == "Error" | summarize count() by Source\``,
      problem: "You need to write a KQL query to find all VMs that have generated a 'disk full' error event in the last 24 hours.",
      solution: "In Log Analytics, run: 'Event | where TimeGenerated > ago(24h) | where EventLog == \"System\" and EventID == 7 | project TimeGenerated, Computer, RenderedDescription'. Create an alert rule based on this query query frequency."
    },
    {
      id: "09.10",
      title: "09.10-azure-app-services",
      name: "App Service Deployments",
      explainer: `✅ **Definition & Purpose**: Managed hosting platform for web applications, REST APIs, and mobile backends.
✅ **Architecture / Components**: App Service Plans (pricing/compute tier), App Services, Deployment Slots, Custom Domains, SSL bindings.
✅ **Daily Tasks**: Creating App Service plans, deploying code packages, configuring deployment slots, swapping slots, and binding SSL certs.
✅ **Real Industry Use Cases**: Deploying a staging version of a web application to a deployment slot, testing it, and swapping to production.
✅ **Troubleshooting**: Web app returning 503 errors (App plan resources exhausted), deployment failures via GitHub Actions.
✅ **Best Practices**: Use deployment slots for zero-downtime updates; run production apps on Standard or Premium plans to enable slots.
✅ **Interview Questions**: What is an App Service Plan? (Ans: The set of physical compute resources (CPU, RAM, Storage) and pricing tier allocated to run one or more App Service web apps).
✅ **Commands / Cheat Sheet**: CLI: \`az webapp create --name mywebapp --resource-group RG --plan myplan\` | \`az webapp deployment slot swap --name mywebapp --resource-group RG --slot staging --target-slot production\``,
      problem: "A developer updates a production web app, but users report the website is completely down during the update process.",
      solution: "Implement deployment slots. Deploy updates to the 'Staging' slot. Once verified, perform a slot swap. This redirects user traffic to the updated slot instantly, resulting in zero-downtime deployments."
    },
    {
      id: "09.11",
      title: "09.11-azure-kubernetes-aks",
      name: "Azure Kubernetes Service",
      explainer: `✅ **Definition & Purpose**: Fully managed Kubernetes service on Azure that simplifies deploying and managing containerized applications.
✅ **Architecture / Components**: Control Plane (managed by Azure), Node Pools (VMs), Kubectl, Pods, Services, Ingress Controllers.
✅ **Daily Tasks**: Creating AKS clusters, scaling node pools, deploying application manifests, and monitoring cluster health.
✅ **Real Industry Use Cases**: Hosting microservices architectures that scale dynamically based on real-time request loads.
✅ **Troubleshooting**: Pods stuck in 'CrashLoopBackOff' (app configuration errors or crash on launch), cluster out of IP addresses.
✅ **Best Practices**: Use Azure AD integration for cluster RBAC authentication; choose Azure CNI networking for direct IP allocation.
✅ **Interview Questions**: What is the difference between kubenet and Azure CNI networking in AKS? (Ans: Kubenet assigns IPs from virtual networks inside the cluster (NAT); Azure CNI assigns direct subnet IPs to every pod, requiring more IP planning).
✅ **Commands / Cheat Sheet**: CLI: \`az aks get-credentials --resource-group RG --name MyAKSCluster\` | \`kubectl get nodes\` | \`kubectl apply -f deployment.yaml\``,
      problem: "A pod fails to start in your AKS cluster, showing status 'ImagePullBackOff'.",
      solution: "Kubernetes cannot pull the container image. Check if the image name/tag is correct in the YAML manifest, and verify that the AKS cluster has permission to pull from your Azure Container Registry (ACR) using an attachment."
    },
    {
      id: "09.12",
      title: "09.12-azure-cost-management",
      name: "Azure Cost Optimization",
      explainer: `✅ **Definition & Purpose**: Monitoring cloud spend, configuring budgets, and implementing cost-saving measures on Azure.
✅ **Architecture / Components**: Cost Analysis, Budgets, Azure Reservations, Azure Hybrid Benefit, Spot VMs.
✅ **Daily Tasks**: Reviewing monthly spend graphs, setting budget alerts, purchasing reservations, and cleaning up orphan resources.
✅ **Real Industry Use Cases**: Purchasing a 3-year Azure Reservation for a production database VM to save up to 72% in compute costs.
✅ **Troubleshooting**: Budget alert emails not firing, unexpected charges from undeleted diagnostic logs or snapshot chains.
✅ **Best Practices**: Make sure to tag and monitor all resources; delete unused disks and public IP addresses.
✅ **Interview Questions**: What is Azure Hybrid Benefit? (Ans: A licensing benefit that allows you to use your on-premises Windows Server and SQL Server licenses with active Software Assurance to pay reduced rates on Azure VMs).
✅ **Commands / Cheat Sheet**: CLI: \`az consumption budget create --amount 500 --budget-name MonthlyBudget --time-grain Monthly\``,
      problem: "A department's cloud spend increases by 40% in one month. You need to identify the exact resource causing the spike.",
      solution: "Open Azure Cost Management -> Cost Analysis. Group the costs by 'Resource Group' or 'Resource' and filter by date. Identify the resource (e.g. an unmanaged VM scale set or large SQL database) and resize or delete it."
    }
  ],

  // 10. Microsoft Intune / MD-102 Endpoint Administrator (14 modules)
  10: [
    {
      id: "10.01",
      title: "10.01-intune-tenant-licensing",
      name: "Tenant Setup & MDM",
      explainer: `✅ **Definition & Purpose**: Initializing Microsoft Intune endpoint management and configuring device authority parameters.
✅ **Architecture / Components**: Intune Admin Center, MDM Authority, licenses (Intune Plan 1/2, M365 E3/E5), Device Enrollment Managers.
✅ **Daily Tasks**: Verifying MDM authority settings, assigning licenses, adding admin roles, and auditing tenant configurations.
✅ **Real Industry Use Cases**: Setting the MDM authority to Microsoft Intune so all user devices register with the corporate tenant.
✅ **Troubleshooting**: Users unable to enroll devices (missing licenses or MDM authority set to Office 365 instead of Intune).
✅ **Best Practices**: Set the MDM authority to Intune globally; configure dynamic device groups to organize endpoints.
✅ **Interview Questions**: What is the MDM Authority? (Ans: A setting that defines which management service has permission to manage endpoints (e.g. Microsoft Intune or Configuration Manager)).
✅ **Commands / Cheat Sheet**: Confirm status in Intune Console -> Tenant Administration -> Tenant Status.`,
      problem: "A new company acquires Intune licenses, but when users try to enroll their Windows 10 devices, the enrollment fails.",
      solution: "Go to Tenant Administration in the Intune portal. Check the MDM authority status. If not set, configure it to 'Microsoft Intune' and ensure users have Intune Plan 1 licenses assigned."
    },
    {
      id: "10.02",
      title: "10.02-windows-autopilot-profiles",
      name: "Windows Autopilot Setup",
      explainer: `✅ **Definition & Purpose**: Zero-touch provisioning service to customize Out-Of-Box Experience (OOBE) and deploy corporate OS.
✅ **Architecture / Components**: Hardware Hashes, Autopilot profiles, OOBE settings (Language, Keyboard, Account type), ESP (Enrollment Status Page).
✅ **Daily Tasks**: Exporting hardware hashes, uploading devices to Autopilot list, assigning profiles, and checking ESP status.
✅ **Real Industry Use Cases**: Shipping a brand-new factory laptop directly to a remote employee's home, which auto-configures on boot.
✅ **Troubleshooting**: Autopilot profile not applying (hardware hash not uploaded), ESP hanging on app installation steps.
✅ **Best Practices**: Use dynamic groups targeting 'physicalIds' to automatically assign Autopilot profiles to registered hashes.
✅ **Interview Questions**: How do you collect a device's hardware hash for Autopilot registration? (Ans: Run the PowerShell script 'Get-WindowsAutopilotInfo.ps1' on the device and export the resulting CSV).
✅ **Commands / Cheat Sheet**: PowerShell: \`Install-Script Get-WindowsAutopilotInfo\` | \`Get-WindowsAutopilotInfo.ps1 -OutputFile autopilot.csv -Online\``,
      problem: "A user boots a new laptop, but is prompted to sign in with a personal Microsoft account instead of the company login.",
      solution: "The hardware hash was not uploaded to Intune or the Autopilot profile was not assigned. Upload the hardware CSV hash, assign it to a group linked to the Autopilot deployment profile, and reboot the laptop."
    },
    {
      id: "10.03",
      title: "10.03-device-enrollment-windows",
      name: "Windows Enrollment Methods",
      explainer: `✅ **Definition & Purpose**: Bringing Windows devices under active Intune management using automatic or manual registration.
✅ **Architecture / Components**: Automatic Enrollment (MAM/MDM user scope), GPO enrollment, Bulk enrollment packages (.ppkg), MDM user limits.
✅ **Daily Tasks**: Creating enrollment restriction policies, configuring GPO auto-enrollment, and troubleshooting registration logs.
✅ **Real Industry Use Cases**: Enforcing a GPO that automatically enrolls all existing domain-joined Windows PCs into Intune.
✅ **Troubleshooting**: Enrollment blocked by device type restrictions, users exceeding the maximum device limit (default 15).
✅ **Best Practices**: Configure Automatic MDM enrollment scope to 'All' in Entra ID settings to allow seamless registration.
✅ **Interview Questions**: What is required to enable automatic Intune enrollment for domain-joined Windows PCs? (Ans: Configure a Group Policy specifying 'Enable automatic MDM enrollment using default Azure AD credentials').
✅ **Commands / Cheat Sheet**: GPO: Computer Configuration -> Policies -> Administrative Templates -> Windows Components -> MDM.`,
      problem: "An administrator tries to enroll a workstation, but receives error 'Device type restricted or limit exceeded'.",
      solution: "Go to Intune Admin Center -> Devices -> Enrollment device limit restrictions. Check if the user has reached their maximum device limit, or check if Windows enrollment is blocked in Device Type Restrictions."
    },
    {
      id: "10.04",
      title: "10.04-device-compliance-policies",
      name: "Device Compliance Policies",
      explainer: `✅ **Definition & Purpose**: Security baselines determining if devices meet corporate requirements before granting resource access.
✅ **Architecture / Components**: Compliance settings (BitLocker, Antivirus, OS version), Actions for non-compliance, Conditional Access integration.
✅ **Daily Tasks**: Creating compliance policies, monitoring device compliance dashboards, and configuring email notifications for non-compliant devices.
✅ **Real Industry Use Cases**: Blocking non-compliant laptops (e.g. missing BitLocker encryption) from accessing Exchange and SharePoint.
✅ **Troubleshooting**: Laptops showing 'Not Evaluated' status (no compliance policy targeting the OS), false non-compliance alerts.
✅ **Best Practices**: Use Conditional Access to enforce compliance rules; always define a grace period before blocking non-compliant devices.
✅ **Interview Questions**: What happens to a device that is marked non-compliant if a Conditional Access policy requires compliant devices? (Ans: The device is blocked from accessing corporate resources (M365 apps) until it satisfies all compliance settings).
✅ **Commands / Cheat Sheet**: Inspect client status via Intune Admin Center -> Devices -> Monitor -> Noncompliant devices.`,
      problem: "A laptop is marked non-compliant because the OS version is flagged as outdated, even though the user installed updates.",
      solution: "The device needs to sync with Intune to update its status. On the client device, open 'Settings' -> 'Accounts' -> 'Access work or school' -> select account -> 'Info' -> click 'Sync'. Alternatively, trigger a remote Sync action from the Intune portal."
    },
    {
      id: "10.05",
      title: "10.05-device-configuration-profiles",
      name: "Configuration Profiles & CSPs",
      explainer: `✅ **Definition & Purpose**: Enforcing registry, feature, and security settings on managed endpoints remotely.
✅ **Architecture / Components**: Configuration Service Providers (CSPs), Settings Catalog, Administrative Templates, Custom OMA-URI profiles.
✅ **Daily Tasks**: Creating browser restriction profiles, deploying Wi-Fi profiles, configuring VPN profiles, and debugging settings.
✅ **Real Industry Use Cases**: Deploying a settings catalog profile to automatically configure corporate proxy settings on all laptops.
✅ **Troubleshooting**: Setting conflicts (two profiles configure the same setting with different values), profile error codes.
✅ **Best Practices**: Use the Settings Catalog for all configuration profiles where possible, as it replaces custom OMA-URI strings.
✅ **Interview Questions**: What is a policy conflict in Intune and how do you resolve it? (Ans: A conflict occurs when two different configuration profiles apply opposing values to the same setting. Resolve by editing profiles to ensure only one policy targets the setting).
✅ **Commands / Cheat Sheet**: Check conflicts: Devices -> Monitor -> Configuration status -> Conflict.`,
      problem: "A wallpaper profile applied to all users shows a 'Conflict' status on multiple devices in the Intune dashboard.",
      solution: "Locate the affected devices. Search for other configuration profiles linked to those devices. You will find another profile setting the wallpaper. Modify or delete the conflicting setting in one of the profiles."
    },
    {
      id: "10.06",
      title: "10.06-intune-application-packaging",
      name: "App Packaging & Win32 Apps",
      explainer: `✅ **Definition & Purpose**: Preparing and deploying desktop software applications (.msi, .exe) using the Win32 app delivery model.
✅ **Architecture / Components**: IntuneWinAppUtil packager, .intunewin format, install/uninstall commands, detection rules.
✅ **Daily Tasks**: Packaging software installers, configuring detection rules (Registry, File, MSI), and tracking deployment logs.
✅ **Real Industry Use Cases**: Packaging a custom line-of-business database client installer and deploying it to the accounting team.
✅ **Troubleshooting**: App installation fails on client (check IME log files at \`C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs\`).
✅ **Best Practices**: Use MSI detection rules when deploying MSI installers; run commands in silent mode (e.g. \`/quiet\` or \`/s\`).
✅ **Interview Questions**: Why do we convert software installers to the '.intunewin' format? (Ans: It compresses the installation files and packages metadata, allowing Intune to securely stream and execute the installer).
✅ **Commands / Cheat Sheet**: Packaging: \`IntuneWinAppUtil.exe -c <source-folder> -s <installer-file> -o <output-folder>\``,
      problem: "A packaged Win32 application fails to install on client PCs, showing 'Error' in the Intune dashboard.",
      solution: "Open 'IntuneManagementExtension.log' on the client. Search for the app ID. The issue is likely an incorrect install command line argument (e.g. missing silent switch) or a failed detection rule (file/registry path not found after install)."
    },
    {
      id: "10.07",
      title: "10.07-android-ios-enrollment",
      name: "Android & iOS Enrollment",
      explainer: `✅ **Definition & Purpose**: Configuring enrollment profiles and management boundaries for mobile operating systems.
✅ **Architecture / Components**: Apple Business Manager (ABM), ADE profiles, Android Enterprise (Fully Managed, Work Profile), MDM Push certificates.
✅ **Daily Tasks**: Renewing Apple MDM Push certificates, creating work profiles, and pushing mobile application packages.
✅ **Real Industry Use Cases**: Deploying a Work Profile on employee-owned Android phones to isolate corporate emails from personal apps.
✅ **Troubleshooting**: Apple enrollment fails (expired APNs certificate), Android enrollment fails (missing Google Play account link).
✅ **Best Practices**: Renew the Apple APNs certificate annually using the exact same Apple ID to prevent client connection drops.
✅ **Interview Questions**: What is the difference between Android Fully Managed and Android Work Profile enrollment? (Ans: Fully Managed grants complete device control (corporate-owned); Work Profile creates a separate container for data security (BYOD)).
✅ **Commands / Cheat Sheet**: Apple APNs certificates must be renewed in Intune -> Devices -> OS -> iOS/iPadOS enrollment -> Apple MDM Push Certificate.`,
      problem: "Employees report they cannot enroll their iPhones into Intune, receiving a 'Profile installation failed' error.",
      solution: "Navigate to Intune -> iOS enrollment. Check the APNs certificate status. If it is expired, renew the certificate using the Apple Push Certificates Portal and upload the new .pem file to Intune."
    },
    {
      id: "10.08",
      title: "10.08-application-protection-policies",
      name: "MAM & App Protection Policies",
      explainer: `✅ **Definition & Purpose**: Securing corporate data at the application layer without requiring full device enrollment (BYOD).
✅ **Architecture / Components**: Mobile Application Management (MAM), App Protection Policies, App PINs, Data leakage controls.
✅ **Daily Tasks**: Creating MAM policies, restricting copy-paste actions, enforcing app PIN codes, and monitoring MAM logs.
✅ **Real Industry Use Cases**: Restricting users from copying text from Outlook app and pasting it into personal WhatsApp or Notes apps.
✅ **Troubleshooting**: Users unable to open corporate attachments in Word app, app protection settings not applying.
✅ **Best Practices**: Apply App Protection Policies to Outlook, OneDrive, and Word for both iOS and Android platforms.
✅ **Interview Questions**: Can App Protection Policies be applied to devices that are not enrolled in Intune? (Ans: Yes. This is called MAM-WE (MAM Without Enrollment) and is ideal for securing data on personal employee devices (BYOD)).
✅ **Commands / Cheat Sheet**: Manage under Intune Admin Center -> Apps -> App protection policies.`,
      problem: "A contractor needs to check company email on their personal iPad but security prevents enrolling the iPad in MDM.",
      solution: "Configure a MAM App Protection Policy for the iPad. This secures the Outlook app, forces an app PIN, blocks copy-paste to personal apps, and allows remote wipe of email data without enrolling the iPad."
    },
    {
      id: "10.09",
      title: "10.09-windows-updates-intune",
      name: "Update Rings & WUfB",
      explainer: `✅ **Definition & Purpose**: Managing Windows OS updates, feature updates, and quality updates on endpoints remotely.
✅ **Architecture / Components**: Update Rings, Feature Updates, Quality Updates, Driver Updates, Windows Update for Business (WUfB).
✅ **Daily Tasks**: Configuring update deferral periods, creating test update rings, monitoring update compliance, and approving drivers.
✅ **Real Industry Use Cases**: Setting up a 'Fast Ring' targeting 10 pilot devices to test updates, and a 'Slow Ring' targeting the rest of the company.
✅ **Troubleshooting**: Devices stuck on old OS versions, update installation errors, driver updates causing BSODs.
✅ **Best Practices**: Use Feature Update policies to lock devices to a specific Windows version (e.g. Windows 11 23H2) until tested.
✅ **Interview Questions**: What is the difference between Quality Updates and Feature Updates in WUfB? (Ans: Quality updates are monthly security patches; Feature updates are annual OS version upgrades (e.g., upgrading from 22H2 to 23H2)).
✅ **Commands / Cheat Sheet**: Configure under Intune -> Devices -> Windows -> Windows updates -> Update rings.`,
      problem: "Laptops are rebooting randomly during business hours to install security updates, disrupting user workflows.",
      solution: "Edit your Windows Update Ring policy in Intune. Set 'Active Hours' (e.g. 8 AM to 5 PM) to block restarts during the day, and configure 'Auto install at maintenance time' with a grace period for reboots."
    },
    {
      id: "10.10",
      title: "10.10-device-security-baselines",
      name: "Security Baselines & Hardening",
      explainer: `✅ **Definition & Purpose**: Pre-configured groups of Microsoft security settings designed to secure devices and reduce vulnerability.
✅ **Architecture / Components**: Windows Security Baseline, Microsoft Defender Baseline, Microsoft Edge Baseline, settings conflicts.
✅ **Daily Tasks**: Deploying security baselines, auditing device security compliance, and resolving baseline setting conflicts.
✅ **Real Industry Use Cases**: Deploying the Microsoft Windows Security Baseline to enforce hundreds of OS hardening settings instantly.
✅ **Troubleshooting**: Legacy software breaking due to hardened security settings (e.g. blocked local admin accounts or restricted credentials).
✅ **Best Practices**: Do not mix security baselines with custom configuration profiles for the same settings to avoid conflicts.
✅ **Interview Questions**: What are Security Baselines in Intune? (Ans: Curated groups of settings recommended by Microsoft security teams that help protect users and devices by establishing a secure baseline configuration).
✅ **Commands / Cheat Sheet**: Monitor under Intune -> Endpoint Security -> Security baselines.`,
      problem: "An administrator deploys the Windows Security Baseline, and users report they can no longer run administrative cmdlets in PowerShell.",
      solution: "The baseline restricts PowerShell execution. Create an exclusion group for administrators or edit the Security Baseline configuration, find the PowerShell settings, and set the execution policy to a less restrictive state (e.g. RemoteSigned)."
    },
    {
      id: "10.11",
      title: "10.11-intune-troubleshooting-logs",
      name: "Intune Diagnostics & Logs",
      explainer: `✅ **Definition & Purpose**: Diagnosing device synchronization, policy deployment, and application installation errors on client systems.
✅ **Architecture / Components**: Intune Management Extension (IME), IME logs, Registry keys, Event Viewer (Applications and Services Logs).
✅ **Daily Tasks**: Collecting device logs, analyzing IME log files, checking registry keys, and checking MDM event logs.
✅ **Real Industry Use Cases**: Troubleshooting why a critical security script failed to run on a remote employee's workstation.
✅ **Troubleshooting**: Devices not syncing (check network connection or certificate expiration), registry settings not updating.
✅ **Best Practices**: Use CMTrace or OneTrace to read IME logs in real-time; look for error codes in the logs to pinpoint failures.
✅ **Interview Questions**: Where are the Intune Management Extension log files located on a Windows client? (Ans: \`C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs\`).
✅ **Commands / Cheat Sheet**: Log path: \`C:\\ProgramData\\Microsoft\\IntuneManagementExtension\\Logs\\IntuneManagementExtension.log\` | Event Viewer: \`Applications and Services Logs\\Microsoft\\Windows\\DeviceManagement-Enterprise-Diagnostics-Provider\\Admin\``,
      problem: "A configuration profile fails to apply, showing error code '0x87d1f007' in the Intune dashboard.",
      solution: "Open Event Viewer on the client, go to DeviceManagement-Enterprise-Diagnostics-Provider/Admin. Search for the error code. It indicates a setting conflict or a registry write permission block. Correct the profile or run a sync."
    },
    {
      id: "10.12",
      title: "10.12-remote-actions-wipes",
      name: "Remote Actions & Device Lifecycle",
      explainer: `✅ **Definition & Purpose**: Managing device lifecycle stages by triggering remote actions like wipes, retirements, and restarts.
✅ **Architecture / Components**: Wipe (destroys all data), Retire (removes corporate data, keeps personal), Fresh Start, Remote Lock.
✅ **Daily Tasks**: Offboarding employees by triggering device retirements, wiping lost/stolen laptops, and initiating remote syncs.
✅ **Real Industry Use Cases**: Triggering a remote 'Wipe' on a company laptop left in a taxi cab to protect corporate data.
✅ **Troubleshooting**: Remote actions stuck in 'Pending' status (target device is offline or disconnected from the internet).
✅ **Best Practices**: Use 'Retire' for BYOD devices to clean business data without touching user photos; use 'Wipe' for corporate laptops.
✅ **Interview Questions**: What is the difference between Wipe and Retire in Intune? (Ans: Wipe restores the device to factory default settings, deleting all data; Retire removes only corporate configurations, certificates, and apps).
✅ **Commands / Cheat Sheet**: Initiate actions via Intune Admin Center -> Devices -> select device -> click action button (Wipe, Retire, Sync).`,
      problem: "A laptop containing sensitive corporate data is reported stolen. The laptop is currently powered off.",
      solution: "Trigger a remote 'Wipe' in the Intune portal. The action will remain 'Pending'. The moment the laptop is turned on and connects to any network interface, the wipe command executes and resets the device."
    },
    {
      id: "10.13",
      title: "10.13-intune-co-management",
      name: "SCCM & Intune Co-Management",
      explainer: `✅ **Definition & Purpose**: Managing endpoints concurrently using both Configuration Manager (SCCM) and Microsoft Intune.
✅ **Architecture / Components**: Co-management handler, workloads (Compliance, Apps, Updates), Cloud Management Gateway (CMG), tenant attach.
✅ **Daily Tasks**: Configuring co-management rules in SCCM, switching workloads to Intune, and monitoring client state.
✅ **Real Industry Use Cases**: Transitioning device update workloads from SCCM to Intune (WUfB) while retaining SCCM for OS deployment.
✅ **Troubleshooting**: Devices not showing co-managed status, workload switch failures.
✅ **Best Practices**: Use Tenant Attach to view SCCM devices in the Intune portal without full co-management configuration.
✅ **Interview Questions**: What are workloads in co-management? (Ans: Workloads are specific management responsibilities (e.g. Compliance Policies, Client Apps) that can be shifted from SCCM to Intune).
✅ **Commands / Cheat Sheet**: Verify state on client: Open Control Panel -> Configuration Manager -> General -> Co-management: Enabled.`,
      problem: "An administrator shifts the 'Compliance Policies' workload to Intune, but client devices still evaluate compliance against SCCM.",
      solution: "Check the client policies. Ensure the devices have received the SCCM policy update. Force a policy retrieval on the client (Configuration Manager Properties -> Actions -> Machine Policy Retrieval & Evaluation Cycle)."
    },
    {
      id: "10.14",
      title: "10.14-endpoint-analytics-reports",
      name: "Endpoint Analytics & Remediations",
      explainer: `✅ **Definition & Purpose**: Monitoring client performance metrics, startup speeds, and running proactive remediation scripts.
✅ **Architecture / Components**: Endpoint Analytics, Startup Performance, Proactive Remediations (Detection script + Remediation script).
✅ **Daily Tasks**: Analyzing device startup score, deploying remediation scripts (e.g. clear temp files or restart stopped services), checking reports.
✅ **Real Industry Use Cases**: Running a proactive remediation script that checks if the local 'Print Spooler' is stopped and restarts it.
✅ **Troubleshooting**: Remediation scripts failing (check exit codes: 0 for compliant, 1 for non-compliant and triggers remediation script).
✅ **Best Practices**: Use proactive remediations to solve common helpdesk tickets (e.g. expired certificates, stale drivers) before users call.
✅ **Interview Questions**: How do Proactive Remediations work in Intune? (Ans: They use a detection PowerShell script to check for a problem. If the exit code is 1, a remediation PowerShell script runs to fix the issue).
✅ **Commands / Cheat Sheet**: Detection script exit codes: \`exit 0\` (No action needed) | \`exit 1\` (Trigger remediation script).`,
      problem: "You want to automate the cleanup of the C:\\Temp directory on all corporate laptops every week.",
      solution: "Create a Proactive Remediation in Intune. Write a detection script: 'if (Test-Path C:\\Temp) { exit 1 } else { exit 0 }'. Write the remediation script: 'Remove-Item C:\\Temp\\* -Recurse -Force'. Schedule it to run weekly."
    }
  ],

  // 11. SCCM / Microsoft Endpoint Configuration Manager (8 modules)
  11: [
    {
      id: "11.01",
      title: "11.01-sccm-architecture-basics",
      name: "SCCM Site Infrastructure",
      explainer: `✅ **Definition & Purpose**: On-premises enterprise systems management architecture designed to deploy software, updates, and OS images.
✅ **Architecture / Components**: Central Administration Site (CAS), Primary Sites, Secondary Sites, Distribution Points (DP), Management Points (MP).
✅ **Daily Tasks**: Monitoring site replication status, checking component states, managing boundaries, and deploying software.
✅ **Real Industry Use Cases**: Structuring a hierarchy with a Primary Site in Chicago and Secondary Sites at regional factories to optimize network links.
✅ **Troubleshooting**: Distribution Points failing to sync content (check \`distmgr.log\`), clients unable to locate Management Points.
✅ **Best Practices**: Minimize the use of a CAS; a single primary site hierarchy is sufficient for up to 150,000 devices.
✅ **Interview Questions**: What is the difference between a Management Point and a Distribution Point in SCCM? (Ans: Management Point handles client communication and policies; Distribution Point stores and distributes deployment content).
✅ **Commands / Cheat Sheet**: Monitor logs using CMTrace: \`C:\\Program Files\\Microsoft Configuration Manager\\Logs\\smsexec.log\``,
      problem: "A new branch office experiences extremely slow software downloads. Investigation reveals they are downloading content from the main office DP.",
      solution: "The new subnet boundary has not been configured or mapped. Add the subnet to the SCCM Boundary Groups and associate it with the local Distribution Point to force local downloads."
    },
    {
      id: "11.02",
      title: "11.02-sccm-client-installation",
      name: "SCCM Client Push & Health",
      explainer: `✅ **Definition & Purpose**: Deploying the Configuration Manager client software to endpoints to enable active management.
✅ **Architecture / Components**: Client Push Installation, CCMSetup service, Client properties, Configuration Manager Applet.
✅ **Daily Tasks**: Monitoring client deployment success rates, repairing broken client agents, and checking client sync health.
✅ **Real Industry Use Cases**: Automating client push installation when new systems are joined to the Active Directory domain.
✅ **Troubleshooting**: Client push failing with error 'Access Denied' (missing client push account permissions or firewall blocking ports 445/135).
✅ **Best Practices**: Configure local firewalls to allow WMI and File Sharing ports; monitor ccmsetup.log for installation progress.
✅ **Interview Questions**: Where do you check for installation errors when client push fails? (Ans: In the \`ccmsetup.log\` file located at \`C:\\Windows\\ccmsetup\\Logs\` on the client machine).
✅ **Commands / Cheat Sheet**: Command line options: \`ccmsetup.exe /mp:SCCM-SRV01 SMSSITECODE=PRI\``,
      problem: "An administrator initiates a client push, but the client properties show 'No' under 'Active' in the SCCM console.",
      solution: "Open 'ccmsetup.log' on the client. If it shows installation succeeded, open 'LocationServices.log'. The client is likely failing to contact the Management Point due to DNS errors or blocked ports."
    },
    {
      id: "11.03",
      title: "11.03-boundary-groups-content",
      name: "Boundaries & Boundary Groups",
      explainer: `✅ **Definition & Purpose**: Defining network location boundaries to assign clients to specific SCCM sites and local content DPs.
✅ **Architecture / Components**: Boundaries (IP Subnet, Active Directory Site, IP Ranges), Boundary Groups, Content fallback locations.
✅ **Daily Tasks**: Creating boundaries for new subnets, mapping boundaries to boundary groups, and monitoring content distribution.
✅ **Real Industry Use Cases**: Creating a boundary group for the London office to ensure London clients pull updates from the London DP.
✅ **Troubleshooting**: Clients falling back to remote DPs over WAN links, missing boundaries causing clients to get no policies.
✅ **Best Practices**: Use IP Address Ranges for boundaries instead of IP Subnets to prevent mismatches caused by subnet mask calculations.
✅ **Interview Questions**: What is a Boundary Group? (Ans: A logical grouping of network boundaries associated with specific Distribution Points and site assignments to optimize content delivery).
✅ **Commands / Cheat Sheet**: Verify client locations in \`LocationServices.log\` on the client machine.`,
      problem: "A group of laptops in a new subnet fail to download software, showing 'No distribution point found' in Software Center.",
      solution: "Verify if the new IP range is added as a boundary in SCCM. If present, ensure it is added to the correct Boundary Group and that group has an active Distribution Point assigned."
    },
    {
      id: "11.04",
      title: "11.04-application-deployment",
      name: "Application Deployment & Detection",
      explainer: `✅ **Definition & Purpose**: Packaging, distributing, and installing software applications on endpoints using target collections.
✅ **Architecture / Components**: Application model, Deployment Types, Requirements, Detection Methods (MSI, File, Registry).
✅ **Daily Tasks**: Creating application packages, defining deployment types, configuring detection rules, and monitoring deployment status.
✅ **Real Industry Use Cases**: Deploying Google Chrome to all workstations, using the Chrome MSI product code as the detection rule.
✅ **Troubleshooting**: Application fails to install with error 'Detection method failed' (app installed but detection rule was incorrect).
✅ **Best Practices**: Use MSI installer detection rules by default; ensure install commands run silently without user interaction.
✅ **Interview Questions**: What is a Detection Method in SCCM? (Ans: A rule that checks if an application is already installed on a device before running the installation command, and verifies success after installation).
✅ **Commands / Cheat Sheet**: Run validation checks against client logs: \`AppDiscovery.log\` and \`AppEnforce.log\`.`,
      problem: "Software Center shows 'Failed' for an application install, but you verify the software is actually installed on the machine.",
      solution: "The detection rule is failing. Open the application properties in SCCM, check the detection method path/registry key, and correct it to match the exact file version or product code created by the installer."
    },
    {
      id: "11.05",
      title: "11.05-software-update-point-sup",
      name: "Software Updates & ADRs",
      explainer: `✅ **Definition & Purpose**: Centrally managing and deploying Windows OS patches using WSUS and SCCM deployment engines.
✅ **Architecture / Components**: Software Update Point (SUP), WSUS synchronization, Automatic Deployment Rules (ADR), Patch groups.
✅ **Daily Tasks**: Running ADRs for Patch Tuesday, monitoring compliance dashboards, and cleaning up expired updates.
✅ **Real Industry Use Cases**: Creating an ADR that automatically packages and deploys critical security updates to workstations every month.
✅ **Troubleshooting**: WSUS synchronization failures (check \`Wsyncmgr.log\`), clients failing to scan updates.
✅ **Best Practices**: Limit the number of classifications synced to reduce database size; decline superseded patches weekly.
✅ **Interview Questions**: What is an ADR (Automatic Deployment Rule)? (Ans: A rule in SCCM that automatically searches for updates, downloads them, packages them, and creates deployments based on schedule).
✅ **Commands / Cheat Sheet**: Monitor server synchronization logs: \`C:\\Program Files\\Microsoft Configuration Manager\\Logs\\wsyncmgr.log\``,
      problem: "The monthly ADR runs, but the software update group fails to deploy to the workstation collection.",
      solution: "Check 'ruleengine.log' on the site server. The ADR likely failed to download one of the updates due to proxy/network blocks. Exclude the failed update from the search criteria and rerun the rule."
    },
    {
      id: "11.06",
      title: "11.06-operating-system-deployment",
      name: "OSD & Task Sequences",
      explainer: `✅ **Definition & Purpose**: Automated deployment of operating system images to bare-metal or existing workstations.
✅ **Architecture / Components**: Task Sequences, Boot Images, OS Images, PXE Boot, Driver Packages, USMT (user state migration).
✅ **Daily Tasks**: Creating task sequences, updating boot images with NIC drivers, managing driver packages, and PXE boot setups.
✅ **Real Industry Use Cases**: PXE-booting 100 new laptops in the staging lab to automatically install Windows 11 and company apps.
✅ **Troubleshooting**: Task Sequence fails with error '0x80070002' (network share path unreachable), boot loops on WinPE launch.
✅ **Best Practices**: Use dynamic driver matching based on WMI queries (e.g. Model query) to inject correct drivers.
✅ **Interview Questions**: What is the primary log file used to troubleshoot Task Sequence OSD failures? (Ans: \`smsts.log\` (located in RAM, system directories, or Windows folder depending on execution stage)).
✅ **Commands / Cheat Sheet**: Press F8 in WinPE to open a command prompt for network troubleshooting and log inspection.`,
      problem: "A laptop boots via PXE, loads the WinPE image, but crashes immediately with a blue screen before showing the Task Sequence menu.",
      solution: "The WinPE boot image is missing the network interface card (NIC) or storage controller driver for the laptop hardware. Inject the correct driver into the boot image, update the DP, and try again."
    },
    {
      id: "11.07",
      title: "11.07-sccm-log-files-cmtrace",
      name: "Troubleshooting Logs & CMTrace",
      explainer: `✅ **Definition & Purpose**: Reading and analyzing server and client log files using CMTrace to locate system errors.
✅ **Architecture / Components**: CMTrace utility, client log directories, server log directories, log thread colors (Red=Error, Yellow=Warning).
✅ **Daily Tasks**: Monitoring software deployments, checking replication health, auditing clients, and tracing server logs.
✅ **Real Industry Use Cases**: Opening 'smsts.log' in CMTrace to debug why a task sequence step failed at index 4.
✅ **Troubleshooting**: Corrupt log directories, missing logs (verbose logging not enabled).
✅ **Best Practices**: Keep CMTrace pinned on your administrative workstation; filter entries to isolate specific error codes.
✅ **Interview Questions**: Name three critical client-side log files in SCCM. (Ans: \`ccmsetup.log\` (client install), \`LocationServices.log\` (site finder), and \`AppEnforce.log\` (app installation execution)).
✅ **Commands / Cheat Sheet**: Log Paths: Client: \`C:\\Windows\\CCM\\Logs\` | Server: \`C:\\Program Files\\Microsoft Configuration Manager\\Logs\``,
      problem: "A user reports they clicked install in Software Center 2 hours ago, but the status is stuck at 'Installing'.",
      solution: "Open 'AppEnforce.log' in CMTrace. Locate the install command. The installer command is likely waiting for user interaction (e.g. a popup dialog). Re-package the application using the correct silent command arguments."
    },
    {
      id: "11.08",
      title: "11.08-sccm-co-management",
      name: "SCCM Cloud Attach & Co-Management",
      explainer: `✅ **Definition & Purpose**: Connecting on-premises SCCM infrastructure to cloud Microsoft Intune configurations.
✅ **Architecture / Components**: Tenant Attach, Cloud Management Gateway (CMG), Co-management settings, Active Directory synchronization.
✅ **Daily Tasks**: Enabling Cloud Attach, configuring CMG traffic, shifting workloads to Intune, and monitoring client sync.
✅ **Real Industry Use Cases**: Setting up a My CMG to allow remote machines on the internet to pull software updates without connecting to VPN.
✅ **Troubleshooting**: CMG connection timeouts (expired certificates or firewall blocks), client connection failures.
✅ **Best Practices**: Use a public, trusted certificate authority to issue CMG certificates to prevent client trust errors.
✅ **Interview Questions**: What is a Cloud Management Gateway (CMG)? (Ans: An Azure hosted cloud service that acts as a proxy for SCCM traffic, allowing internet-connected clients to communicate with on-premises site systems).
✅ **Commands / Cheat Sheet**: Verify cloud connectivity in \`CloudServicesManager.log\` on the site server.`,
      problem: "An internet-connected client cannot download updates from the CMG, showing connection drops in logs.",
      solution: "Open 'ccmnetworking.log' and 'LocationServices.log' on the client. Check if the client trusts the CMG certificate. If untrusted, install the root CA certificate of the CMG onto the client's trusted root store."
    }
  ],

  // 12. AWS Fundamentals (EC2, VPC, S3) (6 modules)
  12: [
    {
      id: "12.01",
      title: "12.01-aws-global-infrastructure",
      name: "AWS Global Infrastructure",
      explainer: `✅ **Definition & Purpose**: The physical layout of Amazon Web Services global hardware networks.
✅ **Architecture / Components**: Regions, Availability Zones (AZ), Edge Locations, local zones.
✅ **Daily Tasks**: Selecting deployment regions, placing resources in redundant AZs, and configuring CloudFront distribution zones.
✅ **Real Industry Use Cases**: Deploying application instances in us-east-1a and us-east-1b to survive datacenter failures.
✅ **Troubleshooting**: Resource deployment latency (deploying in regions far from customers), inter-AZ data transfer charges.
✅ **Best Practices**: Select regions based on user proximity, compliance laws (e.g. GDPR), and service cost differences.
✅ **Interview Questions**: What is the difference between an AWS Region and an Availability Zone? (Ans: A region is a geographic area; an Availability Zone is one or more isolated datacenters inside a region).
✅ **Commands / Cheat Sheet**: AWS CLI: \`aws ec2 describe-regions --output table\``,
      problem: "A website hosted in the Oregon (us-west-2) region loads very slowly for users in Frankfurt, Germany.",
      solution: "Deploy AWS CloudFront (CDN). CloudFront caches content at global Edge Locations closest to Frankfurt, reducing load latency for European users."
    },
    {
      id: "12.02",
      title: "12.02-aws-compute-ec2",
      name: "Amazon EC2 Configurations",
      explainer: `✅ **Definition & Purpose**: Elastic Compute Cloud provides resizable virtual server computing capacity in the AWS cloud.
✅ **Architecture / Components**: Instance types (T-series, M-series, C-series), Amazon Machine Images (AMI), Security Groups, Key Pairs.
✅ **Daily Tasks**: Launching EC2 instances, attaching EBS volumes, creating security group rules, and executing SSH connections.
✅ **Real Industry Use Cases**: Provisioning a memory-optimized EC2 instance to host a high-performance database.
✅ **Troubleshooting**: SSH connection timed out (Security Group missing port 22 inbound access), key pair permissions error.
✅ **Best Practices**: Use SSH key pairs; restrict security group ingress rules to only allow SSH from your specific public IP.
✅ **Interview Questions**: What is a Security Group in AWS? (Ans: A stateful virtual firewall that controls inbound and outbound traffic to associated EC2 instances).
✅ **Commands / Cheat Sheet**: CLI: \`aws ec2 run-instances --image-id ami-xxxxxx --count 1 --instance-type t2.micro --key-name MyKeyPair\``,
      problem: "You try to connect to a new Linux EC2 instance via SSH, but the terminal returns 'Unprotected private key file' error.",
      solution: "Linux SSH requires private key files (.pem) to have restricted permissions. Run 'chmod 400 keypair.pem' to restrict access to the file owner, and run the ssh command again."
    },
    {
      id: "12.03",
      title: "12.03-aws-networking-vpc",
      name: "Amazon VPC & Networking",
      explainer: `✅ **Definition & Purpose**: Virtual Private Cloud allows you to provision isolated logical networks for AWS resources.
✅ **Architecture / Components**: VPC CIDR, public/private subnets, Internet Gateways (IGW), NAT Gateways, Route Tables.
✅ **Daily Tasks**: Creating subnets, configuring internet gateways, linking NAT gateways to private subnets, and updating routing paths.
✅ **Real Industry Use Cases**: Deploying database servers in private subnets with no direct route to the internet, secure from scans.
✅ **Troubleshooting**: EC2 in public subnet cannot reach internet (missing route to IGW in the route table or missing public IP).
✅ **Best Practices**: Put all databases and internal APIs in private subnets; use NAT Gateways for secure outbound updates.
✅ **Interview Questions**: What makes a subnet 'public' in an AWS VPC? (Ans: The subnet's route table has an active default route (0.0.0.0/0) pointing to an Internet Gateway).
✅ **Commands / Cheat Sheet**: CLI: \`aws ec2 create-vpc --cidr-block 10.0.0.0/16\` | \`aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24\``,
      problem: "An EC2 instance in a private subnet needs to pull updates from GitHub, but cannot connect to the internet.",
      solution: "Deploy a NAT Gateway in a public subnet. Update the private subnet's route table, adding a route for '0.0.0.0/0' pointing to the NAT Gateway. This allows outbound internet access while blocking inbound connections."
    },
    {
      id: "12.04",
      title: "12.04-aws-storage-s3-ebs",
      name: "Amazon S3 & EBS Storage",
      explainer: `✅ **Definition & Purpose**: Scalable object storage (S3) and block-level storage volumes (EBS) for cloud resources.
✅ **Architecture / Components**: S3 Buckets, storage classes (Standard, Glacier), bucket policies, EBS volumes, IOPS types.
✅ **Daily Tasks**: Creating buckets, writing bucket access policies, uploading objects, and creating EBS volume snapshots.
✅ **Real Industry Use Cases**: Hosting static assets (images, css) on S3, and utilizing EBS volumes as primary drives for EC2 servers.
✅ **Troubleshooting**: 'Access Denied' on S3 download (blocked by public access settings or incorrect IAM/bucket policies).
✅ **Best Practices**: Block all public access on S3 buckets by default unless hosting public static website files.
✅ **Interview Questions**: What is the difference between S3 and EBS storage? (Ans: S3 is object storage accessible via HTTP/APIs globally; EBS is block storage mounted directly as hard drives to individual EC2 instances).
✅ **Commands / Cheat Sheet**: CLI: \`aws s3 mb s3://my-unique-bucket\` | \`aws s3 cp file.txt s3://my-unique-bucket/file.txt\``,
      problem: "You upload an image to an S3 bucket for a website, but accessing the object URL returns an 'Access Denied' XML error.",
      solution: "S3 buckets block public access by default. Disable 'Block all public access' in bucket settings, and apply a bucket policy allowing 's3:GetObject' access to anonymous users."
    },
    {
      id: "12.05",
      title: "12.05-aws-iam-identities",
      name: "AWS IAM Identities & Access",
      explainer: `✅ **Definition & Purpose**: Identity and Access Management controls authentication and authorization access to AWS resources.
✅ **Architecture / Components**: IAM Users, Groups, Roles (assumed by services/users), JSON Policies (Actions, Resources, Effects).
✅ **Daily Tasks**: Creating users, configuring group memberships, assigning IAM roles to EC2 instances, and auditing keys.
✅ **Real Industry Use Cases**: Assigning an IAM Role to an EC2 instance to allow it to read files from an S3 bucket without hardcoded credentials.
✅ **Troubleshooting**: Application unable to access AWS services (missing role permissions or bad environment credentials).
✅ **Best Practices**: Enforce MFA on root account; never generate access keys for root; use IAM Roles instead of static keys.
✅ **Interview Questions**: What is an IAM Role? (Ans: An identity with permission policies that can be temporarily assumed by users or services to perform actions without static keys).
✅ **Commands / Cheat Sheet**: Policy structure: \`{ "Version": "2012-10-17", "Statement": [ { "Effect": "Allow", "Action": "s3:*", "Resource": "*" } ] }\``,
      problem: "An application running on an EC2 instance fails to upload files to S3, returning credential errors.",
      solution: "Do not put access keys in the app code. Create an IAM Role with S3 write permissions. Attach this IAM Role to the EC2 instance profile, and configure the AWS SDK to assume the role automatically."
    },
    {
      id: "12.06",
      title: "12.06-aws-cloudwatch-billing",
      name: "AWS CloudWatch & Budgets",
      explainer: `✅ **Definition & Purpose**: Monitoring resource metrics, logs, and tracking AWS account subscription cost limits.
✅ **Architecture / Components**: CloudWatch Metrics, Alarms, Logs, EventBridge, AWS Budgets, Cost Explorer.
✅ **Daily Tasks**: Creating CPU usage alarms, centralizing EC2 log files, setting cost alerts, and reviewing billing graphs.
✅ **Real Industry Use Cases**: Configuring a CloudWatch alarm that emails the admin when billing forecasts exceed $100.
✅ **Troubleshooting**: Alarms not firing (incorrect evaluation periods or metric namespaces), logs not writing to log groups.
✅ **Best Practices**: Set up billing alerts immediately when creating a new AWS account to avoid unexpected charges.
✅ **Interview Questions**: What is AWS CloudWatch? (Ans: A monitoring and observability service that collects resource metrics, monitors logs, and triggers alarms based on performance rules).
✅ **Commands / Cheat Sheet**: CLI: \`aws cloudwatch put-metric-alarm --alarm-name CPUAlarm --metric-name CPUUtilization --namespace AWS/EC2 --statistic Average --period 300 --threshold 80 --comparison-operator GreaterThanOrEqualToThreshold\``,
      problem: "A developer leaves a test database instance running, resulting in a $500 charge at the end of the month.",
      solution: "Create an AWS Budget. Define a monthly limit (e.g. $50). Configure email notifications to alert administrators when actual or forecasted spend reaches 80% of the budget limit."
    }
  ],

  // 13. L2 & L3 IT Admin Multi-Cloud (5 modules)
  13: [
    {
      id: "13.01",
      title: "13.01-hybrid-network-connectivity",
      name: "Hybrid Cloud Network",
      explainer: `✅ **Definition & Purpose**: Establishing network routes between local corporate offices and multi-cloud environments.
✅ **Architecture / Components**: Site-to-Site VPN, IPSec tunnels, BGP routing, Azure ExpressRoute, AWS Direct Connect.
✅ **Daily Tasks**: Setting up customer gateways, configuring routing tables, monitoring IPSec tunnel state, and verifying routes.
✅ **Real Industry Use Cases**: Connecting on-premises servers to Azure VNets using a high-speed ExpressRoute private fiber link.
✅ **Troubleshooting**: IPSec tunnel drops (mismatched pre-shared keys or phase 1/2 negotiation settings), routing failures.
✅ **Best Practices**: Configure redundant VPN tunnels over separate ISP links to ensure failover routing connectivity.
✅ **Interview Questions**: What is the difference between IPSec VPN and Direct Connect/ExpressRoute? (Ans: IPSec VPN routes encrypted traffic over the public internet; Direct Connect/ExpressRoute provides a private physical fiber connection, offering higher speed and security).
✅ **Commands / Cheat Sheet**: Verify BGP routes and ping local-to-cloud gateways using network test CLI tools.`,
      problem: "A Site-to-Site VPN tunnel is configured between an office firewall and AWS, but status shows 'Down'.",
      solution: "Verify that the pre-shared keys match on both gateways. Check that IKE Phase 1 and Phase 2 encryption/hash algorithms are identical, and ensure the local gateway public IP matches the AWS customer gateway settings."
    },
    {
      id: "13.02",
      title: "13.02-identity-federation-saml",
      name: "Cloud Identity Federation",
      explainer: `✅ **Definition & Purpose**: Enabling single sign-on (SSO) authentication across multiple clouds using a central identity store.
✅ **Architecture / Components**: SAML 2.0, OAuth, Entra ID SSO, AWS IAM Identity Center, ADFS.
✅ **Daily Tasks**: Creating enterprise application registrations, mapping SAML assertions, and auditing federated logins.
✅ **Real Industry Use Cases**: Allowing system administrators to log in to the AWS Console using their Entra ID corporate credentials.
✅ **Troubleshooting**: SSO login loop errors, mismatched email attributes (SAML claim NameID mapping issues).
✅ **Best Practices**: Use SCIM protocols to automate provisioning and deprovisioning of accounts inside federated applications.
✅ **Interview Questions**: What is SAML 2.0? (Ans: Security Assertion Markup Language - an XML-based protocol used to exchange authentication and authorization data between an Identity Provider and a Service Provider).
✅ **Commands / Cheat Sheet**: Assertions map: Identity Provider (Entra ID) -> Claim: \`https://aws.amazon.com/SAML/Attributes/Role\` -> Service Provider (AWS).`,
      problem: "An administrator attempts to log in to AWS via Entra ID SSO, but receives error 'SAML assertion does not contain the required attributes'.",
      solution: "Open the Entra ID Enterprise Application configurations for AWS. Navigate to 'Attributes & Claims'. Verify that the claims mapping contains the correct XML URIs for roles, role session name, and user principal name."
    },
    {
      id: "13.03",
      title: "13.03-multi-cloud-governance",
      name: "Multi-Cloud Cost Governance",
      explainer: `✅ **Definition & Purpose**: Implementing cost boundaries, resource tags, and compliance policies across AWS and Azure.
✅ **Architecture / Components**: Unified tagging schemas, CloudHealth/Ternary monitoring tools, cloud budget policies.
✅ **Daily Tasks**: Running asset audits, enforcing tagging policies, auditing billing reports, and identifying idle VMs.
✅ **Real Industry Use Cases**: Enforcing a rule that all cloud resources must have 'Owner', 'Environment', and 'CostCenter' tags.
✅ **Troubleshooting**: Untagged resources causing billing audit gaps, lack of visibility into cloud department spending.
✅ **Best Practices**: Deploy automated scripts that automatically shut down untagged resources to enforce governance.
✅ **Interview Questions**: Why are resource tags critical in multi-cloud environments? (Ans: Tags enable granular cost allocation, automated lifecycle scheduling, and resource ownership tracking across different cloud platforms).
✅ **Commands / Cheat Sheet**: AWS CLI: \`aws ec2 create-tags --resources i-xxxxxx --tags Key=Environment,Value=Production\``,
      problem: "A finance auditor complains that $10,000 of AWS spending cannot be traced back to any department project.",
      solution: "Deploy an AWS Config rule or Azure Policy that checks for resource tags. Enforce a tagging strategy and assign tags retroactively to untagged resources by tracing the resource creator in the CloudTrail/Activity Logs."
    },
    {
      id: "13.04",
      title: "13.04-disaster-recovery-dr",
      name: "Cross-Cloud Disaster Recovery",
      explainer: `✅ **Definition & Purpose**: Developing failover strategies to restore systems and data across different cloud environments.
✅ **Architecture / Components**: RPO (Recovery Point Objective), RTO (Recovery Time Objective), data replication, pilot light, active-active.
✅ **Daily Tasks**: Setting up database replication pools, conducting DR drill failovers, and testing backup integrity.
✅ **Real Industry Use Cases**: Replicating a database running in Azure to an AWS instance, configured to take over if Azure goes offline.
✅ **Troubleshooting**: Database synchronization lag, DNS failover delays (TTL configured too high in DNS records).
✅ **Best Practices**: Test disaster recovery failovers quarterly; use low TTL values (e.g. 60 seconds) on failover DNS records.
✅ **Interview Questions**: What is the difference between RPO and RTO? (Ans: RPO is the maximum age of files to recover from backup (data loss limit); RTO is the maximum duration of time allowed to restore the system after failure (downtime limit)).
✅ **Commands / Cheat Sheet**: Configure failover monitoring using Cloudflare DNS or Route 53 health checks.`,
      problem: "During a DR drill, failing over DNS to the backup cloud takes over 30 minutes to update for remote users.",
      solution: "The DNS TTL (Time To Live) was configured to 86400 seconds (24 hours). Change the TTL of critical records to 60 or 300 seconds to ensure client machines check for the new gateway IP address immediately during failover."
    },
    {
      id: "13.05",
      title: "13.05-terraform-iac",
      name: "Terraform Infrastructure as Code",
      explainer: `✅ **Definition & Purpose**: Provisioning and managing multi-cloud infrastructure resources using declarative configuration files.
✅ **Architecture / Components**: Terraform Core, Providers (AWS, AzureRM), State File (.tfstate), HCL configuration syntax.
✅ **Daily Tasks**: Writing main.tf files, planning infrastructure changes, applying configurations, and managing state files.
✅ **Real Industry Use Cases**: Deploying an AWS VPC and an Azure VNet simultaneously using a single Terraform configuration folder.
✅ **Troubleshooting**: State file lock conflicts, resource dependencies mismatches, and configuration drifts.
✅ **Best Practices**: Store Terraform state files in a secure cloud bucket (e.g. S3/Blob) with state locking enabled (using DynamoDB).
✅ **Interview Questions**: What does the command 'terraform apply' do? (Ans: It compares the desired state in configurations with the actual infrastructure state, compiles plans, and executes resource provisioning).
✅ **Commands / Cheat Sheet**: \`terraform init\` (load providers) | \`terraform plan\` (preview changes) | \`terraform apply\` (deploy)\``,
      problem: "You edit a Terraform configuration file to change a VM instance size, but 'terraform apply' fails with a lock error.",
      solution: "Another process or administrator is executing a Terraform command, locking the state file. Await completion, or run 'terraform force-unlock <Lock_ID>' if the process was terminated abruptly."
    }
  ],

  // 14. Desktop Support Engineer (L1) (5 modules)
  14: [
    {
      id: "14.01",
      title: "14.01-operating-system-imaging",
      name: "OS Imaging & Sysprep",
      explainer: `✅ **Definition & Purpose**: Creating standard operating system install images and stripping hardware-specific details for deployment.
✅ **Architecture / Components**: Windows ISO, Sysprep utility, WinPE boot media, ADK tools, WIM image files.
✅ **Daily Tasks**: Running Sysprep on master VMs, capturing WIM files, updating install media, and deploying images.
✅ **Real Industry Use Cases**: Configuring a master Windows PC with corporate applications, running Sysprep, and capturing it to deploy on 50 PCs.
✅ **Troubleshooting**: Sysprep fails to generalize (check \`setuperr.log\` in \`System32\\sysprep\\Panther\` for appx package blocks).
✅ **Best Practices**: Generalize images using Sysprep before capture to generate new security identifiers (SIDs) on boot.
✅ **Interview Questions**: What does the Sysprep generalize switch do? (Ans: It removes hardware-specific details, security identifiers (SIDs), and computer names from the Windows install, preparing it for deployment).
✅ **Commands / Cheat Sheet**: Run command: \`C:\\Windows\\System32\\Sysprep\\sysprep.exe /oobe /generalize /shutdown /mode:vm\``,
      problem: "Sysprep fails, returning error 'Sysprep was not able to validate your Windows installation'.",
      solution: "Open 'setuperr.log' in C:\\Windows\\System32\\Sysprep\\Panther. You will find that a Windows Store (AppX) package was installed for one user but not all users. Remove the package via PowerShell 'Remove-AppxPackage' and rerun Sysprep."
    },
    {
      id: "14.02",
      title: "14.02-printer-troubleshooting",
      name: "Printer Spooler & Network Ports",
      explainer: `✅ **Definition & Purpose**: Resolving local and network print queue failures and driver mismatches.
✅ **Architecture / Components**: Print Spooler service, spool directory (PRINTERS), print drivers, TCP/IP Standard port 9100.
✅ **Daily Tasks**: Restarting spooler services, purging corrupt print files, mapping network printers, and updating drivers.
✅ **Real Industry Use Cases**: Clearing a print queue that has jammed all user print requests on a shared office printer.
✅ **Troubleshooting**: Print spooler service stopping automatically, printer showing offline (port/IP config incorrect).
✅ **Best Practices**: Use Standard TCP/IP ports for network printers instead of WSD (Web Services for Devices) ports to reduce drops.
✅ **Interview Questions**: How do you clear a stuck print job that refuses to delete in Windows? (Ans: Stop Print Spooler service -> delete files in C:\\Windows\\System32\\spool\\PRINTERS -> start Print Spooler).
✅ **Commands / Cheat Sheet**: CMD: \`net stop spooler\` | \`del /Q /F /S "%systemroot%\\System32\\Spool\\Printers\\*.*"\` | \`net start spooler\``,
      problem: "A user tries to print, but the status is stuck at 'Deleting - Printing' and they cannot submit new print jobs.",
      solution: "Run CMD as administrator. Stop the spooler service using 'net stop spooler'. Navigate to 'C:\\Windows\\System32\\spool\\PRINTERS', delete all '.SHD' and '.SPL' files, and restart the service using 'net start spooler'."
    },
    {
      id: "14.03",
      title: "14.03-network-connectivity-l1",
      name: "L1 Network Diagnostics",
      explainer: `✅ **Definition & Purpose**: Isolating and resolving local physical and logical network connection issues on client PCs.
✅ **Architecture / Components**: NIC interface, patch cables, IP configs, DNS servers, gateways.
✅ **Daily Tasks**: Ping testing gateways, flushing local DNS, releasing/renewing DHCP leases, and checking cable link status.
✅ **Real Industry Use Cases**: Checking local connection stats to determine if a user has a bad Ethernet cable or a duplicate IP.
✅ **Troubleshooting**: APIPA IP (169.254.x.x) showing connection drops, DNS lookup failing (unresolved hostnames).
✅ **Best Practices**: Check physical cabling and link lights before configuring logical IP stack settings.
✅ **Interview Questions**: What does an IP address starting with 169.254.x.x indicate? (Ans: APIPA (Automatic Private IP Addressing) - the device cannot contact a DHCP server to obtain an IP address).
✅ **Commands / Cheat Sheet**: CMD: \`ipconfig /all\` | \`ping -t 8.8.8.8\` | \`tracert 8.8.8.8\` | \`nslookup google.com\` | \`ipconfig /flushdns\``,
      problem: "A laptop shows 'Unidentified Network - No Internet'. Running 'ipconfig' reveals the IP address is 169.254.12.5.",
      solution: "The laptop failed to get a lease from DHCP. Check if the network cable is securely plugged in, check if the port is active, or restart the DHCP client service. If on Wi-Fi, verify network password."
    },
    {
      id: "14.04",
      title: "14.04-outlook-profile-repairs",
      name: "Outlook Profile & OST Repairs",
      explainer: `✅ **Definition & Purpose**: Troubleshooting client email sync, profile corruptions, and email database logs.
✅ **Architecture / Components**: Outlook Profile (MAPI), OST file (offline cache), PST file (archive storage), Outlook safe mode.
✅ **Daily Tasks**: Creating Outlook profiles, renaming corrupt OST files to force rebuilds, repairing PSTs, and managing add-ins.
✅ **Real Industry Use Cases**: Rebuilding a user's local OST cache file when their Outlook client fails to sync with Exchange Online.
✅ **Troubleshooting**: Outlook stuck at 'Loading Profile', search index missing mails, client crashes on launch.
✅ **Best Practices**: Keep cached Exchange mode enabled to speed up mail rendering; run Outlook in safe mode to test bad add-ins.
✅ **Interview Questions**: What tool is used to repair corrupt local Outlook data files (.pst/.ost)? (Ans: Scanpst.exe (Microsoft Outlook Inbox Repair Tool)).
✅ **Commands / Cheat Sheet**: Run command: \`outlook.exe /safe\` (starts Outlook without add-ins) | Path: \`%localappdata%\\Microsoft\\Outlook\``,
      problem: "A user opens Outlook, but the application freezes immediately on the screen showing 'Processing...'.",
      solution: "Run 'outlook.exe /safe' to check if a third-party add-in is freezing launch. If it still freezes, open Control Panel -> Mail -> Show Profiles. Create a new Outlook profile, set it as default, and restart Outlook."
    },
    {
      id: "14.05",
      title: "14.05-active-directory-helpdesk",
      name: "Helpdesk Account Operations",
      explainer: `✅ **Definition & Purpose**: Standard directory operations to unlock user accounts and reset expired passwords.
✅ **Architecture / Components**: ADUC console, user account control flags, password policies.
✅ **Daily Tasks**: Resetting passwords, unlocking AD accounts, modifying department names, and adding users to groups.
✅ **Real Industry Use Cases**: Unlocking a user's account in Active Directory after they input the wrong password 5 times.
✅ **Troubleshooting**: Account immediately locking out again (stale credentials cached on user's mobile device or mapped drives).
✅ **Best Practices**: Enforce 'User must change password at next logon' during resets to maintain password confidentiality.
✅ **Interview Questions**: How do you find which device is causing lockouts on a user account? (Ans: Examine Security event logs on domain controllers for Event ID 4740, which specifies the caller computer name).
✅ **Commands / Cheat Sheet**: CMD: \`net user username /domain\` (check lockout) | \`net user username * /domain\` (reset password) | PowerShell: \`Unlock-ADAccount\``,
      problem: "A user's account keeps locking out every 10 minutes, even after you unlock it in Active Directory.",
      solution: "The user has their old password saved on a device. Check their smartphone (email configuration), mapped network drives, or saved credentials in Windows Credential Manager. Clear cached credentials to stop the lockouts."
    }
  ],

  // 15. System Administrator (Ultimate) (10 modules)
  15: [
    {
      id: "15.01",
      title: "15.01-server-hardware-raid",
      name: "RAID Arrays & Storage Parity",
      explainer: `✅ **Definition & Purpose**: Redundant Array of Independent Disks provides data redundancy and performance speed increases.
✅ **Architecture / Components**: RAID 0 (Striping), RAID 1 (Mirroring), RAID 5 (Distributed Parity), RAID 6 (Double Parity), RAID 10 (Striped Mirrors), Hot Spares.
✅ **Daily Tasks**: Configuring hardware RAID controllers, replacing failed disks in server bays, and monitoring rebuild speed indicators.
✅ **Real Industry Use Cases**: Setting up RAID 10 on database servers for performance speed, and RAID 6 on file servers.
✅ **Troubleshooting**: Degraded array alerts, multiple disk failures causing total volume loss, raid controller firmware crashes.
✅ **Best Practices**: Always configure a hot spare disk to automatically begin rebuilding parity if a primary disk fails.
✅ **Interview Questions**: What is the minimum disk requirement for RAID 5, and how many disk failures can it tolerate? (Ans: Minimum of 3 disks; can survive 1 disk failure).
✅ **Commands / Cheat Sheet**: Disk size formula RAID 5: \`(N - 1) * Capacity\` where N is total disks.`,
      problem: "A physical database server has a disk failure light lit amber. The RAID 5 array status is 'Degraded'.",
      solution: "Identify the failed disk index. Pull the failed hot-plug drive, slide in a new matching capacity drive. The hardware RAID controller should automatically start rebuilding parity. Verify status changes to 'Rebuilding'."
    },
    {
      id: "15.02",
      title: "15.02-dns-infrastructure-mgmt",
      name: "DNS Infrastructure Management",
      explainer: `✅ **Definition & Purpose**: Core DNS configuration to manage lookup caching, forwarding paths, and directory scavenging.
✅ **Architecture / Components**: DNS forwarders, Root hints, zone transfers (AXFR/IXFR), scavenge intervals.
✅ **Daily Tasks**: Setting up DNS zone transfers to secondary servers, configuring root hints, and optimizing scavenge times.
✅ **Real Industry Use Cases**: Configuring secure secondary DNS servers in a DMZ to handle client queries without directory access.
✅ **Troubleshooting**: DNS lookup loops, slow resolution times, zone transfer timeouts (blocked by network firewalls).
✅ **Best Practices**: Restrict zone transfers to specific authorized IP addresses to prevent zone enumeration leaks.
✅ **Interview Questions**: What is DNS scavenging? (Ans: The automatic deletion of stale, outdated resource records that have not checked in within the specified aging interval).
✅ **Commands / Cheat Sheet**: CMD: \`nslookup -type=ns domain.com\` | \`dnscmd /zonetransfer domain.com\` | PowerShell: \`Start-DnsServerScavenging\``,
      problem: "DNS resolution of external websites is extremely slow on the internal network, but local name resolution works instantly.",
      solution: "Check the DNS Forwarders configuration. The configured external DNS servers (e.g. ISP DNS) are likely slow or offline. Replace them with reliable public DNS IP addresses (e.g. 8.8.8.8 and 1.1.1.1)."
    },
    {
      id: "15.03",
      title: "15.03-gpo-troubleshooting-rsop",
      name: "GPO Troubleshooting & RSoP",
      explainer: `✅ **Definition & Purpose**: Analyzing and diagnosing GPO application blocks, inheritance settings, and filtering errors.
✅ **Architecture / Components**: Resultant Set of Policy (RSoP), gpresult utility, block inheritance, loopback processing.
✅ **Daily Tasks**: Running gpresult reports on client machines, checking GPO link status, and configuring loopback modes.
✅ **Real Industry Use Cases**: Using Loopback processing (Replace mode) to enforce strict user settings on public kiosk PCs.
✅ **Troubleshooting**: GPO link denied by security filtering, WMI filter syntax blocking application.
✅ **Best Practices**: Use WMI filters sparingly as they run script evaluations on boot and can slow down client logon speeds.
✅ **Interview Questions**: What does GPO Loopback processing do? (Ans: It applies GPOs linked to the computer's OU to any user logging in to that computer, overriding the user's default domain GPOs).
✅ **Commands / Cheat Sheet**: CMD: \`gpresult /Scope Computer /v\` | \`gpresult /Scope User /r\` | \`rsop.msc\``,
      problem: "A security GPO linked to the Domain level does not apply to servers located inside the 'SQL Servers' OU.",
      solution: "Open GPMC. Check if 'Block Inheritance' is checked on the 'SQL Servers' OU. If yes, link the GPO directly to the OU, or configure the GPO link status as 'Enforced' at the domain level, which bypasses blocks."
    },
    {
      id: "15.04",
      title: "15.04-backup-vaults-3-2-1",
      name: "Backup Strategy & Retention",
      explainer: `✅ **Definition & Purpose**: Implementing industry standard backup routines to prevent data loss in disaster scenarios.
✅ **Architecture / Components**: 3-2-1 backup rule (3 copies, 2 media types, 1 off-site), Full/Incremental/Differential schemes.
✅ **Daily Tasks**: Auditing backup success logs, copying tapes to offsite storage, and checking cloud replication status.
✅ **Real Industry Use Cases**: Storing daily database backups on a local NAS (media 1), replicating them to a cloud vault (off-site), and storing weekly tape archives (media 2).
✅ **Troubleshooting**: Tape drive read/write failures, slow data recovery rates, backup script failures.
✅ **Best Practices**: Periodically test restore backups completely to separate isolated sandbox servers to verify data consistency.
✅ **Interview Questions**: What is the difference between incremental and differential backups? (Ans: Incremental backs up files changed since the last backup of any type; Differential backs up files changed since the last full backup).
✅ **Commands / Cheat Sheet**: Keep track of backup logs using backup system dashboards (Veeam, Commvault, or Windows Backup).`,
      problem: "A system backup takes 12 hours to complete, running into business hours and slowing down network transactions.",
      solution: "Switch backup schedules to Incremental on weekdays and Full on weekends. Ensure backup traffic is routed over a dedicated storage network (SAN) interface to avoid clogging the main network links."
    },
    {
      id: "15.05",
      title: "15.05-linux-server-administration",
      name: "Linux Admin for Sysadmins",
      explainer: `✅ **Definition & Purpose**: Managing and securing Linux server infrastructure within a mixed Windows/Linux domain.
✅ **Architecture / Components**: SSH configurations, system log directories (/var/log), package installations, domain integration (sssd).
✅ **Daily Tasks**: Configuring SSH access keys, updating packages, monitoring disk partitions, and parsing log files.
✅ **Real Industry Use Cases**: Integrating Red Hat Enterprise Linux servers into an Active Directory domain for unified identity management.
✅ **Troubleshooting**: Storage partition full (/var/log/audit filling up), SSH connection blocks.
✅ **Best Practices**: Use SSH keys; disable password login; deploy logrotate policies to keep disk utilization low.
✅ **Interview Questions**: How do you inspect real-time logs in Linux? (Ans: Use \`tail -f /var/log/messages\` or \`journalctl -f\`).
✅ **Commands / Cheat Sheet**: \`df -h\` (disk usage) | \`tail -n 100 /var/log/secure\` (check logins) | \`systemctl restart sssd\``,
      problem: "A Linux web server stops writing database entries. Disk space check ('df -h') shows /dev/sda1 is 100% full.",
      solution: "Identify large files. Run 'du -sh /var/log/*' to find files. The system logs are likely clogged. Clear logs or run 'logrotate -f /etc/logrotate.conf' to compress them and free up disk space."
    },
    {
      id: "15.06",
      title: "15.06-network-switch-config",
      name: "Switch Configuration & Security",
      explainer: `✅ **Definition & Purpose**: Managing enterprise network switch parameters, port speed duplex settings, and access control.
✅ **Architecture / Components**: Port configurations, VLAN tagging, Link Aggregation (LACP), Port Security.
✅ **Daily Tasks**: Assigning switch ports to VLANs, configuring port trunks, setting up LACP channel groups, and locking ports.
✅ **Real Industry Use Cases**: Binding dual Ethernet links on a server to two switch ports configured for LACP to double bandwidth.
✅ **Troubleshooting**: Duplex mismatch causing network drops, port locking down due to unrecognized MAC addresses.
✅ **Best Practices**: Disable all unused switch ports and place them in an unrouted VLAN to prevent rogue network connections.
✅ **Interview Questions**: What is LACP? (Ans: Link Aggregation Control Protocol - a protocol that combines multiple physical network links into a single logical channel for redundancy and load balancing).
✅ **Commands / Cheat Sheet**: Cisco: \`interface range gi1/0/1 - 2\` | \`channel-group 1 mode active\` | \`switchport trunk allowed vlan 10,20\``,
      problem: "A server with dual NICs connected to ports Gi1/0/1 and Gi1/0/2 experiences packet drops and low bandwidth.",
      solution: "Verify LACP settings. Ensure both switch ports are configured in a channel-group ('channel-group 1 mode active') and that the server's NIC teaming configuration is set to LACP/802.3ad mode."
    },
    {
      id: "15.07",
      title: "15.07-patching-schedule-wsus",
      name: "Enterprise Patching Schedules",
      explainer: `✅ **Definition & Purpose**: Managing OS update cycles to protect servers from vulnerability exploits without disrupting services.
✅ **Architecture / Components**: Testing rings, staging updates, maintenance windows, WSUS/SCCM approval schedules.
✅ **Daily Tasks**: Staging patches, coordinating reboot schedules with app owners, and monitoring compliance logs.
✅ **Real Industry Use Cases**: Deploying patches to test servers on Tuesday, verifying app health, and applying to production on Saturday.
✅ **Troubleshooting**: Failed patch installations causing server BSOD boot loops, app incompatibility issues.
✅ **Best Practices**: Define strict maintenance windows; ensure backups are verified before patch updates run.
✅ **Interview Questions**: What is Patch Tuesday? (Ans: The informal name for Microsoft's release of security patches on the second Tuesday of each month).
✅ **Commands / Cheat Sheet**: Audit patch compliance using WSUS or SCCM dashboards; track KB numbers of installed updates.`,
      problem: "A critical security patch installed during a patching cycle breaks a legacy database application. You need to roll back.",
      solution: "Identify the KB update number from the patching log. Run CMD as Administrator and execute 'wusa /uninstall /kb:XXXXXXX /quiet /norestart' to remove the patch, then reboot the server and block the patch in WSUS."
    },
    {
      id: "15.08",
      title: "15.08-disaster-recovery-dr-plan",
      name: "Disaster Recovery Planning",
      explainer: `✅ **Definition & Purpose**: Developing and documenting policies and procedures to restore systems after disaster events.
✅ **Architecture / Components**: Business Impact Analysis (BIA), hot sites, cold sites, replication strategies, runbooks.
✅ **Daily Tasks**: Updating disaster recovery documents, conducting tabletop exercises, and auditing backup storage.
✅ **Real Industry Use Cases**: Designing a backup hot site facility in another region configured to take over hosting operations.
✅ **Troubleshooting**: Outdated recovery runbooks causing confusion during testing, network route synchronization delays.
✅ **Best Practices**: Keep all recovery runbooks updated in a central, offline-accessible documentation portal.
✅ **Interview Questions**: What is the difference between a hot site and a cold site? (Ans: A hot site is fully operational with mirrored data; a cold site has physical space but requires hardware installation and backup restores to start).
✅ **Commands / Cheat Sheet**: Maintain and update DR checklists: RTO (recovery time) and RPO (data loss) metrics validation.`,
      problem: "A company's main server facility is flooded, and the DR runbook directs staff to restore from backups, but the backup drive is water damaged.",
      solution: "In corporate DR planning, backups must follow the 3-2-1 rule. Recover the data by downloading the offsite replica copy stored in the secure cloud backup vault, and restore services on a clean host."
    },
    {
      id: "15.09",
      title: "15.09-it-asset-license-mgmt",
      name: "Asset & License Management",
      explainer: `✅ **Definition & Purpose**: Managing hardware inventory and software licenses to ensure compliance and cost efficiency.
✅ **Architecture / Components**: Asset registries, software license counts, compliance audits, lease limits.
✅ **Daily Tasks**: Auditing installed software databases, checking server CPU counts for licensing compliance, and logging hardware leases.
✅ **Real Industry Use Cases**: Running a software inventory scan to ensure the organization has sufficient licenses for installed software.
✅ **Troubleshooting**: License compliance audit failures, unrecorded hardware assets, licensing cost overruns.
✅ **Best Practices**: Use automated asset discovery tools (like SCCM asset intelligence) to log hardware and software inventory.
✅ **Interview Questions**: Why is server core count important for software licensing? (Ans: Many enterprise database systems (e.g. SQL Server) are licensed per CPU core, requiring audits to prevent compliance fines).
✅ **Commands / Cheat Sheet**: Windows: \`wmic bios get serialnumber\` | \`wmic computersystem get model,manufacturer\``,
      problem: "A vendor audit reveals the company has installed SQL Server on a 16-core machine but only purchased an 8-core license.",
      solution: "To avoid licensing compliance fines, purchase an additional 8-core license pack, or migrate the SQL database to an 8-core server and resize the original machine."
    },
    {
      id: "15.10",
      title: "15.10-itsm-change-mgmt-cab",
      name: "Change Management & CAB",
      explainer: `✅ **Definition & Purpose**: Structuring system modification procedures to reduce operational risks and outages.
✅ **Architecture / Components**: Change Advisory Board (CAB), Change Requests (RFC), risk assessments, rollback plans.
✅ **Daily Tasks**: Writing change requests, reviewing rollback plans, presenting changes to the CAB, and logging change success.
✅ **Real Industry Use Cases**: Presenting a plan to migrate the primary core router to the CAB for risk validation.
✅ **Troubleshooting**: Failed changes causing system outages, unapproved emergency changes causing configuration drift.
✅ **Best Practices**: Always detail a tested rollback plan in every Change Request before submitting to the CAB.
✅ **Interview Questions**: What is the role of the Change Advisory Board (CAB)? (Ans: A group of stakeholders that reviews, prioritizes, and schedules system changes to minimize risks and business impact).
✅ **Commands / Cheat Sheet**: Maintain RFC documentation: Risk assessment level, Rollback procedure, Implementation checklist.`,
      problem: "A technician executes an unapproved firewall update on a Friday night, which crashes the company website until Sunday.",
      solution: "Enforce change management policies. Lock down administrator access during 'no-change' windows, and mandate that all firewall modifications require an approved RFC and rollback plan reviewed by the CAB."
    }
  ],

  // 16. Ticketing Tool (ITSM basics) (4 modules)
  16: [
    {
      id: "16.01",
      title: "16.01-itsm-framework-basics",
      name: "ITIL ITSM Fundamentals",
      explainer: `✅ **Definition & Purpose**: IT Service Management (ITSM) framework designed to align IT services with business needs using standard workflows.
✅ **Architecture / Components**: Incident (restore service), Problem (find root cause), Change (approve system edits), Service Request (provide access).
✅ **Daily Tasks**: Categorizing user issues, linking incidents to problems, and routing requests to correct teams.
✅ **Real Industry Use Cases**: Handling a server crash ticket as an Incident, and launching a Problem ticket to investigate why the server crashed.
✅ **Troubleshooting**: Confusing Incidents with Service Requests, leading to incorrect SLA timers.
✅ **Best Practices**: Train staff on ITIL terminology; route standard requests (e.g. password resets) via Service Requests.
✅ **Interview Questions**: What is the difference between an Incident and a Problem in ITIL? (Ans: Incident is a sudden disruption to restore service; Problem is the underlying cause of one or more incidents).
✅ **Commands / Cheat Sheet**: Framework terms: Incident (Fix now) | Problem (Prevent future) | Change (Approve edit).`,
      problem: "A user submits a ticket saying 'I need a new mouse' as a high-priority Incident, clogging up the helpdesk queue.",
      solution: "Re-categorize the ticket as a 'Service Request' (low priority). Train users on the service portal, and implement automated routing rules in the ticketing tool to forward mouse requests to hardware procurement."
    },
    {
      id: "16.02",
      title: "16.02-servicenow-ticket-lifecycle",
      name: "ServiceNow Ticket States",
      explainer: `✅ **Definition & Purpose**: The lifecycle stages of an ITSM ticket from initial submission to final resolution and closure.
✅ **Architecture / Components**: Ticket states: New, Assigned, In Progress, On Hold, Resolved, Closed. Prioritization matrix (Impact vs Urgency).
✅ **Daily Tasks**: Updating ticket status, assigning tickets to teams, setting priorities, and writing resolution notes.
✅ **Real Industry Use Cases**: Routing a company-wide email outage ticket as P1 (Critical) to the infrastructure team.
✅ **Troubleshooting**: Tickets stuck in 'On Hold' state without updates, incorrect assignment routing rules.
✅ **Best Practices**: Provide clear, step-by-step resolution notes in the ticket before changing the status to Resolved.
✅ **Interview Questions**: How is a ticket's Priority determined in ServiceNow? (Ans: By mapping the combination of Urgency (how fast it needs fixing) and Impact (how many users are affected) in a priority matrix).
✅ **Commands / Cheat Sheet**: States: New -> Work in Progress -> Resolved -> Closed. Priority calculation: 1 (Critical) to 4 (Low).`,
      problem: "A critical network outage ticket is assigned as a P4 (Low Priority) because the user set Urgency to 'Low'.",
      solution: "Open the ticket and review the Impact. Because the outage affects the entire office, the Impact is 'High'. Change the Impact to 'High' on the ticket; the system matrix will automatically recalculate the Priority to P1."
    },
    {
      id: "16.03",
      title: "16.03-sla-breach-management",
      name: "SLA Breach & Escalation",
      explainer: `✅ **Definition & Purpose**: Service Level Agreements define agreed-upon response and resolution times for IT support.
✅ **Architecture / Components**: Response SLA, Resolution SLA, escalation rules, notifications.
✅ **Daily Tasks**: Monitoring ticket SLA countdown timers, escalating tickets close to breach, and documenting SLA breaches.
✅ **Real Industry Use Cases**: Monitoring a P1 incident SLA timer (e.g. 4-hour resolution limit) and triggering automated pager alerts to managers.
✅ **Troubleshooting**: Missed SLA targets due to incorrect assignment queues, tickets left in 'Assigned' state.
✅ **Best Practices**: Configure the ticketing tool to send warning notifications when SLA timers reach 50% and 75% thresholds.
✅ **Interview Questions**: What is the difference between Response SLA and Resolution SLA? (Ans: Response SLA is the time limit to acknowledge the ticket; Resolution SLA is the time limit to fully resolve the issue).
✅ **Commands / Cheat Sheet**: Monitor SLA indicators inside the ServiceNow/Jira ticket sidebar menu.`,
      problem: "A P2 server capacity ticket is approaching its resolution SLA, and the assigned technician is currently offline.",
      solution: "Trigger an escalation. Reassign the ticket to the secondary technician on-duty, update the ticket notes, and send an alert notification to the team lead to coordinate coverage and prevent an SLA breach."
    },
    {
      id: "16.04",
      title: "16.04-incident-documentation",
      name: "Documentation & Root Cause",
      explainer: `✅ **Definition & Purpose**: Creating comprehensive incident resolution logs and documenting Root Cause Analysis (RCA) summaries.
✅ **Architecture / Components**: Resolution notes, closure codes, Root Cause Analysis (RCA), Knowledge Base article linking.
✅ **Daily Tasks**: Writing post-incident reports, documenting root causes, and publishing KB articles.
✅ **Real Industry Use Cases**: Writing an RCA report explaining that a website outage was caused by an expired SSL certificate.
✅ **Troubleshooting**: Vague resolution notes ('fixed it' or 'resolved') leading to poor knowledge base searches.
✅ **Best Practices**: Write detailed resolution steps so helpdesk techs can search historical tickets to solve similar issues.
✅ **Interview Questions**: What is an RCA (Root Cause Analysis)? (Ans: A document detailing the cause of a major incident, what was done to fix it, and preventative steps to ensure it does not happen again).
✅ **Commands / Cheat Sheet**: Template: Incident Summary -> Root Cause -> Resolution Steps -> Preventive Recommendations.`,
      problem: "A recurring database connection error keeps occurring, and techs waste time repeating troubleshooting steps from scratch.",
      solution: "Write a detailed Knowledge Base (KB) article detailing the resolution steps. Link the KB article to the ticket category. When the next incident is created, the system will suggest the KB article to the technician."
    }
  ]
};
