/**
 * All Jerk Vest content lives here so the screens stay presentational.
 * Pulled from the original jerkvest.com project (projects, bios, credits).
 *
 * Structure: each movie / series is its own Project with its own page.
 * Every playable video has a UNIQUE name and a UNIQUE link; items still in
 * editing have no link and render as "coming soon" status cards.
 */
import { HEADSHOT_NICK_URL, HEADSHOT_JAMIE_URL } from './config';

export const SITE = {
  name: 'Jerk Vest Productions',
  tagline: 'High-octane productions with a twist',
  email: 'jerkvest@gmail.com',
  instagram: 'https://www.instagram.com/JERKVEST/',
  youtube: 'https://www.youtube.com/@JerkVest/',
  shop: 'https://stuntlisting.myshopify.com/collections/dodge-brick',
};

const yt = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

export type Credit = { role: string; people: { name: string; ig?: string }[] };

export type VideoItem = {
  id: string;
  title: string;
  description: string;
  /** A YouTube id (plays inline on web) or an embeddable URL. Absent = no cut yet. */
  youtubeId?: string;
  embedUrl?: string;
  thumb?: string;
  status?: string;
  credits?: Credit[];
};

export type Project = {
  key: string; // route slug, e.g. /grorillogy
  title: string;
  eyebrow: string;
  intro: string;
  videos: VideoItem[];
  bts?: VideoItem[];
};

/* ------------------------------- The Grorillogy ------------------------------ */

export const GRORILLOGY: Project = {
  key: 'grorillogy',
  title: 'The Grorillogy',
  eyebrow: 'THE GORILLA TRILOGY',
  intro:
    'Three films, one gorilla. From a chance meeting in Prospect Park to a courtroom showdown — the whole primate saga.',
  videos: [
    {
      id: 'gorilla1',
      title: 'Gorilla in Prospect Park',
      description:
        'Nick and I saw this gorilla in Prospect Park yesterday so we asked him if he wanted to make a funny video. He was super cool and a total pro on set.',
      youtubeId: 'umJJp33Sv4c',
      thumb: yt('umJJp33Sv4c'),
      credits: [
        { role: 'Writer / Director', people: [{ name: 'Jamie Northrup' }, { name: 'Nick Meese' }] },
        { role: 'Camera', people: [{ name: 'Jamie Northrup', ig: 'jamesnorthrup' }] },
        { role: 'Editor / VFX', people: [{ name: 'Nick Meese', ig: 'agedcinematographers' }] },
        { role: 'Sound Design', people: [{ name: 'Josh Prem', ig: 'jprem77' }] },
        {
          role: 'Performance by',
          people: [
            { name: 'Tu-An Truong', ig: 'thetuantruong' },
            { name: 'Airon Armstrong', ig: 'aironarmstrong' },
            { name: 'Karl Gunnar Anderson', ig: 'karlgunnaranderson' },
            { name: 'Leana Gardella', ig: 'leana.gardella' },
            { name: 'Alejandra Guevara', ig: 'aleja.g.stunt' },
            { name: 'Nicholas Robyn', ig: 'nicholas_robyn_stunts' },
            { name: 'Claire Medinis', ig: 'clairemedinis' },
          ],
        },
      ],
    },
    {
      id: 'gorilla2',
      title: '100 Men v 1 Gorilla',
      description:
        'The ultimate showdown that pushed the boundaries of independent action filmmaking. Filmed before a live studio audience at Argus Filmworks.',
      youtubeId: 'Isafla2k8g4',
      thumb: yt('Isafla2k8g4'),
      credits: [
        {
          role: 'Starring',
          people: [
            { name: 'Tu-An Truong (The Gorilla)' },
            { name: 'Mark Odgers (Gary)' },
            { name: 'Leana Gardella (Abby Sisstant)' },
            { name: 'Vincent Lane (John Thirdmen)' },
            { name: 'A.J Brugger' },
            { name: 'Riccardo Caba' },
            { name: 'Alejandra Guevara' },
            { name: 'Adam Bourque' },
            { name: 'Nick Meese' },
            { name: 'Gil Sweeney' },
          ],
        },
        { role: 'Written, Directed & Edited by', people: [{ name: 'Jamie Northrup' }, { name: 'Nick Meese' }] },
        { role: 'Cinematographer', people: [{ name: 'Jamie Northrup' }] },
        { role: 'Visual Effects', people: [{ name: 'Nick Meese' }] },
        { role: 'Sound Design', people: [{ name: 'Josh Prem' }] },
      ],
    },
    {
      id: 'gorillaw-order',
      title: 'Gorillaw & Order',
      description:
        'The epic conclusion to the trilogy — a genre-bending parody that combines courtroom drama with primate action.',
      status: 'In Editing',
      credits: [{ role: 'Writer / Director', people: [{ name: 'Jamie Northrup' }, { name: 'Nick Meese' }] }],
    },
  ],
  bts: [
    {
      id: 'bts-reel',
      title: 'Jerk Vest Reel',
      description: 'Behind the scenes and action highlights from the trilogy.',
      embedUrl: 'https://www.instagram.com/jerkvest/reel/DMVthqOxZbv/embed',
    },
    {
      id: 'bts-making',
      title: 'Making of the Grorillogy',
      description: 'From Prospect Park to the courtroom — how it all came together: stunts, VFX, and all.',
      status: 'Coming Soon',
    },
    {
      id: 'bts-bloopers',
      title: 'Bloopers',
      description: 'The takes that did not make the cut. Big swings, bigger misses.',
      status: 'Coming Soon',
    },
  ],
};

