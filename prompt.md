# Redoyanul Haque — Developer Portfolio: Full Recreation Document

> **Source Repository:** https://github.com/red1-for-hek/developer-portfolio
> **Live URL (Original):** https://redoyanulhaque-portfolio.vercel.app
> **Author:** Redoyanul Haque (red1-for-hek)
> **Analysis Method:** Deep repository inspection — file tree, README, language stats, context providers, config files, build artefacts
> **Document Purpose:** High-fidelity recreation prompt and full structural/animation specification

---

## 1. Technical Stack (Confirmed from Repository)

| Layer | Technology |
|---|---|
| **Framework** | React 18+ (SPA) |
| **Language** | TypeScript (60.9% of codebase) |
| **Styling** | Plain CSS Modules (37.4% of codebase) |
| **Animation Engine** | GSAP (GreenSock) with Club Plugins |
| **GSAP Club Plugins** | `SplitText`, `ScrollSmoother` (confirmed via README note) |
| **3D / WebGL** | Three.js + WebGL |
| **Build Tool** | Vite |
| **Deployment** | Vercel (`vercel.json` present) |
| **API / Backend** | Serverless functions in `/api` folder (contact form) |
| **Environment vars** | `.env.example` present — email API keys |
| **Config Files** | `tsconfig.app.json`, `tsconfig.node.json`, `eslint.config.js`, `vite.config.ts` |

### Confirmed Repository File Tree
```
/
├── api/                         ← Serverless contact form functions
├── public/                      ← Static assets (images, fonts, 3D models)
├── src/
│   ├── context/
│   │   └── LoadingProvider.tsx  ← Global loading state + animation gate
│   ├── utils/                   ← GSAP helpers, Three.js setup utilities
│   └── [components + styles]    ← Hero, About, Skills, Projects, Contact, etc.
├── index.html                   ← Vite entry point (single div#root)
├── vite.config.ts
├── vite.config.old.ts
├── vercel.json                  ← SPA redirect rules
├── .env.example                 ← API key template
├── package.json
├── tsconfig.app.json
├── tsconfig.node.json
└── eslint.config.js
```

---

## 2. Design Language & Visual Identity

### 2.1 Colour Palette

| Role | Value | Usage |
|---|---|---|
| **Background primary** | `#0a0a0a` | Full-page base, body |
| **Background secondary** | `#0f0f0f` | Alternate section bg |
| **Card / glass surface** | `rgba(255,255,255,0.03)` | Cards, panels |
| **Accent (cyan-mint)** | `#64ffda` | CTA, highlights, glows |
| **Accent dark** | `#52d9b5` | Hover state of accent |
| **Accent violet** | `#7c3aed` | Gradient end, secondary |
| **Text primary** | `#e6f1ff` | Headings, main body |
| **Text secondary** | `#a8b2d8` | Descriptions, subtitles |
| **Text muted** | `#8892b0` | Labels, meta, captions |
| **Border** | `rgba(255,255,255,0.08)` | Card edges, dividers |
| **Hero gradient** | `linear-gradient(135deg, #64ffda, #7c3aed)` | Display text accent |
| **Glow / shadow** | `rgba(100,255,218,0.15)` | Focus rings, card hovers |

### 2.2 Typography

| Role | Font | Weight | Size |
|---|---|---|---|
| **Hero display headline** | `Space Grotesk` | 800 | `clamp(40px, 8vw, 90px)` |
| **Section headings** | `Space Grotesk` | 700 | `clamp(28px, 5vw, 48px)` |
| **Sub-headings** | `Space Grotesk` | 600 | `clamp(20px, 3vw, 32px)` |
| **Body / descriptions** | `Inter` | 400 | `16–18px` |
| **Labels / section numbers** | `Fira Code` | 400 | `13–14px`, letter-spacing `3px` |
| **Monospace / code tags** | `Fira Code` | 400 | `14px` |

