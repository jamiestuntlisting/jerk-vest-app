/**
 * All Jerk Vest content lives here so the screens stay presentational.
 * Pulled from the original jerkvest.com project (projects, bios, credits).
 */

export const SITE = {
  name: 'Jerk Vest Productions',
  tagline: 'High-octane productions with a twist',
  email: 'jerkvest@gmail.com',
  instagram: 'https://www.instagram.com/JERKVEST/',
  youtube: 'https://www.youtube.com/@JerkVest/',
  shop: 'https://stuntlisting.myshopify.com/collections/dodge-brick',
};

export type Route = '/movies' | '/bts' | '/about' | '/more';

export type MenuItem = {
  key: string;
  title: string;
  blurb: string;
  /** Internal route OR external URL (kind distinguishes them). */
  target: string;
  kind: 'route' | 'external';
  thumb: string;
};

const yt = (id: string) => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

/** The six tiles of the DVD menu, in the order shown on the menu art. */
export const MENU: MenuItem[] = [
  {
    key: 'movies',
    title: 'Movies',
    blurb: 'Check out our films. Shorts, features, and everything in between.',
    target: '/movies',
    kind: 'route',
    thumb: yt('umJJp33Sv4c'),
  },
  {
    key: 'bts',
    title: 'BTS',
    blurb: 'Behind the scenes, making-ofs, bloopers, and more.',
    target: '/bts',
    kind: 'route',
    thumb: yt('Isafla2k8g4'),
  },
  {
    key: 'instagram',
    title: 'Instagram',
    blurb: 'Follow us on Instagram for updates, photos, and random stuff.',
    target: SITE.instagram,
    kind: 'external',
    thumb: yt('nyVyFMP1hpI'),
  },
  {
    key: 'about',
    title: 'About Us',
    blurb: 'Who we are, what we do, and why we do it.',
    target: '/about',
    kind: 'route',
    thumb: yt('_Vj08ZtK078'),
  },
  {
    key: 'shop',
    title: 'Shop',
    blurb: 'Official merch, apparel, accessories, and more.',
    target: SITE.shop,
    kind: 'external',
    thumb: yt('Ftb3ztQ56S4'),
  },
  {
    key: 'more',
    title: 'More',
    blurb: 'Trailers, press, merch, and other cool shit.',
    target: '/more',
    kind: 'route',
    thumb: yt('Ftb3ztQ56S4'),
  },
];

export type Credit = { role: string; people: { name: string; ig?: string }[] };

export type VideoItem = {
  id: string;
  title: string;
  description: string;
  /** A YouTube watch/embed id, an Instagram reel embed, or a frame.io link. */
  youtubeId?: string;
  embedUrl?: string;
  thumb?: string;
  status?: string;
  credits?: Credit[];
};

export const MOVIES: VideoItem[] = [
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
      'The epic conclusion to the Grorillogy trilogy. A genre-bending parody that combines courtroom drama with primate action.',
    embedUrl: 'https://f.io/0EEfF4qa',
    status: 'In Editing',
    credits: [{ role: 'Writer / Director', people: [{ name: 'Jamie Northrup' }, { name: 'Nick Meese' }] }],
  },
  {
    id: 'promo1',
    title: 'Jerk Vest Promo',
    description: 'High-energy promotional content showcasing our signature style and capabilities.',
    youtubeId: 'nyVyFMP1hpI',
    thumb: yt('nyVyFMP1hpI'),
  },
  {
    id: 'promo2',
    title: 'Jerk Vest Promo',
    description: 'High-octane action and creative stunts in this promotional showcase.',
    youtubeId: '_Vj08ZtK078',
    thumb: yt('_Vj08ZtK078'),
  },
  {
    id: 'promo3',
    title: 'Jerk Vest Promo',
    description: 'Dynamic action sequences highlighting our stunt work and visual effects.',
    youtubeId: 'Ftb3ztQ56S4',
    thumb: yt('Ftb3ztQ56S4'),
  },
  {
    id: 'stuntlisting',
    title: 'StuntListing X Jerk Vest',
    description:
      'A collaborative project bringing together stunt professionals for an innovative production.',
    embedUrl: 'https://f.io/PaHXcRx7',
    status: 'In Post-Production',
  },
  {
    id: 'dodge-brick',
    title: 'Dodge Brick',
    description:
      'An action-packed short film featuring intense stunt choreography and creative visual effects.',
    status: 'In Post-Production',
  },
];

/** Behind-the-scenes content. Where there is no finished cut yet we surface
 *  the making-of notes and mark it clearly. */
export const BTS: VideoItem[] = [
  {
    id: 'bts-100men',
    title: 'On Set: 100 Men v 1 Gorilla',
    description:
      'Filmed before a live studio audience at Argus Filmworks. A look at how we staged the ultimate primate showdown.',
    youtubeId: 'Isafla2k8g4',
    thumb: yt('Isafla2k8g4'),
  },
  {
    id: 'bts-reel',
    title: 'Jerk Vest Reel',
    description: 'Behind the scenes and action highlights from our latest productions.',
    embedUrl: 'https://www.instagram.com/jerkvest/reel/DMVthqOxZbv/embed',
  },
  {
    id: 'bts-grorillogy',
    title: 'Making of the Grorillogy',
    description:
      'From Prospect Park to the courtroom — how the gorilla trilogy came together, stunts, VFX, and all.',
    thumb: yt('umJJp33Sv4c'),
    status: 'Coming Soon',
  },
  {
    id: 'bts-bloopers',
    title: 'Bloopers',
    description: 'The takes that did not make the cut. Big swings, bigger misses.',
    status: 'Coming Soon',
  },
];

/** "More" — trailers, press, and merch. */
export const TRAILERS: VideoItem[] = [
  {
    id: 'trailer-dodge-brick',
    title: 'Dodge Brick — Teaser',
    description: 'Our latest short. Intense stunt choreography and creative visual effects.',
    status: 'Coming Soon',
  },
  {
    id: 'trailer-gorillaw',
    title: 'Gorillaw & Order — Trailer',
    description: 'The epic conclusion to the Grorillogy trilogy.',
    embedUrl: 'https://f.io/0EEfF4qa',
    status: 'In Editing',
  },
];

export type Person = {
  initials: string;
  name: string;
  ig?: string;
  unique: string;
  roles: string;
  accent: 'purple' | 'orange';
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
    },
    {
      initials: 'JN',
      name: 'Jamie Northrup',
      ig: 'jamesnorthrup',
      unique: 'Stunt Coordination',
      roles: 'Writer, Director, Editor, Stunt Coordinator, Stunt Performer',
      accent: 'orange',
    },
  ] as Person[],
};
