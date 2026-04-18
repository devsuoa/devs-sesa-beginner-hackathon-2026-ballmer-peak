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