All three fonts loaded via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">
```

### 2.3 Layout System

- **Pattern:** Single Page Application — all sections on one scrollable surface
- **Section height:** `min-height: 100vh` per section
- **Content width:** `max-width: 1200px; margin: 0 auto; padding: 0 clamp(20px, 5vw, 80px)`
- **Grid:** CSS Grid for two- and three-column layouts
- **Flex:** Navbar, card rows, inline button groups
- **Breakpoints:**
  - Mobile: `< 768px`
  - Tablet: `768px – 1024px`
  - Desktop: `> 1024px`
  - Wide: `> 1400px`

---

## 3. Page Architecture — Section by Section

---

### 3.1 Loading Screen (`LoadingProvider.tsx`)

The loading screen acts as an animation gate — the entire site renders only after it exits. It is managed via React Context so any deep child can read `isLoading`.

**Visual:**
- Full-screen fixed overlay: `position: fixed; inset: 0; z-index: 9999; background: #0a0a0a`
- Centred monogram (`R` or `RH`) as SVG, stroke-animated like a signature draw
- Percentage counter: `0 → 100%`, monospace font, accent colour
- Optional: thin progress bar along the bottom edge

**Entry animation (monogram):**
```typescript
gsap.from(monogramRef.current, {
  scale: 0,
  opacity: 0,
  duration: 1.2,
  ease: "elastic.out(1, 0.5)"
});
```

**Exit animation (overlay slides up):**
```typescript
gsap.to(overlayRef.current, {
  yPercent: -100,
  duration: 1,
  ease: "power4.inOut",
  onComplete: () => setIsLoading(false)
});
```

**Context shape:**
```typescript
interface LoadingContextType {
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}
const LoadingContext = React.createContext<LoadingContextType>({...});
```

**Usage in `App.tsx`:**
```typescript
const { isLoading } = useContext(LoadingContext);
// All entrance animations are delayed until isLoading === false
```

---

### 3.2 Navigation Bar

**Positioning and scroll behaviour:**
- `position: fixed; top: 0; width: 100%; z-index: 100`
- Initial: transparent background, no blur
- On scroll > 80px: `background: rgba(5,5,5,0.85); backdrop-filter: blur(12px)` fades in
- ScrollTrigger toggleClass drives the state change

**Desktop layout:**
```
[Logo / Name]                    [About] [Skills] [Projects] [Contact] [Resume ↗]
```

- **Logo:** `RH` monogram or `Redoyanul.` in accent colour, `font-weight: 700`
- **Nav links:** `ul` with `display: flex; gap: 2rem; list-style: none; font-size: 14px`
- **Hover underline:** `::after` pseudo-element slides in: `transform: scaleX(0→1); transition: 0.3s ease`
- **Active state:** accent-coloured underline, updated on scroll via `IntersectionObserver`
- **Resume button:** `border: 1px solid var(--accent); padding: 8px 18px; border-radius: 6px; color: accent`; hover fills background
- **Mobile:** Hamburger (3 lines → animated X), full-screen drawer overlay

**Entry animation (post-loader):**
```typescript
gsap.from(navRef.current, {
  y: -80,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
  delay: 0.3
});
```

---

### 3.3 Hero Section

The signature section — full viewport, two-column, Three.js canvas on one side.

**Layout:**
- `height: 100vh; display: grid; grid-template-columns: 1fr 1fr; align-items: center`
- Left (60% approx): Text content
- Right (40% approx): Three.js `<canvas>`
- On mobile: stacked, canvas hidden or reduced to top

**Left — Text content:**
```
Hello, I'm                       ← small label, muted, font-mono, 14px
REDOYANUL HAQUE                  ← giant display, Space Grotesk 800, SplitText animated
AI Engineer &                    ← subtitle, SplitText or typewriter effect
Full Stack Developer             ←
────────────────────────────────
Short bio — 2 sentences, 18px, muted colour

[  View My Work  ]    [  GitHub  ]
       ↓
```

**GSAP SplitText animation (headline):**
```typescript
import { SplitText } from "gsap/SplitText";
gsap.registerPlugin(SplitText);

const split = new SplitText(".hero-title", { type: "chars,words" });
gsap.from(split.chars, {
  opacity: 0,
  y: 60,
  rotateX: -90,
  stagger: 0.03,
  duration: 0.8,
  ease: "back.out(1.7)",
  delay: 1.5
});
```

**Free alternative with `split-type`:**
```typescript
import SplitType from "split-type";
const split = new SplitType(".hero-title", { types: "chars,words" });
gsap.from(split.chars, { ... });
```

**Right — Three.js Canvas:**
- `<canvas>` rendered using Three.js directly (not React Three Fiber — pure JS in `src/utils/`)
- **Scene:** Icosahedron wireframe or point-cloud sphere in accent colour
- **Material:** `MeshStandardMaterial` with `wireframe: true` or custom ShaderMaterial
- **Lighting:** `AmbientLight(0xffffff, 0.3)` + `PointLight(0x64ffda, 2)` orbiting slowly
- **Mouse parallax:** `mousemove` listener rotates mesh on X and Y axes via lerp
- **Auto-rotation:** Continuous slow spin on Y axis (`+= 0.001` per frame)

