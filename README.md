# Photo Verifier — Image Authenticity & AI Detection Platform

A modern, high-performance, client-side web application designed to analyze digital image authenticity, inspect EXIF/TIFF metadata, perform Error Level Analysis (ELA) to expose image tampering and photo splicing, and detect synthetic AI-generated patterns.

All forensic calculations are executed **100% locally within the browser** using modern Web APIs (HTML5 Canvas, File API) — ensuring complete data privacy with zero server uploads.

---

## ✨ Features

- **🔍 Error Level Analysis (ELA):**
  - Interactive difference analysis via iterative JPEG recompression and quantization disparity mapping on HTML5 Canvas.
  - Generates enhanced heatmaps, inverted contrast views, and high-frequency noise extraction to uncover spliced fragments, cloned areas, and Photoshop layer modifications.

- **📊 Comprehensive EXIF & Hardware Metadata Auditing:**
  - In-depth parsing of camera make, model, lens profile, focal length, exposure, and aperture via `exifr`.
  - Automatic cross-checking of original capture timestamps (`DateTimeOriginal`) against last modification timestamps (`ModifyDate`) to detect tampering.
  - Software signature detection (`Adobe Photoshop`, `Lightroom`, `GIMP`, AI synthesizers).

- **🎛️ Interactive Split-Screen Comparison:**
  - Before/After comparison slider between original photo and forensic ELA maps.
  - Built-in circular zoom magnifier (2.5x) for inspecting subtle pixel-level compression artifacts.

- **📄 Client-Side PDF Forensic Reports:**
  - Instant generation and export of structured forensic certificates using `jsPDF` and Canvas rendering.
  - Full Unicode / Cyrillic support, embedded SHA-256 digital file hash, metadata verification table, and side-by-side visual analysis.

- **🔒 100% Client-Side Privacy (Zero-Exposure):**
  - No server-side storage or external image upload. Everything runs in-memory on the user's device.

- **🌓 Modern Responsive UI:**
  - Built with React 19, TypeScript, and Tailwind CSS.
  - Seamless Light/Dark theme switching, responsive design (mobile-first), and interactive presets for instant testing.

---

## 🛠️ Tech Stack

| Technology | Purpose |
| :--- | :--- |
| **React 19** | Component architecture & declarative state management |
| **TypeScript** | Strict type safety and predictable forensic data structures |
| **Vite** | Fast HMR dev server and optimized production bundler |
| **Tailwind CSS** | Utility-first styling with dark mode support |
| **HTML5 Canvas API** | High-performance client-side pixel manipulation & ELA generation |
| **exifr** | Fast, lightweight metadata parser (EXIF, TIFF, XMP, GPS) |
| **jsPDF** | Client-side forensic document generation and PDF export |
| **Lucide React** | Clean, accessible iconography |
| **Vitest & RTL** | Unit and component testing suite |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (version 18 or higher recommended)
- npm or pnpm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Arti0f2/photo-verification-platform.git
   cd photo-verification-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Testing and Quality Checks

Run the automated test suite with Vitest:
```bash
npm test
```

Run linting with Oxlint:
```bash
npm run lint
```

Build for production:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

---

## 📁 Project Architecture

```
src/
├── components/
│   ├── about/        # Platform overview, architecture, and technology stack
│   ├── analysis/     # Interactive ELA workspace, split-comparison slider, magnifier
│   ├── dashboard/    # Metrics overview, quick dropzone, and recent statistics
│   ├── exif/         # Detailed metadata inspection tables and search
│   ├── history/      # Local verification history and session records
│   ├── layout/       # Navbar, responsive sidebar, and theme switcher
│   ├── report/       # Detailed certificate view, JSON export, and PDF trigger
│   └── upload/       # Drag-and-drop validation widget and demo presets
├── services/
│   ├── demoPresets.ts       # Built-in SVG/vector presets for instant testing
│   ├── elaService.ts        # Canvas-based Error Level Analysis & noise extraction
│   ├── exifService.ts       # exifr metadata parsing and anomaly heuristics
│   ├── mockBackendService.ts# Analysis orchestrator and async inference service
│   └── pdfExportService.ts  # Canvas-to-PDF report generator
├── tests/                   # Vitest unit & integration test suites
├── types/                   # TypeScript interfaces & state machine definitions
├── App.tsx                  # Root application component with state orchestration
└── main.tsx                 # Application entry point
```

---

## 🔬 How Error Level Analysis (ELA) Works

Error Level Analysis functions by re-saving an image at a known quality level (e.g., 85%) and computing the absolute pixel-by-pixel difference between the original and the re-compressed image:

1. **Digital photos from a physical camera** typically exhibit an even, consistent error level distribution across the entire surface.
2. **Modified or pasted regions (splicing)** often display noticeably higher or lower error levels than the surrounding pixels because they have undergone a different number of compression cycles.
3. **AI-generated images** usually demonstrate abnormal, hyper-uniform high-frequency textures or atypical quantization artifacts compared to real camera sensors.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
