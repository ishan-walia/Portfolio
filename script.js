/* ==========================================================================
   ISHAN WALIA // PORTFOLIO JAVASCRIPT ENGINE
   Includes: Custom Cyber-Spider Splash Canvas, Matrix Rain, Interactive CLI,
   Hero Typewriter, Project Filtering, Interactive Smartphone Lab & Animations.
   ========================================================================== */

let splashAudio = null;
let isAudioPlaying = false;
let hasSpokenSplashVoice = false;

function initSplashAudio() {
    if (!splashAudio) {
        splashAudio = new Audio('images/audio/hacker_disclaimer.mp3');
        splashAudio.volume = 1.0;
        splashAudio.preload = 'auto';
        
        splashAudio.onended = () => {
            isAudioPlaying = false;
            setTimeout(() => {
                if (window.dismissSplash) window.dismissSplash();
            }, 300);
        };

        splashAudio.onerror = () => {
            console.warn("MP3 file error, playing speech fallback");
            triggerSpeechFallback();
        };
    }
}

function triggerSpeechFallback() {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const voiceText = "Welcome to Ishan Walia Portfolio. This is a Cybersecurity and Mobile App Developer Portfolio. Thank you!";
    const utterance = new SpeechSynthesisUtterance(voiceText);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    utterance.lang = 'en-US';

    const triggerVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            const bestVoice = voices.find(v => 
                v.lang.startsWith('en') && 
                (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Zira') || v.name.includes('David'))
            ) || voices.find(v => v.lang.startsWith('en'));
            if (bestVoice) utterance.voice = bestVoice;
        }
        window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
        window.speechSynthesis.onvoiceschanged = triggerVoice;
    }
    triggerVoice();
}

window.playSplashVoiceover = function() {
    initSplashAudio();
    if (isAudioPlaying) return;

    splashAudio.currentTime = 0;
    const playPromise = splashAudio.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            isAudioPlaying = true;
            hasSpokenSplashVoice = true;
        }).catch(err => {
            console.warn("Autoplay policy restricted unprompted audio playback:", err);
            triggerSpeechFallback();
            hasSpokenSplashVoice = true;
        });
    }
};

window.toggleSplashAudio = function() {
    initSplashAudio();
    const btnText = document.getElementById('splash-audio-text');
    const btnIcon = document.getElementById('splash-audio-icon');

    if (splashAudio && isAudioPlaying && !splashAudio.paused) {
        splashAudio.pause();
        isAudioPlaying = false;
        if (btnText) btnText.textContent = "PLAY AUDIO";
        if (btnIcon) btnIcon.className = "fa-solid fa-volume-xmark";
    } else {
        window.playSplashVoiceover();
        if (btnText) btnText.textContent = "PAUSE AUDIO";
        if (btnIcon) btnIcon.className = "fa-solid fa-volume-high";
    }
};

// Global dismiss
window.dismissSplash = function() {
    if (splashAudio) {
        splashAudio.pause();
        splashAudio.currentTime = 0;
    }
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    
    const splashElem = document.getElementById('splash-screen');
    if (splashElem) {
        splashElem.style.opacity = '0';
        splashElem.style.pointerEvents = 'none';
        splashElem.classList.add('fade-out');
        setTimeout(() => {
            splashElem.style.display = 'none';
        }, 300);
    }
};

// Start playback attempt immediately on load
try { window.playSplashVoiceover(); } catch(e) {}