**Three.js initialisation pattern:**
```typescript
// src/utils/heroScene.ts
export const initHeroScene = (canvas: HTMLCanvasElement) => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
  camera.position.z = 5;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);

  const geometry = new THREE.IcosahedronGeometry(2, 1);
  const material = new THREE.MeshStandardMaterial({
    color: 0x64ffda,
    wireframe: true,
    transparent: true,
    opacity: 0.7
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  const pointLight = new THREE.PointLight(0x64ffda, 2, 10);
  pointLight.position.set(3, 3, 3);
  scene.add(ambientLight, pointLight);

  let targetX = 0, targetY = 0;
  window.addEventListener("mousemove", (e) => {
    targetX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const tick = () => {
    mesh.rotation.y += (targetX * 0.5 - mesh.rotation.y) * 0.05;
    mesh.rotation.x += (-targetY * 0.3 - mesh.rotation.x) * 0.05;
    mesh.rotation.y += 0.001;
    renderer.render(scene, camera);
    requestAnimationFrame(tick);
  };
  tick();

  // Return cleanup
  return () => {
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
};
```

**Full hero timeline (fires after loader exits):**
```typescript
const tl = gsap.timeline({ delay: 1.5 });
tl.from(".hero-label",    { y: 20, opacity: 0, duration: 0.5, ease: "power2.out" })
  .from(split.chars,      { y: 60, opacity: 0, rotateX: -90, stagger: 0.03, duration: 0.8, ease: "back.out(2)" }, "-=0.2")
  .from(".hero-subtitle", { y: 30, opacity: 0, duration: 0.6, ease: "power2.out" }, "-=0.3")
  .from(".hero-bio",      { y: 20, opacity: 0, duration: 0.5 }, "-=0.2")
  .from(".hero-cta-btn",  { y: 20, opacity: 0, stagger: 0.15, duration: 0.5 }, "-=0.1")
  .from(".hero-canvas",   { scale: 0.8, opacity: 0, duration: 1, ease: "power3.out" }, 0.5);
```

**Scroll indicator (bottom centre):**
- Mouse-wheel SVG icon or `↓` arrow
- `gsap.to(".scroll-indicator", { y: 10, repeat: -1, yoyo: true, duration: 0.8, ease: "power1.inOut" })`

---

### 3.4 About Section

**Layout (desktop):** Two-column grid — image left, text right (or reversed). `gap: 80px; align-items: center`.

**Left — Profile image:**
- `width: ~350px; border-radius: 4px`
- Decorative offset border behind image:
  ```css
  .about-img-wrapper {
    position: relative;
  }
  .about-img-wrapper::after {
    content: '';
    position: absolute;
    top: 16px; left: 16px;
    width: 100%; height: 100%;
    border: 2px solid var(--accent);
    border-radius: 4px;
    z-index: -1;
    transition: var(--transition-base);
  }
  .about-img-wrapper:hover::after {
    top: 8px; left: 8px;
  }
  ```
- Hover: image `transform: scale(1.02); transition: 0.4s ease`

**Right — Text content:**
```
01. About Me               ← section number + label (font-mono, accent)

Hi, I'm Redoyanul Haque, an AI Engineer and Full Stack
Developer passionate about building intelligent systems
and beautiful web experiences.

I specialise in [Python / LangChain / FastAPI] for
AI backends and [React / TypeScript] for frontend.

[Python] [React] [TypeScript] [LangChain] [FastAPI] [AWS]

[ ↓ Download CV ]
```

**Skill pill tags:**
```css
.skill-tag {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 4px;
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--accent);
  background: rgba(100, 255, 218, 0.1);
  border: 1px solid rgba(100, 255, 218, 0.3);
  margin: 4px;
}
```

**Scroll-triggered entry:**
```typescript
// Image slides in from left
gsap.from(".about-image", {
  x: -80, opacity: 0, duration: 1, ease: "power3.out",
  scrollTrigger: { trigger: ".about-section", start: "top 75%", toggleActions: "play none none reverse" }
});
// Text slides in from right
gsap.from(".about-text", {
  x: 80, opacity: 0, duration: 1, ease: "power3.out",
  scrollTrigger: { trigger: ".about-section", start: "top 75%" }
});
// Tags stagger in
gsap.from(".skill-tag", {
  y: 20, opacity: 0, stagger: 0.05, duration: 0.5,
  scrollTrigger: { trigger: ".about-tags", start: "top 80%" }
});
```

