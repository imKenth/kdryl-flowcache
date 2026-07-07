# FlowCache — Complete Program Analysis (Original React/TypeScript Version)

## 1. BIG PICTURE

### What it does in plain language

FlowCache is an **interactive teaching tool** for Operating Systems concepts. It shows you, step-by-step, how an OS decides which memory page to kick out when it needs to bring a new one in.

Think of it like a **parking lot**:
- You have a limited number of **parking spots** (frames)
- Cars (pages) arrive one at a time
- When the lot is full and a new car arrives, someone has to leave
- **FIFO** = the car that's been parked *longest* leaves first
- **LRU** = the car that was *used least recently* leaves first

### The problem it solves

Students often struggle to visualize abstract OS concepts. This app turns those concepts into an animated, interactive dashboard. Instead of reading a textbook, you can:

1. Type in a sequence of page references
2. Watch frames fill up and pages get evicted in real-time
3. See statistics about performance

### How the parts connect (high-level)

```
index.html
    │
    ▼
main.tsx  (React entry point — mounts <App /> into <div id="root">)
    │
    ▼
App.tsx   (root component — Navbar + React Router <Routes>)
    │
    ├── path="/" ──────────► Home (landing page)
    │                           ├── Navbar
    │                           ├── HeroSection
    │                           ├── Features section
    │                           ├── How It Works section
    │                           └── Footer
    │
    └── path="/visualizer" ──► Visualizer (the tool)
                                ├── InputPanel
                                ├── Controls
                                ├── ReferenceString
                                ├── FrameGrid
                                ├── SolutionTrace
                                └── StatsPanel
```

The **state** lives in a custom hook called `useSimulator`, and the **algorithm logic** lives in pure TypeScript functions in `fifo-lru.ts`.

---

## 2. FILE / STRUCTURE BREAKDOWN

```
kdryl-flowchache-style-timeline-blend/
│
├── index.html                 # Single HTML file — just <div id="root"> and <script>
├── vite.config.ts             # Vite config (dev server, build tool)
├── tsconfig.json              # TypeScript config
├── package.json               # Dependencies: React, Framer Motion, Tailwind, etc.
│
├── src/
│   ├── main.tsx               # React entry: creates root, renders <App /> in BrowserRouter
│   ├── App.tsx                # Root component: Navbar + Routes (/ and /visualizer)
│   ├── App.css                # Empty (unused)
│   ├── index.css              # Global styles + Tailwind import + custom CSS
│   │
│   ├── types/index.ts         # All TypeScript type/interface definitions
│   │
│   ├── logic/fifo-lru.ts      # PURE ALGORITHM LOGIC (no React) — FIFO & LRU simulation
│   ├── hooks/useSimulator.ts  # React hook — manages all simulation state
│   ├── utils/helpers.ts       # Stat computation, CSV export, shared CSS strings
│   │
│   ├── pages/
│   │   └── visualizer.tsx     # Visualizer page — orchestrates all simulation components
│   │
│   ├── components/
│   │   ├── landing/Navbar.tsx  # Sticky navbar with scroll navigation + mobile menu
│   │   ├── HeroSection.tsx     # Landing page hero with CTA buttons + preview card
│   │   ├── ui/Button.tsx       # Reusable button component with variants/sizes
│   │   ├── InputPanel.tsx      # Frame size, algorithm toggle, reference string input
│   │   ├── Controls.tsx        # Play/pause, step fwd/back, speed slider, progress bar
│   │   ├── ReferenceString.tsx  # Color-coded display of each page reference
│   │   ├── FrameGrid.tsx        # Timeline grid showing frame states per step
│   │   ├── SolutionTrace.tsx    # FIFO shift table or LRU recency-ordered table
│   │   └── StatsPanel.tsx       # Fault/hit counts, ratios, CSV export button
│   │
│   └── assets/                 # Static images (hero.png, react.svg, vite.svg)
│
├── public/                     # Static files served as-is (favicon.svg, icons.svg)
├── dist/                       # Built output (after npm run build)
└── scripts/check-deps.cjs      # Pre-build dependency checker
```

