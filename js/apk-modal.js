/* ==========================================================================
   REAL APK DOWNLOAD, CONTACT & APP SCREENSHOT GALLERY MODALS
   ========================================================================== */

let currentGalleryImages = [];
let currentGalleryIdx = 0;

window.openDemoGallery = function(appName, imagesArray, startIndex = 0) {
    if (!imagesArray || imagesArray.length === 0) return;
    currentGalleryImages = imagesArray;
    currentGalleryIdx = startIndex || 0;

    const modal = document.getElementById('demo-gallery-modal');
    const titleElem = document.getElementById('gallery-app-title');

    if (titleElem) titleElem.textContent = `${appName} Screenshots`;

    updateGalleryUI();
    if (modal) modal.classList.add('active');
};

window.closeDemoGallery = function() {
    const modal = document.getElementById('demo-gallery-modal');
    if (modal) modal.classList.remove('active');
};

function updateGalleryUI() {
    const mainImg = document.getElementById('gallery-main-img');
    const counterElem = document.getElementById('gallery-counter');
    const thumbsStrip = document.getElementById('gallery-thumbs');

    if (mainImg) {
        mainImg.src = currentGalleryImages[currentGalleryIdx];
    }
    if (counterElem) {
        counterElem.textContent = `Screenshot ${currentGalleryIdx + 1} of ${currentGalleryImages.length}`;
    }

    if (thumbsStrip) {
        thumbsStrip.innerHTML = '';
        currentGalleryImages.forEach((imgUrl, index) => {
            const thumb = document.createElement('img');
            thumb.src = imgUrl;
            thumb.className = `gallery-thumb-item ${index === currentGalleryIdx ? 'active' : ''}`;
            thumb.onclick = () => {
                currentGalleryIdx = index;
                updateGalleryUI();
            };
            thumbsStrip.appendChild(thumb);
        });
    }
}

window.prevGalleryImage = function() {
    if (currentGalleryImages.length === 0) return;
    currentGalleryIdx = (currentGalleryIdx - 1 + currentGalleryImages.length) % currentGalleryImages.length;
    updateGalleryUI();
};

window.nextGalleryImage = function() {
    if (currentGalleryImages.length === 0) return;
    currentGalleryIdx = (currentGalleryIdx + 1) % currentGalleryImages.length;
    updateGalleryUI();
};

// Keyboard Arrow Navigation for Gallery Modal
window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('demo-gallery-modal');
    if (modal && modal.classList.contains('active')) {
        if (e.key === 'ArrowLeft') window.prevGalleryImage();
        if (e.key === 'ArrowRight') window.nextGalleryImage();
        if (e.key === 'Escape') window.closeDemoGallery();
    }
});

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

    const releaseUrl = `${repoUrl}/releases`;
    if (modalApkBtn) modalApkBtn.href = releaseUrl;
    if (modalRepoBtn) modalRepoBtn.href = repoUrl;

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