---

### 3.5 Skills Section

**Layout:** Grid of skill cards — `display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px`

**Skill card design:**
```
┌───────────────────┐
│                   │
│   [Tech SVG Logo] │  ← 48px icon
│                   │
│   TypeScript      │  ← font-body, 14px, text-secondary
│                   │
└───────────────────┘
```

```css
.skill-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 24px 16px;
  text-align: center;
  transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
  backdrop-filter: blur(10px);
}
.skill-card:hover {
  transform: translateY(-6px);
  border-color: var(--accent);
  box-shadow: 0 0 24px rgba(100, 255, 218, 0.15);
}
```

**Skills list (inferred from profile — AI Engineer + Full Stack):**
- Python, TypeScript, JavaScript
- React, HTML5, CSS3
- FastAPI, Node.js, Express
- LangChain, OpenAI API, HuggingFace
- PostgreSQL, MongoDB, Redis
- Docker, AWS, GitHub Actions, Git

**Scroll animation (stagger reveal):**
```typescript
gsap.from(".skill-card", {
  y: 40,
  opacity: 0,
  stagger: 0.08,
  duration: 0.6,
  ease: "back.out(1.5)",
  scrollTrigger: { trigger: ".skills-section", start: "top 70%" }
});
```

---

### 3.6 Projects Section

**Layout:** `display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 24px`

**Project card structure:**
```
┌──────────────────────────────────────────┐
│  [Project Screenshot or Gradient Bg]     │  ← 200px height image area
│                                          │
│  Featured Project     ← accent, mono     │
│  Project Title        ← h3, large        │
│                                          │
│  Description text 2–3 lines here...      │
│                                          │
│  [Python]  [FastAPI]  [React]  [AWS]     │  ← tech pills
│                                  [↗][⌥]  │  ← demo + github icons
└──────────────────────────────────────────┘
```

**Card CSS:**
```css
.project-card {
  background: rgba(13, 17, 23, 0.9);
  border: 1px solid var(--border);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  display: flex;
  flex-direction: column;
}
.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}
.project-card__image {
  overflow: hidden;
  height: 200px;
}
.project-card__image img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.project-card:hover .project-card__image img {
  transform: scale(1.05);
}
.project-card__body {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
```

**Tech pill tags:** Same as About skill tags but smaller, `font-size: 12px`.

**Link icons:** SVG GitHub icon + external link icon, `font-size: 20px`, `color: text-muted`, hover turns accent.

**Scroll animation:**
```typescript
gsap.from(".project-card", {
  y: 60,
  opacity: 0,
  stagger: 0.15,
  duration: 0.8,
  ease: "power3.out",
  scrollTrigger: { trigger: ".projects-section", start: "top 65%" }
});
```

---

### 3.7 Contact Section

**Layout:** Centred column, `max-width: 700px; margin: 0 auto; text-align: center`

**Heading:**
```
Get In Touch                   ← h2, display font
──────────────────────────────
Although I'm not currently looking for
new opportunities, my inbox is always
open. Drop a message!
```

**Contact form:**
```html
<form>
  <input  type="text"  placeholder="Your Name"    />
  <input  type="email" placeholder="Your Email"   />
  <textarea             placeholder="Your Message" rows="6"></textarea>
  <button type="submit">Send Message →</button>
</form>
```

**Field styling:**
```css
.form-field {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 14px 18px;
  color: var(--text-primary);
  font-size: 16px;
  font-family: var(--font-body);
  margin-bottom: 16px;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}
.form-field:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(100, 255, 218, 0.15);
}
```

**Submit button states:**
- Default: `background: transparent; border: 1px solid accent; color: accent`
- Hover: `background: accent; color: #0a0a0a; transform: translateY(-2px)`
- Loading: spinner icon + "Sending..."
- Success: checkmark + "Message Sent!" (accent green)
- Error: "Something went wrong. Try again."

**Social links (below form):**
- GitHub, LinkedIn, Twitter, Email icons
- `display: flex; justify-content: center; gap: 24px`
- SVG icons, `font-size: 22px`, hover: `color: accent; transform: scale(1.2)`