### How each layer connects

```
┌─────────────────────────────────────────────────────────────────┐
│  DEPENDENCY LAYER                                               │
│                                                                 │
│  types/index.ts   ←──  EVERYTHING imports from here             │
│       │                                                         │
│       ▼                                                         │
│  logic/fifo-lru.ts   ←──  uses types (Algorithm, SimulationStep)│
│       │                                                         │
│       ▼                                                         │
│  utils/helpers.ts    ←──  uses types (SimulationStep)           │
│       │                                                         │
│       ▼                                                         │
│  hooks/useSimulator.ts  ←──  uses fifo-lru.ts (simulate)       │
│                              uses helpers.ts (exportCSV)         │
│       │                                                         │
│       ▼                                                         │
│  components/*.tsx  ←──  use: types, hooks/useSimulator          │
│                          helpers.ts (computeStats, CSS strings) │
│       │                                                         │
│       ▼                                                         │
│  App.tsx  ←──  imports all components + react-router-dom        │
│       │                                                         │
│       ▼                                                         │
│  main.tsx  ←──  creates React root, renders <App />             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. LINE-BY-LINE / LOGIC EXPLANATION

### Entry Point: `main.tsx`

```typescript
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- `createRoot` is React 19's new API (replaced `ReactDOM.render`)
- `StrictMode` enables extra development checks (double-renders effects)
- `BrowserRouter` provides client-side routing — no page reloads when navigating between `/` and `/visualizer`
- The `!` after `getElementById('root')` is TypeScript's **non-null assertion** — it tells TS "trust me, this exists"

### The Type System: `types/index.ts`

```typescript
export type Algorithm = 'FIFO' | 'LRU'
```
A **union type** — `algorithm` can only be the string `'FIFO'` or `'LRU'`. TypeScript will error if you try `'FIFO2'`.

```typescript
export interface SimulationStep<T> {
  page: T
  frames: (T | null)[]
  isFault: boolean
  changedIndex: number | null
  replacedPage: T | null
}
```

This is a **generic interface** `<T>`. The simulation works with strings (`"1"`, `"2"`) but the generic lets you theoretically use numbers too. Each step records:
- `page`: what was requested
- `frames`: snapshot of all frame slots at that moment
- `isFault`: did this cause a page fault?
- `changedIndex`: which frame slot changed (if any)
- `replacedPage`: which page got kicked out (if any)

### Algorithm Logic: `fifo-lru.ts`

#### `simulateFIFO`

```typescript
function simulateFIFO<T>(pages: T[], frameSize: number): SimulationStep<T>[] {
  const frames: (T | null)[] = Array(frameSize).fill(null)
  const queue: T[] = []
  const steps: SimulationStep<T>[] = []
```

Three key variables:
- `frames` — the physical memory slots, initialized to `null` (empty)
- `queue` — tracks arrival order for FIFO eviction
- `steps` — accumulates the result

**Per-page loop:**

```typescript
for (const page of pages) {
    const idx = frames.indexOf(page)       // Is it already in memory?
    if (idx !== -1) {                      // YES → HIT
      steps.push({ page, frames: [...frames], isFault: false, changedIndex: null, replacedPage: null })
      continue                             // Skip eviction logic
    }
```

`[...frames]` creates a **shallow copy** of the array. Without this, all steps would point to the same array and you'd see the final state in every step.

```typescript
    const emptyIdx = frames.indexOf(null)  // Any empty slot?
    if (emptyIdx !== -1) {                 // YES → fill it
      frames[emptyIdx] = page
      queue.push(page)
      steps.push({ ... isFault: true, changedIndex: emptyIdx, replacedPage: null })
    } else {                               // NO → evict oldest
      const removed = queue.shift()!       // Remove from front of queue
      const replaceIdx = frames.indexOf(removed)
      frames[replaceIdx] = page
      queue.push(page)                     // Add new page to back
      steps.push({ ... changedIndex: replaceIdx, replacedPage: removed })
    }
```

The `!` after `queue.shift()` is TypeScript's **non-null assertion**. `shift()` can return `undefined` if the array is empty, but since we checked there are no null slots, the queue must have entries. The `!` tells TS "trust me, this isn't undefined."

