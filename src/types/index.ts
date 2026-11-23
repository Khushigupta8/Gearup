export type BikeStyle = 'sports' | 'naked' | 'adventure' | 'cruiser' | 'classic' | 'tourer' | 'scooter' | 'enduro';

export type BikeBadge =
  | { kind: 'warranty'; months: number }
  | { kind: 'flag'; text: string; red?: boolean };

export type Photo = { src: string; label: string };

export type BikeDetail = {
  plate: string;
  owners: number;
  colour: string;
  licence: string;
  fuel: string;
  gearbox: string;
  warrantyWorth?: number;
  /** Main photos: the good shots. */
  gallery: Photo[];
  /** Close-ups of marks, scratches and damage. Uploaded separately in the DMS. */
  detailPhotos: Photo[];
  /** Photos of service receipts and invoices, shown under History. */
  receipts: Photo[];
  /** Walkaround video: a file URL or a YouTube / Vimeo link. */
  video?: string;
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
  /** Shown in "Fresh on the forecourt" on the home page. */
  featured?: boolean;
  /** Bike on a transparent background (home hero, showcase). */
  cutout?: string;
  condition?: 'new' | 'used';
  licence?: 'cbt' | 'a2' | 'full_a';
  seoTitle?: string;
  seoDescription?: string;
  /** Number plate, pulled from the DMS when the bike is added to stock. */
  registration?: string;
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
