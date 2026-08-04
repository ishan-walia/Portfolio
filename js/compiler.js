/* ==========================================================================
   INTERACTIVE CODE COMPILER & PLAYGROUND ENGINE
   ========================================================================== */

const compilerTemplates = {
    kotlin: {
        fileName: "NetSpyderScanner.kt",
        badge: "KOTLIN / ANDROID",
        code: `// Ishan Walia - NetSpyder Network Audit Module
import java.net.InetAddress

fun main() {
    val subnet = "192.168.1"
    println("[+] Starting NetSpyder Subnet Scanner v1.0.4...")
    println("[+] Scanning IP range: $subnet.1 - $subnet.254")
    
    val activeNodes = listOf("192.168.1.1 (Gateway)", "192.168.1.109 (Kali Linux)", "192.168.1.150 (Android Phone)")
    for (node in activeNodes) {
        println("[FOUND] Active Node: $node | Open Ports: 80, 443, 22")
    }
    println("[✔] Subnet Audit Completed successfully! Zero vulnerabilities leaked.")
}`,
        output: [
            "[+] Compiling NetSpyderScanner.kt with kotlinc...",
            "[+] Build status: 0 Errors, 0 Warnings (Build time: 310ms)",
            "[+] Running main()...",
            "--------------------------------------------------",
            "[+] Starting NetSpyder Subnet Scanner v1.0.4...",
            "[+] Scanning IP range: 192.168.1.1 - 192.168.1.254",
            "[FOUND] Active Node: 192.168.1.1 (Gateway) | Open Ports: 80, 443, 22",
            "[FOUND] Active Node: 192.168.1.109 (Kali Linux) | Open Ports: 80, 443, 22",
            "[FOUND] Active Node: 192.168.1.150 (Android Phone) | Open Ports: 80, 443, 22",
            "[✔] Subnet Audit Completed successfully! Zero vulnerabilities leaked."
        ]
    },
    dart: {
        fileName: "EcoAwareAssistant.dart",
        badge: "DART / FLUTTER",
        code: `// Ishan Walia - EcoAware AI Flutter Module
void main() {
  final appName = "EcoAware AI";
  final version = "2.1.0";
  print("Initializing $appName v$version (Flutter Engine)...");
  
  final userQuery = "Analyze carbon offset for local urban recycling";
  print("User Query: '$userQuery'");
  print("[AI Response] Optimizing eco-campaign route: 84% emissions reduced!");
  print("[+] Flutter UI Widget Tree rendered cleanly on Android & iOS.");
}`,
        output: [
            "[+] Running 'dart run EcoAwareAssistant.dart'...",
            "[+] Flutter SDK 3.19.0 Target: Android ARM64",
            "--------------------------------------------------",
            "Initializing EcoAware AI v2.1.0 (Flutter Engine)...",
            "User Query: 'Analyze carbon offset for local urban recycling'",
            "[AI Response] Optimizing eco-campaign route: 84% emissions reduced!",
            "[+] Flutter UI Widget Tree rendered cleanly on Android & iOS."
        ]
    },
    python: {
        fileName: "CommandXAudit.py",
        badge: "PYTHON / CYBERSEC",
        code: `# Ishan Walia - CommandX Security Audit Script
import time

def scan_target(target_ip):
    print(f"[*] Initializing CommandX Security Audit on {target_ip}...")
    ports = [21, 22, 80, 443, 8080]
    for port in ports:
        status = "OPEN" if port in [80, 443] else "CLOSED"
        print(f"[PORT {port:4}] Status: {status}")
    print("[+] Audit Complete. Firewall Rules Enforced!")

scan_target("192.168.1.1")`,
        output: [
            "[+] Executing Python 3.11 environment...",
            "[+] CommandX Security Audit Script Started.",
            "--------------------------------------------------",
            "[*] Initializing CommandX Security Audit on 192.168.1.1...",
            "[PORT   21] Status: CLOSED",
            "[PORT   22] Status: CLOSED",
            "[PORT   80] Status: OPEN",
            "[PORT  443] Status: OPEN",
            "[PORT 8080] Status: CLOSED",
            "[+] Audit Complete. Firewall Rules Enforced!"
        ]
    },
    bash: {
        fileName: "LinuxSecurityAudit.sh",
        badge: "BASH / LINUX CLI",
        code: `#!/bin/bash
# Ishan Walia - CommandX Linux Security Cheat-Sheet CLI
echo "[+] CommandX Linux CLI Helper v1.0"
echo "[+] Current User: $(whoami) | OS: Kali Linux 2026"
echo "[+] Recommended Command: nmap -sV -sC 192.168.1.1"
echo "[+] Status: Security Profile Active!"`,
        output: [
            "[+] Granting execute permission: chmod +x LinuxSecurityAudit.sh",
            "[+] Executing ./LinuxSecurityAudit.sh in zsh...",
            "--------------------------------------------------",
            "[+] CommandX Linux CLI Helper v1.0",
            "[+] Current User: ishan_walia | OS: Kali Linux 2026",
            "[+] Recommended Command: nmap -sV -sC 192.168.1.1",
            "[+] Status: Security Profile Active!"
        ]
    }
};