#### `simulateLRU`

```typescript
const lastUsed = new Map<T, number>()
let tick = 0
```

Instead of a queue, LRU uses a `Map` that maps each page → the last time it was accessed. `tick` is a counter that increments with every access.

```typescript
if (frames.includes(page)) {              // HIT
    lastUsed.set(page, tick++)             // Update access time
    steps.push({ ... isFault: false })
    continue
}
```

On a hit, LRU **updates the timestamp**. This is the key difference from FIFO — a hit makes the page "recently used" again.

```typescript
} else {                                   // Need to evict
    let lruIdx = 0
    let oldest = Infinity
    for (let i = 0; i < frameSize; i++) {
      const t = lastUsed.get(frames[i]!) ?? -1
      if (t < oldest) { oldest = t; lruIdx = i }
    }
```

Linear scan to find the frame with the **smallest tick** (least recently used). `frames[i]!` asserts the value is not null (we checked there are no null slots). `?? -1` provides a default if `get()` returns `undefined`.

### State Management: `useSimulator.ts`

This is a **React custom hook** — a function that uses other React hooks (`useState`, `useEffect`, `useCallback`, `useRef`) to manage state.

```typescript
export function useSimulator(): SimulatorState & SimulatorActions {
```

The return type `SimulatorState & SimulatorActions` means it returns **both** the state variables AND the action functions. This is an **intersection type**.

Each state variable uses `useState`:
```typescript
const [frameSize, setFrameSize] = useState(4)
const [algorithm, setAlgorithm] = useState<Algorithm>('FIFO')
const [inputString, setInputString] = useState('')
// ... etc
```

Each action uses `useCallback` to memoize it:
```typescript
const runSimulation = useCallback(() => {
    const raw = inputString.split(',').map(s => s.trim()).filter(Boolean)
    if (raw.length === 0) { setError('Please enter a page reference string.'); return }
    // ... validate, then:
    const result = simulate(raw, frameSize, algorithm)
    setSteps(result)
    setCurrentStep(0)
    setHasRun(true)
    // ...
}, [inputString, frameSize, algorithm])
```

The dependency array `[inputString, frameSize, algorithm]` means this callback is only re-created when one of those values changes. This is a performance optimization.

The auto-play uses `useEffect`:
```typescript
useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= steps.length) { setIsPlaying(false); return prev }
          // ... highlight fault if needed
          return prev + 1
        })
      }, speed)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isPlaying, speed, steps.length])
```

- When `isPlaying` becomes `true`, it starts a `setInterval`
- The interval advances `currentStep` by 1 every `speed` milliseconds
- When it reaches the end, it sets `isPlaying` to `false` (which triggers the cleanup)
- The cleanup function (`return () => clearInterval(...)`) runs when the component unmounts OR when dependencies change

### Rendering: `visualizer.tsx`

```typescript
export default function Visualizer() {
  const sim = useSimulator()           // Get all state + actions
  const stats = computeStats(sim.steps) // Compute derived data
```

The hook returns everything. Components are wired up like this:

```typescript
<InputPanel
    frameSize={sim.frameSize}
    algorithm={sim.algorithm}
    inputString={sim.inputString}
    hasRun={sim.hasRun}
    error={sim.error}
    onStart={handleStart}
    onReset={sim.reset}
    // ...
/>
```

This is the **props-down** pattern — state lives in the parent (`Visualizer`) and is passed to child components as read-only props. Child components call the callbacks (`onStart`, `onReset`) to request changes.

### Component Example: `Controls.tsx`

```typescript
export default function Controls({ currentStep, totalSteps, isPlaying, speed, hasRun, ... }) {
  if (!hasRun || totalSteps === 0) return null   // Early return — render nothing
```

React components can return `null` to render nothing. This is how the Controls section is hidden before a simulation runs.

```typescript
const progress = totalSteps > 0 ? Math.min(100, (currentStep / totalSteps) * 100) : 0
```

Math to calculate the progress bar width.

### The Speed Slider Inversion

