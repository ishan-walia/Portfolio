/* ==========================================================================
   CYBER-SPIDER SPLASH CANVAS & ANIMATION ENGINE (ULTRA-REALISTIC EDITION)
   ========================================================================== */

let splashAnimId = null;
let isSplashActive = true;
let statusInterval = null;

let splashAudio = null;
let isAudioPlaying = false;

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
    }
}

window.playSplashVoiceover = function() {
    initSplashAudio();
    if (isAudioPlaying) return;

    splashAudio.currentTime = 0;
    const playPromise = splashAudio.play();

    if (playPromise !== undefined) {
        playPromise.then(() => {
            isAudioPlaying = true;
        }).catch(err => {
            console.warn("Autoplay policy restricted audio playback:", err);
        });
    }
};

// Global dismiss fallback function
window.dismissSplash = function() {
    if (splashAudio) {
        splashAudio.pause();
        splashAudio.currentTime = 0;
    }
    if (!isSplashActive) {
        const splashElem = document.getElementById('splash-screen');
        if (splashElem) splashElem.style.display = 'none';
        return;
    }
    isSplashActive = false;

    if (statusInterval) clearInterval(statusInterval);
    if (splashAnimId) cancelAnimationFrame(splashAnimId);

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

function initSplashEngine() {
    const splashCanvas = document.getElementById('splash-canvas');
    const splashStatus = document.getElementById('splash-status-text');
    const skipBtn = document.getElementById('skip-splash-btn');

    // Autoplay audio on splash init
    window.playSplashVoiceover();

    const playOnGesture = () => {
        if (isSplashActive && splashAudio && splashAudio.paused) {
            splashAudio.play().catch(() => {});
        }
    };
    window.addEventListener('click', playOnGesture, { once: true });
    window.addEventListener('touchstart', playOnGesture, { once: true });
    window.addEventListener('keydown', playOnGesture, { once: true });

    if (skipBtn) {
        skipBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            window.dismissSplash();
        });
    }

    // Keyboard shortcut listener (Space, Enter, Escape)
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
    }, 900);

    if (splashCanvas) {
        const ctx = splashCanvas.getContext('2d');
        let width = splashCanvas.width = window.innerWidth;
        let height = splashCanvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = splashCanvas.width = window.innerWidth;
            height = splashCanvas.height = window.innerHeight;
            generateBuildings();
        });

        const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*+<>~[]{}';
        const fontSize = 14;
        const columns = Math.floor(width / fontSize);
        const drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100;
        }

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

            // Matrix Digital Rain
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

            // Draw Realistic Buildings & Top Aviation Warning Beacon Lights
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

            // Spider Leap Physics Logic
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

            // Draw Ultra-Realistic Jointed Cyber Spider
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

            // 1. Abdomen / Opisthosoma (Rear Cyber Shell)
            ctx.save();
            ctx.shadowColor = '#00ff9d';
            ctx.shadowBlur = 22;

            // Metallic Body Gradient
            const abdGrad = ctx.createRadialGradient(0, 8, 2, 0, 8, 14);
            abdGrad.addColorStop(0, '#00ff9d');
            abdGrad.addColorStop(0.6, '#005c3b');
            abdGrad.addColorStop(1, '#021a11');
            ctx.fillStyle = abdGrad;

            ctx.beginPath();
            ctx.ellipse(0, 10, 11, 15, 0, 0, Math.PI * 2);
            ctx.fill();

            // Cyber Circuit Markings on Abdomen
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

            // 2. Cephalothorax (Head & Midsection)
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

            // 3. Arachnid Eyes (8 Glowing Red/Cyan Lenses)
            // 2 Main Central Lenses
            ctx.fillStyle = '#ff3366';
            ctx.shadowColor = '#ff3366';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.arc(-3, -8, 2.2, 0, Math.PI * 2);
            ctx.arc(3, -8, 2.2, 0, Math.PI * 2);
            ctx.fill();

            // 6 Surrounding Lateral Eyes
            ctx.fillStyle = '#00ff9d';
            ctx.shadowColor = '#00ff9d';
            ctx.beginPath();
            ctx.arc(-6, -7, 1.2, 0, Math.PI * 2);
            ctx.arc(6, -7, 1.2, 0, Math.PI * 2);
            ctx.arc(-5, -10, 1.2, 0, Math.PI * 2);
            ctx.arc(5, -10, 1.2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;

            // 4. Cyber Fangs / Chelicerae
            ctx.strokeStyle = '#00f0ff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-3, -11);
            ctx.lineTo(-4, -16);
            ctx.moveTo(3, -11);
            ctx.lineTo(4, -16);
            ctx.stroke();

            // 5. 8 Articulated 3-Segment Jointed Spider Legs
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

            // Draw Left Legs
            legConfigsLeft.forEach((config, idx) => {
                const shift = (idx % 2 === 0 ? 1 : -1) * legWalkOffset;
                ctx.strokeStyle = idx % 2 === 0 ? '#00ff9d' : '#00f0ff';
                ctx.beginPath();
                ctx.moveTo(-4, -2 + idx * 4); // Root joint on body
                ctx.lineTo(config.kx + shift, config.ky + shift * 0.5); // Knee joint
                ctx.lineTo(config.tx + shift * 1.5, config.ty); // Foot tip
                ctx.stroke();

                // Joint Knuckle Glow
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(config.kx + shift - 1, config.ky + shift * 0.5 - 1, 2.5, 2.5);
            });

            // Draw Right Legs
            legConfigsRight.forEach((config, idx) => {
                const shift = (idx % 2 === 0 ? -1 : 1) * legWalkOffset;
                ctx.strokeStyle = idx % 2 === 0 ? '#00ff9d' : '#00f0ff';
                ctx.beginPath();
                ctx.moveTo(4, -2 + idx * 4); // Root joint on body
                ctx.lineTo(config.kx + shift, config.ky + shift * 0.5); // Knee joint
                ctx.lineTo(config.tx + shift * 1.5, config.ty); // Foot tip
                ctx.stroke();

                // Joint Knuckle Glow
                ctx.fillStyle = '#ffffff';
                ctx.fillRect(config.kx + shift - 1, config.ky + shift * 0.5 - 1, 2.5, 2.5);
            });

            ctx.restore();
        }

        drawSplash();
    }
}