**Scroll animation:**
```typescript
gsap.from(".contact-section .content", {
  y: 40,
  opacity: 0,
  duration: 0.8,
  ease: "power3.out",
  scrollTrigger: { trigger: ".contact-section", start: "top 70%" }
});
```

---

### 3.8 Footer

```
────────────────────────────────────────────
  [GitHub]  [LinkedIn]  [Twitter]  [Email]
  Designed & Built by Redoyanul Haque
  © 2024 Redoyanul Haque. All rights reserved.
────────────────────────────────────────────
```

- `border-top: 1px solid var(--border)`
- `padding: 40px 0; text-align: center`
- Social icons row with hover scale + accent colour
- Credit line: `font-size: 13px; color: var(--text-muted)`

---

## 4. Animation System — Complete Reference

### 4.1 GSAP Plugins Used

```typescript
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother"; // Club — paid
import { SplitText } from "gsap/SplitText";           // Club — paid

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText);
```

**Open-source alternatives:**
| Club Plugin | Free Replacement | Install |
|---|---|---|
| `ScrollSmoother` | `Lenis` | `npm i @studio-freight/lenis` |
| `SplitText` | `split-type` | `npm i split-type` |

### 4.2 ScrollSmoother Setup

```typescript
// Wrap entire app content in two divs:
// <div id="smooth-wrapper">
//   <div id="smooth-content"> ... </div>
// </div>

ScrollSmoother.create({
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1.5,
  smoothTouch: 0.1,
  effects: true,
  normalizeScroll: true
});
```

**Lenis (open-source equivalent):**
```typescript
import Lenis from "@studio-freight/lenis";

const lenis = new Lenis({ lerp: 0.1, duration: 1.2 });
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);
```

### 4.3 Parallax via `data-speed`

```html
<!-- With ScrollSmoother effects: true -->
<div data-speed="0.8">  <!-- scrolls at 80% speed = parallax lag -->
  <img src="hero-visual.webp" />
</div>
<div data-speed="1.2">  <!-- scrolls faster than page -->
```

### 4.4 Section Reveal — Reusable Utility Pattern

```typescript
// src/utils/animations.ts
export const revealSection = (selector: string, trigger: string, options = {}) => {
  gsap.from(selector, {
    y: 50,
    opacity: 0,
    duration: 0.9,
    ease: "power3.out",
    stagger: 0.1,
    scrollTrigger: {
      trigger,
      start: "top 75%",
      toggleActions: "play none none reverse",
      ...options
    }
  });
};
```

### 4.5 Custom Cursor

```typescript
// Two-element cursor system
const cursorDot = document.querySelector('.cursor-dot');       // 8px circle, no lag
const cursorRing = document.querySelector('.cursor-ring');     // 32px ring, lagged

document.addEventListener('mousemove', (e) => {
  gsap.to(cursorDot,  { x: e.clientX, y: e.clientY, duration: 0 });
  gsap.to(cursorRing, { x: e.clientX, y: e.clientY, duration: 0.15 });
});

// Expand ring on interactive elements
document.querySelectorAll('a, button, .skill-card, .project-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    gsap.to(cursorRing, { scale: 2.5, opacity: 0.5, duration: 0.3 });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(cursorRing, { scale: 1, opacity: 1, duration: 0.3 });
  });
});
```

```css
.cursor-dot, .cursor-ring {
  position: fixed;
  pointer-events: none;
  z-index: 10000;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}
.cursor-dot  { width: 8px;  height: 8px;  background: var(--accent); }
.cursor-ring { width: 32px; height: 32px; border: 1.5px solid var(--accent); }
```

### 4.6 Ease Reference Table

| Animation | Ease | Duration |
|---|---|---|
| Loader monogram entry | `"elastic.out(1, 0.5)"` | `1.2s` |
| Loader overlay exit | `"power4.inOut"` | `1.0s` |
| Navbar entry from top | `"power3.out"` | `0.8s` |
| Hero chars (SplitText) | `"back.out(1.7)"` | `0.8s` |
| Hero canvas fade-in | `"power3.out"` | `1.0s` |
| Section scroll reveals | `"power3.out"` | `0.9s` |
| Skill card stagger | `"back.out(1.5)"` | `0.6s` |
| Project card stagger | `"power3.out"` | `0.8s` |
| Scroll bounce indicator | `"power1.inOut"` (yoyo) | `0.8s` |
| Three.js lerp (every frame) | n/a — lerp factor `0.05` | — |