```typescript
// In Controls.tsx:
value={1500 - speed + 100}
onChange={e => onSpeedChange(1500 - Number(e.target.value) + 100)}
```

The slider's HTML `value` represents **position** (left=100, right=1500), but `speed` is in milliseconds. They're inverted:
- Slider at 100 (left) → speed = 1500ms (slow)
- Slider at 1500 (right) → speed = 100ms (fast)

The formula `1500 - speed + 100` converts speed to slider position, and `1500 - sliderValue + 100` converts back.

---

## 4. DATA FLOW

### Input → Processing → Output

```
USER types "7,0,1,2,0,3,0,4" in InputPanel
       selects "LRU", frameSize=3
       clicks "Start"
            │
            ▼
InputPanel calls props.onStart()
            │
            ▼
visualizer.tsx: handleStart()
  → sim.runSimulation()
            │
            ▼
useSimulator.ts: runSimulation()
  1. Parse: "7,0,1,2,0,3,0,4" → ["7","0","1","2","0","3","0","4"]
  2. Validate: each passes /^[a-zA-Z0-9]+$/
  3. Call: simulate(["7","0","1","2","0","3","0","4"], 3, "LRU")
            │
            ▼
fifo-lru.ts: simulateLRU()
  Returns 8 step objects:
  [
    { page:"7", frames:["7",null,null], isFault:true, changedIndex:0, replacedPage:null },
    { page:"0", frames:["7","0",null], isFault:true, changedIndex:1, replacedPage:null },
    { page:"1", frames:["7","0","1"], isFault:true, changedIndex:2, replacedPage:null },
    { page:"2", frames:["2","0","1"], isFault:true, changedIndex:0, replacedPage:"7" },
    { page:"0", frames:["2","0","1"], isFault:false, changedIndex:null, replacedPage:null },
    { page:"3", frames:["2","0","3"], isFault:true, changedIndex:2, replacedPage:"1" },
    { page:"0", frames:["2","0","3"], isFault:false, changedIndex:null, replacedPage:null },
    { page:"4", frames:["4","0","3"], isFault:true, changedIndex:0, replacedPage:"2" },
  ]
            │
            ▼
useSimulator stores steps in state, sets hasRun=true
  → React re-renders Visualizer component
            │
            ▼
React passes new props to each child:
  - Controls: appears (was null), shows step 0/8, play button
  - ReferenceString: renders 8 span elements, first one highlighted as current
  - FrameGrid: renders 0 columns (currentStep=0, nothing visible yet)
  - SolutionTrace: renders empty
  - StatsPanel: appears, shows 0 faults, 0 hits
  - EmptyState: hidden (hasRun is true)
            │
            ▼
useEffect triggers togglePlay() after 100ms
  → isPlaying=true → setInterval starts
  → currentStep increments: 1, 2, 3, ... 8
  → Each increment triggers re-render:
      - Controls: progress bar fills, step counter updates
      - ReferenceString: more items turn colored, current highlight moves
      - FrameGrid: columns appear one by one
      - SolutionTrace: columns appear one by one
      - StatsPanel: fault/hit counts update live
```

### Concrete example with values

Input: `reference = "3,2,1,3,4,2,5,1"`, `algorithm = "FIFO"`, `frameSize = 3`

```
Step | Page | Frames       | Fault? | Evicted
-----+------+--------------+--------+--------
  1  |  3   | [3, -, -]    | FAULT  | —
  2  |  2   | [3, 2, -]    | FAULT  | —
  3  |  1   | [3, 2, 1]    | FAULT  | —
  4  |  3   | [3, 2, 1]    | HIT    | —
  5  |  4   | [4, 2, 1]    | FAULT  | 3
  6  |  2   | [4, 2, 1]    | HIT    | —
  7  |  5   | [4, 5, 1]    | FAULT  | 2
  8  |  1   | [4, 5, 1]    | HIT    | —

Stats: Total Faults = 5, Total Hits = 3
       Hit Ratio = 38%, Fault Ratio = 62%
```

At step 7, the user sees:

