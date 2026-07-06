# FlowCache — FIFO & LRU Page Replacement Visualizer

**FlowCache** is an interactive educational tool for visualizing page replacement algorithms. Built with React, TypeScript, Vite, Tailwind CSS, and Framer Motion, it helps students and engineers understand how operating systems manage memory through FIFO (First-In-First-Out) and LRU (Least-Recently-Used) algorithms.

## Features

- **FIFO Simulation** — Watch the oldest page get evicted first when a page fault occurs. Understand the queue-based behavior of First-In-First-Out replacement.
- **LRU Simulation** — See how pages that haven't been accessed the longest get replaced, using recency tracking to make eviction decisions.
- **Step Control** — Play through simulations automatically at adjustable speed, or step forward/backward to examine each page fault and hit in detail.
- **Frame Timeline** — A visual column-per-step grid showing the state of every frame after each page reference, with color-coded fault and hit indicators.
- **Solution Trace** — A diagonal shifting matrix showing how pages propagate through frames. On faults, the new page enters at the top and existing values shift down. On hits, the state is preserved.
- **Live Statistics** — Track total page faults, hits, hit ratio, and fault ratio in real time as the simulation progresses.
- **CSV Export** — Export the complete solution trace to CSV for further analysis or sharing.

## How It Works

1. **Configure** — Set the number of memory frames, choose FIFO or LRU, and enter a comma-separated page reference string.
2. **Simulate** — Click "Start Simulation" to begin. Use Play/Pause for automatic stepping or Next/Back for manual control.
3. **Analyze** — Review the frame timeline, solution trace, and summary statistics to understand how each algorithm manages memory.

## Tech Stack

| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript 6 | Type safety |
| Vite 8 | Build tool / dev server |
| Tailwind CSS 4 | Utility-first styling |
| Framer Motion | Animations and transitions |
| react-router-dom 7 | Client-side routing |

## Getting Started

```bash
Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Build

```bash
npm run build
```

The output will be in the `dist/` directory.
