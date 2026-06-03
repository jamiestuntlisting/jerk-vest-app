# Jerk Vest — App

The Jerk Vest Productions "special features" menu, built as an **Expo (React
Native) app** so the exact same codebase runs as the **web app on Vercel today**
and becomes the **iOS app** later. It is styled like a moving DVD menu: a living
purple/orange background, a shining JERK VEST logo, and a tile highlight that
cycles like a DVD remote selection.

## Routes

| Route      | What it is                                            |
| ---------- | ----------------------------------------------------- |
| `/`        | The DVD "Special Features" menu (6 tiles)             |
| `/movies`  | Films — the gorilla trilogy, promos, Dodge Brick      |
| `/bts`     | Behind the scenes / making-ofs / bloopers             |
| `/about`   | Who we are (Nick & Jamie) + contact                   |
| `/more`    | Trailers, merch link, press & contact                 |
| `/admin`   | **Hidden** analytics dashboard (no link; URL only)    |
| Instagram  | External → https://www.instagram.com/JERKVEST/        |
| Shop       | External → Shopify "Dodge Brick" collection           |

## Run it

```bash
npm install
npm run web      # web dev server
npm run ios      # native (Xcode / simulator) — for the future app build
```

Build the static web bundle (what Vercel ships):

```bash
npm run build:web   # outputs to ./dist
```

## Deploy (Vercel)

`vercel.json` is preconfigured: build `npx expo export -p web`, output `dist`,
`cleanUrls` on (so `/admin`, `/movies`, etc. resolve directly). No env vars are
required to deploy.

**Import steps:**

1. https://vercel.com/new → import `jamiestuntlisting/jerk-vest-app`.
2. If the code is on a feature branch (not `main`): after import, go to
   **Settings → Git → Production Branch**, set it to that branch, and redeploy.
   (Or merge the branch into `main` first and import normally.)
3. Vercel auto-detects `vercel.json`; just deploy. Future pushes auto-deploy.

## Analytics

Fire-and-forget event logging (`page_view`, `menu_click`, `outbound_click`,
`video_play`, `audio_toggle`) writes to Supabase using the public anon key,
which is restricted by RLS to **insert-only**. The `/admin` dashboard reads
aggregates through a **token-gated `analytics_summary(token)` RPC** that is
`SECURITY DEFINER` and checks the admin token server-side (the token lives in a
`private` schema, never exposed over the API). A wrong token returns no data.
See `supabase/migrations/` for the schema + function.

Public Supabase config (URL + anon key) lives in `src/lib/config.ts` so the
Vercel build works without dashboard env vars; the **admin token is only ever
in the database**. Without config the app still works — analytics just no-op and
`/admin` shows a "not configured" note.

## Notes / pluggable bits

- **Background video:** set `EXPO_PUBLIC_BG_VIDEO_URL` to a muted loop to layer
  real video behind the menu; otherwise the generated motion is used.
- **Menu audio:** set `EXPO_PUBLIC_MENU_AUDIO_URL`. Audio is OFF by default; the
  speaker button in the corner turns it on (no autoplay).

## Structure

```
src/
  app/            file-based routes (Expo Router)
  components/     BackgroundFX, JerkVestLogo, MenuTile, DvdFrame, VideoCard, ...
  lib/            theme, content (pulled from jerkvest.com), analytics, links
supabase/         analytics schema + token-gated summary function
```
