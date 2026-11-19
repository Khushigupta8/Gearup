export type Bike = {
  slug: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  engineCc: number;
  style: 'naked' | 'sports' | 'adventure' | 'retro' | 'cruiser' | 'scooter' | 'learner';
  images: string[];
  status: 'available' | 'reserved' | 'sold';
};

export type Reservation = {
  reference: string;
  bikeSlug: string;
  depositPaid: number;
  fulfilment: 'delivery' | 'collection';
  createdAt: string;
};