**Reference String**: `[3] [2] [1] [3] [4] [2] [5] [1]` with past faults in red, past hits in green, current in purple glow, future in gray.

**Frame Timeline**: An 8-column × 3-row grid. Columns 1-7 show data, column 8 is empty. Frame 1 shows `[3→3→3→3→4→4→4]`, Frame 2 shows `[null→2→2→2→2→2→5]`, Frame 3 shows `[null→null→1→1→1→1→1]`.

---

## 5. DEBUGGING GUIDE

### Potential issues and weak spots

**1. The `togglePlay()` setTimeout race in `visualizer.tsx:20`**

```typescript
const handleStart = useCallback(() => {
    sim.runSimulation()
    setTimeout(() => sim.togglePlay(), )   // ← missing delay!
  }, [sim.runSimulation, sim.togglePlay])
```

The `setTimeout` has no second argument — it defaults to `0ms`. This means `togglePlay()` fires on the next event loop tick. If for some reason React batches the state updates differently, `togglePlay()` might fire before `runSimulation()` has committed `hasRun=true`. The Controls component checks `hasRun` — if it's `false`, the play button isn't even rendered, so `togglePlay()` silently does nothing.

**Fix**: Pass an explicit delay (even `0`) is fine, but better to use `setTimeout(() => sim.togglePlay(), 50)` to ensure state has settled.

**2. The `highlightedFault` timer collision in `useSimulator.ts:66-68`**

```typescript
if (next > 0 && steps[next - 1]?.isFault) {
    setHighlightedFault(next - 1)
    setTimeout(() => setHighlightedFault(null), 600)
}
```

No timeout ID is stored. If you step forward twice within 600ms, both timeouts fire and the highlight disappears after the first one. The visual glitch is minor but noticeable.

**Fix**: Store the timeout ref and clear it:
```typescript
if (faultTimeoutRef.current) clearTimeout(faultTimeoutRef.current)
faultTimeoutRef.current = setTimeout(() => setHighlightedFault(null), 600)
```

**3. `useSimulator.ts:89-98` — `setCurrentStep` inside `setInterval` with stale closure**

```typescript
intervalRef.current = setInterval(() => {
    setCurrentStep(prev => {
      if (prev >= steps.length) {     // ← `steps` is from the closure
        setIsPlaying(false)
        return prev
      }
      // ...
    })
}, speed)
```