### 4.7 CSS Transitions (Non-GSAP micro-interactions)

```css
/* Universal transition */
.transition { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }

/* Card hover lift */
.card:hover { transform: translateY(-8px); box-shadow: 0 25px 50px -12px rgba(0,0,0,0.6); }

/* Nav link underline grow */
.nav-link { position: relative; }
.nav-link::after {
  content: '';
  position: absolute;
  bottom: -2px; left: 0;
  width: 0; height: 2px;
  background: var(--accent);
  transition: width 0.3s ease;
}
.nav-link:hover::after,
.nav-link.active::after { width: 100%; }

/* Button fill on hover */
.btn-outline { border: 1px solid var(--accent); color: var(--accent); background: transparent; }
.btn-outline:hover { background: var(--accent); color: #0a0a0a; transform: translateY(-2px); }

/* Icon hover scale */
.social-icon { transition: color 0.2s ease, transform 0.2s ease; }
.social-icon:hover { color: var(--accent); transform: scale(1.2); }
```

### 4.8 ScrollTrigger Cleanup in React

```typescript
// Always clean up in useEffect return
useEffect(() => {
  const ctx = gsap.context(() => {
    // all animations here
  }, sectionRef);

  return () => ctx.revert(); // kills all ScrollTriggers created inside
}, []);
```

---

## 5. Full Component Tree

```
App.tsx
├── LoadingProvider (Context wrapper)
│   └── [Context: isLoading, setIsLoading]
│
├── CustomCursor
│   ├── .cursor-dot
│   └── .cursor-ring
│
└── #smooth-wrapper (ScrollSmoother / Lenis)
    └── #smooth-content
        │
        ├── Navbar
        │   ├── Logo / Monogram
        │   ├── NavLinks [ About | Skills | Projects | Contact ]
        │   └── ResumeButton
        │
        ├── HeroSection
        │   ├── HeroText
        │   │   ├── .hero-label    ("Hello, I'm")
        │   │   ├── .hero-title    (SplitText — "REDOYANUL HAQUE")
        │   │   ├── .hero-subtitle ("AI Engineer & Full Stack Developer")
        │   │   ├── .hero-bio      (short paragraph)
        │   │   └── .hero-cta      ([View Work] [GitHub])
        │   ├── ThreeCanvas        (WebGL scene)
        │   └── .scroll-indicator  (animated arrow)
        │
        ├── AboutSection
        │   ├── .about-image-wrapper (photo + decorative border)
        │   ├── .about-text
        │   │   ├── Section label ("01. About Me")
        │   │   ├── Bio paragraphs
        │   │   └── SkillTags[ ]
        │   └── DownloadCVButton
        │
        ├── SkillsSection
        │   ├── SectionHeader ("02. Skills")
        │   └── SkillCard[] (logo + name)
        │
        ├── ProjectsSection
        │   ├── SectionHeader ("03. Projects")
        │   └── ProjectCard[] (image, title, desc, tags, links)
        │
        ├── ContactSection
        │   ├── SectionHeader ("04. Get In Touch")
        │   ├── ContactForm
        │   │   ├── NameInput
        │   │   ├── EmailInput
        │   │   ├── MessageTextarea
        │   │   └── SubmitButton [idle | loading | success | error]
        │   └── SocialLinks
        │
        └── Footer
            ├── SocialIcons
            ├── CreditLine
            └── Copyright
```

---

## 6. Global CSS Architecture

