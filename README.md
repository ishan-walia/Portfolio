# Ishan Walia // Personal Portfolio Codebase Architecture

Welcome to your official personal developer portfolio codebase! All code has been structured cleanly into modular stylesheets and JavaScript files so you can easily edit any section or feature.

---

## 📁 Directory Structure & File Map

```
e:\portfolio\
├── index.html                   ← Main HTML5 Entrypoint (Semantic Sections)
├── style.css                    ← Master CSS stylesheet
├── script.js                    ← Master JavaScript engine
├── README.md                    ← Architecture Guide
│
├── css/                         ← Modular Stylesheets
│   ├── variables.css            ← Design System Colors (Neon Green #00ff9d, Cyber Cyan, Typography)
│   ├── splash.css               ← Cyber-Spider Splash Screen & Buildings CSS
│   ├── navbar.css               ← Navigation Bar & Mobile Glass Drawer
│   ├── hero.css                 ← Hero Section & Profile Card Styles
│   ├── simulator.css            ← Interactive 3D Smartphone Device Frame & Apps CSS
│   ├── terminal.css             ← Cybersecurity CLI Sandbox Styles
│   ├── projects.css             ← Featured Projects Grid & Tech Badges
│   ├── skills.css               ← Technical Arsenal Skills Matrix
│   ├── contact.css              ← Contact Info & Form Card
│   └── modal.css                ← Real APK Download & Mobile QR Code Modal
│
└── js/                          ← Modular JavaScript Files
    ├── splash.js                ← Cyber-Spider Canvas Engine, Matrix Rain, Skip/Dismiss logic
    ├── bg-particles.js          ← Ambient Node Connection Background Canvas
    ├── typewriter.js            ← Hero Roles Typewriter Effect
    ├── simulator.js             ← Interactive Smartphone App Launcher & Music Player
    ├── terminal.js              ← Cybersecurity CLI Engine & Commands (`help`, `netspyder`, `commandx`)
    ├── projects-filter.js       ← Project Category Filters (Mobile, Cyber, AI)
    ├── skills.js                ← IntersectionObserver Skill Progress Bars
    └── apk-modal.js             ← Real APK Download & Mobile QR Code Generator Modal engine
```

---

## 🛠️ How to Customize Specific Features

| Feature to Change | Files to Edit |
| :--- | :--- |
| **Colors / Neon Theme** | `css/variables.css` & `style.css` |
| **Splash Screen Animation / Spider Speed** | `js/splash.js` & `css/splash.css` |
| **Interactive Smartphone Apps (Simulator)** | `js/simulator.js` & `css/simulator.css` |
| **Cybersecurity Terminal Commands** | `js/terminal.js` & `index.html` (`#terminal`) |
| **Adding New GitHub Projects** | `index.html` (`#projects`) |
| **Real APK Links / QR Code Modal** | `js/apk-modal.js` & `index.html` (`#apk-modal`) |

---

## 🚀 How to Run & Preview

1. Open your terminal in `e:\portfolio`.
2. Run a local web server:
   ```bash
   python -m http.server 8080
   ```
3. Open `http://localhost:8080` in your web browser or double click `index.html`!
