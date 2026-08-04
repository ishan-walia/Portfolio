/* ==========================================================================
   INTERACTIVE SMARTPHONE APP LAB SWITCHER & PLAYER LOGIC
   ========================================================================== */

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
