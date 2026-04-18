export type SearchState = {
  location: string;
  arrivalDate: string | Date | null;
  departureDate: string | Date | null;
  guests: string;
  guestSize: string;
  gravityMin: string;
  gravityMax: string;
  tempMin: string;
  tempMax: string;
  atmosphere: string;
  budget: string;
};

export const ATMOSPHERE_OPTIONS = [
  "Oxygen",
  "Carbon Dioxide",
  "Dihydrogen Monoxide",
  "Methane",
  "Vacuum",
  "Helium",
  "Hydrogen",
  "Sulfur Dioxide",
  "Nitrogen",
  "Ionized Metals",
] as const;

export const PLANET_ARCHETYPE_OPTIONS = [
  "Solid",
  "Liquid",
  "Gas",
  "Plasma",
] as const;

export const GUEST_SIZE_OPTIONS = [
  { label: "Small", sublabel: "< 500 cm", value: "small" },
  { label: "Medium", sublabel: "500–2000 cm", value: "medium" },
  { label: "Large", sublabel: "> 2000 cm", value: "large" },
] as const;

export type EditableSearchState = {
  location: string;
  arrivalDate: Date | null;
  departureDate: Date | null;
  guests: string;
  guestSize: string;
  gravityMin: string;
  gravityMax: string;
  tempMin: string;
  tempMax: string;
  atmosphere: string;
  budget: string;
};
