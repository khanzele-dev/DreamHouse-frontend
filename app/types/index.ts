export interface IRegisterForm {
  name: string;
  phone_number: string;
  otp?: string;
  ref_code?: string;
}

export interface ILoginForm {
  phone_number: string;
  otp?: string;
}

export interface ICardFilters {
  city?: 1 | 2 | 3;
  category?: "flat" | "new_building";
  house_type?: "private" | "apartment";
  elevator?: "cargo" | "none" | "passenger";
  parking?: "none" | "underground";
  building_material?: "brick" | "monolith" | "panel";
  balcony?: boolean;
  area_min?: number;
  area_max?: number;
  price_min?: number;
  price_max?: number;
  floors_min?: number;
  floors_max?: number;
  rooms_min?: number;
  rooms_max?: number;
}
