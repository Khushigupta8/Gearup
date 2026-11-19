export type BikeStyle = 'sports' | 'naked' | 'adventure' | 'cruiser' | 'classic' | 'tourer' | 'scooter' | 'enduro';

export type BikeBadge =
  | { kind: 'warranty'; months: number }
  | { kind: 'flag'; text: string; red?: boolean };

export type BikeDetail = {
  plate: string;
  owners: number;
  colour: string;
  licence: string;
  fuel: string;
  gearbox: string;
  warrantyWorth?: number;
  gallery: { src: string; label: string }[];
  headline: string;
  overview: string[];
  features: string[];
  spec: [label: string, value: string][];
  inspection: { date: string; results: [area: string, result: string][] };
  history: [title: string, note: string][];
};

export type Bike = {
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  wasPrice?: number;
  mileage: number;
  engineCc: number;
  style: BikeStyle;
  image: string;
  badge?: BikeBadge;
  status: 'available' | 'reserved' | 'sold';
  /** Short bullet points shown on the large card. */
  highlights?: string[];
  /** Full bike page content. Bikes without it get a basic page. */
  detail?: BikeDetail;
};

export type Reservation = {
  reference: string;
  bikeSlug: string;
  depositPaid: number;
  fulfilment: 'delivery' | 'collection';
  createdAt: string;
};