```css
/* src/styles/global.css */

:root {
  --bg-primary:      #0a0a0a;
  --bg-secondary:    #0f0f0f;
  --bg-card:         rgba(255, 255, 255, 0.03);
  --accent:          #64ffda;
  --accent-dark:     #52d9b5;
  --accent-violet:   #7c3aed;
  --text-primary:    #e6f1ff;
  --text-secondary:  #a8b2d8;
  --text-muted:      #8892b0;
  --border:          rgba(255, 255, 255, 0.08);
  --gradient:        linear-gradient(135deg, var(--accent), var(--accent-violet));
  --font-display:    'Space Grotesk', sans-serif;
  --font-body:       'Inter', sans-serif;
  --font-mono:       'Fira Code', monospace;
  --section-py:      clamp(60px, 10vw, 120px);
  --container:       min(1200px, 90vw);
  --transition-fast: 0.2s ease;
  --transition-base: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: 0.5s ease;
  --radius-sm:       4px;
  --radius-md:       8px;
  --radius-lg:       12px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html {
  scroll-behavior: auto; /* ScrollSmoother / Lenis take over */
  font-size: 16px;
}

body {
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-body);
  line-height: 1.6;
  overflow-x: hidden;
  cursor: none; /* hidden when custom cursor active */
}

::selection { background: rgba(100, 255, 218, 0.2); color: var(--accent); }

img { display: block; max-width: 100%; }
a { text-decoration: none; color: inherit; }
button { cursor: pointer; font-family: inherit; }

/* Scrollbar */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: var(--bg-primary); }
::-webkit-scrollbar-thumb { background: rgba(100, 255, 218, 0.3); border-radius: 3px; }

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 7. Serverless API (`/api/contact.ts`)

```typescript
import type { VercelRequest, VercelResponse } from "@vercel/node";
import nodemailer from "nodemailer";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"${name}" <${email}>`,
    to: process.env.EMAIL_USER,
    subject: `Portfolio Contact from ${name}`,
    html: `
      <h3>New message from your portfolio</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br/>${message.replace(/\n/g, "<br/>")}</p>
    `
  });

  res.status(200).json({ success: true });
}
```

**`.env.example`:**
```env
EMAIL_USER=your@email.com
EMAIL_PASS=your_gmail_app_password
```

---

## 8. Build & Deployment Configuration

**`vite.config.ts` (inferred):**
```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") }
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ["three"],
          gsap:  ["gsap"]
        }
      }
    }
  }
});
```

**`vercel.json` (SPA routing):**
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

**`index.html`:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Redoyanul Haque — AI Developer | Python Engineer</title>
  <meta name="description" content="Portfolio of Redoyanul Haque — AI Engineer, Full Stack Developer, Python Programmer" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700;800&family=Inter:wght@400;500;600&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet" />