/* --------------------------------- Dodge Brick ------------------------------- */

export const DODGE_BRICK: Project = {
  key: 'dodge-brick',
  title: 'Dodge Brick',
  eyebrow: 'SHORT FILM',
  intro:
    'Our action short — intense stunt choreography and creative visual effects. In post-production now; the official merch collection is already live in the Shop.',
  videos: [
    {
      id: 'dodge-brick',
      title: 'Dodge Brick',
      description:
        'An action-packed short featuring intense stunt choreography and creative visual effects.',
      status: 'In Post-Production',
    },
  ],
};

/* ------------------------------ StuntListing Promos -------------------------- */

export const STUNTLISTING: Project = {
  key: 'stuntlisting',
  title: 'StuntListing Promos',
  eyebrow: 'PROMOS & COLLAB',
  intro: 'The promos and our StuntListing collaboration — high-energy showcases of the Jerk Vest style.',
  videos: [
    {
      id: 'promo1',
      title: 'Promo Vol. 1',
      description: 'High-energy promo showcasing our signature style and capabilities.',
      youtubeId: 'nyVyFMP1hpI',
      thumb: yt('nyVyFMP1hpI'),
    },
    {
      id: 'promo2',
      title: 'Promo Vol. 2',
      description: 'High-octane action and creative stunts in this promotional showcase.',
      youtubeId: '_Vj08ZtK078',
      thumb: yt('_Vj08ZtK078'),
    },
    {
      id: 'promo3',
      title: 'Promo Vol. 3',
      description: 'Dynamic action sequences highlighting our stunt work and visual effects.',
      youtubeId: 'Ftb3ztQ56S4',
      thumb: yt('Ftb3ztQ56S4'),
    },
    {
      id: 'stuntlisting-collab',
      title: 'StuntListing × Jerk Vest',
      description: 'A collaborative project bringing together stunt professionals for an innovative production.',
      status: 'In Post-Production',
    },
  ],
};

export const PROJECTS: Project[] = [GRORILLOGY, DODGE_BRICK, STUNTLISTING];

/* ----------------------------------- Menu ----------------------------------- */

export type Avatar = { initials: string; url?: string; accent: 'purple' | 'orange' };

export type MenuItem = {
  key: string;
  title: string;
  blurb: string;
  target: string;
  kind: 'route' | 'external';
  thumb?: string;
  /** Render a monogram tile (e.g. "JV", "DB") instead of a photo. */
  monoText?: string;
  /** Render headshots instead of a thumbnail (About). */
  avatars?: Avatar[];
};

/** Menu tiles. Each project links to its own page; Shop is external. */
export const MENU: MenuItem[] = [
  {
    key: 'grorillogy',
    title: 'The Grorillogy',
    blurb: 'The gorilla trilogy — Prospect Park to the courtroom.',
    target: '/grorillogy',
    kind: 'route',
    thumb: yt('umJJp33Sv4c'),
  },
  {
    key: 'dodge-brick',
    title: 'Dodge Brick',
    blurb: 'Our action short — intense stunts and VFX. In post now.',
    target: '/dodge-brick',
    kind: 'route',
    monoText: 'DB',
  },
  {
    key: 'stuntlisting',
    title: 'StuntListing Promos',
    blurb: 'The promos and our StuntListing collaboration.',
    target: '/stuntlisting',
    kind: 'route',
    thumb: yt('nyVyFMP1hpI'),
  },
  {
    key: 'about',
    title: 'About Us',
    blurb: 'Who we are, what we do, and how to reach us.',
    target: '/about',
    kind: 'route',
    avatars: [
      { initials: 'NM', url: HEADSHOT_NICK_URL || undefined, accent: 'purple' },
      { initials: 'JN', url: HEADSHOT_JAMIE_URL || undefined, accent: 'orange' },
    ],
  },
  {
    key: 'shop',
    title: 'Shop',
    blurb: 'Official merch, apparel, accessories, and more.',
    target: SITE.shop,
    kind: 'external',
    monoText: 'JV',
  },
];

/** Instagram is a standalone link at the bottom of the menu. */
export const INSTAGRAM_LINK = { url: SITE.instagram, handle: '@JERKVEST' };

/* ----------------------------------- About ---------------------------------- */

export type Person = {
  initials: string;
  name: string;
  ig?: string;
  unique: string;
  roles: string;
  accent: 'purple' | 'orange';
  headshot?: string;
};

export const ABOUT = {
  heading: 'Who We Are',
  intro:
    'Jerk Vest is a two-man wrecking crew making high-octane action comedy — writing, directing, shooting, cutting, and throwing ourselves down stairs so you do not have to.',
  shared: ['Writing', 'Directing', 'Editing', 'Stunts'],
  people: [
    {
      initials: 'NM',
      name: 'Nick Meese',
      ig: 'agedcinematographers',
      unique: 'VFX',
      roles: 'Writer, Director, Editor, VFX, Stunt Performer',
      accent: 'purple',
      headshot: HEADSHOT_NICK_URL || undefined,
    },
    {
      initials: 'JN',
      name: 'Jamie Northrup',
      ig: 'jamesnorthrup',
      unique: 'Stunt Coordination',
      roles: 'Writer, Director, Editor, Stunt Coordinator, Stunt Performer',
      accent: 'orange',
      headshot: HEADSHOT_JAMIE_URL || undefined,
    },
  ] as Person[],
};
