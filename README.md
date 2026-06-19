
<div align="center">

# ✦ ANANTA ✦
### *A digital sanctuary where words outlive their authors.*

---

> *Some things are too important to be lost, but too personal to keep.*

**Ananta** is an immersive, meditative web experience set inside an ancient South Indian stone hall.  
You write something true. You choose a date. You release it into time.  
A flame ignites. The hall remembers.

</div>

---

## The Ritual

```
Write  →  Entrust  →  Release  →  Forget
```

A visitor enters a vast, candlelit stone hall inspired by **Hoysala and Chola temple architecture**.  
At the center rests a **palm leaf manuscript** — an *ola* — the ancient writing medium of South Asia.

They write a memory, a lesson, a blessing, a hope.  
They choose a date — tomorrow, next year, a century from now.  
They seal the manuscript and release it into the night sky through an open oculus above.

Somewhere on a stone pillar, a small oil lamp — a **deepa** — ignites.  
That flame waits. Patient. Burning. Until the chosen date arrives.

---

## Features

| Feature | Description |
|---|---|
| **Threshold** | An animated stone gate entrance with video transitions and ambient audio |
| **The Hall** | An immersive 360° panorama of the ancient stone sanctuary |
| **Palm Leaf Manuscript** | Write and entrust your inheritance to time |
| **Cosmic Journey** | A one-time cinematic sequence for first-time senders — the manuscript flies into the galaxy |
| **Night Archive** | Browse inheritances that have already surfaced, given by others across time |
| **Deepa Glow** | An amber pulse of light marks each new flame in the hall |
| **Dust Motes** | Barely visible particles floating in the air — more felt than seen |
| **Ambient Soundscape** | Stone echo, wind through the oculus, and soft flame crackle |
| **Tutorial Manuscript** | First-visit guide that explains the ritual |

---

## Visual Language

This experience uses **five colors only**. Nothing else.

| Token | Hex | Role |
|---|---|---|
| Deep warm black | `#080A14` | Background — the hall at night |
| Dark carved stone | `#1A1610` | Stone surfaces, shadow |
| Amber flame | `#E8821A` | The deepa — life, warmth, inheritance |
| Aged parchment | `#F5EDD6` | Text, manuscript surface |
| Milky Way purple | `#6B5FA6` | The cosmos above the oculus |

**Typography:** `Cormorant Garamond` — serif, always. No sans-serif appears anywhere.

**Motion:** Nothing snaps. Everything breathes. Minimum transition: 1.5 seconds.  
The only fast movement is the release — the manuscript shooting into the sky.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite 6 |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animation | Motion (Framer Motion) |
| 3D / Panorama | Three.js |
| UI Primitives | Radix UI + shadcn/ui |
| Backend / Storage | Supabase Edge Functions |
| Package Manager | pnpm |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [pnpm](https://pnpm.io/) (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Tani-2005/Akasha.git
cd Ananta


# Install dependencies
pnpm install
# or
npm install
```

### Development

```bash
pnpm dev
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
pnpm build
# or
npm run build
```

---

## Project Structure

```
Ananta/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── Threshold.tsx        # Stone gate entrance sequence
│   │   │   ├── Hall.tsx             # Main sanctuary — all views orchestrated here
│   │   │   ├── Panorama.tsx         # 360° Three.js panorama renderer
│   │   │   ├── ManuscriptUI.tsx     # Palm leaf manuscript writing interface
│   │   │   ├── NightArchive.tsx     # Archive of returned inheritances
│   │   │   ├── CosmicJourney.tsx    # First-send cinematic: manuscript → galaxy
│   │   │   ├── TutorialManuscript.tsx  # First-visit ritual guide
│   │   │   └── ReturningManuscript.tsx # A manuscript surfacing from the past
│   │   ├── hooks/
│   │   │   └── useInheritances.ts   # Data hook for inheritances
│   │   ├── types/
│   │   │   └── inheritance.ts       # TypeScript types
│   │   ├── utils/
│   │   │   ├── audio.ts             # Ambient sound & crossfade utilities
│   │   │   └── analyzeEmotion.ts    # Emotional tone analysis
│   │   └── App.tsx                  # Root — Threshold → Hall orchestration
│   ├── imports/                     # Media assets (video, audio, images)
│   └── styles/                      # Global CSS & design tokens
├── supabase/
│   └── functions/server/            # Edge functions for persistence
└── utils/supabase/                  # Supabase client utilities
```

---

## Design Philosophy

> *Every element should feel ancient and alive. The architecture is the interface.*

When making any design decision, ask:

- **Does this feel like software?** → If yes, simplify.
- **Does this feel like entering a timeless hall where human wisdom becomes light?** → If yes, continue.

There are no navigation bars, no standard buttons, no modals, no loading spinners, no cards, no sidebars.  
The hall *is* the UI.

---

<div align="center">

*Every deepa is a promise.*  
*Every manuscript is a voice.*  
*Every pillar becomes a monument built not from stone,*  
*but from the accumulated inheritance of humanity.*

</div>