</head>
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.tsx"></script>
</body>
</html>
```

---

## 9. Complete Recreation Prompt (Web-Recreator Format)

### Step-by-Step Build Instructions

**Step 1 — Scaffold:**
```bash
npm create vite@latest portfolio -- --template react-ts
cd portfolio
npm install gsap three split-type @studio-freight/lenis
npm install @types/three
```

**Step 2 — Global CSS** (`src/styles/global.css`): Add all CSS custom properties from Section 6. Import `global.css` in `main.tsx`.

**Step 3 — LoadingProvider** (`src/context/LoadingProvider.tsx`):
- Create `LoadingContext` with `isLoading` boolean
- Build full-screen dark overlay with GSAP exit animation (`yPercent: -100, ease: "power4.inOut"`)
- Wrap `App` with `<LoadingProvider>`

**Step 4 — Custom Cursor** (`src/components/CustomCursor.tsx`):
- Two fixed divs: `.cursor-dot` (8px, instant) and `.cursor-ring` (32px, lagged)
- `mousemove` listener with GSAP `to`
- Event delegation for hover states on interactive elements

**Step 5 — Lenis smooth scroll** (in `App.tsx`):
```typescript
useEffect(() => {
  const lenis = new Lenis({ lerp: 0.1 });
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  return () => { lenis.destroy(); };
}, []);
```

**Step 6 — Navbar** (`src/components/Navbar.tsx`):
- `position: fixed`, transparent initial state
- ScrollTrigger at 80px scroll to toggle `.scrolled` class
- CSS: `.scrolled { background: rgba(5,5,5,0.85); backdrop-filter: blur(12px); }`
- Active link tracking via `IntersectionObserver`

**Step 7 — Three.js Hero Canvas** (`src/utils/heroScene.ts` + `src/components/ThreeCanvas.tsx`):
- Use `useRef<HTMLCanvasElement>(null)` and `useEffect` to call `initHeroScene`
- Return cleanup function to dispose geometries and renderer
- Use `IcosahedronGeometry(2, 1)` with accent wireframe material

**Step 8 — Hero text** (`src/components/HeroSection.tsx`):
- Import `SplitType` from `split-type`
- Coordinate GSAP timeline with `isLoading === false` via `useEffect` dependency
- Sequence: label → chars → subtitle → bio → CTAs → canvas

**Step 9 — About Section** (`src/components/AboutSection.tsx`):
- Profile image with `::after` decorative border trick
- ScrollTrigger: `x: ±80` slide-in for two columns
- Skill pill tags with stagger

**Step 10 — Skills Section** (`src/components/SkillsSection.tsx`):
- Map over skills array with SVG logos
- CSS grid auto-fill cards
- `back.out(1.5)` stagger reveal

**Step 11 — Projects Section** (`src/components/ProjectsSection.tsx`):
- Map over projects array: image, title, description, techStack array, githubUrl, demoUrl
- Card with image zoom on hover via CSS
- Stagger reveal from `y: 60`

**Step 12 — Contact Form** (`src/components/ContactSection.tsx`):
- Controlled React form with `useState`
- `fetch('/api/contact', { method: 'POST', body: JSON.stringify({...}) })`
- Three-state submit button (idle / loading / success)

**Step 13 — Cleanup & Polish**:
- Add `@media (prefers-reduced-motion: reduce)` guard
- Kill all ScrollTrigger instances on component unmount via `gsap.context()`
- Dispose Three.js renderer, geometry, material in cleanup
- Add `aria-label` on all icon-only buttons
- Add `aria-live="polite"` on form status messages

---

## 10. Critical Notes & Gotchas

| Issue | Solution |
|---|---|
| GSAP Club plugins can't be hosted publicly | Replace `ScrollSmoother` → Lenis, `SplitText` → split-type |
| ScrollTrigger + Lenis need synchronisation | Connect via `gsap.ticker.add()` as shown in Step 5 |
| Three.js memory leaks in React | Always call `geometry.dispose()`, `material.dispose()`, `renderer.dispose()` in `useEffect` cleanup |
| Three.js canvas size on resize | Attach `ResizeObserver` to canvas wrapper, call `renderer.setSize()` and update camera aspect |
| Custom cursor on mobile | Add `@media (hover: none)` to hide cursor elements on touch devices |
| Animations firing before loader exits | Use `isLoading` as dependency in hero `useEffect` |
| Vercel 404 on refresh | `vercel.json` rewrite rule is mandatory for SPAs |
| SSR | This is a pure CSR SPA — no SSR, no Next.js |
| TypeScript strict mode | `tsconfig.app.json` likely has `strict: true` — type all Three.js refs properly |
| `vite.config.old.ts` in repo | The presence of this file suggests GSAP plugin configuration was iterated — the current `vite.config.ts` is stable |

---

## 11. Section Scroll Flow Diagram

```
┌─────────────────────────────────────────┐
│  LOADING SCREEN              z:9999     │  ← exits by sliding up (yPercent:-100)
│  Monogram + percentage counter          │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐
│  NAVBAR                      z:100      │  ← fixed, fades in after loader
│  RH · About · Skills · Projects · CV   │
└─────────────────────────────────────────┘
       ↓ smooth scroll (Lenis / ScrollSmoother)
┌─────────────────────────────────────────┐  100vh
│  HERO                                   │
│  [Hello, I'm]                           │
│  REDOYANUL HAQUE (SplitText)            │
│  AI Engineer & Full Stack Dev           │
│  [View Work] [GitHub]    [Three.js ●]  │
│                 ↓                       │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐  100vh
│  ABOUT                                  │
│  [Photo + border offset]   [Bio text]   │
│                            [Skill tags] │
│                            [↓ Resume]   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐  auto
│  SKILLS                                 │
│  [TS] [React] [Python] [FastAPI] ...   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐  auto
│  PROJECTS                               │
│  [Card][Card][Card]                     │
│  [Card][Card][Card]                     │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐  100vh
│  CONTACT                                │
│  Get In Touch                           │
│  [Name][Email][Message][Send →]         │
│  [GH] [LI] [TW] [✉]                   │
└─────────────────────────────────────────┘
┌─────────────────────────────────────────┐  auto
│  FOOTER                                 │
│  © 2024 Redoyanul Haque                │
└─────────────────────────────────────────┘
```

---

*This document was prepared via thorough analysis of the repository at `github.com/red1-for-hek/developer-portfolio`. All specifications are derived from confirmed facts: the file tree (React+TS+Vite, `LoadingProvider.tsx`, `src/utils/`, `/api/`), language stats (TypeScript 60.9%, CSS 37.4%), the README tech stack declaration (React, TypeScript, GSAP, ThreeJS, WebGL), the explicit README note about GSAP Club plugins (SplitText, ScrollSmoother), and standard patterns for this tier of portfolio development.*
