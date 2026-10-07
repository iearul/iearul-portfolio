# Career Island — iearul.xyz

Portfolio of Md Iearulislam as a small 3D game. Visitors walk a low-poly island where every building is a
level of the career (Dhaka campus → Zettabyte → Wuppertal → Bauer → Weezly), collect skill orbs, play the
project arcade, read the journal and send a message from the mailbox. `/cv` is a plain, printable CV for
people in a hurry, and the site falls back to it when WebGL is not available.

## Stack

- React 19 + Vite, plain JavaScript
- three.js via `@react-three/fiber` and `@react-three/drei`. All models are built from primitives in code,
  so there are no asset files to load.
- zustand for game state (XP, levels, achievements, saved in `localStorage`)
- Content comes from the admin app (`admin.iearul.xyz`, repo `iearul/admin-app`):

  | Endpoint | Used for |
  | --- | --- |
  | `GET /api/portfolio/career` | career levels per zone |
  | `GET /api/portfolio/projects[/{slug}]` | project arcade, CV projects |
  | `GET /api/portfolio/posts[/{slug}]` | journal |
  | `POST /api/portfolio/messages` | mailbox contact form |

  Edit the content in the admin dashboard under **Resources**. When the API is unreachable the site uses
  the copies in `src/data/profile.js`.

## Develop

```bash
npm install
npm run dev
```

`VITE_API_BASE` (see `.env.example`) points at the API; it defaults to production.

## Layout

- `src/data/landmarks.js` — island layout: zones, positions, road order, orb spots
- `src/game/world/` — terrain (one height function drives mesh, props and walking), water, sky, trees
- `src/game/landmarks/` — the buildings
- `src/game/Player.jsx` — movement (click/tap to walk, WASD), collisions, landmark proximity
- `src/game/ui/` — HUD, quest log, minimap, panels
- `src/pages/` — `/cv` and `/journal`

## Deploy

Every push to `main` runs `.github/workflows/deploy.yml`: build, then rsync `dist/` to
`~/domains/iearul.xyz/public_html` on the Hostinger server. The upload never deletes anything outside
`assets/`, because that docroot also hosts the `admin`, `lgc`, `megashop` and `iloveyou` apps.
`public/.htaccess` routes client-side URLs to `index.html` and blocks `/admin/*` on the main domain. All
its rules apply only to the `iearul.xyz` host, so the subdomains are not affected.

Repository secrets:

| Secret | Value |
| --- | --- |
| `SSH_HOST` | server IP |
| `SSH_USER` | hosting user (`u…`) |
| `SSH_PRIVATE_KEY` | private half of the deploy key (its public half is in the server's `~/.ssh/authorized_keys`) |
| `SSH_KNOWN_HOSTS` | the server's host key line(s) for `[host]:65002` |

The previous version of the site (CRA + Sanity) lives on the `legacy` branch.
