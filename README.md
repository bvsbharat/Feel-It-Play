# 🌅 Morning Chants

> A minimalist, open-source music player for South Indian morning chants — built with React, Vite, and the YouTube IFrame API.

[![Open Source](https://img.shields.io/badge/Open%20Source-Yes-brightgreen)](https://github.com/bvsbharat/Morning-Chants-)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Stars](https://img.shields.io/github/stars/bvsbharat/Morning-Chants-?style=social)](https://github.com/bvsbharat/Morning-Chants-/stargazers)
[![Forks](https://img.shields.io/github/forks/bvsbharat/Morning-Chants-?style=social)](https://github.com/bvsbharat/Morning-Chants-/network/members)

---

## ✨ Features

- **Full playlist support** — 8 curated morning chants by M.S. Subbulakshmi, with skip forward/back and auto-advance on track end
- **Beautiful player UI** — glassmorphism design with spinning album art when playing
- **Seek bar** — scrub through any track with live timestamps
- **Playlist modal** — click "Playlist" to browse all tracks and jump to any song
- **Custom backdrop** — South Indian temple flat-art background (swap it with your own image)
- **Live clock** — shows current local time in the top-left corner
- **YouTube Music link** — quick-open the current track on YouTube Music

---

## 🎵 Default Playlist

| # | Title | Artist |
|---|-------|--------|
| 1 | Sri Venkateswara Suprabhatam | M.S. Subbulakshmi |
| 2 | Kurai Ondrum Illai | M.S. Subbulakshmi |
| 3 | Bhavayami Gopalabalam | M.S. Subbulakshmi |
| 4 | Vishnu Sahasranamam | M.S. Subbulakshmi |
| 5 | Mahadeva Shambho | M.S. Subbulakshmi |
| 6 | Hanuman Chalisa | M.S. Subbulakshmi |
| 7 | Gayatri Mantra | M.S. Subbulakshmi |
| 8 | Devi Stotram – Mahishasura Mardini | M.S. Subbulakshmi |

---

## 🛠 Tech Stack

- [React 19](https://react.dev/) + TypeScript
- [Vite 6](https://vitejs.dev/) for blazing-fast dev/build
- [react-youtube](https://github.com/tjallingt/react-youtube) — YouTube IFrame API wrapper
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Lucide React](https://lucide.dev/) icons

---

## 🚀 Getting Started

```bash
# 1. Clone
git clone https://github.com/bvsbharat/Morning-Chants-.git
cd Morning-Chants-

# 2. Install dependencies
bun install   # or: npm install

# 3. Start dev server
bun dev       # or: npm run dev

# Open http://localhost:3000
```

---

## 🎨 Customise Your Backdrop

Replace the background image by dropping your own JPG/PNG into `src/assets/images/` and updating the import in `src/App.tsx`:

```ts
import bgImage from './assets/images/your-image.jpg';
```

---

## 🎶 Add Your Own Playlist

Edit the `PLAYLIST` array at the top of `src/App.tsx`:

```ts
const PLAYLIST = [
  {
    id: "YOUTUBE_VIDEO_ID",   // the ?v= part of the YouTube URL
    title: "Track Title",
    artist: "Artist Name",
    art: getThumbnail("YOUTUBE_VIDEO_ID")
  },
  // ...add as many as you like
];
```

That's it — no API keys required. The player uses YouTube's public IFrame API.

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome!

1. Fork the repo
2. Create your branch: `git checkout -b feat/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push and open a PR

If you find this project useful, please **⭐ star** and **🍴 fork** it — it helps others discover it!

---

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

*Built with love for peaceful mornings. 🙏*