// Unlock audio on ANY user movement/interaction on the page
const unlockAudioEvents = ['click', 'touchstart', 'keydown', 'mousedown', 'pointerdown', 'mousemove', 'scroll'];
function unlockAndPlayAudio() {
    if (!isAudioPlaying) {
        window.playSplashVoiceover();
    }
    unlockAudioEvents.forEach(evt => {
        window.removeEventListener(evt, unlockAndPlayAudio);
    });
}
unlockAudioEvents.forEach(evt => {
    window.addEventListener(evt, unlockAndPlayAudio, { passive: true });
});

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. SPLASH SCREEN & CYBER SPIDER CANVAS ENGINE
    // ==========================================================================
    let splashAnimId = null;
    let isSplashActive = true;
    let statusInterval = null;

    const splashScreen = document.getElementById('splash-screen');
    const splashCanvas = document.getElementById('splash-canvas');
    const splashStatus = document.getElementById('splash-status-text');
    const skipBtn = document.getElementById('skip-splash-btn');

    // Attempt playing audio as soon as DOM is ready
    window.playSplashVoiceover();

    // Interaction fallback for strict browser policies
    const playOnUserGesture = () => {
        if (isSplashActive && splashAudio && splashAudio.paused) {
            splashAudio.play().catch(() => {});
        }
    };
    window.addEventListener('click', playOnUserGesture, { once: true });
    window.addEventListener('touchstart', playOnUserGesture, { once: true });
    window.addEventListener('keydown', playOnUserGesture, { once: true });

    // Override with full cleanup logic
    window.dismissSplash = function() {
        if (splashAudio) {
            splashAudio.pause();
            splashAudio.currentTime = 0;
        }
        if (!isSplashActive) {
            if (splashScreen) splashScreen.style.display = 'none';
            return;
        }
        isSplashActive = false;

        if (statusInterval) clearInterval(statusInterval);
        if (splashAnimId) cancelAnimationFrame(splashAnimId);

        if (splashScreen) {
            splashScreen.style.opacity = '0';
            splashScreen.style.pointerEvents = 'none';
            splashScreen.classList.add('fade-out');
            setTimeout(() => {
                splashScreen.style.display = 'none';
            }, 300);
        }
    };

    // Auto voiceover on splash screen
    setTimeout(() => {
        if (isSplashActive && !hasSpokenSplashVoice) {
            window.playSplashVoiceover();
        }
    }, 400);

    const firstInteractionHandler = () => {
        if (isSplashActive && !hasSpokenSplashVoice) {
            window.playSplashVoiceover();
        }
        window.removeEventListener('click', firstInteractionHandler);
        window.removeEventListener('touchstart', firstInteractionHandler);
    };
    window.addEventListener('click', firstInteractionHandler);
    window.addEventListener('touchstart', firstInteractionHandler);

    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.dismissSplash();
        });
    }

    // Keypress listener to skip splash with Space, Enter, or Escape
    window.addEventListener('keydown', (e) => {
        if (isSplashActive && (e.key === ' ' || e.key === 'Enter' || e.key === 'Escape')) {
            window.dismissSplash();
        }
    });

    const autoDismissTimer = setTimeout(() => {
        window.dismissSplash();
    }, 7500);

    // Status Messages update
    const statusMessages = [
        "INITIALIZING CYBER SPIDER PROTOCOL...",
        "SCANNING NETWORK NODES WITH NETSPYDER...",
        "LOADING ANDROID & FLUTTER MODULES...",
        "ACCESS GRANTED // WELCOME TO ISHAN WALIA PORTFOLIO"
    ];
    let statusIdx = 0;
    statusInterval = setInterval(() => {
        statusIdx++;
        if (statusIdx < statusMessages.length && splashStatus) {
            splashStatus.textContent = statusMessages[statusIdx];
        }
    }, 850);

    if (splashCanvas) {
        const ctx = splashCanvas.getContext('2d');
        let width = splashCanvas.width = window.innerWidth;
        let height = splashCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = splashCanvas.width = window.innerWidth;
            height = splashCanvas.height = window.innerHeight;
            generateBuildings();
        });

        // Matrix Rain Setup
        const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+<>~[]{}';
        const fontSize = 14;
        const columns = Math.floor(width / fontSize);
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.floor(Math.random() * (height / fontSize));
        }

        // City Buildings Setup
        let buildings = [];
        function generateBuildings() {
            buildings = [];
            const buildingWidth = 85;
            const count = Math.ceil(width / buildingWidth) + 3;
            let curX = -10;
            for (let i = 0; i < count; i++) {
                const bHeight = Math.floor(Math.random() * (height * 0.38)) + height * 0.28;
                const hasAntenna = Math.random() > 0.35;
                const antennaHeight = hasAntenna ? Math.floor(Math.random() * 25) + 20 : 0;
                
                // Pre-generate window lights layout
                const windows = [];
                const topY = height - bHeight;
                for (let wy = topY + 20; wy < height - 30; wy += 22) {
                    for (let wx = curX + 10; wx < curX + buildingWidth - 15; wx += 18) {
                        const isLit = Math.random() > 0.35;
                        const isCyan = Math.random() > 0.6;
                        windows.push({ x: wx, y: wy, isLit, isCyan });
                    }
                }

                buildings.push({
                    x: curX,
                    w: buildingWidth,
                    h: bHeight,
                    topY: topY,
                    hasAntenna: hasAntenna,
                    antennaHeight: antennaHeight,
                    windows: windows
                });
                curX += buildingWidth + Math.floor(Math.random() * 12);
            }
        }
        generateBuildings();

        // Cyber Spider State & Leaping Physics
        let spider = {
            currentBuildingIdx: 0,
            x: 50,
            y: height - 200,
            targetX: 50,
            targetY: height - 200,
            progress: 1,
            startX: 50,
            startY: height - 200,
            webLine: null,
            angle: 0
        };

        if (buildings.length > 0) {
            spider.x = buildings[0].x + buildings[0].w / 2;
            spider.y = buildings[0].topY - 18;
            spider.startX = spider.x;
            spider.startY = spider.y;
            spider.targetX = spider.x;
            spider.targetY = spider.y;
        }

        function leapSpiderToNextBuilding() {
            if (buildings.length < 2) return;
            spider.currentBuildingIdx = (spider.currentBuildingIdx + 1) % buildings.length;
            const targetB = buildings[spider.currentBuildingIdx];
            
            spider.startX = spider.x;
            spider.startY = spider.y;
            spider.targetX = targetB.x + targetB.w / 2;
            spider.targetY = targetB.topY - 18;
            spider.progress = 0;
            
            spider.webLine = {
                startX: spider.startX,
                startY: spider.startY,
                endX: spider.targetX,
                endY: spider.targetY
            };
        }

        let lastLeapTime = Date.now();

        function drawSplash() {
            if (!isSplashActive) return;

            // Deep cyber background with subtle trailing
            ctx.fillStyle = 'rgba(4, 5, 10, 0.22)';
            ctx.fillRect(0, 0, width, height);

            // 1. Matrix Digital Rain
            ctx.fillStyle = '#00ff9d';
            ctx.font = fontSize + 'px monospace';
            for (let i = 0; i < drops.length; i++) {
                const char = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            // 2. Draw Realistic Buildings & Top Aviation Warning Beacon Lights
            const nowTime = Date.now();
            const beaconBlink = Math.sin(nowTime * 0.006) > 0;

            buildings.forEach((b) => {
                // Building Facade Gradient (3D Shaded Silhouette)
                const grad = ctx.createLinearGradient(b.x, b.topY, b.x + b.w, height);
                grad.addColorStop(0, '#0a101d');
                grad.addColorStop(0.5, '#060a12');
                grad.addColorStop(1, '#020408');
                ctx.fillStyle = grad;
                ctx.fillRect(b.x, b.topY, b.w, b.h);

                // Neon Outline Grid
                ctx.strokeStyle = '#00f0ff';
                ctx.lineWidth = 1;
                ctx.strokeRect(b.x, b.topY, b.w, b.h);

                // Roof Cornice & Ledge Header
                ctx.fillStyle = '#0f172a';
                ctx.fillRect(b.x - 3, b.topY, b.w + 6, 6);
                ctx.strokeStyle = '#00ff9d';
                ctx.strokeRect(b.x - 3, b.topY, b.w + 6, 6);

                // Realistic Window Light Grid
                b.windows.forEach(w => {
                    if (w.isLit) {
                        ctx.fillStyle = w.isCyan ? 'rgba(0, 240, 255, 0.7)' : 'rgba(0, 255, 157, 0.65)';
                        ctx.shadowColor = w.isCyan ? '#00f0ff' : '#00ff9d';
                        ctx.shadowBlur = 8;
                        ctx.fillRect(w.x, w.y, 9, 13);
                        ctx.shadowBlur = 0;
                    } else {
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
                        ctx.fillRect(w.x, w.y, 9, 13);
                    }
                });

                // Top Roof Antenna & Red/White Beacon Light
                if (b.hasAntenna) {
                    const antX = b.x + b.w / 2;
                    const antTopY = b.topY - b.antennaHeight;

                    // Antenna Pole
                    ctx.beginPath();
                    ctx.moveTo(antX, b.topY);
                    ctx.lineTo(antX, antTopY);
                    ctx.strokeStyle = '#64748b';
                    ctx.lineWidth = 2;
                    ctx.stroke();

                    // Glowing Aviation Warning Light Beacon on Top
                    if (beaconBlink) {
                        ctx.beginPath();
                        ctx.arc(antX, antTopY, 4.5, 0, Math.PI * 2);
                        ctx.fillStyle = '#ff3366';
                        ctx.shadowColor = '#ff3366';
                        ctx.shadowBlur = 18;
                        ctx.fill();

                        ctx.beginPath();
                        ctx.arc(antX, antTopY, 2, 0, Math.PI * 2);
                        ctx.fillStyle = '#ffffff';
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                }
            });

            // 3. Spider Leaping Physics Update
            if (nowTime - lastLeapTime > 850 && spider.progress >= 1) {
                leapSpiderToNextBuilding();
                lastLeapTime = nowTime;
            }

            if (spider.progress < 1) {
                spider.progress += 0.035;
                if (spider.progress > 1) spider.progress = 1;

                const t = spider.progress;
                spider.x = (1 - t) * spider.startX + t * spider.targetX;
                const arcHeight = 130;
                spider.y = (1 - t) * spider.startY + t * spider.targetY - Math.sin(t * Math.PI) * arcHeight;
            }

            // 5. Draw Ultra-Realistic Jointed Cyber Spider
            drawRealisticCyberSpider(ctx, spider.x, spider.y, spider.progress);

            if (isSplashActive) {
                splashAnimId = requestAnimationFrame(drawSplash);
            }
        }

        // Realistic Cyber Spider Renderer with Jointed Kinematic Legs
        function drawRealisticCyberSpider(ctx, cx, cy, progress) {
            ctx.save();
            ctx.translate(cx, cy);

            const isLeaping = progress < 1;
            const timeFactor = Date.now() * 0.012;
            const legWalkOffset = isLeaping ? Math.sin(progress * Math.PI * 4) * 6 : Math.sin(timeFactor) * 3;

            // Abdomen / Opisthosoma (Rear Shell)
            ctx.save();
            ctx.shadowColor = '#00ff9d';
            ctx.shadowBlur = 22;

            const abdGrad = ctx.createRadialGradient(0, 8, 2, 0, 8, 14);
            abdGrad.addColorStop(0, '#00ff9d');
            abdGrad.addColorStop(0.6, '#005c3b');
            abdGrad.addColorStop(1, '#021a11');
            ctx.fillStyle = abdGrad;

            ctx.beginPath();
            ctx.ellipse(0, 10, 11, 15, 0, 0, Math.PI * 2);
            ctx.fill();

            // Cyber Circuit Lines
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, 2);
            ctx.lineTo(0, 18);
            ctx.moveTo(-5, 8);
            ctx.lineTo(5, 8);
            ctx.moveTo(-4, 14);
            ctx.lineTo(4, 14);
            ctx.stroke();
            ctx.restore();

            // Cephalothorax (Head)
            ctx.save();
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 15;

            const headGrad = ctx.createRadialGradient(0, -5, 1, 0, -5, 8);
            headGrad.addColorStop(0, '#00f0ff');
            headGrad.addColorStop(0.7, '#004c66');
            headGrad.addColorStop(1, '#02121a');
            ctx.fillStyle = headGrad;

            ctx.beginPath();
            ctx.ellipse(0, -4, 8, 9, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            // Arachnid Eyes (8 Lenses)
            ctx.fillStyle = '#ff3366';
            ctx.shadowColor = '#ff3366';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(-3, -8, 2.2, 0, Math.PI * 2);
            ctx.arc(3, -8, 2.2, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#00ff9d';
            ctx.shadowColor = '#00ff9d';
            ctx.beginPath();
            ctx.arc(-6, -7, 1.2, 0, Math.PI * 2);
            ctx.arc(6, -7, 1.2, 0, Math.PI * 2);
            ctx.arc(-5, -10, 1.2, 0, Math.PI * 2);
            ctx.arc(5, -10, 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // Fangs / Chelicerae
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-3, -11);
            ctx.lineTo(-4, -16);
            ctx.moveTo(3, -11);
            ctx.lineTo(4, -16);
            ctx.stroke();

            // 8 Jointed Legs
            const legConfigsLeft = [
                { kx: -14, ky: -16, tx: -28, ty: -24 },
                { kx: -18, ky: -8,  tx: -32, ty: -10 },
                { kx: -16, ky: 4,   tx: -30, ty: 12 },
                { kx: -12, ky: 14,  tx: -24, ty: 26 }
            ];

            const legConfigsRight = [
                { kx: 14, ky: -16, tx: 28, ty: -24 },
                { kx: 18, ky: -8,  tx: 32, ty: -10 },
                { kx: 16, ky: 4,   tx: 30, ty: 12 },
                { kx: 12, ky: 14,  tx: 24, ty: 26 }
            ];

            ctx.lineWidth = 2.2;

            legConfigsLeft.forEach((config, idx) => {
                const shift = (idx % 2 === 0 ? 1 : -1) * legWalkOffset;
                ctx.strokeStyle = idx % 2 === 0 ? '#00ff9d' : '#00f0ff';
                ctx.beginPath();
                ctx.moveTo(-4, -2 + idx * 4);
                ctx.lineTo(config.kx + shift, config.ky + shift * 0.5);
                ctx.lineTo(config.tx + shift * 1.5, config.ty);
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(config.kx + shift - 1, config.ky + shift * 0.5 - 1, 2.5, 2.5);
            });

            legConfigsRight.forEach((config, idx) => {
                const shift = (idx % 2 === 0 ? -1 : 1) * legWalkOffset;
                ctx.strokeStyle = idx % 2 === 0 ? '#00ff9d' : '#00f0ff';
                ctx.beginPath();
                ctx.moveTo(4, -2 + idx * 4);
                ctx.lineTo(config.kx + shift, config.ky + shift * 0.5);
                ctx.lineTo(config.tx + shift * 1.5, config.ty);
                ctx.stroke();

                ctx.fillStyle = '#ffffff';
                ctx.fillRect(config.kx + shift - 1, config.ky + shift * 0.5 - 1, 2.5, 2.5);
            });

            ctx.restore();
        }

        drawSplash();
    }

    // ==========================================================================
    // 2. BACKGROUND AMBIENT PARTICLES
    // ==========================================================================
    const bgCanvas = document.getElementById('bg-canvas');
    if (bgCanvas) {
        const bgCtx = bgCanvas.getContext('2d');
        let bgW = bgCanvas.width = window.innerWidth;
        let bgH = bgCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            bgW = bgCanvas.width = window.innerWidth;
            bgH = bgCanvas.height = window.innerHeight;
        });

        const particles = [];
        const numParticles = Math.min(Math.floor(bgW / 25), 55);

        for (let i = 0; i < numParticles; i++) {
            particles.push({
                x: Math.random() * bgW,
                y: Math.random() * bgH,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 2 + 1
            });
        }

        function renderBgParticles() {
            bgCtx.clearRect(0, 0, bgW, bgH);

            particles.forEach((p, idx) => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > bgW) p.vx *= -1;
                if (p.y < 0 || p.y > bgH) p.vy *= -1;

                bgCtx.fillStyle = 'rgba(0, 255, 157, 0.4)';
                bgCtx.beginPath();
                bgCtx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                bgCtx.fill();

                for (let j = idx + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                    if (dist < 130) {
                        bgCtx.strokeStyle = `rgba(0, 240, 255, ${0.25 * (1 - dist / 130)})`;
                        bgCtx.lineWidth = 0.8;
                        bgCtx.beginPath();
                        bgCtx.moveTo(p.x, p.y);
                        bgCtx.lineTo(p2.x, p2.y);
                        bgCtx.stroke();
                    }
                }
            });

            requestAnimationFrame(renderBgParticles);
        }

        renderBgParticles();
    }

    // ==========================================================================
    // 3. HERO TYPEWRITER EFFECT & CYBER DECK INTERACTIVITY
    // ==========================================================================
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

    // Global Cyber Deck Switcher & Vulnerability Scanner Trigger
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

    // ==========================================================================
    // 4. INTERACTIVE CLI TERMINAL ENGINE
    // ==========================================================================
    const termBody = document.getElementById('terminal-body');
    const termInput = document.getElementById('terminal-input');

    const commands = {
        'help': `Available Commands:
  - nmap <ip>  : Run real-time Nmap port scan (e.g. nmap -sV 192.168.1.1)
  - whoami     : Display developer bio & roles
  - netspyder  : Launch NetSpyder Network Audit App on smartphone
  - commandx   : Launch CommandX Linux cheat-sheet on smartphone
  - duotrack   : Launch DuoTrack GPS Radar App on smartphone
  - ecoaware   : Launch EcoAware AI Assistant App on smartphone
  - bhakti     : Launch Bhakti Sangeet Audio Player on smartphone
  - skills     : Print technical skills breakdown
  - projects   : List top featured repositories
  - contact    : Output contact information & links
  - clear      : Clear terminal screen`,

        'whoami': `Ishan Walia // Android & Flutter Developer & Cybersecurity Student
  GitHub  : https://github.com/ishan-walia
  YouTube : @hackwithishan
  Focus   : Secure mobile apps, network security tooling, and reverse engineering.`,

        'netspyder': `[NetSpyder App] - Network Security & Scanner
  Play Store  : https://play.google.com/store/apps/details?id=com.ishanwalia.netspyder
  Repository  : https://github.com/ishan-walia/NetSpyder-App
  Description : Mobile network auditor for inspecting active IP nodes, open ports, and device discovery.`,

        'batterywater': `[Battery Water App] - Hardware & Maintenance Monitor
  Play Store  : https://play.google.com/store/apps/details?id=com.ishan.batterywater
  Description : Native Kotlin app for monitoring battery water levels, voltage health metrics, and automated refill notifications.`,

        'duotrack': `[DuoTrack App] - Live GPS & Firebase Radar
  Repository  : https://github.com/ishan-walia
  Description : Real-time location tracking app with Firebase backend and active radar UI.`,

        'ecoaware': `[EcoAware AI] - GenAI Environmental App
  Repository  : https://github.com/ishan-walia
  Description : Cross-platform Flutter application providing AI waste sorting guidance.`,

        'bhakti': `[Bhakti Sangeet] - Devotional Audio Player
  Repository  : https://github.com/ishan-walia
  Description : Native Kotlin music player featuring offline audio playback and vinyl disk rotation.`,

        'skills': `[Tech Arsenal]
  Mobile      : Kotlin, Java, Flutter, Dart, Android SDK, Firebase, Google Maps
  Cybersec    : Network Scanning, Wireshark, Linux CLI, Nmap, Vulnerability Auditing
  Tools       : Git, GitHub, Python Scripting, REST APIs`,

        'projects': `[Featured GitHub Repositories]
  1. NetSpyder-App     (Security & Network Scanning)
  2. CommandX-App      (Linux Command Cheat-Sheet)
  3. DuoTrack-App      (GPS Location Sharing & Firebase)
  4. ecoaware-ai-app   (Generative AI & Flutter)
  5. Bhakti-Sangeet-App(Kotlin Devotional Audio Player)`,

        'contact': `[Get in Touch]
  Email    : waliaishanipshita@gmail.com
  GitHub   : https://github.com/ishan-walia
  LinkedIn : https://www.linkedin.com/in/ishanwalia
  YouTube  : https://www.youtube.com/@hackwithishan
  HTB      : https://profile.hackthebox.com/profile/019c3273-a41b-7338-9b6a-7c0cefb77111`,

        'htb': `[Hack The Box Profile]
  User     : Ishan Walia
  Profile  : https://profile.hackthebox.com/profile/019c3273-a41b-7338-9b6a-7c0cefb77111
  Focus    : Penetration Testing, Android Security & Network Exploitation`,

        'hackthebox': `[Hack The Box Profile]
  User     : Ishan Walia
  Profile  : https://profile.hackthebox.com/profile/019c3273-a41b-7338-9b6a-7c0cefb77111
  Focus    : Penetration Testing, Android Security & Network Exploitation`,

        'matrix': `[+] Matrix Protocol Initiated...
01001001 01010011 01001000 01000001 01001110 00100000 01010111 01000001 01001100 01001001 01000001
[+] Network status: OPTIMAL`,

        'sudo': `[!] Permission denied: User ishan is not in the sudoers file. This incident will be reported to @hackwithishan.`
    };

    function printTermOutput(cmdText, outputText, isError = false) {
        if (!termBody) return;

        if (cmdText) {
            const line = document.createElement('div');
            line.className = 'term-line';
            line.innerHTML = `<span class="term-prompt">ishan@cyber:~$</span> ${escapeHtml(cmdText)}`;
            termBody.appendChild(line);
        }

        if (outputText) {
            const outLine = document.createElement('div');
            outLine.className = `term-output ${isError ? 'error' : ''}`;
            outLine.textContent = outputText;
            termBody.appendChild(outLine);
        }

        termBody.scrollTop = termBody.scrollHeight;
    }

    function processCommand(rawInput) {
        const inputTrimmed = rawInput.trim();
        const cmdLower = inputTrimmed.toLowerCase();
        if (!cmdLower) return;

        if (cmdLower === 'clear') {
            termBody.innerHTML = `<div class="term-welcome">Terminal cleared. Type <span class="green">'help'</span> for commands.</div>`;
            return;
        }

        // Handle dynamic Nmap / Port Scan commands (e.g. "nmap -sV -sC 192.168.1.1", "nmap 10.0.0.55")
        if (cmdLower.startsWith('nmap')) {
            window.launchPhoneApp('netspyder');
            
            // Extract Target IP or prompt user for real IP input if none specified
            const parts = inputTrimmed.split(/\s+/);
            let targetIp = parts[parts.length - 1];
            if (!targetIp || targetIp.startsWith('-') || targetIp === 'nmap') {
                const userEnteredIp = prompt("Enter Target IP Address or Hostname to scan with NetSpyder Nmap:", "192.168.1.104");
                if (!userEnteredIp || !userEnteredIp.trim()) {
                    printTermOutput(inputTrimmed, "[!] Nmap Scan Cancelled: No Target IP address entered.", true);
                    return;
                }
                targetIp = userEnteredIp.trim();
            }

            const phoneStatus = document.getElementById('phone-scan-status');
            const phoneList = document.getElementById('phone-node-list');

            if (phoneStatus) phoneStatus.textContent = `Nmap Scanning Target ${targetIp}...`;

            printTermOutput(`nmap -sV -sC ${targetIp}`, `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toLocaleTimeString()}
Initiating SYN Stealth Scan against ${targetIp}
Scanning 1000 ports...`);

            setTimeout(() => {
                const scanReport = `Nmap scan report for ${targetIp}
Host is up (0.0024s latency).
Not shown: 996 closed tcp ports (reset)
PORT     STATE SERVICE       VERSION
22/tcp   open  ssh           OpenSSH 9.2p1 Debian
80/tcp   open  http          Nginx 1.24.0 (Ubuntu)
443/tcp  open  ssl/https     Nginx 1.24.0 (TLS v1.3)
8080/tcp open  http-proxy    Werkzeug 3.0.1 Python/3.11

MAC Address: 52:54:00:12:34:56 (QEMU Virtual NIC)
Device type: general purpose / linux
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

Nmap done: 1 IP address (1 host up) scanned in 1.42 seconds`;

                printTermOutput('', scanReport);

                // Update Smartphone App screen live with exact user-entered IP & open ports
                if (phoneStatus) phoneStatus.textContent = `Scan Complete for ${targetIp}!`;
                if (phoneList) {
                    phoneList.innerHTML = `
                        <div class="node-item"><i class="fa-solid fa-server green"></i> ${targetIp} (Target Node)</div>
                        <div class="node-item"><i class="fa-solid fa-lock green"></i> PORT 22 (SSH) • Open</div>
                        <div class="node-item"><i class="fa-solid fa-globe cyan"></i> PORT 80/443 (HTTP/SSL) • Open</div>
                        <div class="node-item"><i class="fa-solid fa-shield-halved purple"></i> PORT 8080 (Proxy) • Open</div>
                    `;
                }
            }, 800);
            return;
        }

        if (['netspyder', 'batterywater', 'duotrack', 'ecoaware', 'bhakti', 'home'].includes(cmdLower)) {
            window.launchPhoneApp(cmdLower);
        }

        if (commands[cmdLower]) {
            printTermOutput(inputTrimmed, commands[cmdLower]);
        } else {
            printTermOutput(inputTrimmed, `Command not found: '${cmdLower}'. Type 'help' for available commands.`, true);
        }
    }

    if (termInput) {
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                processCommand(termInput.value);
                termInput.value = '';
            }
        });
    }

    window.executeQuickCmd = function(cmdName) {
        processCommand(cmdName);
        if (termInput) termInput.focus();
    };

    window.triggerInteractiveNmapScan = function() {
        const inputIp = prompt("Enter Target IP Address or Hostname to scan with NetSpyder Nmap:", "192.168.1.104");
        if (inputIp !== null && inputIp.trim() !== '') {
            processCommand(`nmap -sV -sC ${inputIp.trim()}`);
        }
    };

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    // ==========================================================================
    // 5. PROJECT CATEGORY FILTERING
    // ==========================================================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterVal === 'all' || category.includes(filterVal)) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // 6. ANIMATED SKILL BARS ON SCROLL
    // ==========================================================================
    const skillSection = document.getElementById('skills');
    const skillFills = document.querySelectorAll('.skill-bar-fill');

    if (skillSection && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    skillFills.forEach(fill => {
                        const targetPct = fill.getAttribute('data-pct');
                        fill.style.width = targetPct;
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        observer.observe(skillSection);
    } else {
        skillFills.forEach(fill => {
            fill.style.width = fill.getAttribute('data-pct');
        });
    }

    // ==========================================================================
    // 7. CONTACT FORM SUBMISSION
    // ==========================================================================
    const contactForm = document.getElementById('portfolio-contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('form-name').value;
            alert(`Thank you ${name}! Your message has been sent successfully to Ishan Walia.`);
            contactForm.reset();
        });
    }

    // ==========================================================================
    // 8. NAVBAR SCROLL & MOBILE TOGGLE
    // ==========================================================================
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.getElementById('nav-links');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });

        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });
    }

    // ==========================================================================
    // 9. INTERACTIVE SMARTPHONE LAB APP SWITCHER
    // ==========================================================================
    window.launchPhoneApp = function(appName) {
        const views = document.querySelectorAll('.phone-view');
        const chips = document.querySelectorAll('.app-chip');
        
        views.forEach(v => v.classList.remove('active'));
        chips.forEach(c => c.classList.remove('active'));
        
        const targetView = document.getElementById(`phone-view-${appName}`);
        if (targetView) {
            targetView.classList.add('active');
        }
        
        chips.forEach(c => {
            const onclickAttr = c.getAttribute('onclick') || '';
            if (onclickAttr.includes(`'${appName}'`)) {
                c.classList.add('active');
            }
        });
    };

    window.toggleSimMusic = function() {
        const vinyl = document.getElementById('vinyl-disc');
        const playBtnIcon = document.querySelector('#music-play-btn i');
        if (vinyl && playBtnIcon) {
            if (vinyl.classList.contains('paused')) {
                vinyl.classList.remove('paused');
                playBtnIcon.className = 'fa-solid fa-pause';
            } else {
                vinyl.classList.add('paused');
                playBtnIcon.className = 'fa-solid fa-play';
            }
        }
    };

    // ==========================================================================
    // 10. REAL APK DOWNLOAD & MOBILE QR MODAL ENGINE
    // ==========================================================================
    window.openApkModal = function(appName, repoUrl, stackInfo, iconClass) {
        const modal = document.getElementById('apk-modal');
        const modalTitle = document.getElementById('modal-app-title');
        const modalStack = document.getElementById('modal-app-stack');
        const modalIcon = document.getElementById('modal-app-icon');
        const modalQrImg = document.getElementById('modal-qr-img');
        const modalApkBtn = document.getElementById('modal-apk-btn');
        const modalRepoBtn = document.getElementById('modal-repo-btn');

        if (modalTitle) modalTitle.textContent = appName;
        if (modalStack) modalStack.textContent = stackInfo || 'Kotlin / Flutter Native';
        if (modalIcon && iconClass) {
            modalIcon.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
        }

        // Direct GitHub Releases URL
        const releaseUrl = `${repoUrl}/releases`;
        if (modalApkBtn) modalApkBtn.href = releaseUrl;
        if (modalRepoBtn) modalRepoBtn.href = repoUrl;

        // Generate Live Mobile QR Code URL
        if (modalQrImg) {
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(releaseUrl)}`;
            modalQrImg.src = qrApiUrl;
        }

        if (modal) modal.classList.add('active');
    };

    window.closeApkModal = function() {
        const modal = document.getElementById('apk-modal');
        if (modal) modal.classList.remove('active');
    };

    window.openContactModal = function() {
        const modal = document.getElementById('contact-modal');
        if (modal) modal.classList.add('active');
    };

    window.closeContactModal = function() {
        const modal = document.getElementById('contact-modal');
        if (modal) modal.classList.remove('active');
    };

    // ==========================================================================
    // 11. INTERACTIVE CODE COMPILER & PLAYGROUND ENGINE
    // ==========================================================================
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

    let currentCompilerLang = 'kotlin';

    window.switchCompilerLang = function(langKey) {
        if (!compilerTemplates[langKey]) return;
        currentCompilerLang = langKey;

        const tabs = document.querySelectorAll('.compiler-tab');
        tabs.forEach(t => t.classList.remove('active'));

        const activeTab = document.getElementById(`tab-lang-${langKey}`);
        if (activeTab) activeTab.classList.add('active');

        const fileName = document.getElementById('compiler-file-name');
        const textarea = document.getElementById('compiler-code-input');
        const statusBadge = document.getElementById('compiler-status-badge');

        const tpl = compilerTemplates[langKey];

        if (fileName) fileName.innerHTML = `<i class="fa-solid fa-code"></i> ${tpl.fileName}`;
        if (textarea) textarea.value = tpl.code;
        if (statusBadge) {
            statusBadge.textContent = "READY";
            statusBadge.className = "box-badge cyan";
        }

        updateLineNums();
        window.clearCompilerOutput();
    };

    function updateLineNums() {
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
        const tpl = compilerTemplates[currentCompilerLang];

        if (!consoleBody) return;

        if (statusBadge) {
            statusBadge.textContent = "COMPILING...";
            statusBadge.className = "box-badge yellow";
        }

        consoleBody.innerHTML = `<div class="console-line info">[⚡] Initializing ${currentCompilerLang.toUpperCase()} Compiler Engine...</div>`;

        setTimeout(() => {
            if (statusBadge) {
                statusBadge.textContent = "EXECUTING";
                statusBadge.className = "box-badge cyan";
            }
            
            let outputHtml = `<div class="console-line info">[⚡] Initializing ${currentCompilerLang.toUpperCase()} Compiler Engine...</div>`;
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
        }, 350);
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

    const textareaElem = document.getElementById('compiler-code-input');
    if (textareaElem) {
        textareaElem.addEventListener('input', updateLineNums);
    }

    // ==========================================================================
    // PRO-LEVEL ULTIMATE CYBER SPIDER NEURAL WEB CANVAS ENGINE (#bg-canvas)
    // Features:
    // 1. Hero Radial Spider Web Radar Grid (12 Radial Spokes + 5 Concentric Web Rings)
    // 2. Giant Animated Cyber Spider + Interactive Cursor Master Spider
    // 3. Dynamic Magnetic Web Ring Deformation on Mouse Move
    // 4. Energy Shockwaves on Click & Electric Data Pulses on Spokes
    // 5. Autonomous Mini Cyber Spiders Crawling & Spinning Silk Threads
    // 6. Ambient Matrix Rain & Floating Neon Sparks
    // ==========================================================================
    function initBackgroundCyberCanvas() {
        const bgCanvas = document.getElementById('bg-canvas');
        if (!bgCanvas) return;

        const ctx = bgCanvas.getContext('2d');
        let width = bgCanvas.width = window.innerWidth;
        let height = bgCanvas.height = window.innerHeight;

        let mouse = {
            x: width / 2,
            y: height / 2,
            targetX: width / 2,
            targetY: height / 2,
            isHovered: false
        };

        window.addEventListener('mousemove', (e) => {
            mouse.targetX = e.clientX;
            mouse.targetY = e.clientY;
            mouse.isHovered = true;
        });

        window.addEventListener('mouseleave', () => {
            mouse.isHovered = false;
        });

        // Energy Shockwaves on Click
        let shockwaves = [];
        window.addEventListener('click', (e) => {
            shockwaves.push({
                x: e.clientX,
                y: e.clientY,
                radius: 10,
                maxRadius: 280,
                alpha: 1.0,
                color: Math.random() > 0.5 ? '#00ff9d' : '#00f0ff'
            });
        });

        window.addEventListener('resize', () => {
            width = bgCanvas.width = window.innerWidth;
            height = bgCanvas.height = window.innerHeight;
            initWebNodes();
            initSpiders();
        });

        // 1. Matrix Digital Rain drops
        const characters = '01010101XYZ@#$%&*+<>~[]{}';
        const fontSize = 13;
        const columns = Math.floor(width / fontSize);
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

        // 2. Web Network Energy Nodes
        let nodes = [];
        const nodeCount = Math.min(60, Math.floor((width * height) / 20000));

        function initWebNodes() {
            nodes = [];
            for (let i = 0; i < nodeCount; i++) {
                nodes.push({
                    x: Math.random() * width,
                    y: Math.random() * height,
                    vx: (Math.random() - 0.5) * 0.9,
                    vy: (Math.random() - 0.5) * 0.9,
                    radius: 2 + Math.random() * 2.5,
                    pulse: Math.random() * Math.PI * 2,
                    color: Math.random() > 0.4 ? '#00ff9d' : '#00f0ff'
                });
            }
        }
        initWebNodes();

        // 3. Electric Data Pulses traveling along Web Spokes
        let pulses = [];
        function createPulse(startX, startY, targetX, targetY, color) {
            pulses.push({
                x: startX,
                y: startY,
                startX: startX,
                startY: startY,
                targetX: targetX,
                targetY: targetY,
                progress: 0,
                speed: 0.02 + Math.random() * 0.03,
                color: color || (Math.random() > 0.5 ? '#00ff9d' : '#00f0ff')
            });
        }

        // 4. Sparks
        let sparks = [];
        function emitSparks(x, y, color) {
            for (let i = 0; i < 5; i++) {
                sparks.push({
                    x: x,
                    y: y,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    life: 1.0,
                    decay: 0.025 + Math.random() * 0.03,
                    color: color
                });
            }
        }

        // 5. Autonomous Mini Cyber Spiders
        let spiders = [];
        const spiderCount = Math.min(10, Math.floor(width / 150));

        function createSpider(id) {
            const startNodeIdx = Math.floor(Math.random() * nodes.length);
            const startNode = nodes[startNodeIdx] || { x: width / 2, y: height / 2 };
            return {
                id: id,
                x: startNode.x,
                y: startNode.y,
                currentNodeIdx: startNodeIdx,
                targetNodeIdx: startNodeIdx,
                progress: 1,
                speed: 0.018 + Math.random() * 0.02,
                size: 7 + Math.random() * 5,
                color: Math.random() > 0.35 ? '#00ff9d' : '#00f0ff',
                lastMoveTime: Date.now() + Math.random() * 1500,
                moveInterval: 700 + Math.random() * 1600,
                angle: Math.random() * Math.PI * 2,
                silkTrail: []
            };
        }

        function initSpiders() {
            spiders = [];
            for (let i = 0; i < spiderCount; i++) {
                spiders.push(createSpider(i));
            }
        }
        initSpiders();

        function selectNextSpiderDestination(spider) {
            if (nodes.length === 0) return;
            let current = nodes[spider.currentNodeIdx];
            if (!current) {
                spider.currentNodeIdx = Math.floor(Math.random() * nodes.length);
                current = nodes[spider.currentNodeIdx];
            }

            let candidates = [];
            for (let i = 0; i < nodes.length; i++) {
                if (i === spider.currentNodeIdx) continue;
                let dx = nodes[i].x - current.x;
                let dy = nodes[i].y - current.y;
                let dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 230) {
                    candidates.push({ index: i, dist: dist });
                }
            }

            let nextIdx = spider.currentNodeIdx;
            if (candidates.length > 0) {
                let chosen = candidates[Math.floor(Math.random() * candidates.length)];
                nextIdx = chosen.index;
            } else {
                nextIdx = Math.floor(Math.random() * nodes.length);
            }

            spider.targetNodeIdx = nextIdx;
            spider.progress = 0;
            let targetNode = nodes[nextIdx];
            spider.angle = Math.atan2(targetNode.y - current.y, targetNode.x - current.x);

            spider.silkTrail.push({ x: current.x, y: current.y, alpha: 0.9 });
            if (spider.silkTrail.length > 6) spider.silkTrail.shift();

            if (Math.random() > 0.3) {
                createPulse(current.x, current.y, targetNode.x, targetNode.y);
            }
        }

        // Giant Cyber Spider roaming in center background
        let giantSpider = {
            x: width * 0.85,
            y: height * 0.25,
            targetX: width * 0.85,
            targetY: height * 0.25,
            angle: 0,
            size: 28,
            lastJump: Date.now()
        };

        // Master Animation Loop
        function renderCyberWeb() {
            mouse.x += (mouse.targetX - mouse.x) * 0.12;
            mouse.y += (mouse.targetY - mouse.y) * 0.12;

            ctx.clearRect(0, 0, width, height);

            // A. Matrix Code Rain (Background)
            ctx.fillStyle = 'rgba(0, 255, 157, 0.18)';
            ctx.font = fontSize + 'px monospace';
            for (let i = 0; i < drops.length; i++) {
                const char = characters.charAt(Math.floor(Math.random() * characters.length));
                ctx.fillText(char, i * fontSize, drops[i] * fontSize);
                if (drops[i] * fontSize > height && Math.random() > 0.98) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            // B. Radial Concentric Spider Web Grid Centered on Screen / Mouse
            const webCenterX = width / 2;
            const webCenterY = height * 0.45;
            const radialSpokes = 12;
            const ringCount = 5;
            const maxRadius = Math.max(width, height) * 0.55;

            ctx.shadowBlur = 0;
            ctx.lineWidth = 1.0;

            // Draw Radial Spokes
            for (let i = 0; i < radialSpokes; i++) {
                const angle = (i / radialSpokes) * Math.PI * 2;
                const endX = webCenterX + Math.cos(angle) * maxRadius;
                const endY = webCenterY + Math.sin(angle) * maxRadius;

                // Deform spokes towards mouse
                const midX = (webCenterX + endX) / 2;
                const midY = (webCenterY + endY) / 2;
                const distToMouse = Math.sqrt(Math.pow(mouse.x - midX, 2) + Math.pow(mouse.y - midY, 2));

                let alpha = 0.22;
                if (distToMouse < 160) {
                    alpha = 0.65;
                    ctx.strokeStyle = `rgba(0, 255, 157, ${alpha})`;
                    ctx.lineWidth = 1.6;
                } else {
                    ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                    ctx.lineWidth = 1.0;
                }

                ctx.beginPath();
                ctx.moveTo(webCenterX, webCenterY);
                ctx.lineTo(endX, endY);
                ctx.stroke();
            }

            // Draw Concentric Rings
            for (let r = 1; r <= ringCount; r++) {
                const ringRadius = (r / ringCount) * maxRadius;
                ctx.beginPath();

                for (let i = 0; i <= radialSpokes; i++) {
                    const angle = (i / radialSpokes) * Math.PI * 2;
                    let rx = webCenterX + Math.cos(angle) * ringRadius;
                    let ry = webCenterY + Math.sin(angle) * ringRadius;

                    // Mouse pull effect on web rings
                    let mdx = mouse.x - rx;
                    let mdy = mouse.y - ry;
                    let mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                    if (mdist < 140) {
                        let pull = (140 - mdist) * 0.25;
                        rx += (mdx / mdist) * pull;
                        ry += (mdy / mdist) * pull;
                    }

                    if (i === 0) ctx.moveTo(rx, ry);
                    else ctx.lineTo(rx, ry);
                }

                const ringDistToMouse = Math.abs(Math.sqrt(Math.pow(mouse.x - webCenterX, 2) + Math.pow(mouse.y - webCenterY, 2)) - ringRadius);
                let ringAlpha = 0.25;
                if (ringDistToMouse < 80) {
                    ringAlpha = 0.7;
                    ctx.strokeStyle = `rgba(0, 255, 157, ${ringAlpha})`;
                    ctx.lineWidth = 1.5;
                } else {
                    ctx.strokeStyle = `rgba(0, 240, 255, ${ringAlpha})`;
                    ctx.lineWidth = 0.9;
                }
                ctx.stroke();
            }

            // C. Energy Nodes & Constellation Strands
            for (let i = 0; i < nodes.length; i++) {
                let n = nodes[i];
                n.x += n.vx;
                n.y += n.vy;

                if (n.x < 0 || n.x > width) n.vx *= -1;
                if (n.y < 0 || n.y > height) n.vy *= -1;

                let mdx = mouse.x - n.x;
                let mdy = mouse.y - n.y;
                let mdist = Math.sqrt(mdx * mdx + mdy * mdy);
                if (mdist < 140) {
                    let force = (140 - mdist) / 140;
                    n.x -= (mdx / mdist) * force * 1.5;
                    n.y -= (mdy / mdist) * force * 1.5;
                }

                n.pulse += 0.04;
                let currentRadius = n.radius + Math.sin(n.pulse) * 0.8;
                ctx.shadowColor = n.color;
                ctx.shadowBlur = 10;
                ctx.fillStyle = n.color;
                ctx.beginPath();
                ctx.arc(n.x, n.y, Math.max(1.5, currentRadius), 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;

            // Inter-Node Strands
            const maxWebDist = 175;
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    let dx = nodes[i].x - nodes[j].x;
                    let dy = nodes[i].y - nodes[j].y;
                    let dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < maxWebDist) {
                        let alpha = (1 - dist / maxWebDist) * 0.55;
                        let midX = (nodes[i].x + nodes[j].x) / 2;
                        let midY = (nodes[i].y + nodes[j].y) / 2;
                        let distToMouse = Math.sqrt(Math.pow(mouse.x - midX, 2) + Math.pow(mouse.y - midY, 2));

                        if (distToMouse < 110) {
                            alpha += (1 - distToMouse / 110) * 0.45;
                            ctx.strokeStyle = `rgba(0, 255, 157, ${Math.min(1.0, alpha)})`;
                            ctx.lineWidth = 1.5;
                        } else {
                            ctx.strokeStyle = `rgba(0, 240, 255, ${alpha})`;
                            ctx.lineWidth = 1.0;
                        }

                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.stroke();
                    }
                }
            }

            // D. Cursor Cyber Spider & Laser Web Tethers
            let connectedCount = 0;
            for (let i = 0; i < nodes.length; i++) {
                let dx = mouse.x - nodes[i].x;
                let dy = mouse.y - nodes[i].y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 200) {
                    let tetherAlpha = (1 - dist / 200) * 0.85;
                    ctx.shadowColor = '#00ff9d';
                    ctx.shadowBlur = 12;
                    ctx.strokeStyle = `rgba(0, 255, 157, ${tetherAlpha})`;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(mouse.x, mouse.y);

                    let ctrlX = (mouse.x + nodes[i].x) / 2 + Math.sin(Date.now() * 0.003 + i) * 16;
                    let ctrlY = (mouse.y + nodes[i].y) / 2 + Math.cos(Date.now() * 0.003 + i) * 16;
                    ctx.quadraticCurveTo(ctrlX, ctrlY, nodes[i].x, nodes[i].y);
                    ctx.stroke();

                    connectedCount++;
                    if (connectedCount % 3 === 0 && Math.random() > 0.88) {
                        emitSparks(nodes[i].x, nodes[i].y, '#00ff9d');
                    }
                }
            }
            ctx.shadowBlur = 0;

            // Draw Master Cursor Spider
            drawMasterCursorSpider(ctx, mouse.x, mouse.y);

            // E. Draw Giant Cyber Spider
            const now = Date.now();
            if (now - giantSpider.lastJump > 3000) {
                giantSpider.targetX = Math.random() * (width * 0.7) + width * 0.15;
                giantSpider.targetY = Math.random() * (height * 0.5) + height * 0.15;
                giantSpider.lastJump = now;
                createPulse(giantSpider.x, giantSpider.y, giantSpider.targetX, giantSpider.targetY, '#00f0ff');
            }
            giantSpider.x += (giantSpider.targetX - giantSpider.x) * 0.04;
            giantSpider.y += (giantSpider.targetY - giantSpider.y) * 0.04;
            giantSpider.angle = Math.atan2(giantSpider.targetY - giantSpider.y, giantSpider.targetX - giantSpider.x);
            drawGiantCyberSpider(ctx, giantSpider.x, giantSpider.y, giantSpider.angle, giantSpider.size);

            // F. Shockwaves
            for (let swIdx = shockwaves.length - 1; swIdx >= 0; swIdx--) {
                let sw = shockwaves[swIdx];
                sw.radius += 8;
                sw.alpha -= 0.025;
                if (sw.alpha <= 0 || sw.radius >= sw.maxRadius) {
                    shockwaves.splice(swIdx, 1);
                    continue;
                }

                ctx.shadowColor = sw.color;
                ctx.shadowBlur = 15;
                ctx.strokeStyle = sw.color;
                ctx.globalAlpha = sw.alpha;
                ctx.lineWidth = 2.5;
                ctx.beginPath();
                ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
                ctx.stroke();
                ctx.globalAlpha = 1.0;
            }
            ctx.shadowBlur = 0;

            // G. Electric Data Pulses Animation
            for (let pIdx = pulses.length - 1; pIdx >= 0; pIdx--) {
                let p = pulses[pIdx];
                p.progress += p.speed;
                if (p.progress >= 1) {
                    pulses.splice(pIdx, 1);
                    continue;
                }

                p.x = (1 - p.progress) * p.startX + p.progress * p.targetX;
                p.y = (1 - p.progress) * p.startY + p.progress * p.targetY;

                ctx.shadowColor = p.color;
                ctx.shadowBlur = 12;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, 3.5, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.shadowBlur = 0;

            // H. Sparks Animation
            for (let sIdx = sparks.length - 1; sIdx >= 0; sIdx--) {
                let sp = sparks[sIdx];
                sp.x += sp.vx;
                sp.y += sp.vy;
                sp.life -= sp.decay;

                if (sp.life <= 0) {
                    sparks.splice(sIdx, 1);
                    continue;
                }

                ctx.fillStyle = `rgba(0, 255, 157, ${sp.life})`;
                ctx.beginPath();
                ctx.arc(sp.x, sp.y, 1.8, 0, Math.PI * 2);
                ctx.fill();
            }

            // I. Update & Render Autonomous Mini Cyber Crawlers
            spiders.forEach((s) => {
                let fromNode = nodes[s.currentNodeIdx];
                let toNode = nodes[s.targetNodeIdx];

                if (!fromNode || !toNode) {
                    s.currentNodeIdx = 0;
                    s.targetNodeIdx = 0;
                    fromNode = nodes[0] || { x: width / 2, y: height / 2 };
                    toNode = nodes[0] || { x: width / 2, y: height / 2 };
                }

                if (now - s.lastMoveTime > s.moveInterval && s.progress >= 1) {
                    selectNextSpiderDestination(s);
                    s.lastMoveTime = now;
                    s.moveInterval = 800 + Math.random() * 1800;
                }

                if (s.progress < 1) {
                    s.progress += s.speed;
                    if (s.progress >= 1) {
                        s.progress = 1;
                        s.currentNodeIdx = s.targetNodeIdx;
                        s.x = toNode.x;
                        s.y = toNode.y;
                    } else {
                        let t = s.progress;
                        s.x = (1 - t) * fromNode.x + t * toNode.x;
                        let arcHeight = Math.sin(t * Math.PI) * 22;
                        s.y = (1 - t) * fromNode.y + t * toNode.y - arcHeight;
                    }
                }

                for (let k = 0; k < s.silkTrail.length; k++) {
                    let st = s.silkTrail[k];
                    st.alpha -= 0.005;
                    if (st.alpha > 0) {
                        ctx.strokeStyle = `rgba(0, 255, 157, ${st.alpha * 0.45})`;
                        ctx.lineWidth = 0.9;
                        ctx.beginPath();
                        ctx.moveTo(s.x, s.y);
                        ctx.lineTo(st.x, st.y);
                        ctx.stroke();
                    }
                }

                drawMiniCyberSpider(ctx, s.x, s.y, s.angle, s.size, s.color, s.progress);
            });

            requestAnimationFrame(renderCyberWeb);
        }

        // Draw Master Cursor Spider
        function drawMasterCursorSpider(ctx, cx, cy) {
            ctx.save();
            ctx.translate(cx, cy);

            const sz = 13;
            const time = Date.now() * 0.008;

            ctx.shadowColor = '#00ff9d';
            ctx.shadowBlur = 20;

            ctx.fillStyle = '#00ff9d';
            ctx.beginPath();
            ctx.ellipse(0, 4, sz * 0.5, sz * 0.75, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#00f0ff';
            ctx.beginPath();
            ctx.arc(0, -sz * 0.4, sz * 0.35, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowColor = '#ff0055';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#ff0055';
            ctx.beginPath();
            ctx.arc(-sz * 0.2, -sz * 0.5, sz * 0.14, 0, Math.PI * 2);
            ctx.arc(sz * 0.2, -sz * 0.5, sz * 0.14, 0, Math.PI * 2);
            ctx.arc(0, -sz * 0.65, sz * 0.1, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowColor = '#00ff9d';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = '#00ff9d';
            ctx.lineWidth = 2.0;

            for (let side = -1; side <= 1; side += 2) {
                for (let i = 0; i < 4; i++) {
                    let legWiggle = Math.sin(time + i * 0.8) * 3.5;
                    let yOffset = -sz * 0.3 + i * sz * 0.35;

                    ctx.beginPath();
                    ctx.moveTo(side * sz * 0.3, yOffset);
                    ctx.lineTo(side * (sz * 1.3 + legWiggle), yOffset - sz * 0.3);
                    ctx.lineTo(side * (sz * 2.1 + legWiggle), yOffset + sz * 0.4);
                    ctx.stroke();
                }
            }

            ctx.restore();
        }

        // Draw Giant Cyber Spider
        function drawGiantCyberSpider(ctx, cx, cy, angle, sz) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle + Math.PI / 2);

            const time = Date.now() * 0.005;

            // Ambient Glow
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 24;

            // Abdomen Shell
            ctx.fillStyle = '#0a101d';
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.ellipse(0, 6, sz * 0.55, sz * 0.8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Core Energy Emblem
            ctx.fillStyle = '#00ff9d';
            ctx.beginPath();
            ctx.arc(0, 6, sz * 0.2, 0, Math.PI * 2);
            ctx.fill();

            // Cephalothorax Head
            ctx.fillStyle = '#0d1527';
            ctx.strokeStyle = '#00ff9d';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, -sz * 0.45, sz * 0.4, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Eyes
            ctx.shadowColor = '#ff0055';
            ctx.shadowBlur = 14;
            ctx.fillStyle = '#ff0055';
            ctx.beginPath();
            ctx.arc(-sz * 0.2, -sz * 0.55, sz * 0.12, 0, Math.PI * 2);
            ctx.arc(sz * 0.2, -sz * 0.55, sz * 0.12, 0, Math.PI * 2);
            ctx.fill();

            // 8 Jointed Cyber Legs
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 10;
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2.2;

            for (let side = -1; side <= 1; side += 2) {
                for (let i = 0; i < 4; i++) {
                    let legWiggle = Math.sin(time + i * 0.7) * 4;
                    let yOffset = -sz * 0.3 + i * sz * 0.35;

                    ctx.beginPath();
                    ctx.moveTo(side * sz * 0.35, yOffset);
                    ctx.lineTo(side * (sz * 1.4 + legWiggle), yOffset - sz * 0.4);
                    ctx.lineTo(side * (sz * 2.3 + legWiggle), yOffset + sz * 0.5);
                    ctx.stroke();
                }
            }

            ctx.restore();
        }

        // Draw Autonomous Mini Cyber Spider
        function drawMiniCyberSpider(ctx, cx, cy, angle, sz, color, progress) {
            ctx.save();
            ctx.translate(cx, cy);
            ctx.rotate(angle + Math.PI / 2);

            const isJumping = progress < 1;
            const legWiggle = isJumping ? Math.sin(progress * Math.PI * 6) * 4 : Math.sin(Date.now() * 0.015) * 2;

            ctx.shadowColor = color;
            ctx.shadowBlur = 12;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.ellipse(0, 3, sz * 0.5, sz * 0.7, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#ff0055';
            ctx.beginPath();
            ctx.arc(-sz * 0.25, -sz * 0.4, sz * 0.15, 0, Math.PI * 2);
            ctx.arc(sz * 0.25, -sz * 0.4, sz * 0.15, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            ctx.strokeStyle = color;
            ctx.lineWidth = 1.6;

            for (let side = -1; side <= 1; side += 2) {
                for (let i = 0; i < 4; i++) {
                    const shift = (i % 2 === 0 ? 1 : -1) * legWiggle;

                    ctx.beginPath();
                    ctx.moveTo(side * sz * 0.3, -sz * 0.2 + i * sz * 0.3);
                    ctx.lineTo(side * (sz * 1.2 + shift), -sz * 0.4 + i * sz * 0.35);
                    ctx.lineTo(side * (sz * 1.8 + shift), sz * 0.3 + i * sz * 0.2);
                    ctx.stroke();
                }
            }

            ctx.restore();
        }

        renderCyberWeb();
    }

    initBackgroundCyberCanvas();

});

