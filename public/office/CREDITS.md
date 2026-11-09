# Virtual workspace credits

Original room models, baked textures, BakedModel material/scale approach, monitor geometry/CSS3D integration and camera keyframes by **Henry Heffernan**, Copyright 2024, MIT.

- Source: https://github.com/henryjeff/portfolio-website
- Pinned source revision: `c53c5a50183655eb83d70048403a5084f5d1214c`
- Original live site: https://henryheffernan.com/
- Full license: [LICENSE.txt](LICENSE.txt)

Copied asset mapping:

| Local file        | Original path under `static/`           |
| ----------------- | --------------------------------------- |
| `computer.glb`    | `models/Computer/computer_setup.glb`    |
| `computer.jpg`    | `models/Computer/baked_computer.jpg`    |
| `environment.glb` | `models/World/environment.glb`          |
| `environment.jpg` | `models/World/baked_environment.jpg`    |
| `decor.glb`       | `models/Decor/decor.glb`                |
| `decor.jpg`       | `models/Decor/baked_decor_modified.jpg` |

Runtime adaptation in `src/lib/office/runtime.ts` draws from `src/Application/Utils/BakedModel.ts`, `Camera/CameraKeyframes.ts` and `World/MonitorScreen.ts`. Updated Three.js color-space APIs; original geometry, per-mesh scale, screen transform and camera positions retained. Original remote OS replaced with Aniket's local resume desktop. No original radio/music, external analytics, remote desktop calls or other personal content imported. Rendering is on demand and camera transitions respect reduced motion.

The resume viewer is adapted from Aniket's own old portfolio at `Code/products/Portfolio/src/app/resume/page.tsx` (PDF iframe). Its public PDF source moved from the broken old GitHub Pages URL to https://github.com/anik8-codes/Aniket-CV-25/blob/main/cv.pdf. Served locally as `public/resume/aniket-singh.pdf`.

The landing-page edition embeds the workspace in `#workspace`: models/runtime load near the viewport, rendering pauses offscreen, and wheel/touch scrolling continues through the page. Baked textures are resized from 4096 × 4096 to 2048 × 2048 to reduce GPU memory on mobile; original models and UVs are unchanged.