let currentLang = 'kotlin';

window.switchCompilerLang = function(langKey) {
    if (!compilerTemplates[langKey]) return;
    currentLang = langKey;

    const tabs = document.querySelectorAll('.compiler-tab');
    tabs.forEach(t => t.classList.remove('active'));

    const activeTab = document.getElementById(`tab-lang-${langKey}`);
    if (activeTab) activeTab.classList.add('active');

    const fileName = document.getElementById('compiler-file-name');
    const textarea = document.getElementById('compiler-code-input');
    const lineNumbers = document.getElementById('line-numbers');
    const statusBadge = document.getElementById('compiler-status-badge');

    const tpl = compilerTemplates[langKey];

    if (fileName) fileName.innerHTML = `<i class="fa-solid fa-code"></i> ${tpl.fileName}`;
    if (textarea) textarea.value = tpl.code;
    if (statusBadge) statusBadge.textContent = "READY";

    updateLineNumbers();
    clearCompilerOutput();
};

function updateLineNumbers() {
    const textarea = document.getElementById('compiler-code-input');
    const lineNumbers = document.getElementById('line-numbers');
    if (!textarea || !lineNumbers) return;

    const lines = textarea.value.split('\n').length;
    let numsHtml = '';
    for (let i = 1; i <= Math.max(lines, 12); i++) {
        numsHtml += `${i}<br>`;
    }
    lineNumbers.innerHTML = numsHtml;
}

window.runCompilerCode = function() {
    const consoleBody = document.getElementById('compiler-console');
    const statusBadge = document.getElementById('compiler-status-badge');
    const tpl = compilerTemplates[currentLang];

    if (!consoleBody) return;

    if (statusBadge) {
        statusBadge.textContent = "COMPILING...";
        statusBadge.className = "box-badge yellow";
    }

    consoleBody.innerHTML = `<div class="console-line info">[⚡] Initializing ${currentLang.toUpperCase()} Compiler Engine...</div>`;

    setTimeout(() => {
        if (statusBadge) {
            statusBadge.textContent = "EXECUTING";
            statusBadge.className = "box-badge cyan";
        }
        
        let outputHtml = `<div class="console-line info">[⚡] Initializing ${currentLang.toUpperCase()} Compiler Engine...</div>`;
        const outputs = tpl ? tpl.output : ["Output generated successfully."];

        let idx = 0;
        const interval = setInterval(() => {
            if (idx < outputs.length) {
                const line = outputs[idx];
                let lineClass = "console-line";
                if (line.startsWith("[✔]")) lineClass += " success";
                else if (line.startsWith("[+]") || line.startsWith("[FOUND]")) lineClass += " info";
                else if (line.startsWith("---")) lineClass += " muted";
                
                outputHtml += `<div class="${lineClass}">${line}</div>`;
                consoleBody.innerHTML = outputHtml;
                consoleBody.scrollTop = consoleBody.scrollHeight;
                idx++;
            } else {
                clearInterval(interval);
                if (statusBadge) {
                    statusBadge.textContent = "SUCCESS (0 ERRORS)";
                    statusBadge.className = "box-badge green";
                }
            }
        }, 180);
    }, 400);
};

window.clearCompilerOutput = function() {
    const consoleBody = document.getElementById('compiler-console');
    const statusBadge = document.getElementById('compiler-status-badge');

    if (consoleBody) {
        consoleBody.innerHTML = `<div class="console-line muted">// Click [RUN CODE] above to compile and execute your code live!</div>`;
    }
    if (statusBadge) {
        statusBadge.textContent = "READY";
        statusBadge.className = "box-badge cyan";
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('compiler-code-input');
    if (textarea) {
        textarea.addEventListener('input', updateLineNumbers);
    }
});
