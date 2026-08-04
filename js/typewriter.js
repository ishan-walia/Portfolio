/* ==========================================================================
   HERO TYPEWRITER ENGINE & CYBER DECK INTERACTION
   ========================================================================== */

function initTypewriterEngine() {
    const typewriterElement = document.getElementById('typewriter-text');
    const roles = [
        "Cyber Security & Mobile App Developer",
        "Android Native & Flutter Engineer",
        "Cybersecurity Researcher"
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    const typeSpeed = 85;
    const backSpeed = 40;
    const delayNext = 2200;

    function handleTypewriter() {
        if (!typewriterElement) return;

        const currentRole = roles[roleIdx];

        if (isDeleting) {
            typewriterElement.textContent = currentRole.substring(0, charIdx - 1);
            charIdx--;
        } else {
            typewriterElement.textContent = currentRole.substring(0, charIdx + 1);
            charIdx++;
        }

        if (!isDeleting && charIdx === currentRole.length) {
            isDeleting = true;
            setTimeout(handleTypewriter, delayNext);
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            roleIdx = (roleIdx + 1) % roles.length;
            setTimeout(handleTypewriter, 300);
        } else {
            setTimeout(handleTypewriter, isDeleting ? backSpeed : typeSpeed);
        }
    }

    handleTypewriter();
}

// Global Cyber Deck Switcher & Interactive Vulnerability Scanner
window.switchDeckMode = function(modeName) {
    const cyberTab = document.getElementById('tab-cyber');
    const mobileTab = document.getElementById('tab-mobile');
    const cyberView = document.getElementById('deck-view-cyber');
    const mobileView = document.getElementById('deck-view-mobile');

    if (cyberTab && mobileTab) {
        cyberTab.classList.remove('active');
        mobileTab.classList.remove('active');
    }
    if (cyberView && mobileView) {
        cyberView.classList.remove('active');
        mobileView.classList.remove('active');
    }

    if (modeName === 'cyber') {
        if (cyberTab) cyberTab.classList.add('active');
        if (cyberView) cyberView.classList.add('active');
    } else {
        if (mobileTab) mobileTab.classList.add('active');
        if (mobileView) mobileView.classList.add('active');
    }
};

window.runCyberScanAnimation = function() {
    const hexStream = document.getElementById('hex-data-stream');
    const portStatus = document.getElementById('hud-port-status');
    const scanBtnText = document.getElementById('scan-btn-text');

    if (scanBtnText) scanBtnText.textContent = "SCANNING SUBNET...";
    if (portStatus) portStatus.textContent = "[PENETRATING NODE...]";

    let hexSamples = [
        "0x7F 0x45 0x4C 0x46 [SYN_ACK] PING 192.168.1.1 OK",
        "0x00 0xFF 0x9D 0x00 EXPLOIT_CHECK: PASS [NMAP_SCAN]",
        "0x9D 0x4E 0xDD 0xFF BYPASSING FIREWALL... STATUS: 200 OK",
        "0x00 0xF0 0xFF 0x88 ISHAN_SECURITY_AUDIT: CLEARED"
    ];

    let step = 0;
    const interval = setInterval(() => {
        if (hexStream && step < hexSamples.length) {
            hexStream.textContent = hexSamples[step];
        }
        step++;
        if (step > hexSamples.length) {
            clearInterval(interval);
            if (scanBtnText) scanBtnText.textContent = "VULN SCAN COMPLETED!";
            if (portStatus) portStatus.textContent = "[ALL NODES SECURE]";
            setTimeout(() => {
                if (scanBtnText) scanBtnText.textContent = "RUN LIVE VULN SCAN";
                if (portStatus) portStatus.textContent = "[PORT 80, 443, 22 OPEN]";
            }, 3000);
        }
    }, 450);
};
