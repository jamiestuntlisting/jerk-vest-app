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

`vercel.json` is preconfigured: build `expo export -p web`, output `dist`,
`cleanUrls` on (so `/admin`, `/movies`, etc. resolve directly). Set the env
vars from `.env.example` in the Vercel project for analytics.

## Analytics

Fire-and-forget event logging (`page_view`, `menu_click`, `outbound_click`,
`video_play`, `audio_toggle`) writes to Supabase using the public anon key,
which is restricted by RLS to **insert-only**. The `/admin` dashboard reads
aggregates through a **token-gated Supabase edge function**, so the data is
never exposed to the anon key. See `supabase/` for the schema + function.

Without the Supabase env vars the app still works — analytics just no-op and
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
supabase/         analytics schema + edge function
```
