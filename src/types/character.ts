export interface PowerStats {
  intelligence: number;
  strength: number;
  speed: number;
  durability: number;
  power: number;
  combat: number;
}

export interface Appearance {
  gender: string;
  race: string | null;
  height: string[];
  weight: string[];
  eyeColor: string;
  hairColor: string;
}

export interface Biography {
  fullName: string;
  alterEgos: string;
  aliases: string[];
  placeOfBirth: string;
  firstAppearance: string;
  publisher: string;
  alignment: 'good' | 'bad' | 'neutral' | string;
}

export interface Work {
  occupation: string;
  base: string;
}

export interface Connections {
  groupAffiliation: string;
  relatives: string;
}

export interface CharacterImages {
  xs: string;
  sm: string;
  md: string;
  lg: string;
}

export interface Character {
  id: number;
  name: string;
  slug: string;
  powerstats: PowerStats;
  appearance: Appearance;
  biography: Biography;
  work: Work;
  connections: Connections;
  images: CharacterImages;
}

export interface FavoriteItem {
  characterId: number;
  name: string;
  realName?: string;
  image: string;
  publisher: string;
  alignment: string;
  createdAt: string;
  powerstats?: PowerStats;
}
