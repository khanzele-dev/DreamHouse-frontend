export interface ICardImage {
  id: number;
  image: string;
}

export interface IDeveloper {
  id: number;
  name: string;
  logo: string;
  is_subscribed?: boolean;
}

export interface IDeveloperDetail extends IDeveloper {
  cards: ICard[];
  is_subscribed: boolean;
}

export interface IDocument {
  id: number;
  title: string;
  file: string;
  uploaded_at: string;
}

export interface IVideo {
  id: number;
  video: string;
}

export interface IReviewImage {
  id: number;
  image: string;
}

export interface IDeveloperResponse {
  id: number;
  developer_name: string;
  response_text: string;
  created_at: string;
}

export interface IReview {
  id: number;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  images: IReviewImage[];
  created_at: string;
  helpful_count: number;
  not_helpful_count: number;
  user_vote?: 'helpful' | 'not_helpful' | null;
  developer_response?: IDeveloperResponse;
}

export interface ICard {
  id: number;
  title: string;
  address: string;
  description: string;
  price: string;
  price_metr: number;
  rooms: number;
  city: number;
  house_type: string;
  area: string;
  building_material: string;
  category: string;
  floors_total: number;
  elevator: string;
  parking: string;
  balcony: boolean;
  ceiling_height: string;
  latitude: number;
  longitude: number;
  rating: string;
  rating_count: number;
  owner: string;
  developer: IDeveloper;
  images: ICardImage[];
  videos: IVideo[];
  documents?: IDocument[];
  questions?: [];
  reviews?: IReview[];
  recommendations?: ICard[];
  list_curations?: ICard[];
  renovation?: string;
  created_at: string;
  is_favorite?: boolean;
}