The `steps` variable inside the interval callback is **closed over** from when the `useEffect` ran. If `steps` changes (it won't during a simulation, but theoretically), the interval would use the old value. The functional updater `prev => ...` correctly gets the latest `currentStep`, but `steps.length` is stale.

This works because `steps` never changes during playback, but it's a subtle bug waiting to happen if someone adds a feature to modify steps mid-playback.

**4. CSS with Tailwind's `@apply` directive**

```css
.glass-panel {
  @apply rounded-[24px] border border-white/10 bg-white/8 backdrop-blur-xl shadow-[0_20px_60px_rgba(2,6,23,0.35)];
}
```

This is **not standard CSS** — it's Tailwind's `@apply` directive. It requires the Tailwind PostCSS plugin to process it. If someone copies just the CSS file without the Tailwind build pipeline, `.glass-panel` won't work.

**5. The `framer-motion` dependency**

Framer Motion adds ~30KB to the bundle. The animations it provides (fade in, slide up, shake) could be done with CSS animations alone. This is the heaviest dependency in the project.

**6. All components re-render on every state change**

React re-renders the entire component tree when state changes. With small components like this, it's not a problem. But `FrameGrid.tsx` and `SolutionTrace.tsx` build large DOM trees. If the simulation had 1000 steps, performance would degrade.

**7. No error boundary**

If any component throws during render, the entire app crashes with a white screen. A production app would wrap the `<Routes>` in an `<ErrorBoundary>`.

---

## 6. SIMULATION / EXAMPLE RUN

Let's trace through the full React lifecycle for one simulation:

### Initial State (page load)

```
User sees landing page (/) with Hero, Features, How It Works
Navbar shows: [FlowCache]  [Features]  [How It Works]  [Launch Visualizer]
```

### User clicks "Launch Visualizer"

```
React Router changes path to /visualizer
  → <Routes> renders <Visualizer /> instead of <Home />
  → useSimulator() initializes with defaults:
      frameSize=4, algorithm='FIFO', inputString='', hasRun=false
  → Visualizer renders:
      - InputPanel: shows frame size 4, FIFO selected, empty input
      - Controls: hidden (hasRun is false)
      - ReferenceString: hidden
      - FrameGrid: hidden
      - SolutionTrace: hidden
      - StatsPanel: hidden
      - EmptyState: visible ("Ready for a new simulation")
```

### User configures and starts

```
1. User types "7,0,1,2,0,3,0,4" → each keystroke calls setInputString
2. User clicks "LRU" button → calls setAlgorithm('LRU')
3. User changes frame size to 3 → calls setFrameSize(3)
4. User clicks "Start" → calls handleStart()
    → runSimulation() validates input, calls simulate(), stores steps
    → setTimeout → togglePlay() → isPlaying=true → useEffect fires
    → setInterval starts, currentStep increments every 500ms
```

### Animation loop (each ~500ms tick)

```
Tick 1: currentStep → 1
  → Controls: "Step 1 / 8", progress bar at 12.5%
  → ReferenceString: "7" is highlighted with purple glow (current fault)
  → FrameGrid: 1 column appears, Frame 1 = "7", status = "FAULT"
  → StatsPanel: Total Faults = 1, Total Hits = 0, Hit Ratio = 0%

Tick 2: currentStep → 2
  → ReferenceString: "7" turns red (past fault), "0" highlighted (current)
  → FrameGrid: 2 columns, Frame 1 = "7", Frame 2 = "0"

... continues until currentStep = 8 ...

Tick 8: currentStep → 8
  → All 8 columns visible in FrameGrid and SolutionTrace
  → StatsPanel: Total Faults = 6, Total Hits = 2, Hit Ratio = 25%
  → isPlaying set to false (reached end), interval cleared
  → Play button shows play icon (not pause)
```

---

## 7. IMPROVEMENTS

### Practical suggestions for a 2nd-year IT student

**1. Add proper TypeScript types to all event handlers**

In `InputPanel.tsx`, `onChange={e => ...}` — `e` is implicitly typed. Explicitly type it as `React.ChangeEvent<HTMLInputElement>` to get better autocomplete and catch errors.

**2. Extract the speed slider inversion into a named function**

```typescript
const sliderPosToSpeed = (sliderPos: number) => 1500 - sliderPos + 100
const speedToSliderPos = (speed: number) => 1500 - speed + 100
```

This makes the code self-documenting instead of relying on a comment.

**3. Replace `framer-motion` with CSS animations**

```css
.fade-in-up {
  animation: fadeInUp 0.35s ease-out both;
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
```

This removes a 30KB dependency and makes the app load faster.

**4. Add keyboard shortcuts**

```typescript
useEffect(() => {
  const handler = (e: KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Space') { e.preventDefault(); togglePlay(); }
    if (e.key === 'ArrowRight') stepForward();
    if (e.key === 'ArrowLeft') stepBackward();
  };
  window.addEventListener('keydown', handler);
  return () => window.removeEventListener('keydown', handler);
}, [togglePlay, stepForward, stepBackward]);
```

**5. Add a "random example" button**

The `InputPanel` could have a button that fills in a pre-defined example:
```
"7,0,1,2,0,3,0,4,2,3,0,3,2,1,2,0,1,7,0,1"
```

This is the famous **Belady's anomaly** example (where increasing frames increases faults in FIFO).

**6. Save state to localStorage**

```typescript
// On input change:
localStorage.setItem('flowcache-last-input', inputString)
// On load:
const saved = localStorage.getItem('flowcache-last-input')
if (saved) setInputString(saved)
```

This way if the user refreshes the page, their last reference string is preserved.

**7. Add `console.assert` checks in development**

```typescript
// In simulateFIFO:
console.assert(steps.length === pages.length, 'Steps must equal pages')
console.assert(steps.every(s => s.frames.length === frameSize), 'Frame count mismatch')
```

---


